import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import images from "@/constants/images";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { commonStyles } from "@/style/commonStyle";
import useBackHandler from "@/utils/useBackHandler";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const { errors, handleEmailValidation, resetErrors, validateEmail } =
    useFieldValidation();

  const handleNextButton = () => {
    handleEmailValidation(email);
    if (!email.trim()) {
      return;
    }
    if (validateEmail(email) && !errors.email) {
      resetErrors();
      router.navigate({
        pathname: "/PasswordScreen",
        params: { email: email.trim() },
      });
    }
  };

  useBackHandler(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
    resetErrors();
    return true;
  });

  const handleCancelButton = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/profile");
    }
    resetErrors();
  };

  const handleSignUpButton = () => {
    router.navigate("/CreateAccountScreen");
    resetErrors();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.absoluteShapesContainer} pointerEvents="none">
        <Image source={images.shape01} style={styles.shape1} />
        <Image source={images.shape02} style={styles.shape2} />
        <Image source={images.shape03} style={styles.shape3} />
        <Image source={images.shape04} style={styles.shape4} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
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
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TouchableOpacity
              style={commonStyles.authButton}
              onPress={handleNextButton}
            >
              <Text style={commonStyles.authButtonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignUpButton}>
              <Text style={styles.signUpButtonText}>
                Don't have an account ? SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    ...spacingStyles.px20,
  },
  absoluteShapesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  shape1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    opacity: 0.9,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape2: {
    position: "absolute",
    top: 0,
    left: -25,
    width: 320,
    height: 300,
    opacity: 1,
    resizeMode: "contain",
  },
  shape3: {
    position: "absolute",
    top: "30%",
    right: -40,
    width: 150,
    height: 150,
    opacity: 1,
    resizeMode: "contain",
  },
  shape4: {
    position: "absolute",
    bottom: 0,
    right: -50,
    width: 350,
    height: 360,
    opacity: 1,
    resizeMode: "contain",
  },
  title: {
    fontSize: fontSizes["6xl"],
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    ...spacingStyles.mb5,
  },
  input: {
    ...spacingStyles.mb25,
  },
  errorInput: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mb20,
  },
  signUpButtonText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    fontFamily: "NunitoSans",
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
    fontFamily: "NunitoSans",
    color: staticColors.darkSlate,
  },
  cancelText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
});
