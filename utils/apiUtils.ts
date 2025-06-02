import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL || "";

export const getApiUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem("apiUrl");
    return savedUrl || DEFAULT_API_URL;
  } catch (error) {
    console.error("Failed to get API URL from AsyncStorage:", error);
    return DEFAULT_API_URL;
  }
};