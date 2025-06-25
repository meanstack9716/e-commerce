export interface AvailableSize {
  label: string;
  left: number;
  sizeData: any;
}

export interface ColorOption {
  id: string;
  color: string;
  value: string;
  img_url: string;
  stock_quantity: string;
  images: string[];
}

export interface ProductModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSize: string;
  selectedColor: string;
  allSizes: AvailableSize[];
  availableColors: ColorOption[];
  onSizeSelect: (size: string) => void;
  onColorSelect: (colorData: {
    color: string;
    colorName: string;
    images: string[];
  }) => void;
  price:number;
  productId?:string
  handleLikePress: () => void;
   handleAddToCart:() => void;
}
