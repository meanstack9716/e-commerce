import { RootState } from "@/store/store";

export const getAuthHeaders = (state: RootState) => ({
  headers: {
    Authorization: `${state.auth.token}`,
    "Content-Type": "application/json",
  },
});

export const getAuthFormDataHeaders = (state: RootState) => ({
  headers: {
    Authorization: `${state.auth.token}`,
    "Content-Type": "multipart/form-data",
    Accept: "multipart/form-data",
  },
});
