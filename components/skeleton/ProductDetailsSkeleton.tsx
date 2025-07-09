import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import gapSizes from "@/style/gapSizes";
import SkeletonPlaceholder from "./SkeletonPlaceholder ";

const { width: screenWidth } = Dimensions.get("window");

const ProductDetailsSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder style={styles.imageCarousel} />
      <View style={styles.dotsContainer}>
        {[...Array(4)].map((_, i) => (
          <SkeletonPlaceholder key={i} style={styles.dot} />
        ))}
      </View>

      <View style={styles.infoSection}>
        <SkeletonPlaceholder style={styles.discountedPrice} />
        <SkeletonPlaceholder style={styles.title} />
        <SkeletonPlaceholder style={styles.shortDesc} />
        <SkeletonPlaceholder style={styles.shortDescHalf} />
      </View>

      {/* Size/Color Selectors */}
      <View style={styles.selectorSection}>
        <SkeletonPlaceholder style={styles.selectorLabel} />
        <View style={styles.selectorOptions}>
          {[...Array(4)].map((_, i) => (
            <SkeletonPlaceholder key={i} style={styles.circleOption} />
          ))}
        </View>
      </View>

      {/* Button */}
      <SkeletonPlaceholder style={styles.addToCartButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.pb20,
  },
  imageCarousel: {
    width: screenWidth,
    height: 400,
    borderRadius: borderRadius.r10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    ...spacingStyles.my10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.r4,
    ...spacingStyles.mx5,
  },
  infoSection: {
    ...spacingStyles.mx10,
    ...spacingStyles.py10,
  },
  discountedPrice: {
    width: 100,
    height: 20,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb10,
  },
  title: {
    width: "80%",
    height: 24,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb10,
  },
  shortDesc: {
    width: "90%",
    height: 16,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb10,
  },
  shortDescHalf: {
    width: "60%",
    height: 16,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb15,
  },
  selectorSection: {
    ...spacingStyles.mx10,
    ...spacingStyles.mb20,
  },
  selectorLabel: {
    width: 120,
    height: 18,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb10,
  },
  selectorOptions: {
    flexDirection: "row",
    gap: gapSizes.md,
  },
  circleOption: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
  },
  addToCartButton: {
    height: 48,
    ...spacingStyles.px15,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mt10,
    ...spacingStyles.mx10
  },
});

export default ProductDetailsSkeleton;
