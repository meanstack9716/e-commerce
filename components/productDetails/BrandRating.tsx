import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { PRODUCT_CODE } from "@/constants/constants";
import fontSizes from "@/style/fontSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

export default function BrandRating() {
  const [isBrandInfoExpanded, setIsBrandInfoExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsBrandInfoExpanded(!isBrandInfoExpanded);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Brand Rating</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>4.1 ★</Text>
        <Text style={styles.ratingDetails}>
          118.4K Ratings* | 116.2K items sold last year
        </Text>
      </View>
      <Text style={styles.note}>
        *Based on ratings of the products sold by the brand.
      </Text>

      <Text style={styles.sectionHeader}>MORE INFORMATION</Text>
      <Text style={styles.subHeader}>Product Code: {PRODUCT_CODE}</Text>

      <TouchableOpacity onPress={toggleExpanded} style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>
          {isBrandInfoExpanded ? "View Less" : "View More"}
        </Text>
      </TouchableOpacity>

      {isBrandInfoExpanded && (
        <>
          <Text style={styles.subHeader}>Manufacturer Detail</Text>
          <Text style={styles.detail}>
            RADHAMANI TEXTILES PVT. LTD., NO. 27, VTMS ARCADE, YELENKUNTE,
            MANGAMMANAPALYA, Hosur main Road, Bengaluru-560068
          </Text>

          <Text style={styles.subHeader}>Packer Detail</Text>
          <Text style={styles.detail}>
            RADHAMANI TEXTILES PVT. LTD., NO. 27, VTMS ARCADE, YELENKUNTE,
            MANGAMMANAPALYA, Hosur main Road, Bengaluru-560068
          </Text>

          <Text style={styles.subHeader}>Country of Origin</Text>
          <Text style={styles.detail}>India</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px15,
    ...spacingStyles.py15,
  },
  header: {
    fontSize: fontSizes.md,
    fontWeight: "bold",
    ...spacingStyles.py5,
    color: staticColors.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb5,
  },
  rating: {
    fontSize: fontSizes.sm,
    fontWeight: "bold",
    ...spacingStyles.mr10,
  },
  ratingDetails: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
  },
  note: {
    fontSize: fontSizes.xs,
    color: staticColors.shadowColor,
    ...spacingStyles.mb20,
  },
  sectionHeader: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: fontSizes.xs,
    fontWeight: "bold",
    ...spacingStyles.mb5,
    color: staticColors.shadowColor,
  },
  detail: {
    fontSize: fontSizes.sm,
    color: staticColors.shadowColor,
  },
  viewMoreButton: {
    ...spacingStyles.pb5,
  },
  viewMoreText: {
    fontSize: fontSizes.sm,
    color: staticColors.discountText,
    fontWeight: "bold",
  },
});
