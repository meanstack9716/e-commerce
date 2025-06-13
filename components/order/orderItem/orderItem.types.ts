import { Order } from "@/interfaces/orderHistory.interface";

export interface OrderItemProps {
  item: Order;
  onReviewPress: (orderId: string, productId: string, description: string) => void;
  // setOrderHistoryModalVisible: (orderId: string, productId: string, description: string) => void;
}