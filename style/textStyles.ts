import { StyleSheet } from "react-native";
import colors from "./staticColors";
import spacingStyles from "./spacingStyles";
import {fontSizes} from "./typography";
import { fontFamilies } from "./fontFamilies";

const textStyles = StyleSheet.create({
  title: {
    fontSize: fontSizes.xl,
    fontFamily: "helveticaRoundedBold",
    ...spacingStyles.mt10,
    ...spacingStyles.mb5,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.helvetica,
    color: colors.textSecondary,
    ...spacingStyles.mb10
  },
});

export default textStyles;
