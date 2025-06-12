export interface Address {
  id: string;
  contact_name: string | null;
  contact_number: string | null;
  type: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
}

export interface AddressFormData {
  contact_name: string;
  contact_number: string;
  postal_code: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  is_primary?: boolean;
}
