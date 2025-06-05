import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import categoriesReducer from "./category/categoriesSlice";
import productsReducer from "./product/productsSlice";
import cartReducer from './cart/cartSlice'
import addressReducer from './address/addressSlice';
import orderReducer from './order/orderSlice'
import wishlistReducer from './wishlist/wishlistSlice'
import reviewReducer from './review/reviewSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    review: reviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
