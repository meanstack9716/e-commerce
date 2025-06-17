import { WishlistItem } from "@/types/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { getAuthHeaders } from "@/utils/apiHeader";
import axiosConfig from "@/utils/axiosConfig";

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk<
  WishlistItem[],          
  void,                   
  { state: RootState; rejectValue: string } 
>(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState(); 
      const response = await axiosConfig.get(
        `/wishlist/list`,
        getAuthHeaders(state)
      );

      if (!response.data?.data) {
        throw new Error("Invalid fetchWishlist response structure");
      }
      return response.data.data as WishlistItem[];
    } catch (error: any) {
      console.log("wishlist", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/removeWishlistItem",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const response = await axiosConfig.delete(`/wishlist/remove`, {
        data: { item_ids: [id] },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove wishlist item"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (
    {
      productId,
      selectedSize,
      selectedColor,
      quantity,
    }: {
      productId: string;
      selectedSize?: string;
      selectedColor?: string;
      quantity: string;
    },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const requestBody = {
        product_id: productId,
        selected_size: selectedSize,
        selected_color: selectedColor,
        quantity,
      };
      const response = await axiosConfig.post(`/wishlist/add`, requestBody);
      return response.data.data as WishlistItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.quantity ||
          error.response?.data?.message ||
          error.message ||
          "Failed to add to wishlist"
      );
    }
  }
);

export const moveToCart = createAsyncThunk(
  "wishlist/moveToCart",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const response = await axiosConfig.post(
        `/wishlist/to-cart`,
        { item_ids: [id] },
        getAuthHeaders(state)
      );
      return id; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to move item to cart"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.loading = false;
          state.items = action.payload.filter((item) => item.id);
        }
      )
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeWishlistItem.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      )
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToWishlist.fulfilled,
        (state, action: PayloadAction<WishlistItem | null>) => {
          state.loading = false;
          if (action.payload && action.payload.id) {
            state.items.push(action.payload);
          }
        }
      )
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(moveToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveToCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(moveToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wishlistSlice.reducer;
