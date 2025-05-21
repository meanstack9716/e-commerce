import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { EXTRA_DISCOUNT, PRODUCT_PRICE } from "@/constants/constants";
import OfferDetailsModal from "@/modal/OfferDetailsModal";
import {fontSizes, fontWeights} from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { EvilIcons } from "@expo/vector-icons";
import borderRadius from "@/style/borderRadius";

const DealBanner = () => {
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const toggleModal = () => {
    setIsOfferModalVisible(!isOfferModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftContent}>
          <Image
            source={require("@/assets/images/images/mega-deal.png")}
            style={styles.megaDealImage}
            resizeMode="contain"
          />
          <Text style={styles.getAtText}>
            Get at <Text style={styles.priceText}>₹{PRODUCT_PRICE}</Text>
          </Text>
        </View>

        <View style={styles.rightBadge}>
          <Text style={styles.badgeText}>Extra ₹{EXTRA_DISCOUNT} Off</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bottomRow} onPress={toggleModal}>
        <Text style={styles.couponText}>
          With Coupon + <Text style={styles.bankOfferText}>Bank Offer</Text>
        </Text>
        <View style={styles.detailsSections}>
          <Text style={styles.detailsText}>Details</Text>
          <EvilIcons
            name="chevron-right"
            size={20}
            color={staticColors.discountText}
          />
        </View>
      </TouchableOpacity>

      <OfferDetailsModal
        visible={isOfferModalVisible}
        onClose={toggleModal}
        offerPrice={PRODUCT_PRICE}
        extraDiscount={EXTRA_DISCOUNT}
      />
    </View>
  );
};

export default DealBanner;

const styles = StyleSheet.create({
  container: {
     borderRadius: borderRadius.r10,
    ...spacingStyles.mx15,
    ...spacingStyles.mt15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: borderRadius.r10,
    ...spacingStyles.pr10,
    ...spacingStyles.py10,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  megaDealImage: {
    width: 65,
    height: 45,
  },
  getAtText: {
    fontSize: fontSizes.md,
    color: staticColors.darkGray,
    fontWeight: fontWeights.semiBold,
  },
  priceText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
  },
  rightBadge: {
    backgroundColor: staticColors.darkGreen,
    ...spacingStyles.px10,
    ...spacingStyles.py5,
     borderRadius: borderRadius.r10,
  },
  badgeText: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
  },
  bottomRow: {
    backgroundColor: staticColors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.py10,
    ...spacingStyles.px20,
     borderRadius: borderRadius.r14,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
  },
  couponText: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
  },
  bankOfferText: {
    fontWeight: fontWeights.semiBold,
  },
  detailsText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: staticColors.discountText,
  },
  detailsSections: {
    flexDirection: "row",
  },
});
