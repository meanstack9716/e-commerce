import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "./SkeletonPlaceholder ";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";

const ReviewSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder style={styles.avatar} />

      <View style={styles.content}>
        <SkeletonPlaceholder style={styles.nameLine} />
        <SkeletonPlaceholder style={styles.ratingLine} />
        <SkeletonPlaceholder style={styles.reviewLine} />
        <SkeletonPlaceholder style={styles.reviewLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    ...spacingStyles.mb20,
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.circle,
    ...spacingStyles.mr10,
  },
  content: {
    flex: 1,
  },
  nameLine: {
    height: 12,
    width: "40%",
    borderRadius: borderRadius.r6,
    ...spacingStyles.mb5,
  },
  ratingLine: {
    height: 10,
    width: "30%",
    borderRadius: borderRadius.r6,
    ...spacingStyles.mb10,
  },
  reviewLine: {
    height: 10,
    width: "100%",
    borderRadius: borderRadius.r6,
    ...spacingStyles.mb5,
  },
});

export default ReviewSkeleton;
