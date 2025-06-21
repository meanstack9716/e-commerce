export interface PromoCodeSuccessProps {
  visible: boolean;
  promoCode?: string | null;
  error?: string | null;
  onClose: () => void;
  shouldNavigateToCart?: boolean;
}

export interface PromoCodeModalProps {
  visible: boolean;
  onClose: () => void;
  selectedItems: { id: string }[];
}