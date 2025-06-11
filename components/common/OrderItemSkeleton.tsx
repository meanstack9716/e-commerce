import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";

const OrderItemSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <MotiView
        style={styles.thumbnailPlaceholder}
        from={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing" as const,
          duration: 1000,
          loop: true,
          repeatReverse: true,
        }}
      />
      <View style={styles.detailsContainer}>
        <MotiView
          style={[styles.textPlaceholder, styles.orderNumberPlaceholder]}
          from={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "timing" as const,
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
        />
        <MotiView
          style={[styles.textPlaceholder, styles.descriptionPlaceholder]}
          from={{ opacity: 0.3 }}
          animate={{ opacity: 0.7 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
        />
        <MotiView
          style={styles.textPlaceholder}
          from={{ opacity: 0.3 }}
          animate={{ opacity: 0.7 }}
          transition={{
            type: "timing",
            duration: 1000,
            loop: true,
            repeatReverse: true,
          }}
        />
      </View>
    </View>
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