import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import { commonStyles } from "@/style/commonStyle";
import useBackHandler from "@/utils/useBackHandler";
import { Button } from "@/components/common/Button";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { fontFamilies } from "@/style/fontFamilies";
import { KeyboardAvoidingViewWrapper } from "@/components/common/KeyboardAvoidingView/KeyboardAvoidingViewWrapper";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const { errors, handleEmailValidation, resetErrors, validateEmail } =
    useFieldValidation();

  const onEmailSubmit = () => {
    handleEmailValidation(email);
    if (validateEmail(email) && !errors.email) {
      resetErrors();
      router.push({
        pathname: "/PasswordScreen",
        params: { email: email.trim() },
      });
    }
  };

  useBackHandler(() => {
    handleCancelButton();
    return true;
  });

  const handleCancelButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/profile");
    }
    resetErrors();
  };

  const handleSignUpButton = () => {
    router.push("/CreateAccountScreen");
    resetErrors();
  };

  return (
    <SafeAreaViewWrapper>
      <Image source={images.loginPasswordShape} style={styles.shape1} />
      <Image source={images.createLoginPwdShape} style={styles.shape2} />
      <Image source={images.loginShape} style={styles.shape3} />
      <Image source={images.loginOnboardingShape} style={styles.shape4} />

      <KeyboardAvoidingViewWrapper>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Login</Text>

          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitle}>Good to see you back! </Text>
            <Ionicons
              name="heart"
              size={fontSizes.md}
              color={staticColors.darkSlate}
            />
          </View>

          <TextInput
            style={[
              commonStyles.authInput,
              styles.input,
              errors.email && styles.errorInput,
            ]}
            placeholder="Email"
            placeholderTextColor={staticColors.mutedGray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              handleEmailValidation(text);
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <Button
            title="Next"
            onPress={onEmailSubmit}
            style={commonStyles.authButton}
            textStyle={commonStyles.authButtonText}
          />

          <TouchableOpacity onPress={handleCancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignUpButton}>
            <Text style={styles.signUpButtonText}>
              Don't have an account ? SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    ...spacingStyles.px20,
    zIndex: 2,
  },
  shape1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 275,
    height: 290,
    opacity: 0.9,
    resizeMode: "contain",
    zIndex: 2,
  },
  shape2: {
    position: "absolute",
    top: -50,
    left: -25,
    width: 310,
    height: 320,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape3: {
    position: "absolute",
    top: "30%",
    right: -40,
    width: 150,
    height: 150,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape4: {
    position: "absolute",
    bottom: -50,
    right: -50,
    width: 350,
    height: 360,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  title: {
    fontSize: fontSizes["6xl"],
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    ...spacingStyles.mb5,
  },
  input: {
    ...spacingStyles.mb10,
  },
  errorInput: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
  },
  signUpButtonText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.nunitoSans,
    textAlign: "center",
    ...spacingStyles.my15,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb20,
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.darkSlate,
  },
  cancelText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
});
