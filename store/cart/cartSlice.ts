import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '../../types/types';

interface CartState {
  cartItems: Profile[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Profile; selectedSize?: string }>
    ) => {
      const { product, selectedSize } = action.payload;
      const cartItem: Profile = {
        ...product,
        quantity: 1,
        selectedSize,
        isSelected: true,
        seller: product.seller || 'Default Seller',
        originalPrice: product.originalPrice || (parseFloat(product.price) * 1.15).toFixed(2),
      };
      const existingItem = state.cartItems.find(
        (item) => item.id === cartItem.id && item.selectedSize === selectedSize
      );
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.cartItems.push(cartItem);
      }
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.isSelected = !item.isSelected;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    deleteSelectedItems: (state) => {
      state.cartItems = state.cartItems.filter((item) => !item.isSelected);
    },
    moveToWishlist: (state, action: PayloadAction<string[]>) => {
      state.cartItems = state.cartItems.filter(
        (item) => !action.payload.includes(item.id)
      );
    },
  },
});

export const {
  addToCart,
  toggleItemSelection,
  removeFromCart,
  deleteSelectedItems,
  moveToWishlist,
} = cartSlice.actions;

export default cartSlice.reducer;