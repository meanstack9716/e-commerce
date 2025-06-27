export interface SearchSuggestionsProps {
  title: string;
  searchList: string[];
  onSuggestionPress : (query: string) => void;
  onClearHistory?: () => void;
}