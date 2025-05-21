import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItem, Product } from "../../types/types";
import { RootState } from "@/store/store";
import { clearCartFromStorage, saveCartToStorage } from "@/utils/cartStorage";
import { handleApiError } from "@/utils/handleApiError";
import { getAuthHeaders } from "@/utils/apiHeader";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

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
  { product: Product; selectedSize?: string; selectedColor?: string },
  { state: RootState }
>(
  "cart/addToCartApi",
  async (
    { product, selectedSize, selectedColor },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const payload = {
        product_id: product.id,
        selected_size: selectedSize || "",
        selected_color: selectedColor || "",
        quantity: 1,
      };
      await axios.post(`${apiUrl}/cart/add`, payload, getAuthHeaders(state));
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
    const response = await axios.get(
      `${apiUrl}/cart/list`,
      getAuthHeaders(state)
    );
    const cartItemsData = response.data.data;
    const cartItems: CartItem[] = cartItemsData.map((item: any) => {
      let colorName = item.selected_color_name;
      const productId = item.product?.id;
      if (item.color) {
        const matchingSize = item.product?.sizes?.find(
          (size: any) => size.value === item.size
        );
        const matchingVariant = matchingSize?.variants?.find(
          (variant: any) => variant.value === item.color
        );
        colorName = matchingVariant?.name || "";
      }

      const galleryImages = item.product?.gallery
        ? item.product.gallery
            .filter((galleryItem: any) =>
              colorName
                ? galleryItem.color.trim().toLowerCase() ===
                  colorName.trim().toLowerCase()
                : false
            )
            .map((galleryItem: any) => galleryItem.img_url)
        : [];

      const images =
        galleryImages.length > 0
          ? galleryImages
          : [item.product?.thumbnail_url];

      return {
        ...item.product,
        id: item.id,
        productId,
        quantity: parseInt(item.quantity, 10) || 1,
        selectedSize: item.selected_size || item.size || "",
        selectedColor: item.selected_color || "",
        colorName,
        isSelected: true,

        images,
      };
    });
    return cartItems;
  } catch (error: any) {
    return rejectWithValue(handleApiError(error, "Failed to send code"));
  }
});

export const removeFromCartApi = createAsyncThunk<
  void,
  { ids: string[] },
  { state: RootState }
>("cart/removeFromCartApi", async ({ ids }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const payload = {
      item_ids: ids,
    };
    await axios.delete(`${apiUrl}/cart/remove`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      data: payload,
    });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to remove from cart"
    );
  }
});

export const updateCartItemApi = createAsyncThunk<
  void,
  { id: string; size: string; color: string; quantity: string },
  { state: RootState }
>(
  "cart/updateCartItemApi",
  async (
    { id, size, color, quantity },
    { getState, rejectWithValue, dispatch }
  ) => {
    try {
      const state = getState();

      const payload = {
        id,
        size,
        color,
        quantity,
      };

      await axios.put(`${apiUrl}/cart/update`, payload, getAuthHeaders(state));
      dispatch(fetchCartItemsApi());
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart item";
      return rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemsFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    addToCartLocally: (
      state,
      action: PayloadAction<{
        product: Product;
        selectedSize?: string;
        selectedColor?: string;
        colorName?: string;
        images?: string[];
        isAuthenticated: boolean;
      }>
    ) => {
      const {
        product,
        selectedSize,
        selectedColor,
        colorName,
        images,
        isAuthenticated,
      } = action.payload;
      const galleryImages = images
        ? images
        : product.gallery
          ? product.gallery
              .filter((galleryItem) =>
                colorName
                  ? galleryItem.color.trim().toLowerCase() ===
                    colorName.trim().toLowerCase()
                  : false
              )
              .map((galleryItem) => galleryItem.img_url)
          : [];
      const finalImages =
        galleryImages.length > 0
          ? galleryImages
          : [product.thumbnail_url || ""];
      const cartItem: CartItem = {
        ...product,
        quantity: 1,
        selectedSize,
        productId: product.id,
        colorName,
        selectedColor,
        isSelected: true,
        cartItemId: generateUniqueId(),
        images: finalImages,
      };

      const existingItem = state.cartItems.find(
        (item) =>
          item.id === cartItem.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.cartItems.push(cartItem);
      }

      if (!isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
        colorName?: string;
        isAuthenticated: boolean;
      }>
    ) => {
      const {
        id,
        quantity,
        selectedSize,
        selectedColor,
        colorName,
        isAuthenticated,
      } = action.payload;

      const existingItem = state.cartItems.find(
        (item) =>
          item.id === id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }

      if (!isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },

    updateSize: (
      state,
      action: PayloadAction<{
        id: string;
        selectedSize: string;
        selectedColor?: string;
        isAuthenticated: boolean;
        cartItemId: string;
      }>
    ) => {
      const { id, selectedSize, selectedColor, isAuthenticated, cartItemId } =
        action.payload;

      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item.cartItemId === cartItemId &&
          item.id === id &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...state.cartItems[existingItemIndex],
          selectedSize: selectedSize,
          cartItemId: generateUniqueId(),
        };
        state.cartItems.splice(existingItemIndex, 1, updatedItem);
      }

      if (!isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },

    toggleItemSelection: (
      state,
      action: PayloadAction<{
        id: string;
        isAuthenticated: boolean;
        selectedColor?: string;
        selectedSize?: string;
      }>
    ) => {
      const item = state.cartItems.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );
      if (item) {
        item.isSelected = !item.isSelected;
      }
      if (!action.payload.isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{
        id: string;
        isAuthenticated: boolean;
        selectedSize?: string;
        selectedColor?: string;
      }>
    ) => {
      const { id, selectedSize, selectedColor } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      );
      if (!action.payload.isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },
    deleteSelectedItems: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean }>
    ) => {
      state.cartItems = state.cartItems.filter((item) => !item.isSelected);
      if (!action.payload.isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },
    moveToWishlist: (
      state,
      action: PayloadAction<{
        ids: string[];
        selectedSizes?: string[];
        selectedColors?: string[];
        isAuthenticated: boolean;
      }>
    ) => {
      const { ids, selectedSizes, selectedColors } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            ids.includes(item.id) &&
            (!selectedSizes ||
              selectedSizes.includes(item.selectedSize || "")) &&
            (!selectedColors ||
              selectedColors.includes(item.selectedColor || ""))
          )
      );
      if (!action.payload.isAuthenticated) {
        saveCartToStorage(state.cartItems);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      clearCartFromStorage();
    },
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
      .addCase(removeFromCartApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCartItemApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItemApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCartLocally,
  updateQuantity,
  updateSize,
  toggleItemSelection,
  removeFromCart,
  deleteSelectedItems,
  moveToWishlist,
  setCartItemsFromStorage,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
