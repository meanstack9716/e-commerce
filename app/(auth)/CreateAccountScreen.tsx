import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import images from "@/constants/images";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { commonStyles } from "@/style/commonStyle";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import { fontFamilies } from "@/style/fontFamilies";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthError,
  registerUser,
  resetRegistration,
} from "@/store/auth/authSlice";
import { Button } from "@/components/common/Button";
import PasswordTextField from "@/components/common/PasswordTextField";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { FormData } from "./CreateAccount.types";
import { KeyboardAvoidingViewWrapper } from "@/components/common/KeyboardAvoidingView/KeyboardAvoidingViewWrapper";

export default function CreateAccountScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, registered } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    errors,
    handleEmailValidation,
    handlePasswordValidation,
    handleConfirmPasswordMatch,
    resetErrors,
  } = useFieldValidation();

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (registered) {
      router.replace({
        pathname: "/OtpConfirmationScreen",
        params: { email: formData.email, useCase: "create-account" },
      });
      dispatch(resetRegistration());
    }
  }, [registered, router, dispatch, formData.email]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    switch (field) {
      case "email":
        handleEmailValidation(value);
        break;
      case "password":
        handlePasswordValidation(value);
        if (formData.confirmPassword) {
          handleConfirmPasswordMatch(value, formData.confirmPassword);
        }
        break;
      case "confirmPassword":
        handleConfirmPasswordMatch(formData.password, value);
        break;
    }
  };

  const handleCreateAccountSubmit = (): void => {
    resetErrors();
    handleEmailValidation(formData.email);
    handlePasswordValidation(formData.password);
    handleConfirmPasswordMatch(formData.password, formData.confirmPassword);
    const hasErrors = Object.keys(errors).some((key) => errors[key]);

    if (!hasErrors) {
      dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        })
      );
    }
  };

  const handleCancelButton = (): void => {
    router.back();
  };

  return (
    <SafeAreaViewWrapper>
      <KeyboardAvoidingViewWrapper style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.backgroundView} />
          <Image source={images.createLoginPwdShape} style={styles.shape2} />
          <Image source={images.CreatAccountShape} style={styles.shape7} />
          <View style={styles.content}>
            <Text style={styles.title}>Create{"\n"}Account</Text>
            <View style={styles.profilePicContainer}>
              <Ionicons
                name="camera-outline"
                size={fontSizes["5xl"]}
                color={staticColors.primaryBlue}
                style={styles.cameraIcon}
              />
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  commonStyles.authInput,
                  errors.email && styles.inputError,
                ]}
                placeholder="Email"
                placeholderTextColor={staticColors.mutedGray}
                autoCapitalize="none"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <View style={styles.passwordContainer}>
                <PasswordTextField
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  error={errors.password}
                />
              </View>

              <View style={styles.passwordContainer}>
                <PasswordTextField
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  error={errors.confirmPassword}
                />
              </View>
            </View>

            <View style={styles.bottomButtonContainer}>
              <Button
                title="Done"
                onPress={handleCreateAccountSubmit}
                style={commonStyles.authButton}
                loading={loading}
                textStyle={commonStyles.authButtonText}
              />
              <TouchableOpacity onPress={handleCancelButton} disabled={loading}>
                <Text
                  style={[styles.cancelText, loading && styles.disabledText]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    zIndex: 0,
  },
  keyboardAvoidingView: {
    zIndex: 10,
    backgroundColor: "transparent",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    ...spacingStyles.px20,

    backgroundColor: "transparent",
  },
  content: {
    zIndex: 10,
  },
  shape2: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    opacity: 0.7,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape7: {
    position: "absolute",
    top: 60,
    right: -90,
    width: 250,
    height: 250,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  title: {
    fontSize: fontSizes["5xl"],
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    textAlign: "left",
    alignSelf: "flex-start",
    ...spacingStyles.px10,
    ...spacingStyles.py25,
    ...spacingStyles.mt20,
  },
  profilePicContainer: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.circle,
    borderWidth: 2,
    borderColor: staticColors.primaryBlue,
    borderStyle: "dashed",
    ...spacingStyles.my25,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mx10,
  },
  cameraIcon: {},
  inputContainer: {
    width: "100%",
    ...spacingStyles.mt5,
    ...spacingStyles.mb25,
    flexDirection: "column",
    gap: gapSizes.md,
    zIndex: 15,
    backgroundColor: "transparent", // Already transparent
  },
  passwordContainer: {
    position: "relative",
  },
  inputError: {
    borderColor: staticColors.errorColor,
    borderWidth: 1,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt5,
  },
  cancelText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    textAlign: "center",
    ...spacingStyles.mt15,
  },
  disabledText: {
    opacity: 0.5,
  },
  bottomButtonContainer: {
    ...spacingStyles.py25,
    width: "100%",
    ...spacingStyles.pb20,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
