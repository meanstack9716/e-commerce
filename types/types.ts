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
  created_at: string;
  items: OrderItem[];
}