import { RootState } from "@/store/store";

export const getAuthHeaders = (state: RootState) => ({
  headers: {
    Authorization: `${state.auth.token}`,
    "Content-Type": "application/json",
  },
});