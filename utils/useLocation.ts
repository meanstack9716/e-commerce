import { useState } from "react";
import * as Location from "expo-location";
import { Linking, Platform } from "react-native";

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({ visible: false, title: "", message: "", onConfirm: () => {} });

  const showModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setModalData({ visible: true, title, message, onConfirm, onCancel });
  };

  const hideModal = () => {
    setModalData((prev) => ({ ...prev, visible: false }));
  };

  const requestLocationPermission = async (
    onSuccess: (pinCode: string) => void
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (isLocationEnabled) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const [address] = await Location.reverseGeocodeAsync(location.coords);
          const fetchedPinCode = address?.postalCode || "";

          if (fetchedPinCode) {
            onSuccess(fetchedPinCode);
          } else {
            showModal(
              "PIN Code Not Found",
              "We couldn't determine your PIN code. Please enter it manually.",
              hideModal
            );
          }
        } else {
          showModal(
            "Location Services Disabled",
            "Please enable location services to proceed.",
            () => {
              hideModal();
              if (Platform.OS === "ios") {
                Linking.openURL("App-Prefs:Privacy&path=LOCATION");
              } else {
                Linking.openSettings();
              }
            },
            hideModal
          );
        }
      } else {
        showModal(
          "Permission Denied",
          "Location permission is required to ensure accurate address and hassle-free delivery. Please grant the permission.",
          () => {
            hideModal();
            Linking.openSettings();
          },
          hideModal
        );
      }
    } catch (error) {
      console.error("Location Error", error);
      showModal(
        "Error",
        "An error occurred while fetching location.",
        hideModal
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestLocationPermission,
    isLoading,
    locationModal: modalData,
    hideLocationModal: hideModal,
  };
};
