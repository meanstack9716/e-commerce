export interface PromoCode {
  id: string;
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  max_discount_amount: number | null;
  min_order_amount: number | null;
  description: string;
}