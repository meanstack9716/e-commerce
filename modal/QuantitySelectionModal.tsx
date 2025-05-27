import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "@/types/types";
import { AppDispatch, RootState } from "@/store/store";
import { updateCartItemApi, updateQuantity } from "@/store/cart/cartSlice";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";

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
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const error = useSelector((state: RootState) => state.cart.error);
  const loading = useSelector((state: RootState) => state.cart.loading);

  const getVariantStockQuantity = () => {
    if (!item.selectedSize || !item.colorName || !item.sizes) {
      return item.stock_quantity ? parseInt(item.stock_quantity.toString()) : 1;
    }

    const selectedSizeObj = item.sizes.find(
      (size) => size.value === item.selectedSize
    );
    if (!selectedSizeObj) {
      return 1;
    }

    const selectedVariant = selectedSizeObj.variants.find(
      (variant) => variant.name === item.colorName
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

  const handleDone = async () => {
    try {
      if (isAuthenticated) {
        await dispatch(
          updateCartItemApi({
            id: item.cartItemId || item.id,
            size: item.selectedSize || "",
            color: item.selectedColor || "",
            quantity: selectedQuantity.toString(),
          })
        ).unwrap();
      } else {
        dispatch(
          updateQuantity({
            id: item.id,
            quantity: selectedQuantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            colorName: item.colorName,
            isAuthenticated,
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
            <Text style={styles.headerTitle}>Select Quantity</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={staticColors.black} />
            </TouchableOpacity>
          </View>

          {item.colorName && (
            <View style={styles.variantInfo}>
              <Text style={styles.variantInfoText}>
                Available for {item.colorName}: {availableQuantity}
              </Text>
            </View>
          )}

          {error && <Text>{error}</Text>}

          <ScrollView style={styles.quantityScrollView}>
            <View style={styles.quantityContainer}>
              {quantityOptions.map((quantity) => (
                <TouchableOpacity
                  key={quantity}
                  style={[
                    styles.quantityOption,
                    selectedQuantity === quantity && styles.selectedOption,
                  ]}
                  onPress={() => handleQuantitySelect(quantity)}
                  disabled={loading}
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
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneButton]}
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
    fontWeight: fontWeights.semiBold,
    color: staticColors.black,
  },
  closeButton: {
    ...spacingStyles.p5,
  },
  variantInfo: {
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r8,
    ...spacingStyles.mb5,
  },
  variantInfoText: {
    fontSize: fontSizes.sm,
    color: staticColors.textSubtitle,
  },
  quantityScrollView: {
    maxHeight: Dimensions.get("window").height * 0.3,
  },
  quantityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginLeft: 8,
  },
  quantityOption: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: borderRadius.circle,
    margin: 3,
  },
  selectedOption: {
    borderColor: staticColors.discountText,
    backgroundColor: staticColors.white,
  },
  quantityText: {
    fontSize: fontSizes.base,
    color: staticColors.black,
  },
  selectedQuantityText: {
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
  doneButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
  },
});

export default QuantitySelectionModal;
