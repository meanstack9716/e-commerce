import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "@/store/store";
import { handleApiError } from "@/utils/handleApiError";
import { Address, AddressFormData } from "@/types/types";
import Constants from "expo-constants";
import { getAuthHeaders } from "@/utils/apiHeader";

interface AddressState {
  addressTypes: string[];
  selectedAddressType: string;
  isDefault: boolean;
  loading: boolean;
  addresses: Address[];
  error: { [key: string]: string } | null;
  selectedAddressId: string | null;
  editingAddress: Address | null;
}

const initialState: AddressState = {
  addressTypes: [],
  addresses: [],
  selectedAddressType: "",
  isDefault: false,
  loading: false,
  error: null,
  selectedAddressId: null,
  editingAddress: null,
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const fetchAddressTypes = createAsyncThunk<
  string[],
  void,
  { state: RootState; rejectValue: string }
>("address/fetchAddressTypes", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const response = await axios.get(`${apiUrl}/address/types-list`, getAuthHeaders(state))
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      handleApiError(error, "Failed to fetch address types")
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
      await axios.post(
        `${apiUrl}/address/add`,
        {
          contact_name: formData.contact_name,
          contact_number: formData.contact_number,
          line1: formData.line1,
          line2: formData.line2,
          type: addressType,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_primary: isDefault,
        },
        getAuthHeaders(state)
      );
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const mappedErrors: { [key: string]: string } = {};
        for (const field in apiErrors) {
          const fieldNameMap: { [key: string]: string } = {
            contact_name: "name",
            contact_number: "mobile",
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

export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  { state: RootState; rejectValue: string }
>("address/fetchAddresses", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const response = await axios.get(`${apiUrl}/address/list`,getAuthHeaders(state));
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch addresses"
    );
  }
});

export const removeAddress = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  "address/removeAddress",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      await axios.delete(`${apiUrl}/address/remove/${id}`, getAuthHeaders(state));
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove address"
      );
    }
  }
);

export const updateAddress = createAsyncThunk<
  void,
  {
    addressId: string;
    formData: AddressFormData;
    addressType: string;
    isDefault: boolean;
  },
  { state: RootState; rejectValue: { [key: string]: string } }
>(
  "address/updateAddress",
  async (
    { addressId, formData, addressType, isDefault },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState();
      await axios.put(
        `${apiUrl}/address/update`,
        {
          address_id: addressId,
          contact_name: formData.contact_name,
          contact_number: formData.contact_number,
          line1: formData.line1,
          line2: formData.line2,
          type: addressType,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          is_primary: isDefault,
        },
        getAuthHeaders(state)
      );
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const mappedErrors: { [key: string]: string } = {};
        for (const field in apiErrors) {
          const fieldNameMap: { [key: string]: string } = {
            contact_name: "name",
            contact_number: "mobile",
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
        general: error.response?.data?.message || "Failed to update address",
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
    setSelectedAddressId(state, action: PayloadAction<string | null>) {
      state.selectedAddressId = action.payload;
    },
    setEditingAddress(state, action: PayloadAction<Address | null>) {
      state.editingAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressTypes.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.addressTypes = action.payload;
        state.selectedAddressType = action.payload[0] || "Home";
      })
      .addCase(fetchAddressTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          general: action.payload || "Failed to fetch address types",
        };
        state.selectedAddressType = "Home";
      })
      .addCase(saveAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAddress.fulfilled, (state) => {
        state.loading = false;
        state.editingAddress = null;
      })
      .addCase(saveAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { general: "Failed to save address" };
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        const primaryAddress = action.payload.find((addr) => addr.is_primary);
        state.selectedAddressId =
          primaryAddress?.id || action.payload[0]?.id || null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = {
          general: action.payload || "Failed to fetch addresses",
        };
      })
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr.id !== action.payload
        );
        if (state.selectedAddressId === action.payload) {
          const remainingAddresses = state.addresses.filter(
            (addr) => addr.id !== action.payload
          );
          const primaryAddress = remainingAddresses.find(
            (addr) => addr.is_primary
          );
          state.selectedAddressId =
            primaryAddress?.id || remainingAddresses[0]?.id || null;
        }
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = { general: action.payload || "Failed to remove address" };
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.loading = false;
        state.editingAddress = null; // Clear editing address
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { general: "Failed to update address" };
      });
  },
});

export const {
  setAddressType,
  setIsDefault,
  resetError,
  setSelectedAddressId,
  setEditingAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
