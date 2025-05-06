import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Button } from "@/components/common/Button";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { useRouter } from "expo-router";
import PasswordField from "../common/PasswordField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword } from "@/store/auth/authSlice";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";

export default function CreateNewPassword() {
  const { errors, handlePasswordValidation, handlePasswordMatch } =
    useFieldValidation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { email, code } = useAppSelector((state) => ({
    email: state.auth.resetEmail || "",
    code: state.auth.resetCode || "",
  }));
  const { loading, error } = useAppSelector((state) => state.auth);

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    handlePasswordValidation(text);

    if (confirmPassword) {
      handlePasswordMatch(text, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    handlePasswordMatch(newPassword, text);
  };

  const handleSubmit = async () => {  
    try {
     await dispatch(
        resetPassword({
          email: email.trim(),
          code: code.toString().trim(),
          password: newPassword,
          password_confirmation: confirmPassword,
        })
      )
      .unwrap();
      router.push("/login");
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../../assets/images/favicon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={textStyles.title}>Create New Password</Text>
      <Text style={styles.infoText}>
        Your new password must be different from previously used password.
      </Text>

      <View style={styles.inputGroup}>
        <PasswordField
          label="Enter New Password"
          value={newPassword}
          onChangeText={handlePasswordChange}
          error={errors.password}
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />
      </View>
      <Button title="Save" onPress={handleSubmit} style={{ width: "90%" }} loading={loading}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    ...spacingStyles.mt20,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#CCDAF9",
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mb10
  },
  image: {
    width: 80,
    height: 90,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: "#555",
    textAlign: "center",
    width: "80%",
    ...spacingStyles.mb20,
    fontFamily: "Helvetica",
    lineHeight:20
  },
  inputGroup: {
    width: "90%",
  },
});
