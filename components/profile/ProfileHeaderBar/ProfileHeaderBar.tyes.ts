import { ImageSourcePropType, TextStyle, ViewStyle } from "react-native";
export interface ProfileHeaderBarProps {
  title: string;
  profileImage: ImageSourcePropType;
  containerStyle?: ViewStyle; 
  titleStyle?: TextStyle;
}