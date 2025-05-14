import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";

interface IconCardProps {
  iconName: string;
  title: string;
  onPress?: () => void;
  containerStyle?: object;
  iconContainerStyle?: object;
  iconStyle?: object;
  textStyle?: object;
  iconBackgroundColor?: string;
}

const IconCard: React.FC<IconCardProps> = ({
  iconName,
  title,
  onPress,
  containerStyle,
  iconContainerStyle,
  iconStyle,
  textStyle,
  iconBackgroundColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconBackgroundColor || staticColors.bgCardLight },
          iconContainerStyle,
        ]}
      >
        <Ionicons
          name={iconName as any}
          size={fontSizes.lg}
          color={staticColors.textMuted}
          style={[styles.icon, iconStyle]}
        />
      </View>
      <Text style={[styles.title, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.white,
    borderRadius: 5,
    ...spacingStyles.p10,
    ...spacingStyles.m5,
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    ...spacingStyles.mb5,
  },
  icon: {},
  title: {
    fontSize: fontSizes.xs,
    color: staticColors.textMuted,
    textAlign: "center",
  },
});

export default IconCard;
