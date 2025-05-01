import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CategoryItem {
  id: string;
  name: string;
  img_url: string;
}

interface ProductType {
  id: string;
  name: string;
  description: string;
  img_url: string;
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
  img_url: string;
  product_types: ProductType[];
}

interface CategoryDetails {
  id: string;
  name: string;
  description: string;
  img_url: string;
  sub_categories: SubCategory[];
}

interface CategoriesState {
  data: CategoryItem[];
  selectedCategoryDetails: CategoryDetails | null;
  loading: boolean;
  error: string | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

const initialState: CategoriesState = {
  data: [],
  selectedCategoryDetails: null,
  loading: false,
  error: null,
  detailsLoading: false,
  detailsError: null,
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories/list`);
      if (!response.data.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid response format: 'data' array not found");
      }
      return response.data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        img_url: item.img_url,
      }));
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchCategoryDetails = createAsyncThunk(
  "categories/fetchCategoryDetails",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/categories/list/${categoryId}`
      );
      if (!response.data.data) {
        throw new Error("Invalid response format: 'data' not found");
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category details"
      );
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategoryDetails: (state) => {
      state.selectedCategoryDetails = null;
      state.detailsError = null;
    },
  },
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
    builder
      .addCase(fetchCategoryDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchCategoryDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedCategoryDetails = action.payload;
      })
      .addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload as string;
      });
  },
});

export const { clearSelectedCategoryDetails } = categoriesSlice.actions;
export default categoriesSlice.reducer;
