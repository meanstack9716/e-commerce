import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import images from "@/constants/images";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { commonStyles } from "@/style/commonStyle";
import gapSizes from "@/style/gapSizes";
import { router } from "expo-router";
import { Button } from "@/components/common/Button";
import { SafeKeyboardView } from "@/components/common/SafeKeyboardView";
import { fontFamilies } from "@/style/fontFamilies";

const WelcomeScreen = () => {
  const handleNextButton = () => {
    router.navigate("/CreateAccountScreen");
  };

  const handleAlreadyButton = () => {
    router.navigate("/LoginScreen");
  };
  return (
    <SafeKeyboardView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.shadowContainer}>
          <Image source={images.welcomeBag} style={styles.bagImage} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Shoppe</Text>
        <Text style={styles.subtitle}>
          Beautiful eCommerce UI Kit for your online store
        </Text>

        <View style={styles.bottomContainer}>
          <Button
            title="Let's get started"
            onPress={handleNextButton}
            style={commonStyles.authButton}
            textStyle={commonStyles.authButtonText}
          />

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={handleAlreadyButton}
          >
            <Text style={styles.linkText}>I already have an account</Text>
            <Ionicons
              name="arrow-forward"
              size={fontSizes.base}
              color={staticColors.white}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeKeyboardView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowContainer: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p20,
    borderRadius: borderRadius.circle,
    elevation: 5,
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  bagImage: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  title: {
    fontSize: fontSizes["5xl"],
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    ...spacingStyles.mt20,
    ...spacingStyles.mb15,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.darkSlate,
    textAlign: "center",
    ...spacingStyles.px25,
    lineHeight: 30,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.md,
    ...spacingStyles.mt15,
  },
  linkText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.nunitoSans,
  },
  icon: {
    ...spacingStyles.p5,
    borderRadius: borderRadius.circle,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.primaryBlue,
  },
});

export default WelcomeScreen;
