import { StyleSheet } from "react-native";
import colors from "./staticColors";
import spacingStyles from "./spacingStyles";

const textStyles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontFamily: "helveticaRoundedBold",
    ...spacingStyles.mt10,
    ...spacingStyles.mb5,
    color: colors.primaryColor,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Helvetica",
    color: colors.subTitle,
    ...spacingStyles.mb10
  },
});

export default textStyles;
