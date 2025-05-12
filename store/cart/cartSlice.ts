import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/types";
import { clearCartFromStorage, saveCartToStorage } from "@/utils/cartStorage";

interface CartState {
  cartItems: Product[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemsFromStorage: (state, action: PayloadAction<Product[]>) => {
      state.cartItems = action.payload;
    },
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        selectedSize?: string;
        isAuthenticated: boolean;
      }>
    ) => {
      const { product, selectedSize, isAuthenticated } = action.payload;

      const cartItem: Product = {
        ...product,
        quantity: 1,
        selectedSize,
        isSelected: true,
        seller: product.seller || "Default Seller",
      };

      const existingItem = state.cartItems.find(
        (item) => item.id === cartItem.id && item.selectedSize === selectedSize
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

    toggleItemSelection: (
      state,
      action: PayloadAction<{ id: string; isAuthenticated: boolean }>
    ) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
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
      action: PayloadAction<{ id: string; isAuthenticated: boolean }>
    ) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
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
      action: PayloadAction<{ ids: string[]; isAuthenticated: boolean }>
    ) => {
      state.cartItems = state.cartItems.filter(
        (item) => !action.payload.ids.includes(item.id)
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
});

export const {
  addToCart,
  toggleItemSelection,
  removeFromCart,
  deleteSelectedItems,
  moveToWishlist,
  setCartItemsFromStorage,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
