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
  reviews?: Review[];
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
import { GalleryItem, Product } from "@/interfaces";

export interface SubSubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_category_id: string;
  category_id: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  category_id: string;
  sub_sub_categories?: SubSubCategory[];
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_categories: SubCategory[];
}

export interface BannerSlide {
  id: string;
  image: string;
  title: string;
}

export interface PromotionalCard {
  id: string;
  title: string;
  description: string;
  image: string;
  actionText: string;
  actionLink: string;
}

export type OtpInputProps = {
  email: string;
  onVerifySuccess: (enteredOtp: string) => void;
  onStepBack: () => void;
  cancelText?: string;
  confirmText?: string;
};

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  isSelected: boolean;
  cartItemId: string;
  colorName?: string;
  productId: string;
}

export interface Address {
  id: string;
  contact_name: string | null;
  contact_number: string | null;
  type: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

export interface AddressFormData {
  contact_name: string;
  contact_number: string;
  postal_code: string;
  line1: string;
  line2: string | null; 
  city: string;
  state: string;
  country: string;
}

export interface Review {
  id: string;
  product_id: string;
  order_id: string;
  rating: string;
  review: string;
  by: {
    email: string;
    id: string;
    profile_url: string | null;
    role: string | null;
  };
}

export interface WishlistItem {
  id: string;
  selected_size: string;
  selected_color: string;
  selected_color_name: string;
  quantity: string;
  product: Product;
}
export type UserProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};
