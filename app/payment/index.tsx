import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";

const PaymentScreen: React.FC = () => {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const paymentOptions = [
    {
      label: "Cash On Delivery",
      offers: "",
      icon: "cash-outline",
      iconColor: "black",
      
    },
  ];

  const toggleExpand = (label: string) => {
    setExpandedOption(expandedOption === label ? null : label);
  };

  const handleSelectOption = (label: string) => {
    setSelectedOption(label);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
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
                  style={styles.radioButton}
                  onPress={() => handleSelectOption(option.label)}
                >
                  <View
                    style={[
                      styles.radioButtonInner,
                      selectedOption === option.label && styles.radioButtonSelected,
                    ]}
                  />
                </TouchableOpacity>
                <Ionicons
                //   name={option.icon}
                  size={24}
                  color={option.iconColor}
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>{option.label}</Text>
                {option.offers ? (
                  <Text style={styles.offerTag}>{option.offers}</Text>
                ) : null}
              </View>
              <Ionicons
                name="chevron-down"
                size={24}
                color="black"
                style={[
                  styles.chevron,
                  {
                    transform: [
                      {
                        rotate:
                          expandedOption === option.label ? "180deg" : "0deg",
                      },
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
            {expandedOption === option.label && option.label === "Cash On Delivery" && (
              <View style={styles.expandedMessage}>
                <Text style={styles.expandedMessageText}>
                  Due to handling costs, a nominal fee of ₹9 will be charged
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalText}>₹12,086</Text>
          <TouchableOpacity>
            <Text style={styles.viewDetails}>VIEW DETAILS</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>PAY NOW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:staticColors.bgSecondary
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.p15,
    backgroundColor: staticColors.white,
  },
  headerTitle: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    ...spacingStyles.ml15
  },
  offerContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  offerIcons: {
    flexDirection: "row",
    marginBottom: 8,
  },
  offerIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ddd",
    marginRight: 8,
  },
  offerText: {
    fontSize: 14,
    color: "#333",
  },
  offerLink: {
    fontSize: 14,
    color: "#00c4b4",
    marginTop: 8,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoIcon: {
    marginLeft: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  radioButtonSelected: {
    backgroundColor: "#ff3d71",
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 16,
    marginRight: 8,
  },
  offerTag: {
    fontSize: 12,
    color: "#00c4b4",
  },
  chevron: {
    transitionProperty: "transform",
    transitionDuration: "0.3s",
  },
  expandedMessage: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  expandedMessageText: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewDetails: {
    fontSize: 12,
    color: "#00c4b4",
    marginTop: 4,
  },
  payButton: {
    backgroundColor: "#ff3d71",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentScreen;