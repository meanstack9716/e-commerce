import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "@/utils/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import { Product } from "@/interfaces";

interface SearchState {
  data: Product[];
  loading: boolean;
  error: string | null;
  lastPage: number;
}

const initialState: SearchState = {
  data: [],
  loading: false,
  error: null,
  lastPage: 1,
};

export const fetchSearchProducts = createAsyncThunk<
  { data: Product[]; page: number; lastPage: number },
  { params?: any },
  { rejectValue: string }
>("search/fetchSearchProducts", async ({ params = {} }, { rejectWithValue }) => {
  try {
    const response = await axiosConfig.get("/products/list", {
      params: {
        ...params,
      },
    });
console.log(params)
    const { data, current_page, last_page } = response.data;
    return { data, page: current_page, lastPage: last_page };
  } catch (error) {
    return rejectWithValue(handleApiError(error, "Search failed"));
  }
});

const searchProductsSlice = createSlice({
  name: "searchProducts",
  initialState,
  reducers: {
    resetSearchProducts: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.lastPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchProducts.fulfilled, (state, action) => {
        const { data, page, lastPage } = action.payload;
        state.loading = false;
        state.lastPage = lastPage;
        state.data = page === 1 ? data : [...state.data, ...data];
      })
      .addCase(fetchSearchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetSearchProducts } = searchProductsSlice.actions;
export default searchProductsSlice.reducer;
