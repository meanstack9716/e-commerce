import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import axiosConfig from "@/utils/axiosConfig";
import { getAuthHeaders } from "@/utils/apiHeader";

interface PromoCode {
  id: string;
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  max_discount_amount: number | null;
  min_order_amount: number | null;
  start_date: string;
  expiry_date: string | null;
  description: string;
  is_active: boolean;
}

interface PromoCodeState {
  promoCodes: PromoCode[];
  loading: boolean;
  error: string | null;
  appliedPromoCode: string | null;
  loadingPromoCode: string | null;
  discounted_amount: number | null;
}

const initialState: PromoCodeState = {
  promoCodes: [],
  loading: false,
  error: null,
  appliedPromoCode: null,
  loadingPromoCode: null,
  discounted_amount: null,
};

export const fetchPromoCodes = createAsyncThunk<
  PromoCode[],
  void,
  { state: RootState }
>("promoCode/fetchPromoCodes", async (_, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  try {
    const response = await axiosConfig.get(
      `/promo-code/list`,
      getAuthHeaders(state)
    );
    return response.data.data;
  } catch (error: any) {
    const errorMessage = error || "Failed to fetch promo codes";
    return rejectWithValue(errorMessage);
  }
});

export const applyPromoCode = createAsyncThunk<
  { code: string; discounted_amount: number }, 
  { code: string; cartItemIds: string[] },
  { state: RootState }
>(
  "promoCode/applyPromoCode",
  async ({ code, cartItemIds }, { getState, rejectWithValue }) => {
    const state = getState();
    try {
      const response = await axiosConfig.post(
        `/orders/validate-promo-code`,
        {
          promo_code: code,
          cart_items_ids: cartItemIds,
        },
        getAuthHeaders(state)
      );

      if (response.data?.promo_code && response.data?.discount_amount >= 0) {
        return {
          code,
          discounted_amount: response.data.discounted_amount, 
        };
      } else {
        return rejectWithValue(
          response.data?.message || "This promo code is not valid."
        );
      }
    } catch (error: any) {
      const errorMessage = error || "Failed to apply promo code.";
      return rejectWithValue(errorMessage);
    }
  }
);

const promoCodeSlice = createSlice({
  name: "promoCode",  
  initialState,
  reducers: {
    resetPromoCodeState: (state) => {
      state.loading = false;
      state.error = null;
      state.appliedPromoCode = null;
      state.loadingPromoCode = null;
      state.discounted_amount = null;
    },
    removePromoCode: (state) => {
      state.appliedPromoCode = null;
      state.discounted_amount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCodes = action.payload;
        state.error = null;
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.promoCodes = [];
      })
      .addCase(applyPromoCode.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.loadingPromoCode = action.meta.arg.code;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedPromoCode = action.payload.code;
        state.discounted_amount = action.payload.discounted_amount;
        state.error = null;
        state.loadingPromoCode = null;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loadingPromoCode = null;
        state.discounted_amount = null;
      });
  },
});

export const { resetPromoCodeState, removePromoCode } = promoCodeSlice.actions;
export default promoCodeSlice.reducer;
