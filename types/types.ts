interface Profile {
    id: string;
    images: string[];
    title: string;
    price: string;
    star: number;
    categories: string[];
  }
  
  interface Category {
    id: string;
    title: string;
    imageUrl: string;
    isActive?: boolean;
  }
  
  interface ProductData {
    categories: {
      All: Category[];
      Men: Category[];
      Women: Category[];
    };
    products: Profile[];
  }

  type OTPInputProps = {
    email: string;
    onVerifySuccess: (enteredOtp: string) => void;
    onStepBack: () => void;
    cancelText?: string;
    confirmText?: string;
    cancelButtonStyle?: object;
    confirmButtonStyle?: object;
    cancelTextStyle?: object;
    confirmTextStyle?: object;
  };
  
  export { Profile, Category, ProductData ,OTPInputProps };