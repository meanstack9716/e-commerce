import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { getApiUrl } from "@/utils/apiUtils";

interface OrderPayload {
  cart_items_ids: (string | number)[];
  shipping_address_id: string;
  payment_method: string;
}

interface OrderState {
  loading: boolean;
  error: string | null;
  orderId: string | null;
}

const initialState: OrderState = {
  loading: false,
  error: null,
  orderId: null,
};

export const placeOrder = createAsyncThunk<
  any,
  OrderPayload,
  { state: RootState }
>(
  "order/placeOrder",
  async (payload: OrderPayload, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) {
        return rejectWithValue("No authentication token found.");
      }
      const apiUrl = await getApiUrl();
      const response = await axios.post(`${apiUrl}/orders/new`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to place order.";
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.orderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderId = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload.orderId || "success";
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orderId = null;
      });
  },
});

export const { clearOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
