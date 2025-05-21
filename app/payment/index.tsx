import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import { RootState } from "@/store/store";
import { commonStyles } from "@/style/commonStyle";
import { useAppDispatch } from "@/store/hooks";
import { placeOrder, clearOrderStatus } from "@/store/order/orderSlice";

const PaymentScreen: React.FC = () => {
  const [expandedPaymentOption, setExpandedPaymentOption] = useState<
    string | null
  >(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [orderNotes, setOrderNotes] = useState<{ [key: string]: string }>({});
  const { shippingAddressId } = useLocalSearchParams<{
    shippingAddressId: string;
  }>();
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const { loading, error, orderId } = useSelector(
    (state: RootState) => state.order
  );
  const selectedItems = cartItems.filter((item) => item.isSelected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.final_price || 0),
    0
  );

  useEffect(() => {
    if (orderId) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Order placed successfully!",
      });
      dispatch(clearOrderStatus());
      router.push("/cart");
    }
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error || "Failed to place order. Please try again.",
      });
      dispatch(clearOrderStatus());
    }
  }, [orderId, error, dispatch]);

  const paymentOptions = [
    {
      label: "Cash On Delivery",
    },
  ];

  const toggleExpand = (label: string) => {
    setExpandedPaymentOption(expandedPaymentOption === label ? null : label);
  };

  const handleSelectOption = (label: string) => {
    setSelectedPaymentMethod(label);
  };

  const handleOrderNoteChange = (label: string, text: string) => {
    setOrderNotes((prev) => ({ ...prev, [label]: text }));
  };

  const handleBack = () => {
    router.back();
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={staticColors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYMENT</Text>
      </View>

      {/* Payment Options */}
      <ScrollView style={styles.sectionContainer}>
        {paymentOptions.map((option, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => toggleExpand(option.label)}
            >
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={commonStyles.radioOuter}
                  onPress={() => handleSelectOption(option.label)}
                >
                  <View
                    style={[
                      styles.radioButtonInner,
                      selectedPaymentMethod === option.label &&
                        styles.radioButtonSelected,
                    ]}
                  />
                </TouchableOpacity>
                <Ionicons
                  name="cash-outline"
                  size={20}
                  color={staticColors.black}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>{option.label}</Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={18}
                color="black"
                style={[
                  styles.chevron,
                  {
                    transform: [
                      {
                        rotate:
                          expandedPaymentOption === option.label
                            ? "180deg"
                            : "0deg",
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
            {expandedPaymentOption === option.label &&
              option.label === "Cash On Delivery" && (
                <View style={styles.expandedMessage}>
                  <Text style={styles.expandedMessageText}>
                    Due to handling costs, a nominal fee of ₹9 will be charged
                  </Text>
                </View>
              )}
            {/* Order Note Box */}
            <View style={styles.orderNoteContainer}>
              <Text style={styles.orderNoteLabel}>Order Note</Text>
              <TextInput
                style={styles.orderNoteInput}
                placeholder="Add a note for your order (optional)"
                value={orderNotes[option.label] || ""}
                onChangeText={(text) =>
                  handleOrderNoteChange(option.label, text)
                }
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalText}>₹{totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayNow}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={staticColors.white} />
          ) : (
            <Text style={styles.payButtonText}>PAY NOW</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.bgSecondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p15,
    backgroundColor: staticColors.white,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.darkGray,
    ...spacingStyles.pl5,
  },
  sectionContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.px15,
    ...spacingStyles.my5,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.py10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  radioButtonSelected: {
    backgroundColor: staticColors.discountText,
    borderColor: staticColors.discountText,
  },
  optionIcon: {
    ...spacingStyles.mx5,
  },
  optionText: {
    fontSize: fontSizes.sm,
  },
  chevron: {
    transitionProperty: "transform",
    transitionDuration: "0.3s",
  },
  expandedMessage: {
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    ...spacingStyles.mb10,
  },
  expandedMessageText: {
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
  },
  orderNoteContainer: {
    backgroundColor: staticColors.bgMuted,
    ...spacingStyles.p10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: staticColors.softGray,
    ...spacingStyles.my10,
  },
  orderNoteLabel: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    color: staticColors.textDarkGray,
    ...spacingStyles.mb5,
  },
  orderNoteInput: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: 5,
    ...spacingStyles.p10,
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    textAlignVertical: "top",
    backgroundColor: staticColors.white,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.p15,
    backgroundColor: staticColors.white,
  },
  totalText: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.py10,
    ...spacingStyles.px25,
    borderRadius: 8,
  },
  payButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
    fontWeight: "bold",
  },
  payButtonDisabled: {
    backgroundColor: staticColors.lightGray,
    opacity: 0.6,
  },
});

export default PaymentScreen;
