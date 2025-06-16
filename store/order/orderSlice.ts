import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getAuthHeaders } from "@/utils/apiHeader";
import axiosConfig from "@/utils/axiosConfig";
import { Order } from "@/interfaces";
import Toast from "react-native-toast-message";
import { OrderPayload } from "@/app/placeorder/placeorder.type";

interface OrderState {
  loading: boolean;
  error: string | null;
  orderId: string | null;
  orders: Order[];
  statusTypes: string[];
  selectedOrder: Order | null;
}

const initialState: OrderState = {
  loading: false,
  error: null,
  orderId: null,
  orders: [],
  statusTypes: [],
  selectedOrder: null,
};

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState }
>("order/fetchOrders", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    const response = await axiosConfig.get(
      `/orders/list`,
      getAuthHeaders(state)
    );
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch orders.";
    return rejectWithValue(errorMessage);
  }
});

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
      const response = await axiosConfig.post(`/orders/new`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error || "Failed to place order.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchStatusTypes = createAsyncThunk<
  string[],
  void,
  { state: RootState }
>("order/fetchStatusTypes", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    const response = await axiosConfig.get(
      `/orders/status-types`,
      getAuthHeaders(state)
    );
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch status types.";
    return rejectWithValue(errorMessage);
  }
});

export const fetchOrderDetails = createAsyncThunk<
  Order,
  string,
  { state: RootState }
>("order/fetchOrderDetails", async (orderId, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    if (!token) {
      return rejectWithValue("No authentication token found.");
    }

    const response = await axiosConfig.get(
      `/orders/${orderId}`,
      getAuthHeaders(state)
    );
    return response.data.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch order details.";
    return rejectWithValue(errorMessage);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.orderId = null;
      state.selectedOrder = null;
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
        Toast.show({
          type: "error",
          text1: action.payload as string,
          position: "top",
        });
        state.loading = false;
        state.error = action.payload as string;
        state.orderId = null;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orders = [];
      })

      .addCase(fetchStatusTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.statusTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchStatusTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.statusTypes = [];
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedOrder = null;
      });
  },
});

export const { clearOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
