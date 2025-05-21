import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { Ionicons } from "@expo/vector-icons";
import {fontSizes, fontWeights} from "@/style/typography";
import { IMAGE_URIS } from "@/constants/imageLinks";

interface QualityCheckModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const QualityCheckModal: React.FC<QualityCheckModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quality Check Process</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={staticColors.textDarkGray}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.section}>
              <Image
                source={{ uri: IMAGE_URIS.shoppingTargetGraphic }}
                style={styles.sectionImage}
              />

              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Sample Check</Text>
                <Text style={styles.sectionDescription}>
                  A style sample out of a lot is checked before a seller is
                  onboarded on myntra*
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Image
                source={{ uri: IMAGE_URIS.genuineProductBadge }}
                style={styles.sectionImage}
              />
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Measurements Check</Text>
                <Text style={styles.sectionDescription}>
                  Sample tag & measurements out of a lot is checked as per size
                  chart, relying on the information provided by the seller*
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Image
                source={{ uri: IMAGE_URIS.marketingConceptArt }}
                style={styles.sectionImage}
              />
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Product Check</Text>
                <Text style={styles.sectionDescription}>
                  Sellers are mandated to check the size, MRP, color, expiry for
                  every product before selling on myntra*
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Image
                source={{ uri: IMAGE_URIS.beautyHealthProducts }}
                style={styles.sectionImage}
              />
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Safety Check</Text>
                <Text style={styles.sectionDescription}>
                  All covid precautions are strictly followed to get the product
                  safely to you
                </Text>
              </View>
            </View>

            <Text style={styles.footnote}>
              * This specific product may not have been checked
            </Text>
            <Text style={styles.footnote}>
              * The sellers are responsible for compliance with all applicable
              laws
            </Text>
          </View>
        </View>
      </View>
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
  modalContainer: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: "100%",
    ...spacingStyles.p15,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb20,
  },
  modalTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
  },
  modalContent: {
    flexDirection: "column",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb20,
  },
  sectionImage: {
    width: 60,
    height: 60,
    ...spacingStyles.mr10,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
    ...spacingStyles.mb5,
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    lineHeight: 20,
  },
  footnote: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    ...spacingStyles.mt5,
  },
});

export default QualityCheckModal;
