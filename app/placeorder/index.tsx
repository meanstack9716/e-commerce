import React, { useEffect, useState } from "react";
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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { placeOrder } from "@/store/order/orderSlice";
import { useAppDispatch } from "@/store/hooks";
import Toast from "react-native-toast-message";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import CartItemsList from "@/components/cartItemList/CardItemList";
import ContactCard from "@/components/contactCard/ContactCard";
import { getFormattedAddress } from "@/utils/formatAddress";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";

const paymentOptions = [
  {
    label: "Cash On Delivery",
  },
];

const PlaceOrderScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedItems } = useLocalSearchParams<{ selectedItems: string }>();
  const selectedCartItemsId: String[] = selectedItems
    ? selectedItems.split(",")
    : [];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(paymentOptions[0].label);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const selectedCartItems = cartItems.filter((item) =>
    selectedCartItemsId.includes(item.id)
  );

  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.address.selectedAddressId
  );

  const [shippingAddressId, setShippingAddressId] = useState<string | null>(
    null
  );

  const { loading, error, orderId } = useSelector(
    (state: RootState) => state.order
  );

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (selectedAddressId) {
      setShippingAddressId(selectedAddressId);
    }
  }, [selectedAddressId]);

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a payment method.",
      });
      return;
    }
    if (!shippingAddressId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select aa address or create new address",
      });
      return;
    }

    const payload = {
      cart_items_ids: selectedCartItemsId,
      shipping_address_id: shippingAddressId,
      payment_method: selectedPaymentMethod,
    };

    const result = await dispatch(placeOrder(payload)).unwrap();
    if (result) {
      Toast.show({
        type: "success",
        text1: "Order Placed",
        text2: "Your order has been placed successfully",
      });
      router.navigate("/orderHistory");
    }
  };

  const calculateTotalPrice = () => {
    return selectedCartItems.reduce((total, item) => {
      return total + item.product.final_price * item.quantity;
    }, 0);
  };

  if (!selectedCartItems || selectedCartItems.length === 0) {
    handleBack();
    return (
      <SafeAreaViewWrapper>
        <Text>No items found in cart.</Text>
      </SafeAreaViewWrapper>
    );
  }

  return (
    <SafeAreaViewWrapper>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={staticColors.black}
              />
            </TouchableOpacity>
            <Text style={styles.pageHeading}>Payment</Text>
          </View>
          <ContactCard
            title="Shipping Address"
            information={[getFormattedAddress(addresses, shippingAddressId)]}
          />
          <CartItemsList cartItems={selectedCartItems} />

          <View style={[commonStyles.justifyBetwwen, { ...spacingStyles.mt5 }]}>
            <Text style={commonStyles.itemCountTitle}>Payment Method</Text>
            {/* <TouchableOpacity style={styles.editIconWrapper}>
              <FontAwesome5 name="pen" size={16} color={staticColors.white} />
            </TouchableOpacity> */}
          </View>
          <View style={styles.paymentMethodsWrapper}>
            <View style={styles.selectedPaymentWrap}>
              <Text style={styles.paymentType}>{selectedPaymentMethod}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPrice}>Total ₹ {calculateTotalPrice()}</Text>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              calculateTotalPrice() === 0 && styles.disableButton,
            ]}
            onPress={handlePlaceOrder}
            disabled={calculateTotalPrice() === 0}
          >
            {loading ? (
              <ActivityIndicator size="small" color={staticColors.white} />
            ) : (
              <Text style={styles.checkoutButtonText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    ...spacingStyles.px15,
  },
  pageHeading: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayeBold,
    ...spacingStyles.mb5,
  },
  totalPriceContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.px25,
    ...spacingStyles.py15,
    ...spacingStyles.mt5,
  },
  totalPrice: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
  checkoutButton: {
    width: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: staticColors.darkSlate,
    ...spacingStyles.py10,
    borderRadius: borderRadius.r12,
  },
  checkoutButtonText: {
    fontSize: fontSizes.md,
    color: staticColors.white,
    fontFamily: fontFamilies.nunitoSans,
  },
  disableButton: {
    backgroundColor: staticColors.lightGray,
    opacity: 0.6,
  },
  editIconWrapper: {
    backgroundColor: staticColors.blue500,
    flexShrink: 0,
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  paymentMethodsWrapper: {
    flexDirection: "row",
    ...spacingStyles.py12,
    flexWrap: "wrap",
  },
  selectedPaymentWrap: {
    borderRadius: borderRadius.r14,
    backgroundColor: staticColors.blue100,
    ...spacingStyles.py6,
    ...spacingStyles.px25,
  },
  paymentType: {
    fontSize: fontSizes.sm,
    color: staticColors.blue500,
    fontFamily: fontFamilies.ralewayBold,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    ...spacingStyles.p5,
  },
});

export default PlaceOrderScreen;
