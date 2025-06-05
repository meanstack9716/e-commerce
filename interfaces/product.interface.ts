import { Review } from "@/app/product-reviews/review.types";

export interface Product {
  id: string;
  title: string;
  description: string;
  discount_percent?: number;
  final_price: number;
  price:number;
  stock_quantity?: string;
  thumbnail_url: string;
  images: string[];
  categories: string[];
  star?: number;
  details?: string;
  sku?: string;
  brand?: Brand;
  sizes?: Size[];
  gallery?: GalleryItem[];
  seller?: Seller;
  delivery_days?: string;
  reviews?:Review[]
}

export interface RatingReviewProps {
  review: Review;
  productId: string;
}

export interface GalleryItem {
  id: string;
  color: string;
  img_url: string;
}

export interface ColorVariant {
  id: string;
  value: string;
  name: string;
  stock_quantity: string;
}

export interface Size {
  id: string;
  product_id: string;
  value: string;
  size_type: string;
  variants: ColorVariant[];
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  img_url: string;
}

export interface Seller {
  business_name: string;
  business_type: string;
  business_email: string;
  business_mobile: string;
  id: string;
}