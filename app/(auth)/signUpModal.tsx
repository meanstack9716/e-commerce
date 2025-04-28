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
    handlePasswordMatch,
    resetErrors,
  } = useFieldValidation();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, registered } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (registered) {
      onClose();
      onLoginPress();
      dispatch(resetRegistration());
    }
  }, [registered, onClose, router, dispatch]);

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  
    if (typeof value === 'string') {
      switch (field) {
        case 'email':
          handleEmailValidation(value);
          break;
        case 'password':
          handlePasswordValidation(value);
          if (formData.confirmPassword) {
            handlePasswordMatch(value, formData.confirmPassword);
          }
          break;
        case 'confirmPassword':
          handlePasswordMatch(formData.password, value);
          break;
      }
    }
  
    if (field === 'termsAccepted') {
    
    }
  };
  

  const handleSignUp = (): void => {
    handleEmailValidation(formData.email);
    handlePasswordValidation(formData.password);
    handlePasswordMatch(formData.password, formData.confirmPassword);

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
                      color={staticColors.primaryColor}
                    />
                  </TouchableOpacity>

                  <View>
                    <Image
                      source={require("../../assets/images/logo-blue.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.subTitle}>
                      Sign up and shop your favourite brands, all in one place
                    </Text>

                    <TextField
                      label="Enter Your Email"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      keyboardType="email-address"
                      error={errors.email}
                    />

                    <PasswordField
                      label="Password"
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      error={errors.password}
                    />

                    <PasswordField
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleInputChange('confirmPassword', text)}
                      error={errors.confirmPassword}
                    />
                    {error && <Text style={styles.apiError}>{error}</Text>}

                    <TouchableOpacity
                      style={styles.termsContainer}
                      onPress={() => handleInputChange('termsAccepted', !formData.termsAccepted)}
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
    backgroundColor: staticColors.modalBackGround,
  },
  backdropTouchable: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: staticColors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  container: {
    width: "100%",
    backgroundColor: staticColors.whiteColor,
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
    fontSize: 13,
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
    borderColor: staticColors.linkPrimaryColor,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: staticColors.primaryColor,
  },
  checkmark: {
    color: staticColors.whiteColor,
    fontSize: 12,
  },
  termsText: {
    fontSize: 12.5,
    color: staticColors.cardTitleColor,
    flexShrink: 1,
  },
  link: {
    color: staticColors.linkPrimaryColor,
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
    color: staticColors.linkPrimaryColor,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  apiError: {
    color: staticColors.errorColor,
    fontSize: 13,
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
