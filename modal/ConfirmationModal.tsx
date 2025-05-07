import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  firstButtonText: string;
  secondButtonText: string;
  onFirstButtonPress: () => void;
  onSecondButtonPress: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  firstButtonText,
  secondButtonText,
  onFirstButtonPress,
  onSecondButtonPress,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onFirstButtonPress}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with Title and Close Icon */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={onFirstButtonPress}
            >
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
            >
              <Text style={styles.secondButtonText}>{secondButtonText}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity
              onPress={onFirstButtonPress}
              style={styles.firstButton}
            >
              <Text style={styles.firstButtonText}>{firstButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

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
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: staticColors.darkGray,
    ...spacingStyles.pb5,
    borderBottomColor: staticColors.lightGray,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  firstButton: {
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    alignItems: "center",
  },
  firstButtonText: {
    fontSize: 12,
    color: staticColors.discountText,
    textAlign: "center",
  },
  secondButton: {
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    alignItems: "center",
  },
  secondButtonText: {
    fontSize: 12,
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
