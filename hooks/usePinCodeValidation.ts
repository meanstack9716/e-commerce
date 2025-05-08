export const isPinCodeValid = (pinCode: string): boolean => {
   
    return pinCode.length === 6 && !isNaN(Number(pinCode));
  };
  