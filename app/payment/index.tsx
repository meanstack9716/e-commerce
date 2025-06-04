import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { commonStyles } from "@/style/commonStyle";

interface PaymentMethodProps {
  paymentOptions: { label: string }[];
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (label: string) => void;
  orderNotes: { [key: string]: string };
  onOrderNoteChange: (label: string, text: string) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentOptions,
  selectedPaymentMethod,
  onSelectPaymentMethod,
  orderNotes,
  onOrderNoteChange,
}) => {
  const [expandedPaymentOption, setExpandedPaymentOption] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedPaymentOption(expandedPaymentOption === label ? null : label);
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
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
                  onPress={() => onSelectPaymentMethod(option.label)}
                >
                  <View
                    style={[
                      commonStyles.radioInner,
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
            <View style={styles.orderNoteContainer}>
              <Text style={styles.orderNoteLabel}>Order Note</Text>
              <TextInput
                style={styles.orderNoteInput}
                placeholder="Add a note for your order (optional)"
                value={orderNotes[option.label] || ""}
                onChangeText={(text) => onOrderNoteChange(option.label, text)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
    ...spacingStyles.mb10,
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
  expandedMessage: {
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r5,
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
    borderRadius: borderRadius.r5,
    borderWidth: 1,
    borderColor: staticColors.softGray,
    ...spacingStyles.my10,
  },
  orderNoteLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: staticColors.textDarkGray,
    ...spacingStyles.mb5,
  },
  orderNoteInput: {
    borderWidth: 1,
    borderColor: staticColors.borderLight,
    borderRadius: borderRadius.r5,
    ...spacingStyles.p10,
    fontSize: fontSizes.xs,
    color: staticColors.textDarkGray,
    textAlignVertical: "top",
    backgroundColor: staticColors.white,
  },
});

export default PaymentMethod;