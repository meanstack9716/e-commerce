export interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  productId: string;
  productDescription: string;
}

export interface ReviewState {
  rating: number;
  comment: string;
  selectedImages: string[];
  showImagePickerModal: boolean;
}
