import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import fontSizes from "@/style/fontSizes";
import OtpInput from "@/components/common/OtpInput";
import images from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyEmailCode, verifyUser } from "@/store/auth/authSlice";

const VerifyEmailOtpScreen = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const email = params.email ? String(params.email) : "";
  const dispatch = useAppDispatch();

  const handleVerifySuccess = async (otpCode: string) => {
    try {
      const result = await dispatch(
        verifyUser({ email, code: otpCode })
      ).unwrap();
      router.navigate("/profile");
    } catch (err) {
      console.log("Verification failed:", err);
    }
  };

  const handleStepBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />

        {/* Heading */}
        <Text style={styles.title}>Verify your Email</Text>
        <Text style={styles.subTitle}>
          We've sent an OTP to <Text style={styles.highlight}>{email}</Text>
        </Text>

        {/* OTP Input Component */}
        <OtpInput
          email={email}
          onVerifySuccess={handleVerifySuccess}
          onStepBack={handleStepBack}
          cancelText="Back"
          confirmText="Continue"
        />
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailOtpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    ...spacingStyles.mt25,
    ...spacingStyles.px25,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 100,
    ...spacingStyles.mt25,
    ...spacingStyles.mb10,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: "bold",
    ...spacingStyles.mb5,
    textAlign: "center",
  },
  subTitle: {
    fontSize: fontSizes.base,
    textAlign: "center",
    ...spacingStyles.mb10,
    color: colors.darkGray,
  },
  highlight: {
    fontWeight: "bold",
    color: colors.textDarkGray,
  },
});
