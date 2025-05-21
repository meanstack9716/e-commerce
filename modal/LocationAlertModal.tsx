import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const LocationAlertModal: React.FC<Props> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onCancel && (
              <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LocationAlertModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p20,
    borderRadius: borderRadius.r20,
    width: "80%"
  },
  title: {
    fontWeight: fontWeights.semiBold,
   fontSize:fontSizes.md,
   ...spacingStyles.mb5
  },
  message: {
    ...spacingStyles.mb15,
    color:staticColors.textMuted
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems:'center',
    gap:gapSizes.md
  },
  cancelButton: {
    backgroundColor: staticColors.bgMuted,
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r10,
  },
  cancelText: {
    color: staticColors.textDarkGray,
  },
  confirmButton: {
    backgroundColor: staticColors.discountText,
   ...spacingStyles.py10,
   ...spacingStyles.px20,
   borderRadius: borderRadius.r10,
  },
  confirmText: {
    color: staticColors.white,
  },
});
