import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DeliveryAddressScreen from "@/components/productDetails/DeliveryAddress";
interface DeliveryModalProps {
  onClose: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ onClose }) => {
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const handleGrant = (pinCode: string) => {
    console.log("Pincode from address screen:", pinCode);
  };

  return (
    <View style={styles.modalContainer}>
      {!addressModalVisible ? (
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Delivery Location</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter Pincode</Text>
            <TouchableOpacity style={styles.checkButton}>
              <Text style={styles.checkButtonText}>Check Pincode</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchContainer}>
            <MaterialIcons
              name="my-location"
              size={22}
              color={staticColors.offerColor}
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>Use my current Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => setAddressModalVisible(true)}
          >
            <FontAwesome6
              name="map-location-dot"
              size={20}
              color={staticColors.offerColor}
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>Search location</Text>
            <Ionicons
              name="chevron-forward"
              size={13}
              color={staticColors.offerColor}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <DeliveryAddressScreen
          onPinCodeFetched={handleGrant}
          onCloseModal={() => setAddressModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: staticColors.modalBackGround,
  },
  modalContent: {
    backgroundColor: staticColors.whiteColor,
    ...spacingStyles.px20,
    ...spacingStyles.pt15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  modalTitle: { fontSize: 17, fontWeight: "bold" },
  closeIcon: { fontSize: 20, color: staticColors.shadowColor },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 8,
    ...spacingStyles.px10,
    ...spacingStyles.py5,
  },
  inputLabel: { fontSize: 16, color: staticColors.shadowColor },
  checkButton: {
    ...spacingStyles.py5,
  },
  checkButtonText: { fontSize: 14, color: staticColors.cardTitleColor },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    ...spacingStyles.pb10,
  },
  searchIcon: {
    ...spacingStyles.mr10,
  },
  arrowIcon: {
    ...spacingStyles.mt5,
  },
  searchText: {
    fontSize: 14,
    color: staticColors.offerColor,
    ...spacingStyles.px5,
  },
});

export default DeliveryModal;
