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
import { router } from "expo-router";
import { ProfileHeaderBarProps } from "./ProfileHeaderBar.tyes";

const ProfileHeaderBar: React.FC<ProfileHeaderBarProps> = ({
  title,
  profileImage,
  containerStyle,
  titleStyle,
}) => {
  const handleProfilePress = () => {
    router.push("/userManageAccount");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={staticColors.primaryBlue}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.iconGroup}>
        <TouchableOpacity
          style={[styles.iconWrapper]}
          onPress={() => router.push("/wishlist")}
        >
          <Ionicons
            name="heart-outline"
            size={20}
            color={staticColors.primaryBlue}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => router.push("/settings")}
        >
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...spacingStyles.pb10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    ...spacingStyles.py5,
    ...spacingStyles.mr15,
  },
  profileImage: {
    width: 40,
    height: 40,
    marginLeft: -7,
    borderRadius: borderRadius.circle,
    borderWidth: 3,
    borderColor: staticColors.white,
    alignSelf: "center",
    backgroundColor: staticColors.white,
    zIndex: 10,
    elevation: 10,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    resizeMode: "cover",
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
    padding: 7,
    ...spacingStyles.ml10,
    position: "relative",
    backgroundColor: staticColors.skyBlue50,
    borderRadius: borderRadius.circle,
  },
});

export default ProfileHeaderBar;
