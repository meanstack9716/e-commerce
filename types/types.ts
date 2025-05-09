export interface Profile {
  id: string;
  images: string[];
  title: string;
  price: string;
  star: number;
  categories: string[];
}

export interface SubSubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_category_id: string;
  category_id: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  category_id: string;
  sub_sub_categories?: SubSubCategory[];
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  img_url: string;
  sub_categories: SubCategory[];
}

export interface ProductData {
  products: Profile[];
}

export type OTPInputProps = {
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
