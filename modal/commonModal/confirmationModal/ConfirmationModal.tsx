import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import staticColors from "@/style/staticColors";
import { ConfirmationModalProps } from "./ConfirmationModal.types";
import gapSizes from "@/style/gapSizes";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  isSuccess,
  onClose,
}) => {
  const handleContinueShopping = () => {
    router.navigate("/(tabs)/home");
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible && isSuccess}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.confirmationOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.confirmationModal}>
              <View style={styles.outerCircle}>
                <Image
                  source={require("@/assets/images/images/tickImage.png")}
                  style={styles.checkImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.confirmationStars}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name="star"
                    size={fontSizes["2xl"]}
                    color={staticColors.darkYellow}
                  />
                ))}
              </View>
              <Text style={styles.confirmationTitle}>
                Thank You for Your Review!
              </Text>

              <Text style={styles.confirmationMessage}>
                Your feedback helps others shop smarter. Keep exploring! 💡💡
              </Text>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinueShopping}
              >
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmationOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmationModal: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p20,
    alignItems: "center",
    width: "90%",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  outerCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -30,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  checkImage: {
    width: 40,
    height: 40,
  },
  confirmationTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.primaryBlue,
    textAlign: "center",
    ...spacingStyles.my10,
  },
  confirmationStars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: gapSizes.md,
    ...spacingStyles.mt30,
  },
  confirmationMessage: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayMedium,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb15,
  },
  continueButton: {
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r10,
    ...spacingStyles.py10,
    ...spacingStyles.my5,
    width: "100%",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.white,
    textTransform: "capitalize",
  },
});

export default ConfirmationModal;
