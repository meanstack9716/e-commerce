import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";

interface SafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}

export const SafeAreaViewWrapper: React.FC<SafeAreaViewProps> = ({
  children,
  style,
  backgroundColor = staticColors.white,
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={["bottom"]} 
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});