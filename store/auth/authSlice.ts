import { clearCartFromStorage } from "@/utils/cartStorage";
import { handleApiError } from "@/utils/handleApiError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { clearCart } from "../cart/cartSlice";
import { AppDispatch } from "@/store/store";
import { fetchCartItemsApi } from "../cart/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  loading: boolean;
  error: string | null;
  registered: boolean;
  isAuthenticated: boolean;
  user: any | null;
  resetEmail: string | null;
  resetCode: string | null;
  token: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  registered: false,
  isAuthenticated: false,
  user: null,
  resetEmail: null,
  resetCode: null,
  token: null,
};

export const loadAuthState = createAsyncThunk(
  "auth/loadAuthState",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const user = await AsyncStorage.getItem("authUser");
      if (!token || !user) {
        return rejectWithValue(
          "Authentication data not found. Please log in again."
        );
      }
      return { token, user: JSON.parse(user) };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      password_confirmation,
    }: { email: string; password: string; password_confirmation: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, {
        email,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      dispatch(clearCart());
      await AsyncStorage.setItem("authToken", response.data.token);
      await AsyncStorage.setItem(
        "authUser",
        JSON.stringify(response.data.user)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Login failed"));
    }
  }
);

export const sendEmailCode = createAsyncThunk(
  "auth/sendEmailCode",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/send-email-code`, { email });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Failed to send code"));
    }
  }
);

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-email-code`, {
        email,
        code,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Invalid OTP"));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      email,
      code,
      password,
      password_confirmation,
    }: {
      email: string;
      code: string;
      password: string;
      password_confirmation: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/reset-password`, {
        email,
        code,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Password reset failed"));
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (
    { email, code }: { email: string; code: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/verify-user`, {
        email,
        code,
      });
      await AsyncStorage.setItem("authToken", res.data.token);
      await AsyncStorage.setItem("authUser", JSON.stringify(res.data.user));
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Email verification failed")
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }
      await axios.post(
        `${apiUrl}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("authUser");
      await clearCartFromStorage();
      dispatch(clearCart());

      return true;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Logout failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    resetRegistration: (state) => {
      state.registered = false;
    },
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.resetEmail = action.payload;
    },
    setResetCode: (state, action: PayloadAction<string>) => {
      state.resetCode = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registered = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadAuthState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAuthState.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token && action.payload.user) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      })
      .addCase(loadAuthState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearAuthError,
  resetRegistration,
  setResetEmail,
  setResetCode,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
