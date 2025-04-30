import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocation } from "@/utils/useLocation";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";

interface DeliveryAddressProps {
  onPinCodeFetched?: (pinCode: string) => void;
  onCloseModal?: () => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  onPinCodeFetched,
  onCloseModal,
}) => {
  const { requestLocationPermission, isLoading } = useLocation();

  const handleUseCurrentLocation = () => {
    requestLocationPermission((pinCode: string) => {
      if (onPinCodeFetched) {
        onPinCodeFetched(pinCode);
      }
      if (onCloseModal) {
        onCloseModal();
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCloseModal}>
          <Ionicons name="arrow-back" size={24} color={staticColors.cardTitleColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECT DELIVERY ADDRESS</Text>
      </View>

      {/* Important Message */}
      <View style={styles.importantContainer}>
        <View style={styles.infoIconContainer}>
          <Text style={styles.infoIcon}>i</Text>
        </View>
        <Text style={styles.importantText}>
          <Text style={styles.importantLabel}>Important: </Text>
          Use your current location or manually search on the map to guide
          delivery partners.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={staticColors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Please enter your details for better delivery"
          placeholderTextColor={staticColors.textSecondary}
        />
      </View>

      {/* Current Location Option */}
      <TouchableOpacity
        style={styles.locationOption}
        onPress={handleUseCurrentLocation}
        disabled={isLoading}
      >
        <View style={styles.locationIconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={staticColors.offerColor} />
          ) : (
            <MaterialIcons name="my-location" size={20} color={staticColors.offerColor} />
          )}
        </View>
        <Text style={styles.locationText}>
          {isLoading ? "Fetching Location..." : "Use my current Location"}
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.whiteColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p10
  },
  backButton: {
    ...spacingStyles.p5
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: staticColors.primaryColor,
    ...spacingStyles.ml10,
    flex: 1,
  },
  importantContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.lightYellow,
    ...spacingStyles.py10,
    ...spacingStyles.px15
  },
  infoIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: staticColors.darkYellow,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10
  },
  infoIcon: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  importantLabel: {
    fontWeight: "bold",
    color: staticColors.darkYellow,
  },
  importantText: {
    flex: 1,
    color: staticColors.darkYellow,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:staticColors.borderLight,
    borderRadius: 8,
    ...spacingStyles.m15,
    ...spacingStyles.px10
  },
  searchIcon: {
    ...spacingStyles.mr5
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.px15,
    ...spacingStyles.py5
  },
  locationIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: staticColors.offerColor,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10
  },
  locationText: {
    color: staticColors.offerColor,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default DeliveryAddress;
