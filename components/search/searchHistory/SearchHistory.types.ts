export interface SearchHistoryProps {
  history: string[];
  onItemPress: (query: string) => void;
  onClearHistory: () => void;
}