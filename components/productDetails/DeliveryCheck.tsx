import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import LocationModal from "@/modal/LocationModal";
import * as Location from "expo-location";

const ProductDetails = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      setIsLoading(true);
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

          const fetchedPinCode = address?.postalCode || "";
          if (fetchedPinCode) {
            setPinCode(fetchedPinCode);
          }
        }
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
  };

  const handleTextInputPress = () => {
    setModalVisible(true);
  };

  const handleGrant = (fetchedPinCode: string) => {
    setPinCode(fetchedPinCode);
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Check Delivery</Text>
      <View style={styles.inputContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={staticColors.offerColor} />
            <Text style={styles.loadingText}>Fetching your location...</Text>
          </View>
        ) : (
          <View style={styles.textInputWrapper}>
            <TextInput
              ref={textInputRef}
              style={[styles.input, pinCode && { paddingRight: 70 }]}
              placeholder="Enter PIN Code"
              placeholderTextColor={staticColors.primaryColor}
              value={pinCode}
              onFocus={!pinCode ? handleTextInputPress : undefined}
              editable={false}
              accessibilityLabel="PIN code input"
            />
            {pinCode && (
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleTextInputPress}
                accessibilityLabel="Change PIN code"
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <LocationModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onGrant={handleGrant}
      />
      <View style={styles.option}>
        <MaterialIcons name="local-shipping" size={20} color="#000" />
        <Text style={{ flexShrink: 1 }}>
          <Text style={styles.boldText}>Express delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="payment" size={20} color="#000" />
        <Text style={{ flexShrink: 1 }}>
          <Text style={styles.boldText}>Pay on delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="refresh" size={20} color="#000" />
        <Text style={{ flexShrink: 1 }}>
          <Text style={styles.boldText}>Hassle free 7, 15 and 30 days</Text>{" "}
          Return & Exchange might be available
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.subTitle}>Fabric</Text>
          <Text style={styles.subTitle}>Pattern</Text>
        </View>
        <View style={styles.row}>
          <Text>Cotton</Text>
          <Text>Solid</Text>
        </View>
        <View style={styles.sectiontable}>
          <Text style={styles.tableTitle}>Product Details</Text>
          <View>
            <Text>• White top</Text>
            <Text>• Solid</Text>
            <Text>• Shirt collar neck, Sleeveless</Text>
            <Text>• Knitted cotton</Text>
            <Text>• Button closure</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Size & Fit</Text>
        <Text>The model (height 5'8") is wearing a size S</Text>

        <Text style={styles.sectionTitle}>Material & Care</Text>
        <Text>98% cotton, 2% elastane</Text>
        <Text>Machine wash</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    ...spacingStyles.py5,
    color: staticColors.primaryColor,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: staticColors.primaryColor,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
    position: "relative",
  },
  input: {
    flex: 1,
    ...spacingStyles.p10,
    color: staticColors.primaryColor,
  },
  changeButton: {
    position: "absolute",
    right: 10,
  },
  changeText: {
    color: staticColors.offerColor,
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 10,
    ...spacingStyles.p10,
  },
  loadingText: {
    ...spacingStyles.ml10,
    color: staticColors.primaryColor,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  sectiontable: {
    flexDirection: "column",
    gap: 5,
    ...spacingStyles.py10,
  },
  details: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 20,
    ...spacingStyles.p15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitle: {
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
});

export default ProductDetails;
