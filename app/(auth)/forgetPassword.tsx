import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import CreateNewPassword from "@/components/auth/CreateNewPassword";
import TextField from "@/components/common/TextField";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import {
  clearAuthError,
  sendEmailCode,
  setResetCode,
  setResetEmail,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import colors from "@/style/staticColors";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import images from "../../constants/images";
import gapSizes from "@/style/gapSizes";
import fontSizes from "@/style/fontSizes";
import OTPInput from "@/components/common/OtpInput";

export default function ForgetPassword() {
  const router = useRouter();
  const { errors, handleEmailValidation } = useFieldValidation();
  const [currentStage, setCurrentStage] = useState<
    "email" | "otp" | "password"
  >("email");
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.auth);

  const handleStepBack = () => {
    if (currentStage === "otp") {
      setCurrentStage("email");
      dispatch(clearAuthError());
    } else {
      router.back();
    }
  };

  const onEmailChange = (text: string) => {
    setEmail(text);
    handleEmailValidation(text);
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleConfirmEmail = async () => {
    handleEmailValidation(email);
    if (!email.trim() || errors.email) return;

    try {
      await dispatch(sendEmailCode(email)).unwrap();
      setCurrentStage("otp");
    } catch (error) {
      console.error("Failed to send email code", error);
    }
  };

  const handleVerifySuccess = (enteredOtp: string) => {
    dispatch(setResetEmail(email));
    dispatch(setResetCode(enteredOtp));
    setCurrentStage("password");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacer} />
      <View style={styles.innerContainer}>
        {currentStage === "email" && (
          <>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Reset Password</Text>
            <TextField
              label="Enter your Email"
              onChangeText={onEmailChange}
              keyboardType="email-address"
              error={errors.email || error || undefined}
              value={email}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleStepBack}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmEmail}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.confirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {currentStage === "otp" && (
          <>
            <Image
              source={images.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={textStyles.title}>Verification</Text>
            </View>
            <OTPInput
              email={email}
              onVerifySuccess={handleVerifySuccess}
              onStepBack={handleStepBack}
              cancelText="Cancel"
              confirmText="Verify"
            />
          </>
        )}

        {currentStage === "password" && <CreateNewPassword />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  spacer: {
    height: 40,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    ...spacingStyles.px25,
    ...spacingStyles.mt20,
  },
  logo: {
    width: 120,
    height: 150,
  },
  title: {
    ...textStyles.title,
    ...spacingStyles.mb25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: gapSizes.xl,
    ...spacingStyles.mt15,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.primary,
    fontFamily: "HelveticaBold",
  },
  confirmText: {
    color: colors.white,
    fontFamily: "HelveticaBold",
  },
});