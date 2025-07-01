import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import PromoCodeList from "@/components/promoCode/PromoCodeList";
import { PromoCodeModalProps } from "./PromoCodeModal.types";

const PromoCodeModal: React.FC<PromoCodeModalProps> = ({
  visible,
  onClose,
  promoCodes,
  appliedPromoCode,
  onSelectPromoCode,
  onRemovePromoCode,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Apply Promo Code</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView contentContainerStyle={styles.scrollContent}>
                <PromoCodeList
                  promoCodes={promoCodes}
                  appliedPromoCode={appliedPromoCode}
                  onApplyPromoCode={onSelectPromoCode}
                  onRemovePromoCode={onRemovePromoCode}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
  },
  scrollContent: {
    flexGrow: 1,
    ...spacingStyles.px5,
  },
});

export default PromoCodeModal;
