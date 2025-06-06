import { Product } from "./product.interface";

export interface CartItem {
  selected_size?: string;
  selected_color?: string;
  selected_color_name?: string;
  quantity: number;
  id: string;
  product: Product;
  //   isSelected: boolean;
}
