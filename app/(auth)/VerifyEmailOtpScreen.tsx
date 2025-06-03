import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import {fontSizes, fontWeights} from "@/style/typography";
import OtpInput from "@/components/common/OtpInput";
import images from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyEmailCode, verifyUser } from "@/store/auth/authSlice";
import { SafeKeyboardView } from "@/components/common/SafeAreaViewComponent";

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
    <SafeKeyboardView >
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
    </SafeKeyboardView>
  );
};

export default VerifyEmailOtpScreen;

const styles = StyleSheet.create({
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
    fontWeight: fontWeights.semiBold,
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
    fontWeight:fontWeights.semiBold,
    color: colors.textDarkGray,
  },
});
