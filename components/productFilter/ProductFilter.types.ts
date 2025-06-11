export interface ProductFilterProps {
  subCategories: string[];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number | null;
  onApplyFilters: (filters: {
    subCategories: string[];
    sizes: string[];
    colors: string[];
    priceMin: number;
    priceMax: number | null;
  }) => void;
  onClearFilters: () => void;
  onClose: () => void;
}