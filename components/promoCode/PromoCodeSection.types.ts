import { CartItem } from "@/interfaces";

export interface PromoCodeSectionProps {
  selectedCartItems: CartItem[];
  headerTitle?: string;
  showAllCouponsLink?: boolean;
  maxPromoCodes?: number;
  shouldNavigateToCart?: boolean;
}