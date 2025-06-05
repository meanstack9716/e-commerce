import { ReactNode } from "react";
import { ViewStyle } from "react-native";
import { Edge } from "react-native-safe-area-context";

export interface SafeAreaViewProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  edges?: Edge[];
}