import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/store";
import { handleApiError } from "@/utils/handleApiError";
import { getAuthFormDataHeaders } from "@/utils/apiHeader";
import { buildFormData } from "@/utils/buildFormData";

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

export interface ReviewPayload {
  product_id: string;
  rating: string;
  review: string;
  images?: string[];
  review_id?: string;
  remove_img_indexes?: number[];
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
      const formData = buildFormData(payload);
      const response = await axios.post(
        `${apiUrl}/products/review`,
        formData,
        getAuthFormDataHeaders(state)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Review not submitted"));
    }
  }
);

export const updateReview = createAsyncThunk<
  any,
  ReviewPayload & { remove_img_indexes?: number[] },
  { state: RootState }
>(
  "review/updateReview",
  async (
    payload: ReviewPayload & { remove_img_indexes?: number[] },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    try {
      const formData = buildFormData(payload);
      if (payload.review_id) {
        formData.append("review_id", payload.review_id);
      }

      const response = await axios.post(
        `${apiUrl}/products/update-review`,
        formData,
        getAuthFormDataHeaders(state)
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error, "Review not updated"));
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
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;