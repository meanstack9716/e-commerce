import { CartItem } from "@/interfaces";

export interface CardItemCardProps {
  cartItem: CartItem;
  from: "cart" | "wishlist";
  onPressDelete?: (id: string) => void;
  selectedItems: string[];
  onToggleSelect?: (id: string) => void;
  onQuantityChange?: (quantity: number, id: string) => void;
}
