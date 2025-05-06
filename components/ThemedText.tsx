import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import fontSizes from "@/style/fontSizes";

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
    fontWeight: "600",
  },
  title: {
    fontSize: fontSizes["3xl"],
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: fontSizes.base,
    color: "#0a7ea4",
  },
});
