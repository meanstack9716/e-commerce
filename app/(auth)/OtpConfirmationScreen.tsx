import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import images from "@/constants/images";
import { commonStyles } from "@/style/commonStyle";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import OtpInput from "@/components/common/OtpInput";
import { fontSizes } from "@/style/typography";
import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { verifyUser, verifyEmailCode } from "@/store/auth/authSlice";

const OtpConfirmationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const email = params.email ? String(params.email) : "";
  const source = params.source ? String(params.source) : "";
  const dispatch = useAppDispatch();

  const onVerifySuccess = async (otpCode: string) => {
    try {
      if (source === "create-account") {
        const result = await dispatch(
          verifyUser({ email, code: otpCode })
        ).unwrap();
        router.navigate("/profile");
      } else if (source === "password-recovery") {
        const result = await dispatch(
          verifyEmailCode({ email, code: otpCode })
        ).unwrap();
        router.navigate({
          pathname: "/SetupNewPassword",
          params: { email, code: otpCode },
        });
      } else {
        throw new Error("Invalid source");
      }
    } catch (err) {}
  };

  const onStepBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={commonStyles.topRightImages}>
        <Image source={images.shape05} style={commonStyles.shape5} />
        <Image source={images.shape06} style={commonStyles.shape6} />
      </View>

      <View style={commonStyles.contentContainer}>
        <Image source={images.avatar} style={commonStyles.avatar} />
        <Text style={styles.title}>Password Recovery</Text>

        {/* OTP Input Component */}
        <OtpInput
          email={email}
          onVerifySuccess={onVerifySuccess}
          onStepBack={onStepBack}
          cancelText="Cancel"
        />
      </View>

      <View style={[commonStyles.bottomContainer, { bottom: insets.bottom }]}>
        <View style={commonStyles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
});

export default OtpConfirmationScreen;
