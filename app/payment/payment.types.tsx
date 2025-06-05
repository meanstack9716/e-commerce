export interface PaymentOption {
  label: string;
}

export interface PaymentMethodProps {
  paymentOptions: PaymentOption[];
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (label: string) => void;
  orderNotes: { [key: string]: string };
  onOrderNoteChange: (label: string, text: string) => void;
}
