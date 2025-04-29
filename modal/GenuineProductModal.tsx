import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GenuineProductModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const GenuineProductModal: React.FC<GenuineProductModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Genuine Product</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/5579/5579919.png",
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>
                  This is a genuine product, sold by an authorized seller of
                  brand RAREISM
                </Text>
              </View>
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
    backgroundColor: staticColors.modalBackGround,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: staticColors.whiteColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: "100%",
    ...spacingStyles.p15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb20,
    ...spacingStyles.mx10,
    ...spacingStyles.mt5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: staticColors.primaryColor,
  },
  closeButton: {
    fontSize: 20,
    color: staticColors.shadowColor,
    fontWeight: "bold",
  },
  modalContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  modalImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    resizeMode: "contain",
  },
  modalText: {
    flex: 1,
    fontSize: 14,
    color: staticColors.darkGray,
    lineHeight: 20,
    flexWrap: "wrap",
  },
});

export default GenuineProductModal;
