import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface KeyboardAvoidingViewProps {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
  backgroundColor?: string;
}