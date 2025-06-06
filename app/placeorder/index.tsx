import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SelectAddress from "@/components/address/SelectAddress";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { ESTIMATED_DELIVERY } from "@/constants/constants";
import { placeOrder } from "@/store/order/orderSlice";
import { useAppDispatch } from "@/store/hooks";
import Toast from "react-native-toast-message";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import PaymentMethod from "../payment";
import CartItemsList from "@/components/cartItemList/CardItemList";

interface DeliveryItem {
  imageUri: string;
  estimatedDelivery: string;
}

const paymentOptions = [
  {
    label: "Cash On Delivery",
  },
];

const PlaceOrderScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(
    paymentOptions[0].label
  ); const [orderNotes, setOrderNotes] = useState<{ [key: string]: string }>({});
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector((state: RootState) => state.address.selectedAddressId);

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);
  const primaryAddress = addresses.find((addr) => addr.is_primary);
  const displayAddress = selectedAddress || primaryAddress;
  const deliveryData: DeliveryItem[] = selectedItems.map((item) => ({
    imageUri: item.images?.[0],
    estimatedDelivery: item.delivery_days || ESTIMATED_DELIVERY,
  }));
  const { shippingAddressId } = useLocalSearchParams<{ shippingAddressId: string }>();

  const { loading, error, orderId } = useSelector((state: RootState) => state.order);

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.final_price || 0), 0);

  const renderDeliveryItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.deliveryItem}>
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      <Text style={styles.deliveryText}>Estimated delivery in {item.estimatedDelivery} days</Text>
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

  const handleOrderNoteChange = (label: string, text: string) => {
    setOrderNotes((prev) => ({ ...prev, [label]: text }));
  };

  const handlePayNow = async () => {
    if (!selectedPaymentMethod) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a payment method.",
      });
      return;
    }

    const payload = {
      cart_items_ids: selectedItems.map((item) => item.id),
      shipping_address_id: shippingAddressId,
      payment_method: selectedPaymentMethod,
    };

    dispatch(placeOrder(payload));
  };

  return (
    <>
      {showAddressSelector ? (
        <SelectAddress onGoBack={() => setShowAddressSelector(false)} />
      ) : (
        <SafeAreaViewWrapper style={styles.container}>
          <View style={styles.mainContainer}>
            {/* Scrollable Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.subContainer}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color={staticColors.black} />
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
                      <Text style={styles.addressDetails}>{displayAddress.line2}</Text>
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

                <CartItemsList cartItems={cartItems} />

                <PaymentMethod
                  paymentOptions={paymentOptions}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onSelectPaymentMethod={setSelectedPaymentMethod}
                  orderNotes={orderNotes}
                  onOrderNoteChange={handleOrderNoteChange}
                />
              </View>
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
              <View>
                <Text style={styles.totalText}>Total ₹{totalPrice}</Text>
              </View>
              <TouchableOpacity
                style={[styles.payButton, loading && styles.payButtonDisabled]}
                onPress={handlePayNow}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={staticColors.white} />
                ) : (
                  <Text style={styles.payButtonText}>Pay</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaViewWrapper>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  subContainer: {
    flexDirection: "column",
    gap: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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

  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.white,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r8,
  },
  deliveryText: {
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  backButton: {
    ...spacingStyles.p5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.pt10
  },
  totalText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
  },
  payButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    ...spacingStyles.px25,
    borderRadius: borderRadius.r8,
  },
  payButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.px20,
    ...spacingStyles.py2,
  },
  payButtonDisabled: {
    backgroundColor: staticColors.lightGray,
    opacity: 0.6,
  },

});

export default PlaceOrderScreen;