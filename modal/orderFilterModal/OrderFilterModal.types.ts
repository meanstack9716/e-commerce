export interface FilterValues {
  status: string;
  time: string;
  dateRange: string;
}

export interface OrderFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}