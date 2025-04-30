import { useState } from "react";
import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestLocationPermission = async (onSuccess: (pinCode: string) => void): Promise<void> => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (isLocationEnabled) {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const { latitude, longitude } = location.coords;

          const [address] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          const fetchedPinCode = address?.postalCode || "";
          if (fetchedPinCode) {
            onSuccess(fetchedPinCode);
          } else {
            Alert.alert(
              "PIN Code Not Found",
              "We couldn't determine your PIN code. Please enter it manually."
            );
          }
        } else {
          Alert.alert(
            "Location Services Disabled",
            "Please enable location services to proceed.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("App-Prefs:Privacy&path=LOCATION");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to ensure accurate address and hassle-free delivery. Please grant the permission.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert("Error", "An error occurred while requesting location permission.");
      setIsLoading(false);
    }
  };

  return { requestLocationPermission, isLoading };
};