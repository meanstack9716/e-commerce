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
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { CartItem } from "@/types/types";
import { fetchCartItemsApi, updateCartItemApi, updateSize } from "@/store/cart/cartSlice";
import borderRadius from "@/style/borderRadius";

interface SizeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  item: CartItem;
}

const allPossibleSizes = ["XS", "S", "M", "L", "XL", "XXL"];

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
      console.error("Failed to update quantity:", error);
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
            <Text style={styles.headerTitle}>Select Size</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={staticColors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.sizeContainer}>
            {availableSizes.map((size) => (
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
            ))}
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            disabled={loading}
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
    fontSize: fontSizes.lg,
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
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: borderRadius.r24,
    ...spacingStyles.m5,
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
    backgroundColor: staticColors.discountText,
    borderRadius: borderRadius.r8,
    ...spacingStyles.py5,
    alignItems: "center",
    ...spacingStyles.m5,
  },
  doneButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
});

export default SizeSelectionModal;
