import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import PaymentsAndCurrencies from "./PaymentsAndCurrencies";
import EarnAndRedeem from "./EarnAndRedeem";
import ManageAccount from "./ManageAccount";

const menuItems = [
  {
    title: "Ultimate Glam Clan",
    subtitle: "Myntra Influencer program for shoppers",
    isNew: true,
    leftIcon: "star-outline",
  },
  {
    title: "Personal Loan",
    subtitle: "Get instant cash upto Rs.10,00,000",
    isNew: true,
    leftIcon: "card-outline",
  },
  {
    title: "Payments & Currencies",
    subtitle: "View balance and saved payment methods",
    leftIcon: "wallet-outline",
    hasDropdown: true,
  },
  {
    title: "Earn & Redeem",
    subtitle: "View prizes and earn rewards",
    leftIcon: "gift-outline",
    hasDropdown: true,
  },
  {
    title: "Manage Account",
    subtitle: "Manage your account and saved addresses",
    leftIcon: "person-outline",
    hasDropdown: true,
  },
  {
    title: "Challenges",
    subtitle: "Earn prizes by completing fun tasks",
    leftIcon: "trophy-outline",
  },
  {
    title: "Wishlist",
    subtitle: "Your most loved styles",
    leftIcon: "heart-outline",
  },
  {
    title: "Myntra Suggests",
    subtitle: "100% personalized feed just for you",
    leftIcon: "thumbs-up-outline",
  },
  {
    title: "Settings",
    subtitle: "Manage Notifications",
    leftIcon: "settings-outline",
  },
];

const UserProfileMenu: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => item.hasDropdown && toggleSection(item.title)}
          >
            <View style={styles.rowBetween}>
              {/* Left Icon */}
              <Ionicons
                name={item.leftIcon as any}
                size={fontSizes.lg}
                color={staticColors.textMuted}
                style={styles.leftIcon}
              />

              {/* Middle Text */}
              <View style={styles.textContainer}>
                <View style={styles.row}>
                  <Text style={styles.title}>{item.title}</Text>
                  {item.isNew && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>NEW</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons
                name={
                  item.hasDropdown
                    ? expandedSection === item.title
                      ? "chevron-up-outline"
                      : "chevron-down-outline"
                    : "chevron-forward-outline"
                }
                size={fontSizes.sm}
                color={staticColors.textLightGray}
              />
            </View>
          </TouchableOpacity>

          {item.title === "Payments & Currencies" &&
            expandedSection === item.title && <PaymentsAndCurrencies />}
          {item.title === "Earn & Redeem" && expandedSection === item.title && (
            <EarnAndRedeem />
          )}
          {item.title === "Manage Account" &&
            expandedSection === item.title && <ManageAccount />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    ...spacingStyles.px20,
    ...spacingStyles.py10,
    borderBottomWidth: 1,
    borderBottomColor: staticColors.lightGray,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    ...spacingStyles.mr15,
  },
  textContainer: {
    flex: 1,
    ...spacingStyles.pr10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontWeight: "bold",
    fontSize: fontSizes.sm,
    color: staticColors.black,
    ...spacingStyles.mr5,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    ...spacingStyles.mt2,
  },
  badge: {
    backgroundColor: staticColors.discountText,
    borderRadius: 20,
    ...spacingStyles.px10,
    paddingVertical: 2,
  },
  badgeText: {
    color: staticColors.white,
    fontSize: fontSizes.s,
    fontWeight: "bold",
  },
});

export default UserProfileMenu;
