import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import {fontSizes, fontWeights} from "@/style/typography";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: fontSizes.base,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: fontSizes.base,
    lineHeight: 24,
    fontWeight: fontWeights.semiBold,
  },
  title: {
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.semiBold,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
  },
  link: {
    lineHeight: 30,
    fontSize: fontSizes.base,
    color: "#0a7ea4",
  },
});
