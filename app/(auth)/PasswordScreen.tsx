import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearAuthError } from "@/store/auth/authSlice";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import images from "@/constants/images";
import borderRadius from "@/style/borderRadius";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { commonStyles } from "@/style/commonStyle";
import { Button } from "@/components/common/Button";
import PasswordTextField from "@/components/common/PasswordTextField";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { KeyboardAvoidingViewWrapper } from "@/components/common/KeyboardAvoidingView/KeyboardAvoidingViewWrapper";

export default function PasswordScreen() {
  const [password, setPassword] = useState("");
  const { loginError, loading } = useAppSelector((state) => state.auth);
  const { errors, handleLoginPasswordValidation, resetErrors, setFieldErrors } =
    useFieldValidation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams();

  useEffect(() => {
    setPassword("");
    resetErrors();
    dispatch(clearAuthError());
  }, []);

  const handleSubmit = async () => {
    handleLoginPasswordValidation(password);
    if (!errors.password && password.trim()) {
      const resultAction = await dispatch(
        loginUser({
          email: email as string,
          password: password,
        })
      );
      if (loginUser.fulfilled.match(resultAction)) {
        router.navigate("/OnboardingScreen");
      }
    }
  };

  const handleNotYouButton = () => {
    router.back();
    dispatch(clearAuthError());
    resetErrors();
  };

  const handleForgetPassword = () => {
    router.navigate({
      pathname: "/PasswordRecoveryScreen",
      params: { email: email as string },
    });
    dispatch(clearAuthError());
    resetErrors();
  };

  return (
    <KeyboardAvoidingViewWrapper style={styles.keyboardAvoidingView}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        
      >
        <Image source={images.loginPasswordShape} style={styles.shape1} />
        <Image source={images.createLoginPwdShape} style={styles.shape2} />

        <View style={[commonStyles.contentContainer, styles.contentWrapper]}>
          <Image
            source={images.avatar}
            style={[commonStyles.avatar, styles.avatar]}
          />
          <Text style={styles.greeting}>Hello User !!</Text>

          <Text style={styles.label}>Type your password</Text>
          <View style={styles.passwordContainer}>
            <PasswordTextField
              placeholder="Enter Your Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                handleLoginPasswordValidation(text);
              }}
              error={errors.password}
            />
            {loginError && <Text style={styles.errorText}>{loginError}</Text>}
            {errors.apiError && (
              <Text style={styles.errorText}>{errors.apiError}</Text>
            )}
          </View>

          <Button
            title="SUBMIT"
            onPress={handleSubmit}
            loading={loading}
            style={commonStyles.authButton}
            textStyle={commonStyles.authButtonText}
          />

          <TouchableOpacity onPress={handleForgetPassword}>
            <Text style={styles.forgetPasswordText}>Forget your password?</Text>
          </TouchableOpacity>

          {/* Bottom "Not you?" button */}
          <View
            style={[
              styles.bottomButtonContainer,
              { paddingBottom: insets.bottom },
            ]}
          >
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={handleNotYouButton}
            >
              <Text style={styles.buttonText}>Not you?</Text>
              <Ionicons
                name="arrow-forward"
                size={fontSizes.base}
                color={staticColors.white}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingViewWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    minHeight: "20%",
   
  },
  contentWrapper: {
    justifyContent: "center",
    ...spacingStyles.px20,
  },
  keyboardAvoidingView: {
    zIndex: 10,
    backgroundColor: staticColors.white,
  },
  shape1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 280,
    height: 300,
    opacity: 1,
    resizeMode: "contain",
    zIndex: -1,
  },
  shape2: {
    position: "absolute",
    top: -50,
    left: -25,
    width: 320,
    height: 340,
    opacity: 1,
    resizeMode: "contain",
    zIndex: -2,
  },
  avatar: {
    zIndex: 10,
    position: "relative",
  },
  greeting: {
    fontSize: fontSizes["2xl"],
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    ...spacingStyles.mt20,
    textAlign: "center",
  },
  label: {
    fontSize: fontSizes.lg,
    fontFamily: "NunitoSans",
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
  passwordContainer: { ...spacingStyles.mb10 },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mb20,
  },
  forgetPasswordText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    fontFamily: "NunitoSans",
    textAlign: "center",
    ...spacingStyles.mb10,
  },
  bottomButtonContainer: {
    alignItems: "center",
    width: "100%",
  },
  bottomButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.sm,
    
  },
  buttonText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.base,
    fontFamily: "NunitoSans"
  },
  icon: {
    ...spacingStyles.p5,
    borderRadius: borderRadius.circle,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.primaryBlue,
  },
});
