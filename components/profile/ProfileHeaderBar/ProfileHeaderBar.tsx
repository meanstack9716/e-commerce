import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { fontFamilies } from "@/style/fontFamilies";
import { ProfileHeaderBarProps } from "./ProfileHeaderBar.tyes";

const ProfileHeaderBar: React.FC<ProfileHeaderBarProps> = ({
  title,
  profileImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.iconGroup}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={20}
            color={staticColors.primaryBlue}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconWrapper, styles.activeIcon]}>
          <Ionicons
            name="reorder-three-outline"
            size={20}
            color={staticColors.primaryBlue}
          />
          <View style={styles.dotIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons
            name="settings-outline"
            size={20}
            color={staticColors.primaryBlue}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...spacingStyles.px20,
    ...spacingStyles.py25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: staticColors.white,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.circle,
    borderWidth: 2,
    borderColor: staticColors.white,
    alignSelf: "center",
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    resizeMode: "contain",
    ...spacingStyles.mr10,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.black,
    ...spacingStyles.mr10,
  },
  iconGroup: {
    flexDirection: "row",
  },
  iconWrapper: {
    backgroundColor: staticColors.iceBlue,
    borderRadius: borderRadius.circle,
    ...spacingStyles.p10,
    ...spacingStyles.ml10,
    position: "relative",
  },
  activeIcon: {
    backgroundColor: "#DBEAFE",
  },
  dotIndicator: {
    position: "absolute",
    top: 4,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: staticColors.primaryBlue,
    borderRadius: borderRadius.circle,
  },
});
export default ProfileHeaderBar;
