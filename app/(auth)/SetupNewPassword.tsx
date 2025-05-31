import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/auth/authSlice";
import images from "@/constants/images";
import { commonStyles } from "@/style/commonStyle";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import spacingStyles from "@/style/spacingStyles";
import gapSizes from "@/style/gapSizes";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { Button } from "@/components/common/Button";
import { SafeKeyboardView } from "@/components/common/SafeKeyboardView";
import { fontFamilies } from "@/style/fontFamilies";

const SetupNewPassword: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { errors, handlePasswordValidation, handleConfirmPasswordMatch } =
    useFieldValidation();
  const { error, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams();
  const [formState, setFormState] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = params.email ? String(params.email) : null;
  const code = params.code ? String(params.code) : null;

  const handleChange = (
    field: "password" | "confirmPassword",
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "password") {
      handlePasswordValidation(value);
      if (formState.confirmPassword) {
        handleConfirmPasswordMatch(value, formState.confirmPassword);
      }
    } else {
      handleConfirmPasswordMatch(formState.password, value);
    }
  };

  const handleSubmit = async () => {
    handlePasswordValidation(formState.password);
    handleConfirmPasswordMatch(formState.password, formState.confirmPassword);

    if (errors.password || errors.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Please fix the errors in the form",
        position: "top",
      });
      return;
    }

    if (!email || !code) {
      Toast.show({
        type: "error",
        text1: "Missing email or verification code",
        position: "top",
      });
      return;
    }

    try {
      await dispatch(
        resetPassword({
          email: email.trim(),
          code: code.trim(),
          password: formState.password,
          password_confirmation: formState.confirmPassword,
        })
      ).unwrap();
      Toast.show({
        type: "success",
        text1: "Password reset successfully",
        position: "top",
      });
      router.navigate("/profile");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.message || "Failed to reset password",
        position: "top",
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeKeyboardView keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 40 : 0}>
      <View style={styles.absoluteShapesContainer} pointerEvents="none">
        <Image source={images.OtpCnfrmPwdNewPwd1} style={commonStyles.shape5} />
        <Image source={images.OtpCnfrmPwdNewPwd2} style={commonStyles.shape6} />
      </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <Image source={images.avatar} style={commonStyles.avatar} />
            <Text style={styles.title}>Setup New Password</Text>
            <Text style={styles.subtitle}>
              Please, setup a new password for{"\n"}your account
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    commonStyles.authInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="New Password"
                  placeholderTextColor={staticColors.mutedGray}
                  secureTextEntry={!showNewPassword}
                  value={formState.password}
                  onChangeText={(text) => handleChange("password", text)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye" : "eye-off"}
                    size={fontSizes.md}
                    color={staticColors.CharcoalGray}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    commonStyles.authInput,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Repeat Password"
                  placeholderTextColor={staticColors.mutedGray}
                  secureTextEntry={!showConfirmPassword}
                  value={formState.confirmPassword}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
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
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>

          <View style={styles.bottomButtonContainer}>
            <Button
              title="Save"
              onPress={handleSubmit}
              style={commonStyles.authButton}
              loading={loading}
              textStyle={commonStyles.authButtonText}
            />
            <TouchableOpacity onPress={handleCancel} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </SafeKeyboardView>
  )
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    ...spacingStyles.px20,
  },
  contentContainer: {
    justifyContent: "center",
    ...spacingStyles.mt25,
    ...spacingStyles.pt20,
  },
  absoluteShapesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.nunitoSans,
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb20,
  },
  inputContainer: {
    width: "100%",
    ...spacingStyles.mt5,
    ...spacingStyles.mb25,
    flexDirection: "column",
    gap: gapSizes.md,
  },
  inputWrapper: {
    position: "relative",
  },
  inputError: {
    borderColor: staticColors.errorColor,
    borderWidth: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
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

  bottomButtonContainer: {
    ...spacingStyles.py25,
    width: "100%",
    ...spacingStyles.pb20,
  },
});

export default SetupNewPassword;
