import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/store";
import { handleApiError } from "@/utils/handleApiError";
import { getAuthFormDataHeaders, getAuthHeaders } from "@/utils/apiHeader";
import { buildFormData } from "@/utils/buildFormData";
import axiosConfig from "@/utils/axiosConfig";
<<<<<<< HEAD
=======
import { Review } from "@/interfaces";
>>>>>>> 3b38f39b98de6a66251c901df8c3b48e119c3a58

interface ReviewState {
  loading: boolean;
  error: string | null;
  success: boolean;
  userReview: Review | null;
  productReviews: Review[];
  page: number;
  hasMoreReviews: boolean;
}

const initialState: ReviewState = {
  loading: false,
  error: null,
  success: false,
  userReview: null,
  productReviews: [],
  page: 1,
  hasMoreReviews: true,
};

export interface ReviewPayload {
  product_id: string;
  rating: string;
  review: string;
  images?: string[];
  review_id?: string;
  remove_img_indexes?: number[];
}

export const fetchUserReview = createAsyncThunk<
  Review,
  string,
  { state: RootState }
>(
  "review/fetchUserReview",
  async (productId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    try {
      const response = await axiosConfig.get(
        `/products/${productId}/user-review`,
        getAuthHeaders(state)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to fetch user review")
      );
    }
  }
);

export const fetchProductReviews = createAsyncThunk<
  { reviews: Review[]; hasMoreReviews: boolean },
  { productId: string; page: number; limit: number },
  { state: RootState }
>(
  "review/fetchProductReviews",
  async ({ productId, page, limit }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      console.log(response, { limit });
      const reviews = response.data.data;
      const hasMoreReviews = reviews.length === limit;
      return { reviews, hasMoreReviews };
    } catch (error: any) {
      return rejectWithValue(
        handleApiError(error, "Failed to fetch product reviews")
      );
    }
  }
);

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
<<<<<<< HEAD
      const response = await axiosConfig.post(
        `/products/review`,
        payload,
        getAuthHeaders(state)
=======
      const formData = buildFormData(payload);
      const response = await axiosConfig.post(
        `/products/review`,
        formData,
        getAuthFormDataHeaders(state)
>>>>>>> 3b38f39b98de6a66251c901df8c3b48e119c3a58
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
<<<<<<< HEAD
=======

>>>>>>> 3b38f39b98de6a66251c901df8c3b48e119c3a58
      const response = await axiosConfig.post(
        `/products/update-review`,
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
      state.userReview = null;
      state.productReviews = [];
      state.page = 1;
      state.hasMoreReviews = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReview.fulfilled, (state, action) => {
        state.loading = false;
        state.userReview = action.payload;
      })
      .addCase(fetchUserReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = [
          ...state.productReviews,
          ...action.payload.reviews,
        ];
        state.page += 1;
        state.hasMoreReviews = action.payload.hasMoreReviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
