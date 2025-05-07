import { View, Text, StyleSheet, Image } from "react-native";
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
import images from "@/constants/images";
import staticColors from "@/style/staticColors";

export default function CreateNewPassword() {
  const { errors, handlePasswordValidation, handleConfirmPasswordMatch } =
    useFieldValidation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Get email and code from global state 
  const { resetEmail: email, resetCode: code, loading } = useAppSelector((state) => state.auth);

  const handleChange = (field: "newPassword" | "confirmPassword", value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "newPassword") {
      handlePasswordValidation(value);
      if (formState.confirmPassword) {
        handleConfirmPasswordMatch(value, formState.confirmPassword);
      }
    } else {
      handleConfirmPasswordMatch(formState.newPassword, value);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(
        resetPassword({
          email: email!.trim(),
          code: code!.toString().trim(),
          password: formState.newPassword,
          password_confirmation: formState.confirmPassword,
        })
      ).unwrap();
      router.push("/categories");
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={images.logo} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={textStyles.title}>Create New Password</Text>
      <Text style={styles.infoText}>
        Your new password must be different from previously used password.
      </Text>

      <View style={styles.inputGroup}>
        <PasswordField
          label="Enter New Password"
          value={formState.newPassword}
          onChangeText={(text) => handleChange("newPassword", text)}
          error={errors.password}
        />
        <PasswordField
          label="Confirm Password"
          value={formState.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          error={errors.confirmPassword}
        />
      </View>
      <Button
        title="Save"
        onPress={handleSubmit}
        style={{ width: "90%" }}
        loading={loading}
      />
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
    backgroundColor: staticColors.LightSkyBlue,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.mb10,
  },
  image: {
    width: 80,
    height: 90,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: staticColors.LightSkyBlue,
    textAlign: "center",
    width: "80%",
    ...spacingStyles.mb20,
    fontFamily: "Helvetica",
    lineHeight: 20,
  },
  inputGroup: {
    width: "90%",
  },
});
