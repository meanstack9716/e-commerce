import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SelectAddress from "@/components/address/SelectAddress";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { ESTIMATED_DELIVERY } from "@/constants/constants";

interface DeliveryItem {
  imageUri: string;
  estimatedDelivery: string;
}

const PlaceOrderScreen: React.FC = () => {
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.address.selectedAddressId
  );

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );
  const primaryAddress = addresses.find((addr) => addr.is_primary);
  const displayAddress = selectedAddress || primaryAddress;
  const deliveryData: DeliveryItem[] = selectedItems.map((item) => ({
    imageUri: item.images?.[0],
    estimatedDelivery: item.delivery_days || ESTIMATED_DELIVERY,
  }));

  const renderDeliveryItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.deliveryItem}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      <Text style={styles.deliveryText}>
        Estimated delivery in {item.estimatedDelivery} days
      </Text>
    </View>
  );

  const handleBack = () => {
    router.back();
  };
  const handleConfirm = () => {
    router.push({
      pathname: "/payment",
      params: { shippingAddressId: displayAddress?.id || "" },
    });
  };
  return (
    <>
      {showAddressSelector ? (
        <SelectAddress onGoBack={() => setShowAddressSelector(false)} />
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={20}
                color={staticColors.black}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ADDRESS</Text>
          </View>
          {/* Address Section */}
          {displayAddress ? (
            <View style={styles.addressContainer}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>
                  {displayAddress.contact_name || "No Name"}
                  {displayAddress.is_primary && "(Default)"}
                </Text>
                <Text style={styles.addressType}>{displayAddress.type}</Text>
                <TouchableOpacity onPress={() => setShowAddressSelector(true)}>
                  <Text style={styles.changeText}>CHANGE</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.addressDetails}>{displayAddress.line1}</Text>
              {displayAddress.line2 && (
                <Text style={styles.addressDetails}>
                  {displayAddress.line2}
                </Text>
              )}
              <Text style={styles.addressDetails}>{displayAddress.city}</Text>
              <Text style={styles.addressDetails}>
                {displayAddress.state}, {displayAddress.postal_code}
              </Text>
              {displayAddress.contact_number && (
                <Text style={styles.addressDetails}>
                  Mobile: {displayAddress.contact_number}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.addressContainer}>
              <Text style={styles.addressDetails}>No address selected</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>DELIVERY ESTIMATES</Text>
          <FlatList
            data={deliveryData}
            renderItem={renderDeliveryItem}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleConfirm}
          >
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  addressContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p15,
    borderRadius: borderRadius.r8,
    ...spacingStyles.mb15,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  addressName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  addressType: {
    fontSize: fontSizes.s,
    color: staticColors.textLightGray,
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    ...spacingStyles.px5,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r4,
  },
  changeText: {
    fontSize: fontSizes.sm,
    color: staticColors.primary,
    fontWeight: fontWeights.semiBold,
  },
  addressDetails: {
    fontSize: fontSizes.sm,
    color: staticColors.textSecondary,
    ...spacingStyles.mb5,
  },
  sectionTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
    ...spacingStyles.mb10,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.white,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r8,
  },
  itemImage: {
    width: 50,
    height: 60,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mr15,
  },
  deliveryText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  separator: {
    height: 1,
    backgroundColor: staticColors.borderLight,
    ...spacingStyles.my5,
  },
  continueButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r8,
    alignItems: "center",
    ...spacingStyles.mt15,
  },
  continueButtonText: {
    fontSize: fontSizes.sm,
    color: staticColors.white,
    fontWeight: fontWeights.semiBold,
  },
  backButton: {
    ...spacingStyles.p5,
  },
});

export default PlaceOrderScreen;
