import { CART } from "@/constants/constants";
import { saveToStorage, getFromStorage, removeFromStorage } from "./storageUtils";


export const saveCartToStorage = async (cartItems: any[]) => {
  await saveToStorage(CART, cartItems);
};

export const getCartFromStorage = async (): Promise<any[]> => {
  const data = await getFromStorage<any[]>(CART);
  return data ?? [];
};

export const clearCartFromStorage = async () => {
  await removeFromStorage(CART);
};
