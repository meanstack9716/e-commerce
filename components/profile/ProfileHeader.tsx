import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import LoginModal from "@/app/(auth)/loginModal";
import SignUpModal from "@/app/(auth)/signUpModal";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";

const ProfileHeader: React.FC = () => {
  const router = useRouter();
  const [loginModalVisible, setLoginModalVisible] = useState<boolean>(false);
  const [signupModalVisible, setSignupModalVisible] = useState<boolean>(false);

  const handleLoginPress = (): void => {
    setLoginModalVisible(true);
  };

  const closeLoginModal = (): void => {
    setLoginModalVisible(false);
  };

  const closeSignupModal = (): void => {
    setSignupModalVisible(false);
  };

  const openSignupModal = (): void => {
    setLoginModalVisible(false); 
    setSignupModalVisible(true);
  };

  const openLoginModal = (): void => {
    setSignupModalVisible(false); 
    setLoginModalVisible(true); 
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
      
      <LoginModal 
        visible={loginModalVisible} 
        onClose={closeLoginModal}
        onSignupPress={openSignupModal} 
      />
      
      <SignUpModal 
        visible={signupModalVisible} 
        onClose={closeSignupModal}
        onLoginPress={openLoginModal}
      />
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
    ...spacingStyles.px15
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
    borderRadius: 5,
    borderColor: colors.borderLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "55%",
    height: "55%",
    resizeMode: "cover",
    borderRadius: 5,
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
    borderRadius: 5,
  },
  loginText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: fontSizes.xs
  },
});

export default ProfileHeader;
