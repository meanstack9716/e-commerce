import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import categoriesReducer from './category/categoriesSlice'
import cartReducer from './cart/cartSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;