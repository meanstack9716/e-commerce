import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";

const ProfileHeader = () => {
  const handleLoginPress = () => {
    router.navigate("/WelcomeScreen");
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.header} />
        <View style={styles.contentContainer}>
          <View style={styles.rowContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/images/avtar-profile.png")}
                style={styles.avatarImage}
              />
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginPress}
            >
              <View style={styles.solidButton}>
                <Text style={styles.loginText}>LOG IN/SIGN UP</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    height: 215,
  },
  header: {
    backgroundColor: colors.textMuted,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
  },
  contentContainer: {
    ...spacingStyles.px15,
  },
  rowContainer: {
    marginTop: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarContainer: {
    width: 120,
    height: 125,
    backgroundColor: colors.white,
    borderRadius: borderRadius.r5,
    borderColor: colors.borderLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "55%",
    height: "55%",
    resizeMode: "cover",
    borderRadius: borderRadius.r5,
  },
  loginButton: {
    marginTop: 75,
    width: "62%",
  },
  solidButton: {
    backgroundColor: colors.buttonPrimary,
    ...spacingStyles.py10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.r5,
  },
  loginText: {
    color: colors.white,
    fontWeight: fontWeights.semiBold,
  },
});

export default ProfileHeader;
