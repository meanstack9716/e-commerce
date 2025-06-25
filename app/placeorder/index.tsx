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
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import { commonStyles } from "@/style/commonStyle";
import { placeOrder } from "@/store/order/orderSlice";
import { useAppDispatch } from "@/store/hooks";
import Toast from "react-native-toast-message";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import CartItemsList from "@/components/cartItemList/CardItemList";
import ContactCard from "@/components/contactCard/ContactCard";
import { getFormattedAddress } from "@/utils/formatAddress";
import { OrderPayload } from "./placeorder.type";
import images from "@/constants/images";

const paymentOptions = [
  {
    label: "Cash On Delivery",
  },
  {
    label: "Razorpay",
  },
];

const PlaceOrderScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedItems } = useLocalSearchParams<{ selectedItems: string }>();
  const selectedCartItemsId: String[] = selectedItems
    ? selectedItems.split(",")
    : [];
  const { discounted_amount, appliedPromoCode } = useSelector(
    (state: RootState) => state.promoCode
  );
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
        text2: "Please select an address or create a new address",
      });
      return;
    }

    const payload: OrderPayload = {
      cart_items_ids: selectedCartItemsId,
      shipping_address_id: shippingAddressId,
      payment_method: selectedPaymentMethod,
    };

    if (appliedPromoCode) {
      payload.promo_code = appliedPromoCode;
    }
    const redirectUrl = Linking.createURL("orderHistory");
    payload.redirect_url = redirectUrl;

    const result = await dispatch(placeOrder(payload)).unwrap();
    if (result?.payment_link) {
      const paymentUrl = result.payment_link;
      const authResult = await WebBrowser.openAuthSessionAsync(
        paymentUrl,
        redirectUrl
      );

      if (authResult.type === "success") {
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Your order has been placed successfully",
        });
      }
      return;
    }
  };

  const calculateOriginalTotal = () => {
    return selectedCartItems.reduce((total, item) => {
      return total + item.product.final_price * item.quantity;
    }, 0);
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateOriginalTotal();
    return discounted_amount !== null ? discounted_amount : subtotal;
  };

  const calculateDiscount = () => {
    const original = calculateOriginalTotal();
    return discounted_amount !== null ? original - discounted_amount : 0;
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

          {appliedPromoCode !== null && (
            <View style={styles.totalPriceContainerColumn}>
              <Text style={styles.summaryHeading}>Price Summary</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Promo Code</Text>
                <Text style={[styles.priceValue, styles.promoText]}>
                  {appliedPromoCode}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>
                  ₹ {calculateOriginalTotal()}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={[styles.priceValue, styles.discountText]}>
                  - ₹ {calculateDiscount()}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, styles.totalText]}>Total</Text>
                <Text style={[styles.priceValue, styles.totalText]}>
                  ₹ {calculateTotalPrice()}
                </Text>
              </View>
            </View>
          )}

          <View style={[commonStyles.justifyBetwwen, { ...spacingStyles.mt5 }]}>
            <Text style={commonStyles.itemCountTitle}>Payment Method</Text>
          </View>
          <View style={styles.paymentMethodsWrapper}>
            {paymentOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.selectedPaymentWrap,
                  selectedPaymentMethod === option.label
                    ? styles.selectedPayment
                    : styles.unselectedPayment,
                ]}
                onPress={() => setSelectedPaymentMethod(option.label)}
              >
                <Text
                  style={[
                    styles.paymentType,
                    selectedPaymentMethod === option.label
                      ? styles.selectedPaymentText
                      : styles.unselectedPaymentText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
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
    gap: 10, // Adds spacing between payment options
  },
  selectedPaymentWrap: {
    borderRadius: borderRadius.r14,
    ...spacingStyles.py6,
    ...spacingStyles.px25,
  },
  selectedPayment: {
    backgroundColor: staticColors.blue500,
    borderWidth: 1,
    borderColor: staticColors.blue500,
  },
  unselectedPayment: {
    backgroundColor: staticColors.white,
    borderWidth: 1,
    borderColor: staticColors.blue500,
  },
  paymentType: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.ralewayBold,
  },
  selectedPaymentText: {
    color: staticColors.white,
  },
  unselectedPaymentText: {
    color: staticColors.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    ...spacingStyles.p5,
  },
  totalPriceContainerColumn: {
    width: "100%",
    backgroundColor: staticColors.gray100,
    ...spacingStyles.px15,
    ...spacingStyles.py10,
    ...spacingStyles.mt5,
    borderRadius: borderRadius.r10,
  },
  summaryHeading: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.mb5,
    color: staticColors.black,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb2,
  },
  priceLabel: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
  },
  priceValue: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
  },
  promoText: {
    color: staticColors.errorColor,
    fontFamily: fontFamilies.ralewayeSemiBold,
  },
  discountText: {
    color: staticColors.darkGreen,
    fontFamily: fontFamilies.ralewayeSemiBold,
  },
  totalText: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.ralewayBold,
  },
});

export default PlaceOrderScreen;
