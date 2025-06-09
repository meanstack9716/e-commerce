import { Address } from "@/interfaces";

export interface AddressListModalProps {
  visible: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId?: string | null;
  onSelect?: (id: string) => void;
  onEditAddress?: (address: Address) => void;
  onConfirmAddress?: (id: string) => void;
  onAddAddress?: () => void;
}
