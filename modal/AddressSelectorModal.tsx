import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DeliveryAddressScreen from "@/components/productDetails/DeliveryAddress";
import { useLocation } from "@/utils/useLocation";
import fontSizes from "@/style/fontSizes";
import { isPinCodeValid } from "@/hooks/usePinCodeValidation";
import LocationAlertModal from "./LocationAlertModal";

interface AddressSelectorModalProps {
  visible?: boolean;
  onClose: () => void;
  onPinCodeSelect: (pinCode: string) => void;
}

const AddressSelectorModal: React.FC<AddressSelectorModalProps> = ({
  visible,
  onClose,
  onPinCodeSelect,
}) => {
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedPinCode, setSelectedPinCode] = useState<string>("");
  const { requestLocationPermission, isLoading, locationModal } = useLocation();

  const handleCurrentLocation = (pinCode: string) => {
    onPinCodeSelect(pinCode);
    setSelectedPinCode(pinCode);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    requestLocationPermission((pinCode: string) => {
      setSelectedPinCode(pinCode);
      onPinCodeSelect(pinCode);
      onClose();
    });
  };

  const handleCheckPincode = () => {
    if (isPinCodeValid(selectedPinCode)) {
      onPinCodeSelect(selectedPinCode);
      onClose();
    }
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
            <TextInput
              style={styles.inputField}
              placeholder="Enter Pincode"
              keyboardType="numeric"
              maxLength={6}
              value={selectedPinCode}
              onChangeText={(text) => setSelectedPinCode(text)}
            />

            <TouchableOpacity
              style={[
                styles.checkButton,
                !isPinCodeValid && styles.disabledButton,
              ]}
              disabled={!isPinCodeValid}
              onPress={handleCheckPincode}
            >
              <Text
                style={[
                  styles.checkButtonText,
                  {
                    color: isPinCodeValid(selectedPinCode)
                      ? staticColors.discountText
                      : staticColors.textSubtitle,
                  },
                ]}
              >
                Check Pincode
              </Text>
            </TouchableOpacity>
          </View>

          {/* Location Options */}
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={handleUseCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={staticColors.discountText}
                style={styles.searchIcon}
              />
            ) : (
              <MaterialIcons
                name="my-location"
                size={22}
                color={staticColors.discountText}
                style={styles.searchIcon}
              />
            )}
            <Text style={styles.searchText}>Use my current Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchContainer}
            onPress={() => setAddressModalVisible(true)}
          >
            <FontAwesome6
              name="map-location-dot"
              size={20}
              color={staticColors.discountText}
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>Search location</Text>
            <Ionicons
              name="chevron-forward"
              size={13}
              color={staticColors.discountText}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <DeliveryAddressScreen
          onPinCodeFetched={handleCurrentLocation}
          onCloseModal={() => setAddressModalVisible(false)}
        />
      )}

      <LocationAlertModal
        visible={locationModal.visible}
        title={locationModal.title}
        message={locationModal.message}
        onConfirm={locationModal.onConfirm}
        onCancel={locationModal.onCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: staticColors.modalOverlayLight,
  },
  modalContent: {
    backgroundColor: staticColors.white,
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
  modalTitle: { fontSize: fontSizes.base, fontWeight: "bold" },
  closeIcon: { fontSize: fontSizes.md, color: staticColors.shadowColor },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 8,
    ...spacingStyles.px10,
    ...spacingStyles.py2,
  },
  inputField: {
    color: staticColors.textSubtitle,
    flex: 1,
  },
  checkButton: {
    padding: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkButtonText: { fontSize: fontSizes.sm, fontWeight: "bold" },
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
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    ...spacingStyles.px5,
  },
});

export default AddressSelectorModal;
