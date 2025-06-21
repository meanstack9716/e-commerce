import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { CartItem } from "@/interfaces";
import PromoCodeSection from "@/components/promoCode/PromoCodeSection";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { RootState } from "@/store/store";
import spacingStyles from "@/style/spacingStyles";
import { PromoCodeModalProps } from "./PromoCodeModal.types";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  visible,
  onClose,
  selectedItems,
}) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const selectedCartItems: CartItem[] = (() => {
    if (!selectedItems) return [];
    const selectedIds = new Set(selectedItems.map((item) => item.id));
    return cartItems.filter((item) => selectedIds.has(item.id));
  })();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaViewWrapper>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Apply Promo Code</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <PromoCodeSection
                selectedCartItems={selectedCartItems}
                headerTitle="All Codes"
                showAllCouponsLink={false}
                shouldNavigateToCart={true}
              />
            </ScrollView>
          </View>
        </View>
      </SafeAreaViewWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
    maxHeight: "90%",
    ...spacingStyles.pt20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px20,
    ...spacingStyles.pb15,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.borderLight,
  },
  headerTitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.lightGray,
  },
  closeButtonText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  scrollContent: {
    flexGrow: 1,
    ...spacingStyles.px5,
  },
});

export default PromoCodeModal;
