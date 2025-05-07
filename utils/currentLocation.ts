import * as Location from "expo-location";

export const getCurrentPinCode = async (): Promise<string | null> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status === "granted") {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (isLocationEnabled) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const [address] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        return address?.postalCode || null;
      }
    }
  } catch (error) {
    console.error("Error checking location permission:", error);
  }

  return null;
};
