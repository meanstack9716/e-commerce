import { GalleryItem, Product } from "@/interfaces";

export interface OrderItem {
  selected_size: string;
  selected_color_name: string;
  quantity: number;
  product: Product;
  gallery?: GalleryItem[];
}

export interface Order {
  id: string;
  status: string;
  payment_status:string
  created_at: string;
  items: OrderItem[];
}