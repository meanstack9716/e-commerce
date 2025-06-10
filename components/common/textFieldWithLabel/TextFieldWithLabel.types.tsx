import { Address, AddressFormData } from "@/interfaces";

export interface TextFieldWithLabelProps {
  label: string;
  placeholder?: string;
  errorMessage?: string;
  value: string;
  isEditable?: boolean;
  isNumeric?: boolean;
  maxLength?: number;
  field: string;
  onChangeText: (field: string, value: string) => void;
}
