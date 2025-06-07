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
  reviews?:Review[];
  total_rating:number,
}

export interface Review {
  id: string;
  rating: string;
  review: string;
  by: {
    first_name?: string;
    last_name?: string;
  };
  img_urls?: string[];
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

export interface Color {
  name: string;
  color: string;
}