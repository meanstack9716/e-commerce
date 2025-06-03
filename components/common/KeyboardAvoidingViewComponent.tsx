import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from "react-native";
import staticColors from "@/style/staticColors";

interface KeyboardAvoidingViewProps {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
}

export const KeyboardAvoidingViewComponent: React.FC<
  KeyboardAvoidingViewProps
> = ({
  children,
  style,
  keyboardVerticalOffset = Platform.OS === "ios" ? 20 : 0,
  backgroundColor = staticColors.white,
}) => {
  return (
    <KeyboardAvoidingView
      style={[styles.keyboardAvoiding, { backgroundColor }, style]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
});
