import { Order } from "@/interfaces";

export interface OrderItemsSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  onSelectItem: (productId: string, productDescription: string) => void;
}