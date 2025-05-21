import { StyleSheet, Dimensions } from "react-native";
import spacingStyles from "./spacingStyles";
import staticColors from "./staticColors";
import {fontSizes, fontWeights} from "./typography";
import borderRadius from "./borderRadius";

export const commonStyles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: borderRadius.r10
  },
  imagePlaceholderContainer: {
    backgroundColor: staticColors.errorColor,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: staticColors.lightGray,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.white,
    ...spacingStyles.px10,
    ...spacingStyles.py5,
    borderRadius: borderRadius.r8,
  },
  ratingText: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    ...spacingStyles.ml5,
  },
  cardTitle: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
    flex: 1,
  },
  cardPrice: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: staticColors.primary,
  },
  
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.r10,
    borderWidth: 1,
    borderColor: staticColors.discountText,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mr10,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.r6,
    backgroundColor: staticColors.discountText,
  },
  backButton: {
    ...spacingStyles.mr5,
  },
  header: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.textDarkGray,
  },
});
