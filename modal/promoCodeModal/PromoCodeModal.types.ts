export interface PromoCodeModalProps {
  visible: boolean;
  promoCode?: string | null;
  error?: string | null;
  onClose: () => void;
  shouldNavigateToCart?: boolean;
}