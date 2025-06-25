import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
import { CartItem } from "@/interfaces";

const PlaceOrderScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedItems, productId, quantity, isBuyNow, imageUrl } =
    useLocalSearchParams<{
      selectedItems?: string;
      productId?: string;
      quantity?: string;
      isBuyNow?: string;
      imageUrl?: string;
    }>();

  const selectedCartItemsId = selectedItems ? selectedItems.split(",") : [];

  const [selectedPaymentMethod] = useState("Cash On Delivery");

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.address.selectedAddressId
  );
  const { selectedProduct, selectedProductLoading } = useSelector(
    (state: RootState) => state.products
  );
  const { loading } = useSelector((state: RootState) => state.order);

  const [shippingAddressId, setShippingAddressId] = useState<string | null>(
    null
  );
  const isInstantBuy = isBuyNow === "true";

  useEffect(() => {
    if (selectedAddressId) {
      setShippingAddressId(selectedAddressId);
    }
  }, [selectedAddressId]);

  let buyNowItem: CartItem | null = null;

  if (isInstantBuy && selectedProduct && productId) {
    buyNowItem = {
      id: productId,
      product: {
        ...selectedProduct,
        images: imageUrl ? [imageUrl] : selectedProduct.images,
      },
      quantity: parseInt(quantity || "1", 10),
    };
  }

  const selectedCartItems: CartItem[] =
    isInstantBuy && buyNowItem
      ? [buyNowItem]
      : cartItems.filter((item) => selectedCartItemsId.includes(item.id));

  const totalPrice = selectedCartItems.reduce(
    (total, item) => total + item.product.final_price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod || !shippingAddressId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: !selectedPaymentMethod
          ? "Please select a payment method."
          : "Please select an address or create a new address",
      });
      return;
    }

    const cartItemsIds =
      isInstantBuy && buyNowItem ? [buyNowItem.id] : selectedCartItemsId;

    const payload = {
      cart_items_ids: cartItemsIds,
      shipping_address_id: shippingAddressId,
      payment_method: selectedPaymentMethod,
    };

    try {
      const result = await dispatch(placeOrder(payload)).unwrap();
      if (result) {
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Your order has been placed successfully",
        });
        router.navigate("/orderHistory");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Unable to place order. Please try again.",
      });
    }
  };

  return (
    <SafeAreaViewWrapper>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={router.back} style={styles.backButton}>
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
          <View style={[commonStyles.justifyBetwwen, spacingStyles.mt5]}>
            <Text style={commonStyles.itemCountTitle}>Payment Method</Text>
          </View>
          <View style={styles.paymentMethodsWrapper}>
            <View style={styles.selectedPaymentWrap}>
              <Text style={styles.paymentType}>{selectedPaymentMethod}</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPrice}>Total ₹ {totalPrice}</Text>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              totalPrice === 0 && styles.disableButton,
            ]}
            onPress={handlePlaceOrder}
            disabled={totalPrice === 0}
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
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    ...spacingStyles.px15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    ...spacingStyles.p5,
  },
  pageHeading: {
    fontSize: fontSizes["2xl"],
    fontFamily: fontFamilies.ralewayeBold,
    ...spacingStyles.mb5,
  },
  totalPriceContainer: {
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
  paymentMethodsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    ...spacingStyles.py12,
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
});

export default PlaceOrderScreen;
