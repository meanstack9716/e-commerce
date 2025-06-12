import React from "react";
import { View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <MotiView
        style={styles.imagePlaceholder}
        from={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "timing" as const,
          duration: 1000,
          loop: true,
          repeatReverse: true,
        }}
      />
      <View style={styles.textPlaceholderContainer}>
        <MotiView
          style={[styles.textPlaceholder, styles.titlePlaceholder]}
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
          style={[styles.textPlaceholder, styles.pricePlaceholder]}
          from={{ opacity: 0.3 }}
          animate={{ opacity: 0.7 }}
          transition={{
            type: "timing" as const,
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
    width: "48%",
    backgroundColor: staticColors.white,
    ...spacingStyles.mx5,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: staticColors.lightGray,
    borderRadius: borderRadius.r10,
  },
  textPlaceholderContainer: {
    ...spacingStyles.mt15,
  },
  textPlaceholder: {
    backgroundColor: staticColors.lightGray,
    borderRadius: borderRadius.r5,
    ...spacingStyles.mb5,
  },
  titlePlaceholder: {
    width: "80%",
    height: 15,
  },
  pricePlaceholder: {
    width: "50%",
    height: 10,
  },
});

export default ProductCardSkeleton;
