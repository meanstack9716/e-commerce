import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "guest_cart";

export const saveCartToStorage = async (cartItems: any[]) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (e) {
    console.error("Error saving cart to storage", e);
  }
};

export const getCartFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading cart from storage", e);
    return [];
  }
};

export const clearCartFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error("Error clearing cart from storage", e);
  }
};
