import { CartItem, PromoCode } from "@/interfaces";

export interface PromoCodeSectionProps {
  selectedCartItems: CartItem[];
  headerTitle?: string;
  maxPromoCodes?: number;
}

export interface PromoCodeListProps {
  promoCodes: PromoCode[];
  appliedPromoCode: string | null;
  loadingPromoCode: string | null;
  onApplyPromoCode: (code: string) => void;
  onRemovePromoCode: () => void;
}