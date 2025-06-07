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
  titleStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftSection}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      <View style={styles.iconGroup}>
        <TouchableOpacity style={[styles.iconWrapper]} onPress={()=> router.push('/wishlist')}>
          <Ionicons
            name="heart-outline"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => router.navigate('/settings')}>
          <Ionicons
            name="settings-outline"
            size={24}
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
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    marginLeft: -7,
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
    ...spacingStyles.p5,
    ...spacingStyles.ml10,
    position: "relative",
  },
});
export default ProfileHeaderBar;
