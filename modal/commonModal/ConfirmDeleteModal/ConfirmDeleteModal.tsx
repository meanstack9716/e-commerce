import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontFamilies } from "@/style/fontFamilies";
import { fontSizes } from "@/style/typography";
import { ConfirmDeleteModalProps } from "./ConfirmDeleteModal.types";

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = "Are you sure you want to delete this?",
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <FontAwesome
            name="trash"
            size={24}
            color={staticColors.errorColor}
            style={styles.trashIcon}
          />
          <Text style={styles.modalText}>{title}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p20,
    width: "80%",
    alignItems: "center",
  },
  trashIcon: {
    ...spacingStyles.mb10,
    ...spacingStyles.p12,
    backgroundColor: staticColors.lightRose,
    borderRadius: borderRadius.circle,
  },
  modalText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r5,
  },
  cancelButton: {
    backgroundColor: staticColors.secondaryGray,
  },
  confirmButton: {
    backgroundColor: staticColors.primaryBlue,
  },
  modalButtonText: {
    color: staticColors.white,
    fontFamily: fontFamilies.ralewayBold,
  },
});

export default ConfirmDeleteModal;
