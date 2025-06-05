import { Address } from "@/interfaces";

export const getFormattedAddress = (addresses: Address[]) => {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return "Please add an address.";
  }

  const address = addresses[0];

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
