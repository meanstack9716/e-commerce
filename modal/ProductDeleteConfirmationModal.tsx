import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";
import fontSizes from "@/style/fontSizes";

interface ProductDeleteConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onFirstButtonPress: () => void;
  onSecondButtonPress: () => void;
  onClose: () => void;
  isLoading: boolean;
}

const ProductDeleteConfirmationModal: React.FC<ProductDeleteConfirmationModalProps> = ({
  visible,
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onFirstButtonPress,
  onSecondButtonPress,
  onClose,
  isLoading,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons
                name="close-outline"
                size={24}
                color={staticColors.shadowColor}
              />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons with Separator */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onSecondButtonPress}
              style={styles.secondButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={staticColors.darkGray} />
              ) : (
                <Text style={styles.secondButtonText}>{secondaryButtonText}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onFirstButtonPress}
              style={styles.firstButton}
            >
              <Text style={styles.firstButtonText}>{primaryButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductDeleteConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.px20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mt10,
  },
  closeIcon: {},
  title: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
  },
  message: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    ...spacingStyles.pb5,
    borderBottomColor: staticColors.lightGray,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    ...spacingStyles.py5,
    alignItems: "center",
  },
  firstButton: {
    borderLeftWidth: 1,
    width: "50%",
    borderLeftColor: staticColors.lightGray,
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    alignItems: "center",
  },
  firstButtonText: {
    fontSize: fontSizes.xs,
    color: staticColors.discountText,
    textAlign: "center",
  },
  secondButton: {
    width: "50%",
    ...spacingStyles.px15,

    alignItems: "center",
  },
  secondButtonText: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    textAlign: "center",
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.mx20,
  },
});
