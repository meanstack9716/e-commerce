import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface SafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}