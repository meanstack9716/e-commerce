import React from "react";
import { View, StyleSheet } from "react-native";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import SkeletonPlaceholder from "./SkeletonPlaceholder ";
import staticColors from "@/style/staticColors";
import gapSizes from "@/style/gapSizes";

const WishlistSkeleton: React.FC = () => {
  return (
    <View style={styles.itemContainer}>
      <SkeletonPlaceholder style={styles.image} />
      <View style={styles.textBlock}>
        <SkeletonPlaceholder style={styles.title} />
        <SkeletonPlaceholder style={styles.price} />
        <View style={styles.optionsRow}>
          <SkeletonPlaceholder style={styles.option} />
          <SkeletonPlaceholder style={styles.option} />
          <SkeletonPlaceholder style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    ...spacingStyles.p10,
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r5,
  },
  image: {
    width: 130,
    height: 100,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mr10,
  },
  textBlock: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    width: "70%",
    height: 20,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mt10,
  },
  price: {
    width: "50%",
    height: 20,
    borderRadius: borderRadius.r5,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
  },
  option: {
    width: 60,
    height: 25,
    borderRadius: borderRadius.r5,
  },
  icon: {
    width: 30,
    height: 25,
    borderRadius: borderRadius.r5,
    marginLeft: "auto",
  },
});

export default WishlistSkeleton;
