import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthError, loginUser } from "@/store/auth/authSlice";
import TextField from "@/components/common/TextField";
import PasswordField from "@/components/common/PasswordField";
import { Button } from "@/components/common/Button";
import { Ionicons } from "@expo/vector-icons";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import images from "@/constants/images";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onSignupPress: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginModal: React.FC<LoginModalProps> = ({
  visible,
  onClose,
  onSignupPress,
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const { error, loading } = useAppSelector((state) => state.auth);
  const {
    errors,
    handleEmailValidation,
    handleLoginPasswordValidation,
    resetErrors,
  } = useFieldValidation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleInputChange = (
    field: "email" | "password",
    text: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: text }));

    if (field === "email") {
      handleEmailValidation(text);
    } else if (field === "password") {
      handleLoginPasswordValidation(text);
    }
  };

  const handleLoginPress = async (): Promise<void> => {
    handleEmailValidation(formData.email);
    handleLoginPasswordValidation(formData.password);
    const hasErrors = !!(errors.email || errors.password);
    const allFieldsFilled = formData.email && formData.password;

    if (!hasErrors && allFieldsFilled) {
      const resultAction = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      );
      if (loginUser.fulfilled.match(resultAction)) {
        onClose();
        router.push({
          pathname: "/VerifyEmailOtpScreen",
          params: { email: formData.email },
        });
      }
    }
  };

  const handleForgetPress = (): void => {
    onClose();
    router.push("/forgetPassword");
    dispatch(clearAuthError());
  };
  useEffect(() => {
    if (!visible) {
      setFormData({ email: "", password: "" });
      resetErrors();
      dispatch(clearAuthError());
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="none" transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons
                  name="close"
                  size={24}
                  color={staticColors.darkGray}
                />
              </TouchableOpacity>
              <Image
                source={images.logoBlue}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.subTitle}>Login to your account</Text>

              <TextField
                label="Enter your Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                error={errors.email}
              />

              <PasswordField
                label="Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                error={errors.password}
              />
              {error && <Text style={styles.apiError}>{error}</Text>}

              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  style={styles.rememberMeContainer}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked,
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkmark}>✔</Text>}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgetPress}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                title="LOGIN"
                onPress={handleLoginPress}
                loading={loading}
              />

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={onSignupPress}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.helpContainer}>
                <Text style={styles.signupText}>
                  Having trouble logging in?
                </Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.signupLink}>Get help</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: staticColors.modalOverlayLight,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: staticColors.white,
    ...spacingStyles.p25,
    width: "100%",
    position: "relative",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  image: {
    width: "100%",
    height: 55,
    ...spacingStyles.mb5,
  },
  subTitle: {
    ...textStyles.subtitle,
    textAlign: "center",
  },

  errorInput: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mb10,
  },
  apiError: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mb15,
    textAlign: "left",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  checkmark: {
    color: staticColors.white,
    fontSize: fontSizes.xs,
  },
  checkboxChecked: {
    backgroundColor: staticColors.primary,
  },
  forgotPasswordText: {
    color: staticColors.linkPrimary,
    fontWeight: "600",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: staticColors.linkPrimary,
    borderRadius: 4,
    ...spacingStyles.mr5,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberMeText: {
    color: staticColors.textSecondary,
    fontSize: fontSizes.sm,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: staticColors.textSecondary,
  },
  signupLink: {
    color: staticColors.linkPrimary,
    fontWeight: "bold",
    ...spacingStyles.px5,
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    ...spacingStyles.mt5,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default LoginModal;
