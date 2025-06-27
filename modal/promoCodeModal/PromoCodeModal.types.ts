import { PromoCode } from "@/interfaces";

export interface PromoCodeSuccessProps {
  visible: boolean;
  promoCode?: string | null;
  error?: string | null;
  onClose: () => void;
}

export interface PromoCodeModalProps {
  visible: boolean;
  onClose: () => void;
  promoCodes: PromoCode[];
  appliedPromoCode: string | null;
  onSelectPromoCode: (code: string) => void;
  onRemovePromoCode: () => void;
}