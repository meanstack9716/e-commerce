import { StyleSheet } from "react-native";
import colors from "./staticColors";
import spacingStyles from "./spacingStyles";
import {fontSizes} from "./typography";

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
    fontFamily: "Helvetica",
    color: colors.textSecondary,
    ...spacingStyles.mb10
  },
});

export default textStyles;
