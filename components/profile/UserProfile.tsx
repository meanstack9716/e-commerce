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
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";

const UserProfile = () => {
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
      <View style={styles.profileSelectorContainer}>
        <Text style={styles.profileSelectorHeader}>Shopping for you</Text>
        <View style={styles.profileSelector}>
          <View style={styles.profileCircleContainer}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>Y</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminText}>Admin</Text>
              </View>
            </View>
            <Text style={styles.profileLabel}>you</Text>
          </View>
          <View style={styles.addCircleContainer}>
            <TouchableOpacity style={styles.addCircle}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.addLabel}>Add</Text>
          </View>
        </View>
      </View>

      {/* Card Buttons */}
      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="cube-outline"
            size={20}
            color={staticColors.textLightGray}
          />
          <Text style={styles.cardText}>Orders</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={staticColors.textLightGray}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <MaterialIcons
            name="workspace-premium"
            size={20}
            color={staticColors.textLightGray}
          />
          <Text style={styles.cardText}>Insider</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={staticColors.textLightGray}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="headset-outline"
            size={20}
            color={staticColors.textLightGray}
          />
          <Text style={styles.cardText}>Help Center</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={staticColors.textLightGray}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="pricetags-outline"
            size={20}
            color={staticColors.textLightGray}
          />
          <Text style={styles.cardText}>Coupons</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={staticColors.textLightGray}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, ...spacingStyles.p20 },
  banner: {
    backgroundColor: staticColors.bannerColor,
    borderRadius: 10,
    ...spacingStyles.p15,
    ...spacingStyles.mb20,
  },
  bannerText: { fontSize: fontSizes.sm, ...spacingStyles.mb10 },
  highlight: { fontWeight: "bold", color: staticColors.bannerHeighlight },
  knowMoreButton: {
    backgroundColor: staticColors.bannerHeighlight,
    ...spacingStyles.py5,
    ...spacingStyles.px15,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  knowMoreText: { color: staticColors.white, fontWeight: "bold" },
  profileSelectorContainer: {
    ...spacingStyles.mb20,
  },
  profileSelectorHeader: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
    color: staticColors.black,
    ...spacingStyles.mb10,
  },
  profileSelector: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: gapSizes.lg,
  },
  profileCircleContainer: {
    alignItems: "center",
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: staticColors.profileBg,
    borderWidth: 2,
    borderColor: staticColors.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  profileInitial: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    color: staticColors.black,
  },
  adminBadge: {
    position: "absolute",
    bottom: 0,
    backgroundColor: staticColors.modalOverlayLight,
    ...spacingStyles.px5,
    ...spacingStyles.py2,
    borderRadius: 6,
  },
  adminText: {
    color: staticColors.primary,
    fontSize: 10,
    fontWeight: "500",
  },
  profileLabel: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    ...spacingStyles.mt5,
  },
  addCircleContainer: {
    alignItems: "center",
  },
  addCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: staticColors.softGray,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    color: staticColors.darkGray,
  },
  addLabel: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    ...spacingStyles.mt5,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ...spacingStyles.mb20,
  },
  card: {
    width: "48%",
    backgroundColor: staticColors.white,
    ...spacingStyles.py15,
    ...spacingStyles.px10,
    ...spacingStyles.my5,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: staticColors.lightGray,
  },
  cardText: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontWeight: "500",
    color: staticColors.black,
    ...spacingStyles.ml5,
  },
});

export default UserProfile;
