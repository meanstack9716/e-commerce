
import { StyleSheet, Dimensions } from 'react-native';
import spacingStyles from './spacingStyles';
import staticColors from './staticColors';
import fontSizes from './fontSizes';

export const commonStyles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 10,
  },
  imagePlaceholderContainer: {
    backgroundColor: staticColors.errorColor,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: staticColors.lightGray,
    fontSize: fontSizes.md,
    fontWeight: "500",
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
    borderRadius: 8,
  },
  ratingText: {
    fontSize: fontSizes.xs,
    color: staticColors.textLightGray,
    ...spacingStyles.ml5
  },
  cardTitle: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: staticColors.darkGray,
    flex: 1,
  
  },
  cardPrice: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: staticColors.primary,
  },
});

