import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "@/interfaces";
import axiosConfig from "@/utils/axiosConfig";
import { handleApiError } from "@/utils/handleApiError";
import { SimilarProduct } from "@/components/productDetails/similarProduct/SimilarProduct.types";

interface SimilarProductsState {
  data: SimilarProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: SimilarProductsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchSimilarProducts = createAsyncThunk<
  SimilarProduct[],
  { productId: string; color?: string },
  { rejectValue: string }
>("similarProducts/fetchSimilarProducts", async ({ productId, color }, { rejectWithValue }) => {
    console.log(productId , color)
  try {
    const response = await axiosConfig.get(`/products/${productId}/similar`, {
      params: { color },
    });

    if (Array.isArray(response.data?.similar_products)) {
      return response.data.similar_products;
    }

    return rejectWithValue("Invalid similar products format");
  } catch (error) {
    return rejectWithValue(handleApiError(error, "Failed to fetch similar products"));
  }
});


const similarProductsSlice = createSlice({
  name: "similarProducts",
  initialState,
  reducers: {
    clearSimilarProducts: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch similar products";
      });
  },
});

export const { clearSimilarProducts } = similarProductsSlice.actions;
export default similarProductsSlice.reducer;
