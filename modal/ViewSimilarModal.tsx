import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import SimilarProducts from "@/components/productDetails/similarProduct/SimilarProducts";
import { Product } from "@/types/types";

interface ViewSimilarModalProps {
  visible: boolean;
  onClose: () => void;
  currentProduct: Product | null;
}

const ViewSimilarModal: React.FC<ViewSimilarModalProps> = ({
  visible,
  onClose,
  currentProduct,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Similar Products</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={staticColors.primary}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {currentProduct ? (
                  <SimilarProducts currentProduct={currentProduct} />
                ) : (
                  <Text style={styles.placeholderText}>
                    No similar products available.
                  </Text>
                )}
              </ScrollView>
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
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: "100%",
    ...spacingStyles.pb15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.px25,
    ...spacingStyles.py10,
  },
  modalTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
  },
  closeButton: {
    ...spacingStyles.p5,
  },
  placeholderText: {
    fontSize: fontSizes.base,
    color: staticColors.lightGray,
    textAlign: "center",
    ...spacingStyles.mt15,
  },
});

export default ViewSimilarModal;
