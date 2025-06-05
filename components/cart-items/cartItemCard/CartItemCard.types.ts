import { CartItem } from "@/interfaces";

export interface CartItemCardProps {
  cartItem: CartItem;
  from: "cart" | "wishlist";
  onPressDelete?: (id: string) => void;
  selectedItems: string[];
  onToggleSelect?: (id: string) => void;
  onQuantityChange?: (quantity: number, id: string) => void;
}
