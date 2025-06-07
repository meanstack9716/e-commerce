import { Address } from "@/interfaces";

export const getFormattedAddress = (
  addresses: Address[],
  addressId?: string | null
) => {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return "Please add an address.";
  }

  const address =
    (addressId && addresses.find((addr) => addr.id === addressId)) ||
    addresses.find((addr) => addr.is_primary) ||
    addresses[0];

  if (!address) {
    return "Address not found.";
  }
  const {
    contact_name,
    contact_number,
    line1,
    line2,
    city,
    state,
    postal_code,
    country,
  } = address;

  return `${contact_name}\n${contact_number}\n${line1}, ${line2}, ${city}, ${state} - ${postal_code}, ${country}`;
};
