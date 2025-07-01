import { StyleSheet, Dimensions } from "react-native";
import spacingStyles from "./spacingStyles";
import staticColors from "./staticColors";
import { fontSizes, fontWeights } from "./typography";
import borderRadius from "./borderRadius";
import { fontFamilies } from "./fontFamilies";
import gapSizes from "./gapSizes";

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
    backgroundColor: staticColors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: staticColors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#f5f3ed',
    ...spacingStyles.px6,
    ...spacingStyles.py2,
    borderRadius: borderRadius.r5,
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
    color: staticColors.textDarkGray,
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
    alignItems: "center",
    alignSelf: "center",
  },
  topRightImages: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  shape5: {
    position: "absolute",
    top: -50,
    right: -55,
    width: 320,
    height: 250,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape6: {
    position: "absolute",
    top: -20,
    right: -30,
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
  reviewAvtar: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.circle,
    borderColor: staticColors.white,
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    resizeMode: "contain",
    ...spacingStyles.mr10,
    alignSelf: "flex-start",
  },
  starIcon: {
    ...spacingStyles.m2,
  },
  reviewImageContainer: {
    ...spacingStyles.mt5,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.r8,
    ...spacingStyles.mr5
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: gapSizes.md,
    ...spacingStyles.mb10,
    ...spacingStyles.pt10,
    ...spacingStyles.px4,
  },
  searchContainerText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: staticColors.gray100,
    borderRadius: borderRadius.r20,
    ...spacingStyles.px15,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
    fontWeight: fontWeights.medium,
  },

  itemCountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
    ...spacingStyles.py10,
  },
  itemCountTitle: {
    fontSize: fontSizes.xl,
    fontFamily: fontFamilies.ralewayBold,
    ...spacingStyles.mt5
  },
  itemCountWrap: {
    borderRadius: borderRadius.circle,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.iceBlue,
    ...spacingStyles.px12,
    ...spacingStyles.pb6,
  },
  itemCount: {
    fontSize: fontSizes.lg,
    textAlign: "center",
    fontFamily: fontFamilies.ralewayBold,
  },
  justifyBetwwen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
});
