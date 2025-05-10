import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Button } from "@/components/common/Button";
import { useRouter } from "expo-router";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import {
  clearAuthError,
  registerUser,
  resetRegistration,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import PasswordField from "@/components/common/PasswordField";
import TextField from "@/components/common/TextField";
import { Ionicons } from "@expo/vector-icons";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import images from "@/constants/images";

interface SignUpModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginPress: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  visible,
  onClose,
  onLoginPress,
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const {
    errors,
    handleEmailValidation,
    handlePasswordValidation,
    handleConfirmPasswordMatch,
    resetErrors,
  } = useFieldValidation();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, registered } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (registered) {
      onClose();
      router.push({
        pathname: "/VerifyEmailOtpScreen",
        params: { email: formData.email },
      });
      dispatch(resetRegistration());
    }
  }, [registered, onClose, router, dispatch, formData.email]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ): void => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (typeof value === "string") {
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
    }
  };

  const handleSignUp = (): void => {
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

    if (!hasErrors && allFieldsFilled && formData.termsAccepted) {
      dispatch(
        registerUser({
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        })
      );
    }
  };

  useEffect(() => {
    if (!visible) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
      resetErrors();
      dispatch(clearAuthError());
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.backdropTouchable}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <ScrollView
                  style={styles.container}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={staticColors.primary}
                    />
                  </TouchableOpacity>

                  <View>
                    <Image
                      source={images.logoBlue}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.subTitle}>
                      Sign up and shop your favourite brands, all in one place
                    </Text>

                    <TextField
                      label="Enter Your Email"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      keyboardType="email-address"
                      error={errors.email}
                    />

                    <PasswordField
                      label="Password"
                      value={formData.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                      error={errors.password}
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChangeText={(text) =>
                        handleInputChange("confirmPassword", text)
                      }
                      error={errors.confirmPassword}
                    />
                    {error && <Text style={styles.apiError}>{error}</Text>}

                    <TouchableOpacity
                      style={styles.termsContainer}
                      onPress={() =>
                        handleInputChange(
                          "termsAccepted",
                          !formData.termsAccepted
                        )
                      }
                    >
                      <View
                        style={[
                          styles.checkbox,
                          formData.termsAccepted && styles.checkboxChecked,
                        ]}
                      >
                        {formData.termsAccepted && (
                          <Text style={styles.checkmark}>✔</Text>
                        )}
                      </View>
                      <Text style={styles.termsText}>
                        By continuing, you confirm that you are above 18 years
                        of age, and you agree to our{" "}
                        <Text style={styles.link}>Terms of use</Text> and{" "}
                        <Text style={styles.link}>Privacy Policy</Text>.
                      </Text>
                    </TouchableOpacity>

                    <Button
                      title="Sign Up"
                      onPress={handleSignUp}
                      disabled={!formData.termsAccepted || loading}
                      loading={loading}
                      style={
                        !formData.termsAccepted || loading
                          ? styles.disabledButton
                          : {}
                      }
                    />

                    <View style={styles.signupContainer}>
                      <Text style={styles.signupText}>
                        Already have an account?
                      </Text>
                      <TouchableOpacity onPress={onLoginPress}>
                        <Text style={styles.signupLink}> Login</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: staticColors.modalOverlayLight,
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    backgroundColor: staticColors.white,
  },
  scrollContent: {
    ...spacingStyles.p25,
  },
  image: {
    width: "100%",
    height: 55,
    ...spacingStyles.mb5,
  },
  subTitle: {
    ...textStyles.subtitle,
    textAlign: "center",
    fontSize: fontSizes.xs,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: staticColors.linkPrimary,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: staticColors.primary,
  },
  checkmark: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
  },
  termsText: {
    fontSize: fontSizes.xs,
    color: staticColors.darkGray,
    flexShrink: 1,
  },
  link: {
    color: staticColors.linkPrimary,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    ...spacingStyles.mb10,
  },
  signupText: {
    color: staticColors.textSecondary,
  },
  signupLink: {
    color: staticColors.linkPrimary,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  apiError: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    marginTop: -10,
    textAlign: "left",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default SignUpModal;
