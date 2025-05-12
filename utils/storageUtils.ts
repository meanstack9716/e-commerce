import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStorage = async <DataType>(key: string, value: DataType): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error saving data to storage with key "${key}"`, e);
  }
};

export const getFromStorage = async <DataType>(key: string): Promise<DataType | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as DataType : null;
  } catch (e) {
    console.error(`Error reading data from storage with key "${key}"`, e);
    return null;
  }
};

export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing data from storage with key "${key}"`, e);
  }
};
