import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiError } from "@/utils/handleApiError";
import axiosConfig from "@/utils/axiosConfig";
import { Product } from "@/interfaces";

interface ProductsState {
  data: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  selectedProductLoading: boolean;
  selectedProductError: string | null;
}

const initialState: ProductsState = {
  data: [],
  selectedProduct: null,
  loading: false,
  error: null,
  selectedProductLoading: false,
  selectedProductError: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosConfig.get(`/products/list`);
    if (response.data?.data) {
      return response.data.data;
    }
    return rejectWithValue("Invalid response format from API");
  } catch (error) {
    return rejectWithValue(handleApiError(error, "Failed to fetch products"));
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosConfig.get(`/products/${id}`);
    const apiProduct = response.data.data;
    if (apiProduct) {
      return apiProduct;
    }
    return rejectWithValue("Invalid product data");
  } catch (error) {
    return rejectWithValue(handleApiError(error, "Failed to fetch product data"));
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedProductLoading = false;
      state.selectedProductError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.selectedProductLoading = true;
        state.selectedProductError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProductError =
          action.payload || "Failed to fetch product details";
      });
  },
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;