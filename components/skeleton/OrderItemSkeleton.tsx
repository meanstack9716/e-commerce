import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import SkeletonPlaceholder from "../skeleton/SkeletonPlaceholder ";
interface OrderItemSkeletonProps {
  count?: number;
}

const OrderItemSkeleton: React.FC<OrderItemSkeletonProps> = ({ count = 5 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <View key={`skeleton-${index}`} style={styles.container}>
            <SkeletonPlaceholder
              style={styles.thumbnailPlaceholder}
              fromOpacity={0.4}
              toOpacity={1}
            />
            <View style={styles.detailsContainer}>
              <SkeletonPlaceholder
                style={[styles.textPlaceholder, styles.orderNumberPlaceholder]}
                fromOpacity={0.4}
                toOpacity={1}
              />
              <SkeletonPlaceholder
                style={[styles.textPlaceholder, styles.descriptionPlaceholder]}
              />
              <SkeletonPlaceholder style={styles.textPlaceholder} />
            </View>
          </View>
        ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: staticColors.white,
    ...spacingStyles.px10,
    ...spacingStyles.py15,
    ...spacingStyles.mb15,
    borderRadius: borderRadius.r10,
    elevation: 1,
  },
  thumbnailPlaceholder: {
    width: 100,
    height: 80,
    backgroundColor: staticColors.lightGray,
    borderRadius: borderRadius.r10,
  },
  detailsContainer: {
    flex: 1,
    ...spacingStyles.ml12,
  },
  textPlaceholder: {
    backgroundColor: staticColors.lightGray,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb8,
    height: 10,
  },
  orderNumberPlaceholder: {
    width: "60%",
    height: 16,
  },
  descriptionPlaceholder: {
    width: "80%",
    height: 12,
  },
  statusPlaceholder: {
    width: "40%",
    height: 10,
  },
});

export default OrderItemSkeleton;
