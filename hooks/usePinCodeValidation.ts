import { PIN_CODE_LENGTH } from "@/constants/constants";

export const isPinCodeValid = (pinCode: string): boolean => {
   
    return pinCode.length === PIN_CODE_LENGTH && !isNaN(Number(pinCode));
  };
  