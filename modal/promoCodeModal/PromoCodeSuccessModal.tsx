import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import images from "@/constants/images";
import { PromoCodeSuccessProps } from "./PromoCodeModal.types";

const PromoCodeSuccessModal: React.FC<PromoCodeSuccessProps> = ({
  visible,
  promoCode,
  onClose,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Image
                source={images.promoCodeSuccess}
                style={styles.promoCodeImage}
                resizeMode="contain"
              />

              <Text style={styles.modalTitle}> 🎉 Congratulations !</Text>
              <Text style={styles.modalMessage}>
                Coupon code   
                <Text style={styles.promoText}> "{promoCode}" </Text> applied
                successfully!
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,
    ...spacingStyles.px15,
    width: "80%",
    alignItems: "center",
  },
  promoCodeImage: { width: 100, height: 100 },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
    ...spacingStyles.mb5,
  },
  modalMessage: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayeMedium,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb20,
  },
  promoText: {
    color: staticColors.darkGreen,
    fontFamily: fontFamilies.ralewayBold,
  },
});

export default PromoCodeSuccessModal;
