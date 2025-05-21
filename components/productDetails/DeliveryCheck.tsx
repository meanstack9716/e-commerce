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
import {fontSizes, fontWeights} from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { getCurrentPinCode } from "@/utils/currentLocation";
import borderRadius from "@/style/borderRadius";

const ProductDetails = () => {
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchPinCode = async () => {
      setIsLoading(true);
      const PinCode = await getCurrentPinCode();
      if (PinCode) {
        setPinCode(PinCode);
      }
      setIsLoading(false);
    };
  
    fetchPinCode();
  }, []);
  

  const handleCloseModal = () => {
    setIsLocationModalVisible(false);
    if (textInputRef.current) {
      textInputRef.current.blur();
    }
  };

  const handleAddressTextInput = () => {
    setIsLocationModalVisible(true);
  };

  const handleGrantButton = (fetchedPinCode: string) => {
    setPinCode(fetchedPinCode);
    handleCloseModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Check Delivery</Text>
      <View style={styles.inputContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={staticColors.discountText} />
            <Text style={styles.loadingText}>Fetching your location...</Text>
          </View>
        ) : (
          <View style={styles.textInputWrapper}>
            <TextInput
              ref={textInputRef}
              style={[styles.input, pinCode && { paddingRight: 70 }]}
              placeholder="Enter PIN Code"
              placeholderTextColor={staticColors.primary}
              value={pinCode}
              onFocus={!pinCode ? handleAddressTextInput : undefined}
              editable={!pinCode ? true : false}
              accessibilityLabel="PIN code input"
            />
            {pinCode && (
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handleAddressTextInput}
                accessibilityLabel="Change PIN code"
              >
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <LocationModal
        visible={isLocationModalVisible}
        onClose={handleCloseModal}
        onGrant={handleGrantButton}
      />
      <View style={styles.option}>
        <MaterialIcons name="local-shipping" size={20} color={staticColors.black}/>
        <Text style={{ flexShrink: 1 }}>
          <Text style={styles.boldText}>Express delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="payment" size={20} color={staticColors.black} />
        <Text style={{ flexShrink: 1 }}>  
          <Text style={styles.boldText}>Pay on delivery</Text> might be
          available
        </Text>
      </View>
      <View style={styles.option}>
        <MaterialIcons name="refresh" size={20} color={staticColors.black} />
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
    ...spacingStyles.px15,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.py5,
    color: staticColors.primary,
  },
  tableTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
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
     borderRadius: borderRadius.r10,
    position: "relative",
  },
  input: {
    flex: 1,
    ...spacingStyles.p10,
    color: staticColors.primary,
  },
  changeButton: {
    position: "absolute",
    right: 10,
  },
  changeText: {
    color: staticColors.discountText,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p10,
  },
  loadingText: {
    ...spacingStyles.ml10,
    color: staticColors.primary,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
    gap: gapSizes.md,
  },
  sectiontable: {
    flexDirection: "column",
    gap: gapSizes.sm,
    ...spacingStyles.py10,
  },
  details: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
     borderRadius: borderRadius.r20,
    ...spacingStyles.p15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitle: {
    fontWeight: fontWeights.semiBold,
  },
  boldText: {
    fontWeight: fontWeights.semiBold,
  },
});

export default ProductDetails;
