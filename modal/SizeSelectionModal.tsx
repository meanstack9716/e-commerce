import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "@/types/types";
import {
  fetchCartItemsApi,
  updateCartItemApi,
  updateSize,
} from "@/store/cart/cartSlice";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { AppDispatch, RootState } from "@/store/store";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";

interface SizeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  item: CartItem;
}

const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const numericSizes = [
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
];

const SizeSelectionModal: React.FC<SizeSelectionModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const allPossibleSizes =
    item?.sizes &&
    item.sizes.length > 0 &&
    item.sizes[0]?.size_type === "numeric"
      ? numericSizes
      : standardSizes;

  const availableSizes = allPossibleSizes
    .map((size) => {
      const productSize = item?.sizes?.find((s) => s.value === size);
      if (productSize) {
        const variant = productSize.variants.find(
          (v) => v.value === item.selectedColor
        );
        const stock = variant ? parseInt(variant.stock_quantity || "0") : 0;
        return { label: size, left: stock };
      }
      return { label: size, left: 0 };
    })
    .filter((size) => size.left > 0);

  const [selectedSize, setSelectedSize] = useState<string>(
    item.selectedSize || ""
  );

  useEffect(() => {
    if (visible) {
      setSelectedSize(item.selectedSize || "");
    }
  }, [visible, item.selectedSize]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleDone = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(
          updateCartItemApi({
            id: item.cartItemId || item.id,
            size: selectedSize || "",
            color: item.selectedColor || "",
            quantity: (item.quantity || 1).toString(),
          })
        ).unwrap();
      } else {
        dispatch(
          updateSize({
            id: item.id,
            selectedSize: selectedSize,
            selectedColor: item.selectedColor,
            isAuthenticated,
            cartItemId: item.cartItemId,
          })
        );
      }
      onClose();
    } catch (error) {
      console.error("Failed to update size:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>
              Select Size
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={staticColors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.sizeContainer}>
            {availableSizes.length > 0 ? (
              availableSizes.map((size) => (
                <TouchableOpacity
                  key={size.label}
                  style={[
                    styles.sizeOption,
                    selectedSize === size.label && styles.selectedOption,
                  ]}
                  onPress={() => handleSizeSelect(size.label)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size.label && styles.selectedSizeText,
                    ]}
                  >
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSizesText}>No sizes available</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.doneButton, loading && styles.disabledButton]}
            onPress={handleDone}
            disabled={loading || !selectedSize}
          >
            {loading ? (
              <ActivityIndicator size="small" color={staticColors.white} />
            ) : (
              <Text style={styles.doneButtonText}>DONE</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: staticColors.modalOverlayLight,
  },
  modalView: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...spacingStyles.p10,
    maxHeight: Dimensions.get("window").height * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  headerTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: staticColors.black,
  },
  closeButton: {
    ...spacingStyles.p5,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    ...spacingStyles.m5,
  },
  sizeOption: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: borderRadius.circle,
  },
  selectedOption: {
    borderColor: staticColors.discountText,
    backgroundColor: staticColors.white,
  },
  sizeText: {
    fontSize: fontSizes.md,
    color: staticColors.black,
  },
  selectedSizeText: {
    color: staticColors.discountText,
    fontWeight: fontWeights.semiBold,
  },
  doneButton: {
    backgroundColor: staticColors.primary,
    borderRadius: borderRadius.r8,
    ...spacingStyles.py5,
    alignItems: "center",
    ...spacingStyles.m5,
  },
  disabledButton: {
    backgroundColor: staticColors.lightGray,
  },
  doneButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
  noSizesText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.mt10,
  },
});

export default SizeSelectionModal;
