import spacingStyles from "@/style/spacingStyles";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import colors from "@/style/staticColors";
import {fontSizes, fontWeights} from "@/style/typography";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, style, disabled && styles.disabled]}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={staticColors.white} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r6,
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.mb10,
    width: "100%",
  },
  text: {
    color: colors.white,
    fontWeight: fontWeights.semiBold,
    fontSize:fontSizes.sm
  },
  disabled: {
    opacity: 0.6,
  },
});
