import { Product } from "@/interfaces";

export interface SimilarProductsProps {
  currentProduct: Product;
  handleAddToCart: (product: Product) => void; 
}