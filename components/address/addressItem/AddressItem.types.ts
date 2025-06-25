import { Address } from "@/interfaces";

export interface AddressItemProps {
  address: Address;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  onEditAddress?: (address: Address) => void;
  onDeleteAddress?: (address: Address) => void; 
}
