export interface OrderPayload {
  cart_items_ids: String[];
  shipping_address_id: string;
  payment_method: string;
  promo_code?: string;
  redirect_url?: string;
}