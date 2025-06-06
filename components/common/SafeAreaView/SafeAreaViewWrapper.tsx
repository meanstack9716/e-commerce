import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";
import { SafeAreaViewProps } from "./SafeAreaViewWrapper.types";
import spacingStyles from "@/style/spacingStyles";

export const SafeAreaViewWrapper: React.FC<SafeAreaViewProps> = ({
  children,
  style,
  backgroundColor = staticColors.white,
  edges = ["top", "bottom"],
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ...spacingStyles.px10,
  },
});