import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import images from "@/constants/images";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import { commonStyles } from "@/style/commonStyle";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import {
  clearAuthError,
  registerUser,
  resetRegistration,
} from "@/store/auth/authSlice";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { loading, error, registered } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

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
        params: { email: formData.email, source: "create-account" },
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

  const handleDoneButton = (): void => {
    setSubmissionAttempted(true);
    handleEmailValidation(formData.email);
    handlePasswordValidation(formData.password);
    handleConfirmPasswordMatch(formData.password, formData.confirmPassword);

    const hasErrors = !!(
      errors.email ||
      errors.password ||
      errors.confirmPassword
    );
    const allFieldsFilled =
      formData.email && formData.password && formData.confirmPassword;

    if (!hasErrors && allFieldsFilled) {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.absoluteShapesContainer} pointerEvents="none">
        <Image source={images.shape02} style={styles.shape2} />
        <Image source={images.shape07} style={styles.shape7} />
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
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    commonStyles.authInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Password"
                  placeholderTextColor={staticColors.mutedGray}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={fontSizes.md}
                    color={staticColors.CharcoalGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    commonStyles.authInput,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor={staticColors.mutedGray}
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={fontSizes.md}
                    color={staticColors.CharcoalGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              {submissionAttempted && error && (
                <Text style={styles.apiError}>{error}</Text>
              )}
            </View>
          </View>

          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity
              style={[
                commonStyles.authButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleDoneButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={staticColors.white} />
              ) : (
                <Text style={commonStyles.authButtonText}>Done</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCancelButton} disabled={loading}>
              <Text style={[styles.cancelText, loading && styles.disabledText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    ...spacingStyles.px20,
  },
  contentContainer: {
    justifyContent: "center",
    ...spacingStyles.mt25,
    ...spacingStyles.pt25,
  },
  absoluteShapesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
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
  },
  title: {
    fontSize: fontSizes["5xl"],
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    textAlign: "left",
    alignSelf: "flex-start",
    ...spacingStyles.px10,
    ...spacingStyles.py25,
    ...spacingStyles.mt25,
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
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
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
  apiError: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt10,
    textAlign: "center",
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
