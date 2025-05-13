import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types/types";
import { clearCartFromStorage, saveCartToStorage } from "@/utils/cartStorage";

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemsFromStorage: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload;
    },
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        selectedSize?: string;
        selectedColor?: string;
        isAuthenticated: boolean;
      }>
    ) => {
      const { product, selectedSize, selectedColor, isAuthenticated } =
        action.payload;
      const cartItem: CartItem = {
        ...product,
        quantity: 1,
        selectedSize,
        selectedColor,
        isSelected: true,
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
      state.cartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.selectedSize === action.payload.selectedSize &&
            item.selectedColor === action.payload.selectedColor
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
