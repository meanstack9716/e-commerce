import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import DeliveryAddressScreen from "@/components/productDetails/DeliveryAddress";
import { useLocation } from "@/utils/useLocation";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import LocationAlertModal from "./LocationAlertModal";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onGrant: (pinCode: string) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  onGrant,
}) => {
  const [pinCode, setPinCode] = useState<string>("");
  const [addressModalVisible, setAddressModalVisible] =
    useState<boolean>(false);
  const {
    requestLocationPermission,
    isLoading,
    locationModal,
    hideLocationModal,
  } = useLocation();

  const handlePinCodeChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
    setPinCode(numericText);
  };

  const handleCheckPincode = () => {
    if (pinCode.length === 6) {
      onGrant(pinCode);
      onClose();
    }
  };

  const handleGrantLocation = () => {
    requestLocationPermission((fetchedPinCode: string) => {
      setPinCode(fetchedPinCode);
      onGrant(fetchedPinCode);
      onClose();
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={staticColors.black} />
              </TouchableOpacity>

              <View style={styles.headerContainer}>
                <FontAwesome6
                  name="location-crosshairs"
                  size={22}
                  color={staticColors.discountText}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Location permission is off
                  </Text>
                  <Text style={styles.subtitleText}>
                    Granting location permission will ensure accurate address
                    and hassle free delivery
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.grantButton}
                  onPress={handleGrantLocation}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={staticColors.white}
                    />
                  ) : (
                    <Text style={styles.grantButtonText}>Grant</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Select Delivery Location</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={pinCode}
                    onChangeText={handlePinCodeChange}
                    placeholder="Enter PIN Code"
                    placeholderTextColor={staticColors.textDarkGray}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[
                      styles.checkButton,
                      pinCode.length === 6
                        ? styles.activeCheckButton
                        : styles.inactiveCheckButton,
                    ]}
                    onPress={handleCheckPincode}
                    disabled={pinCode.length !== 6}
                  >
                    <Text
                      style={[
                        styles.checkButtonText,
                        pinCode.length === 6 && {
                          color: staticColors.discountText,
                        },
                      ]}
                    >
                      Check Pincode
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <DeliveryAddressScreen
          onPinCodeFetched={onGrant}
          onCloseModal={() => setAddressModalVisible(false)}
        />
      </Modal>
      <LocationAlertModal
        visible={locationModal.visible}
        title={locationModal.title}
        message={locationModal.message}
        onConfirm={locationModal.onConfirm}
        onCancel={locationModal.onCancel}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: staticColors.modalOverlayLight,
  },
  modalView: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...spacingStyles.pb10,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: -30,
    ...spacingStyles.p5,
  },
  headerContainer: {
    flexDirection: "row",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  icon: {
    ...spacingStyles.mt2,
  },
  textContainer: {
    flex: 1,
    ...spacingStyles.mx10,
  },
  titleText: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    color: staticColors.primary,
    marginBottom: 5,
  },
  subtitleText: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  grantButton: {
    backgroundColor: staticColors.discountText,
    borderRadius: 20,
    ...spacingStyles.py5,
    ...spacingStyles.px15,
    alignSelf: "flex-start",
    minWidth: 70,
    alignItems: "center",
  },
  grantButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
    fontWeight: "bold",
  },
  inputContainer: {
    ...spacingStyles.mb15,
    ...spacingStyles.px20,
    ...spacingStyles.pt15,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mt10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 8,
    ...spacingStyles.p10,
    backgroundColor: staticColors.bgSecondary,
  },
  checkButton: {
    position: "absolute",
    right: 10,
    ...spacingStyles.px10,
  },
  activeCheckButton: {
    opacity: 1,
  },
  inactiveCheckButton: {
    opacity: 0.5,
  },
  checkButtonText: {
    color: staticColors.shadowColor,
    fontSize: fontSizes.sm,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    ...spacingStyles.px20,
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

export default LocationModal;
