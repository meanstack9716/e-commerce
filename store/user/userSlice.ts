import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { getAuthHeaders } from "@/utils/apiHeader";
import { handleApiError } from "@/utils/handleApiError";
import { UserProfile } from "@/types/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  user: UserProfile | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  user: null,
};

export const updateProfile = createAsyncThunk<
  UserProfile,
  UserProfile,
  { state: RootState; rejectValue: string }
>("user/updateProfile", async (userData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const response = await axios.put(
      `${apiUrl}/user/update-profile`,
      userData,
      getAuthHeaders(state)
    );
    return response.data.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "Failed to update profile");
    return rejectWithValue(errorMessage);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
