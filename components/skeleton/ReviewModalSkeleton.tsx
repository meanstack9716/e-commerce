import React from "react";
import { View, StyleSheet } from "react-native";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import gapSizes from "@/style/gapSizes";
import SkeletonPlaceholder from "./SkeletonPlaceholder ";

const ReviewModalSkeleton: React.FC = () => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <SkeletonPlaceholder style={styles.modalTitle} />

        {/* Order Info Placeholder */}
        <View style={styles.orderInfo}>
          <SkeletonPlaceholder style={styles.avatarImage} />
          <SkeletonPlaceholder style={styles.productDescription} />
        </View>

        {/* Rating and Camera Placeholder */}
        <View style={styles.ratingWithCamera}>
          <SkeletonPlaceholder style={styles.star} />

          <View style={styles.cameraRow}>
            <SkeletonPlaceholder style={styles.cameraIcon} />
            <SkeletonPlaceholder style={styles.cameraText} />
          </View>

          {/* Image Preview Placeholder */}
          <View style={styles.imagePreviewContainer}>
            {[...Array(3)].map((_, index) => (
              <SkeletonPlaceholder key={index} style={styles.previewImage} />
            ))}
          </View>
        </View>

        {/* Comment Input Placeholder */}
        <SkeletonPlaceholder style={styles.commentInput} />

        {/* Submit Button Placeholder */}
        <SkeletonPlaceholder style={styles.submitButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalView: {
    backgroundColor: staticColors.white,
    width: "100%",
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
  },
  modalTitle: {
    backgroundColor: staticColors.bgSoftBlue,
    borderTopLeftRadius: borderRadius.r20,
    borderTopRightRadius: borderRadius.r20,
    ...spacingStyles.py30,
    ...spacingStyles.mb10,
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mx10,
    gap: gapSizes.md,
    ...spacingStyles.pb10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.lightGray,
  },
  productDescription: {
    height: 15,
    width: 200,
    backgroundColor: staticColors.lightGray,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    width: 100,
    height: 20,
    ...spacingStyles.mx15,
    ...spacingStyles.mb10,
    backgroundColor: staticColors.lightGray,
  },
  ratingWithCamera: {
    alignItems: "flex-start",
  },
  cameraRow: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mx10,
    gap: gapSizes.sm,
    ...spacingStyles.mb10,
  },
  cameraText: {
    height: 14,
    width: 100,
    backgroundColor: staticColors.lightGray,
  },
  cameraIcon: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.lightGray,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
    ...spacingStyles.mx10,
    ...spacingStyles.mb10,
  },
  previewImage: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.r10,
    backgroundColor: staticColors.lightGray,
  },
  commentInput: {
    borderRadius: borderRadius.r10,
    minHeight: 120,
    ...spacingStyles.mx10,
    ...spacingStyles.mb10,
    backgroundColor: staticColors.lightGray,
  },
  submitButton: {
    borderRadius: borderRadius.r10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.mx10,
    ...spacingStyles.mb15,
    backgroundColor: staticColors.lightGray,
  },
});

export default ReviewModalSkeleton;
