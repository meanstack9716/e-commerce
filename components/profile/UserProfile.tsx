import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import borderRadius from "@/style/borderRadius";
import { router } from "expo-router";

const UserProfile = () => {
  const handleOrder = () => {
    router.push({
      pathname: "/cart",
    });
  };
  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Become An Insider{" "}
          <Text style={styles.highlight}>Free Shipping, Extra Discounts</Text>{" "}
          and More Rewards!
        </Text>
        <TouchableOpacity style={styles.knowMoreButton}>
          <Text style={styles.knowMoreText}>Know More</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Selector */}
      <View style={styles.profileSelector}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitial}>Y</Text>
          <View style={styles.adminBadge}>
            <Text style={styles.adminText}>Admin</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addCircle}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Card Buttons */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card} onPress={handleOrder}>
          <Ionicons name="cube" size={24} />
          <Text>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="workspace-premium" size={24} />
          <Text>Insider</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="help-circle-outline" size={24} />
          <Text>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="pricetags-outline" size={24} />
          <Text>Coupons</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, ...spacingStyles.p20 },
  banner: {
    backgroundColor: staticColors.bannerColor,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p15,
    ...spacingStyles.mb20,
  },
  bannerText: { fontSize: fontSizes.sm, ...spacingStyles.mb10 },
  highlight: {
    fontWeight: fontWeights.semiBold,
    color: staticColors.bannerHeighlight,
  },
  knowMoreButton: {
    backgroundColor: staticColors.bannerHeighlight,
    ...spacingStyles.py5,
    ...spacingStyles.px15,
    borderRadius: borderRadius.r6,
    alignSelf: "flex-start",
  },
  knowMoreText: { color: staticColors.white, fontWeight: fontWeights.semiBold },
  profileSelector: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb20,
    gap: gapSizes.lg,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.r30,
    backgroundColor: staticColors.profileBg,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: fontWeights.semiBold,
    color: staticColors.primary,
  },
  adminBadge: {
    position: "absolute",
    bottom: -10,
    backgroundColor: staticColors.darkGray,
    ...spacingStyles.px5,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r6,
  },
  adminText: { color: staticColors.white, fontSize: fontSizes.xs },
  addCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.r30,
    borderWidth: 1,
    borderColor: staticColors.softGray,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: { fontSize: fontSizes.xl, fontWeight: fontWeights.semiBold },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ...spacingStyles.mb20,
  },
  card: {
    width: "47%",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.p15,
    ...spacingStyles.my5,
    borderRadius: borderRadius.r10,
    alignItems: "center",
  },
});

export default UserProfile;
