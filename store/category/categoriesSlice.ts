import { CategoryItem } from "@/types/types";
import { handleApiError } from "@/utils/handleApiError";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CategoriesState {
  data: CategoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  data: [],
  loading: false,
  error: null,
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchCategories = createAsyncThunk<
  CategoryItem[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/categories/list`);
    if (!Array.isArray(response.data.data)) {
      throw new Error("Invalid response format: expected an array");
    }
    return response.data.data;
  } catch (error) {
    return rejectWithValue(
      handleApiError(error, "Failed to fetch categories")
    );
  }
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default categoriesSlice.reducer;