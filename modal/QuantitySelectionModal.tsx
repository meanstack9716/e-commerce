import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CartItem } from "@/types/types";
import { updateQuantity } from "@/store/cart/cartSlice";

interface QuantitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  item: CartItem;
}

const QuantitySelectionModal: React.FC<QuantitySelectionModalProps> = ({
  visible,
  onClose,
  item,
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const getVariantStockQuantity = () => {
    if (!item.selectedSize || !item.selectedColor || !item.sizes) {
      return item.stock_quantity ? parseInt(item.stock_quantity.toString()) : 1;
    }

    const selectedSizeObj = item.sizes.find(
      (size) => size.value === item.selectedSize
    );
    if (!selectedSizeObj) {
      return 1;
    }

    const selectedVariant = selectedSizeObj.variants.find(
      (variant) => variant.name === item.selectedColor
    );

    if (!selectedVariant) {
      return 1;
    }

    return parseInt(selectedVariant.stock_quantity.toString());
  };

  const availableQuantity = getVariantStockQuantity();

  const quantityOptions = Array.from(
    { length: availableQuantity },
    (_, index) => index + 1
  );

  const [selectedQuantity, setSelectedQuantity] = useState(item.quantity || 1);

  useEffect(() => {
    if (visible) {
      const currentQuantity = item.quantity || 1;
      setSelectedQuantity(Math.min(currentQuantity, availableQuantity));
    }
  }, [visible, item.quantity, availableQuantity]);

  const handleQuantitySelect = (quantity: number) => {
    setSelectedQuantity(quantity);
  };

  const handleDone = () => {
    dispatch(
      updateQuantity({
        id: item.id,
        quantity: selectedQuantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        isAuthenticated,
      })
    );
    onClose();
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
            <Text style={styles.headerTitle}>Select Quantity</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={staticColors.black} />
            </TouchableOpacity>
          </View>

          {/* Display selected variant info */}
          {item.selectedColor && (
            <View style={styles.variantInfo}>
              <Text style={styles.variantInfoText}>
                Available for {item.selectedColor}: {availableQuantity}
              </Text>
            </View>
          )}

          <View style={styles.quantityContainer}>
            {quantityOptions.map((quantity) => (
              <TouchableOpacity
                key={quantity}
                style={[
                  styles.quantityOption,
                  selectedQuantity === quantity && styles.selectedOption,
                ]}
                onPress={() => handleQuantitySelect(quantity)}
              >
                <Text
                  style={[
                    styles.quantityText,
                    selectedQuantity === quantity &&
                      styles.selectedQuantityText,
                  ]}
                >
                  {quantity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>DONE</Text>
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    fontWeight: "600",
    color: staticColors.black,
  },
  closeButton: {
    ...spacingStyles.p5,
  },
  variantInfo: {
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.p10,
    borderRadius: 8,
    ...spacingStyles.mb5,
  },
  variantInfoText: {
    fontSize: fontSizes.sm,
    color: staticColors.textSubtitle,
  },
  quantityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    ...spacingStyles.m5,
  },
  quantityOption: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: 25,
    ...spacingStyles.m5,
  },
  selectedOption: {
    borderColor: staticColors.discountText,
    backgroundColor: staticColors.white,
  },
  quantityText: {
    fontSize: fontSizes.md,
    color: staticColors.black,
  },
  selectedQuantityText: {
    color: staticColors.discountText,
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: staticColors.discountText,
    borderRadius: 8,
    ...spacingStyles.py5,
    alignItems: "center",
    ...spacingStyles.m5,
  },
  doneButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
});

export default QuantitySelectionModal;
