import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <Modal
      animationType="fade"
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
              <Text style={styles.confirmationTitle}>Done!</Text>
              <Text style={styles.confirmationMessage}>
                Thank you for your review
              </Text>
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
    paddingTop: 50,
    ...spacingStyles.pb25,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "90%",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },

  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -35,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  checkImage: {
    width: 60,
    height: 60,
  },
  confirmationTitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    ...spacingStyles.mb5,
    textTransform: "capitalize",
  },
  confirmationMessage: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb15,
  },
  confirmationStars: {
    flexDirection: "row",
    justifyContent: "center",
    gap:gapSizes.md
  },
});

export default ConfirmationModal;
