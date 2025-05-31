import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";

interface SafeKeyboardViewProps {
  children: ReactNode;
  style?: ViewStyle;
  scrollViewContentStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
}

export const SafeKeyboardView: React.FC<SafeKeyboardViewProps> = ({
  children,
  style,
  scrollViewContentStyle,
  keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0,
  backgroundColor = staticColors.white,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});
