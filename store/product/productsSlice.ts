import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleApiError } from "@/utils/handleApiError";
import axiosConfig from "@/utils/axiosConfig";
import { Product, Color } from "@/interfaces";
import { RECOMMENDED_KEYWORD_LIMIT } from "@/constants/constants";
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
  recommendedKeywords: string[];
  recommendedKeywordsLoading: boolean;
  recommendedKeywordsError: string | null;
  lastPage: number;
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
  recommendedKeywords: [],
  recommendedKeywordsLoading: false,
  recommendedKeywordsError: null,
  lastPage: 1,
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
  { data: Product[]; page: number; lastPage: number },
  { params?: any },
  { rejectValue: string }
>("products/fetchProducts", async ({ params = {} }, { rejectWithValue }) => {
  try {
    const response = await axiosConfig.get("/products/list", {
      params: {
        ...params,
      },
    });
    console.log("params",params)
    if (response.data?.data) {
      const { data, current_page, last_page } = response.data;
      return { data, page: current_page, lastPage: last_page };
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
    return rejectWithValue(
      handleApiError(error, "Failed to fetch product data")
    );
  }
});

export const fetchRecommendedKeywords = createAsyncThunk<
  string[],
  { limit?: number },
  { rejectValue: string }
>(
  "products/fetchRecommendedKeywords",
  async ({ limit = RECOMMENDED_KEYWORD_LIMIT }, { rejectWithValue }) => {
    try {
      const response = await axiosConfig.get(
        "/search/products/recommended-keywords",
        {
          params: { limit },
        }
      );

      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }

      return rejectWithValue(
        "Invalid response format from recommended keywords API"
      );
    } catch (error) {
      return rejectWithValue(
        handleApiError(error, "Failed to fetch recommended keywords")
      );
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.lastPage = 1;
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
        const { data, page, lastPage } = action.payload;
        state.lastPage = lastPage;
        if (page === 1) {
          state.data = data;
        } else {
          state.data = [...state.data, ...data];
        }
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      })
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
      })
      .addCase(fetchRecommendedKeywords.pending, (state) => {
        state.recommendedKeywordsLoading = true;
        state.recommendedKeywordsError = null;
      })
      .addCase(fetchRecommendedKeywords.fulfilled, (state, action) => {
        state.recommendedKeywordsLoading = false;
        state.recommendedKeywords = action.payload;
      })
      .addCase(fetchRecommendedKeywords.rejected, (state, action) => {
        state.recommendedKeywordsLoading = false;
        state.recommendedKeywordsError =
          action.payload || "Failed to load keywords";
      });
  },
});

export const { resetProducts, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
