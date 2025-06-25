import { Product } from "@/interfaces";

export interface SizeSelectorProps {
  product: Product | null;
  onColorSelect: (colorData: {
    color: string;
    colorName: string;
    images: string[];
  }) => void;
  onSizeSelect: (size: string) => void;
  price: number;
  handleLikePress: () => void;
  handleAddToCart:() => void;
}