import { StyleSheet } from "react-native";
import colors from "./staticColors";
import spacingStyles from "./spacingStyles";
import fontSizes from "./fontSizes";

const textStyles = StyleSheet.create({
  title: {
    fontSize: fontSizes.xl,
    fontFamily: "helveticaRoundedBold",
    ...spacingStyles.mt10,
    ...spacingStyles.mb5,
    color: colors.primary,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontFamily: "Helvetica",
    color: colors.textSecondary,
    ...spacingStyles.mb10
  },
});

export default textStyles;
