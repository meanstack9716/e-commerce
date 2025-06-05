import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiUrl } from "@/utils/apiUtils";
import { handleApiError } from "@/utils/handleApiError";

const axiosConfig = axios.create();

axiosConfig.interceptors.request.use(
  async (config) => {
    try {
      const apiUrl = await getApiUrl();
      config.baseURL = apiUrl;
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const errorMessage = handleApiError(error, "API request failed");
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("authUser");
    }

    return Promise.reject(errorMessage);
  }
);

export default axiosConfig;
