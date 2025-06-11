import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiError } from "@/utils/handleApiError";
import axiosConfig from "@/utils/axiosConfig";
import { Product, Color } from "@/interfaces";
import { PRODUCT_LIMIT } from "@/constants/constants";

interface ProductsState {
  data: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  selectedProductLoading: boolean;
  selectedProductError: string | null;
  colors: Color[];
  colorsLoading: boolean;
  colorsError: string | null;
  pagination: {
    currentPage: number;
    limit: number;
    hasMore: boolean;
  };
}

const initialState: ProductsState = {
  data: [],
  selectedProduct: null,
  loading: false,
  error: null,
  selectedProductLoading: false,
  selectedProductError: null,
  colors: [],
  colorsLoading: false,
  colorsError: null,
  pagination: {
    currentPage: 1,
    limit: PRODUCT_LIMIT,
    hasMore: true,
  },
};

export const fetchColors = createAsyncThunk<
  Color[],
  void,
  { rejectValue: string }
>("products/fetchColors", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosConfig.get("/products/colors-list");
    if (response.data?.success && response.data?.data) {
      const colorsArray = Object.values(response.data.data).map(
        (item: any) => ({
          id: item.id,
          name: item.name,
          color: item.value,
        })
      );
      return colorsArray;
    }
    return rejectWithValue("Invalid response format from colors API");
  } catch (error) {
    return rejectWithValue(handleApiError(error, "Failed to fetch colors"));
  }
});

export const fetchProducts = createAsyncThunk<
  { products: Product[]; pagination: any },
  { params?: any; page?: number; limit?: number },
  { rejectValue: string }
>(
  "products/fetchProducts",
  async ({ params = {}, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get("/products/list", {
        params: {
          ...params,
          page,
          limit,
        },
      });
      if (response.data?.data) {
        return {
          products: response.data.data,
          pagination:{
            currentPage: page,
            limit,
            hasMore: response.data.data.length === limit,
          },
        };
      }
      return rejectWithValue("Invalid response format from API");
    } catch (error) {
      return rejectWithValue(handleApiError(error, "Failed to fetch products"));
    }
  }
);

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
    return rejectWithValue(
      handleApiError(error, "Failed to fetch product data")
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
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
        state.data =
          action.payload.pagination.currentPage === 1
            ? action.payload.products
            : [...state.data, ...action.payload.products];
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          limit: action.payload.pagination.limit,
          hasMore:
            action.payload.pagination.currentPage <
            action.payload.pagination.totalPages,
        };
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
    builder
      .addCase(fetchColors.pending, (state) => {
        state.colorsLoading = true;
        state.colorsError = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.colorsLoading = false;
        state.colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.colorsLoading = false;
        state.colorsError = action.payload as string;
      });
  },
});

export const { resetProducts, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
