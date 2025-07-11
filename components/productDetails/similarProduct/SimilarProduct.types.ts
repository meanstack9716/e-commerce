import { Product } from "@/interfaces";

export interface SimilarProductsProps {
  currentProduct: Product;
  handleAddToCart: (product: Product) => void; 
}

export interface SimilarProduct {
  id: string; 
  title: string;
  name?: string; 
  description?: string;
  thumbnail_url?: string;
  image_url?: string;
  price: number;
  final_price: number;
}  
