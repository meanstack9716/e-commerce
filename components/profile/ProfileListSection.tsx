import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import ProfileHeader from "./ProfileHeader";
import ProfileOption from "./ProfileOption";
import spacingStyles from "@/style/spacingStyles";
import colors from "@/style/staticColors";
import { router } from "expo-router";

export default function ProfileListSection() {
  return (
    <>
      <ProfileHeader />
      <View style={styles.optionsContainer}>
        <ProfileOption
          icon={
            <FontAwesome5 name="box-open" size={24} color={colors.textMuted} />
          }
          label="Orders"
          subtitle="Check your order status"
        />
        <ProfileOption
          icon={
            <MaterialIcons name="help" size={24} color={colors.textMuted} />
          }
          label="Help Center"
          subtitle="Help regarding your recent purchases"
        />
        <ProfileOption
          icon={
            <Ionicons name="heart-outline" size={24} color={colors.textMuted} />
          }
          label="Wishlist"
          subtitle="Your most loved styles"
        />
        <ProfileOption
          icon={
            <Ionicons name="heart-outline" size={10} color={colors.white} />
          }
          label="Change Base Url"
          onPress={() => router.navigate("/Base_URL")}
          customStyle={{ ...spacingStyles.mt5 }}
        />
        <ProfileOption
          icon={
            <MaterialIcons
              name="qr-code-scanner"
              size={24}
              color={colors.textMuted}
              style={styles.qrIcon}
            />
          }
          label="Scan for coupon"
          customStyle={{ ...spacingStyles.my25 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    backgroundColor: colors.bgSecondary,
  },
  qrIcon: {
    ...spacingStyles.mt10,
  },
});
