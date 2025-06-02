import { StyleSheet, Dimensions } from "react-native";
import spacingStyles from "./spacingStyles";
import staticColors from "./staticColors";
import { fontSizes, fontWeights } from "./typography";
import borderRadius from "./borderRadius";
import { fontFamilies } from "./fontFamilies";

export const commonStyles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 190,
    borderRadius: borderRadius.r10,
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
    width: 18,
    height: 18,
    borderRadius: borderRadius.r10,
    borderWidth: 1,
    borderColor: staticColors.textDarkGray,
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
  radioOuterSelected: {
    borderColor: staticColors.discountText,
  },
  backButton: {
    ...spacingStyles.mr5,
  },
  header: {
    fontSize: fontSizes.base,
    fontWeight: "bold",
    color: staticColors.textDarkGray,
  },
  authButton: {
    width: "100%",
    height: 60,
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.r16,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.my10,
  },
  authButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.nunitoSans,
  },
  authInput: {
    width: "100%",
    height: 50,
    backgroundColor: staticColors.paperWhite,
    borderRadius: borderRadius.r24,
    ...spacingStyles.px20,
    fontSize: fontSizes.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.circle,
    borderWidth: 7,
    borderColor: staticColors.white,
    alignSelf: "center",
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    resizeMode: "contain",
  },
  contentContainer: {
    position: "absolute",
    top: "17%",
    width: "100%",
    ...spacingStyles.px25,
  },
  homeIndicator: {
    width: 145,
    height: 5,
    backgroundColor: staticColors.black,
    borderRadius: borderRadius.r4,
    ...spacingStyles.mt20,
    alignItems:'center',
    alignSelf:'center'
  },
    topRightImages: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  shape5: {
    position: "absolute",
    top: -100,
    right: -50,
    width: 320,
    height: 250,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape6: {
    position: "absolute",
    top: -65,
    right: -25,
    width: 360,
    height: 250,
    opacity: 1,
    resizeMode: "contain",
  },
    bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    ...spacingStyles.px20,
  },
});
