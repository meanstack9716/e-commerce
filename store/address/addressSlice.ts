import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/store";

interface AddressFormData {
  contact_name: string;
  contact_mobile: string;
  postal_code: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
}

interface AddressState {
  addressTypes: string[];
  selectedAddressType: string;
  isDefault: boolean;
  loading: boolean;
  error: { [key: string]: string } | null; 
}

const initialState: AddressState = {
  addressTypes: [],
  selectedAddressType: "",
  isDefault: false,
  loading: false,
  error: null,
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchAddressTypes = createAsyncThunk<
  string[],
  void,
  { state: RootState; rejectValue: string }
>("address/fetchAddressTypes", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    const response = await axios.get(`${apiUrl}/address/types-list`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch address types"
    );
  }
});

export const saveAddress = createAsyncThunk<
  void,
  {
    formData: AddressFormData;
    addressType: string;
    isDefault: boolean;
  },
  { state: RootState; rejectValue: { [key: string]: string } }
>(
  "address/saveAddress",
  async (
    { formData, addressType, isDefault },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      const token = state.auth.token;
      await axios.post(
        `${apiUrl}/address/add`,
        {
          contact_name: formData.contact_name,
          contact_mobile: formData.contact_mobile,
          line1: formData.line1,
          line2: formData.line2,
          type: addressType,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_primary: isDefault,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const mappedErrors: { [key: string]: string } = {};
        for (const field in apiErrors) {
          const fieldNameMap: { [key: string]: string } = {
            contact_name: "name",
            contact_mobile: "mobile",
            postal_code: "pinCode",
            line1: "address",
            line2: "locality",
            city: "city",
            state: "state",
            country: "country",
          };
          const mappedField = fieldNameMap[field] || field;
          mappedErrors[mappedField] = apiErrors[field];
        }
        return rejectWithValue(mappedErrors);
      }
      return rejectWithValue({
        general: error.response?.data?.message || "Failed to save address",
      });
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressType(state, action: PayloadAction<string>) {
      state.selectedAddressType = action.payload;
    },
    setIsDefault(state, action: PayloadAction<boolean>) {
      state.isDefault = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.addressTypes = action.payload;
        state.selectedAddressType = action.payload[0] || "Home";
      })
      .addCase(fetchAddressTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = { general: action.payload || "Failed to fetch address types" };
        state.selectedAddressType = "Home";
      })
      .addCase(saveAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { general: "Failed to save address" };
      });
  },
});

export const { setAddressType, setIsDefault, resetError } =
  addressSlice.actions;

export default addressSlice.reducer;