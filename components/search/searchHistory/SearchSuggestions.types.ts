export interface SearchSuggestionsProps {
  title: string;
  recentSearches: string[];
  onSuggestionPress : (query: string) => void;
  onClearHistory?: () => void;
}