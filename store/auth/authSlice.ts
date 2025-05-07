import { handleApiError } from "@/utils/handleApiError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  loading: boolean;
  error: string | null;
  registered: boolean;
  isAuthenticated: boolean;
  user: any | null;
  resetEmail: string | null;
  resetCode: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  registered: false,
  isAuthenticated: false,
  user: null,
  resetEmail: null,
  resetCode: null,
};

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
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
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
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setResetCredentials: (
      state,
      action: PayloadAction<{ email: string; code: string }>
    ) => {
      state.resetEmail = action.payload.email;
      state.resetCode = action.payload.code;
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
        state.user = action.payload;
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
      .addCase(verifyEmailCode.fulfilled, (state) => {
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
      });
  },
});

export const { clearAuthError, resetRegistration, setResetCredentials } =
  authSlice.actions;
export default authSlice.reducer;
