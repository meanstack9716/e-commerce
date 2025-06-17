import { Order } from "@/interfaces";

export interface OrderDetailsModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
  onReturn?: () => void;
  onExchange?: () => void;
}