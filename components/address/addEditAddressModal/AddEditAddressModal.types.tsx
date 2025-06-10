import { Address, AddressFormData } from "@/interfaces";

export interface AddEditAddressModalProps {
  visible: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editAddress?: Address | null;
  onAddAddress?: (address: AddressFormData, addressType: string) => void;
  onEditAddress?: (
    address: AddressFormData,
    addressType: string,
    addressId: string
  ) => void;
}
