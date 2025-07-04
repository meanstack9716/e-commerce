import React from "react";
import { View, StyleSheet } from "react-native";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import SkeletonPlaceholder from "./SkeletonPlaceholder ";
import staticColors from "@/style/staticColors";

const CartSkeleton: React.FC = () => {
  return (
    <View style={styles.itemContainer}>
      <SkeletonPlaceholder style={styles.image} />
      <View style={styles.infoBlock}>
        <SkeletonPlaceholder style={styles.title} />
        <SkeletonPlaceholder style={styles.price} />
        <SkeletonPlaceholder style={styles.controls} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    ...spacingStyles.mb10,
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r10,
    ...spacingStyles.p10,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: borderRadius.r10,
    ...spacingStyles.mr10
  },
  infoBlock: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    height: 20,
    width: "60%",
    borderRadius: borderRadius.r5,
    ...spacingStyles.mt5
  },
  price: {
    height: 20,
    width: "40%",
    borderRadius: borderRadius.r5,
   ...spacingStyles.mb10
  },
  controls: {
    height: 25,
    width: "50%",
    borderRadius: borderRadius.r5,
  },
});

export default CartSkeleton;
