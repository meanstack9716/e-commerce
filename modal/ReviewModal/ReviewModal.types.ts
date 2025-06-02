export interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  productDescription: string;
}
