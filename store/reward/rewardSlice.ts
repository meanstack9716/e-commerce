import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "@/utils/axiosConfig";
import { getAuthHeaders } from "@/utils/apiHeader";
import { handleApiError } from "@/utils/handleApiError";
import { RootState } from "../store";
import {
  RewardHistory,
  RewardHistoryResponse,
  RewardPointsResponse,
} from "@/interfaces";
import { LIST_LIMIT } from "@/constants/constants";

interface RewardState {
  loading: boolean;
  error: string | null;
  data: RewardHistory[];
  currentPage: number;
  lastPage: number;
  totalPoints: RewardPointsResponse | null;
}

const initialState: RewardState = {
  loading: false,
  error: null,
  data: [],
  currentPage: 1,
  lastPage: 1,
  totalPoints: null,
};

export const fetchRewardHistory = createAsyncThunk<
  RewardHistoryResponse,
  { page?: number; limit?: number },
  { state: RootState; rejectValue: string }
>(
  "reward/fetchRewardHistory",
  async ({ page = 1, limit = LIST_LIMIT }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await axiosConfig.get(
        `/user/reward-history?limit=${limit}&page=${page}`,
        getAuthHeaders(state)
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to fetch reward history"
      );
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTotalRewardPoints = createAsyncThunk<
  RewardPointsResponse,
  void,
  { state: RootState; rejectValue: string }
>("reward/fetchTotalRewardPoints", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const response = await axiosConfig.get(
      `/user/reward-points`,
      getAuthHeaders(state)
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "Failed to fetch reward points");
    return rejectWithValue(errorMessage);
  }
});

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    resetRewardState: (state) => {
      state.loading = false;
      state.error = null;
      state.data = [];
      state.currentPage = 1;
      state.lastPage = 1;
      state.totalPoints = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardHistory.pending, (state, action) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(fetchRewardHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { data, current_page, last_page } = action.payload;
        state.currentPage = current_page;
        state.lastPage = last_page;
        state.data = current_page === 1 ? data : [...state.data, ...data];
      })
      .addCase(fetchRewardHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTotalRewardPoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTotalRewardPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPoints = action.payload;
      })
      .addCase(fetchTotalRewardPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRewardState } = rewardSlice.actions;
export default rewardSlice.reducer;
