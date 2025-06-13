export interface SearchSuggestionsProps {
  title: string;
  history: string[];
  onItemPress: (query: string) => void;
  onClearHistory?: () => void;
}