import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import categoriesReducer from './category/categoriesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;