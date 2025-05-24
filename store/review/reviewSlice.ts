import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "@/utils/apiHeader";
import { RootState } from "@/store/store";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface ReviewState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  loading: false,
  error: null,
  success: false,
};

interface ReviewPayload {
  product_id: string;
  rating: string;
  review: string;
}

export const submitReview = createAsyncThunk<
  any,
  ReviewPayload,
  { state: RootState }
>(
  "review/submitReview",
  async (payload: ReviewPayload, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    try {
      const response = await axios.post(
        `${apiUrl}/products/review`,
        payload,
        getAuthHeaders(state)
      );
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to submit review.";
      return rejectWithValue(errorMessage);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
