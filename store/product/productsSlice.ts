import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductData, Profile } from "@/types/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface ProductsState {
  data: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Profile[], 
  void,     
  { rejectValue: string } 
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiUrl}/products/list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!Array.isArray(response.data.products)) {
      throw new Error("Invalid response format: expected 'products' to be an array");
    }

    return response.data.products;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
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
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
