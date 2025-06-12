import { saveToStorage, getFromStorage, removeFromStorage } from "./storageUtils"; 

const SEARCH_HISTORY_KEY = "searchHistory";

export const saveSearchQuery = async (query: string): Promise<void> => {
  try {
    const existingHistory = await getSearchHistory();
    const updatedHistory = [
      query,
      ...existingHistory.filter((item) => item !== query),
    ].slice(0, 5); 
    await saveToStorage(SEARCH_HISTORY_KEY, updatedHistory);
  } catch (e) {
    console.error(`Error saving search query "${query}" to storage`, e);
  }
};

export const getSearchHistory = async (): Promise<string[]> => {
  try {
    const history = await getFromStorage<string[]>(SEARCH_HISTORY_KEY);
    return history ?? [];
  } catch (e) {
    console.error("Error reading search history from storage", e);
    return [];
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await removeFromStorage(SEARCH_HISTORY_KEY);
  } catch (e) {
    console.error("Error clearing search history from storage", e);
  }
};