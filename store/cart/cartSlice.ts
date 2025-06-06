import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/store";
import { handleApiError } from "@/utils/handleApiError";
import { getAuthHeaders } from "@/utils/apiHeader";
import { getApiUrl } from "@/utils/apiUtils";
import axiosConfig from "@/utils/axiosConfig";
import { CartItem } from "@/interfaces";
import Toast from "react-native-toast-message";

interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

export const addToCartApi = createAsyncThunk<
  void,
  { productId: string; selectedSize: string; selectedColor: string },
  { state: RootState }
>(
  "cart/addToCartApi",
  async (
    { productId, selectedSize, selectedColor },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const payload = {
        product_id: productId,
        selected_size: selectedSize,
        selected_color: selectedColor,
        quantity: 1,
      };
      await axiosConfig.post(`/cart/add`, payload, getAuthHeaders(state));
    } catch (error: any) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to add to cart",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const fetchCartItemsApi = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>("cart/fetchCartItemsApi", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const response = await axiosConfig.get(`/cart/list`, getAuthHeaders(state));
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(handleApiError(error, "Failed to send code"));
  }
});

export const removeFromCartApi = createAsyncThunk<
  string[],
  { ids: string[] },
  { state: RootState }
>("cart/removeFromCartApi", async ({ ids }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const payload = {
      item_ids: ids,
    };
    await axiosConfig.delete(`/cart/remove`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
    return ids;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to remove from cart"
    );
  }
});

export const updateCartItemQuantityApi = createAsyncThunk<
  { id: string; quantity: number },
  { id: string; quantity: number },
  { state: RootState }
>(
  "cart/updateCartItemApi",
  async ({ id, quantity }, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();

      const payload = {
        id,
        quantity: quantity,
      };
      await axiosConfig.put(`/cart/update`, payload, getAuthHeaders(state));
      dispatch(fetchCartItemsApi());
      return { id, quantity };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        error ||
        "Failed to update cart item";
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add reducer here 
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCartItemsApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCartItemsApi.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.loading = false;
          state.cartItems = action.payload;
        }
      )
      .addCase(fetchCartItemsApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.loading = false;
        const removedIds = action.payload;
        state.cartItems = state.cartItems.filter(
          (item) => !removedIds.includes(item.id)
        );
      })
      .addCase(removeFromCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemQuantityApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantityApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItemQuantityApi.rejected, (state, action) => {
        Toast.show({
          type: "error",
          text1: action.payload as string,
          position: "top",
        });
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  //add functions here
} = cartSlice.actions;

export default cartSlice.reducer;
