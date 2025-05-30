import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
    if (!email) {
      setFieldErrors({ ...errors });
      return;
    }
    if (!errors.password && password.trim()) {
      const resultAction = await dispatch(
        loginUser({
          email: email as string,
          password: password,
        })
      );
      if (loginUser.fulfilled.match(resultAction)) {
        router.navigate("/profile");
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
    <SafeAreaView style={styles.container}>
      <Image source={images.shape01} style={styles.shape1} />
      <Image source={images.shape02} style={styles.shape2} />

      <View style={commonStyles.contentContainer}>
        <Image source={images.avatar} style={commonStyles.avatar} />
        <Text style={styles.greeting}>Hello User !!</Text>

        <Text style={styles.label}>Type your password</Text>

        <TextInput
          style={[
            commonStyles.authInput,
            styles.input,
            errors.password && styles.errorInput,
          ]}
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            handleLoginPasswordValidation(text);
          }}
        />

        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        {loginError && <Text style={styles.errorText}>{loginError}</Text>}
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        {errors.apiError && (
          <Text style={styles.errorText}>{errors.apiError}</Text>
        )}

        <Button
          title="SUBMIT"
          onPress={handleSubmit}
          loading={loading}
          style={commonStyles.authButton}
        />

        <TouchableOpacity onPress={handleForgetPassword}>
          <Text style={styles.forgetPasswordText}>Forget your password?</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomButtonContainer, { bottom: insets.bottom }]}>
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
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shape1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    opacity: 1,
    resizeMode: "contain",
    zIndex: 1,
  },
  shape2: {
    position: "absolute",
    top: 0,
    left: -25,
    width: 320,
    height: 300,
    opacity: 1,
    resizeMode: "contain",
  },
  greeting: {
    fontSize: fontSizes["2xl"],
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    ...spacingStyles.mt25,
    textAlign: "center",
  },
  label: {
    fontSize: fontSizes.lg,
    fontFamily: "NunitoSans",
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
  input: {
    ...spacingStyles.mb25,
  },
  errorInput: {
    borderColor: staticColors.errorColor,
  },
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
  },
  bottomButtonContainer: {
    position: "absolute",
    ...spacingStyles.pb2,
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
    fontFamily: "NunitoSans",
  },
  icon: {
    ...spacingStyles.p5,
    borderRadius: borderRadius.circle,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: staticColors.primaryBlue,
  },
});
