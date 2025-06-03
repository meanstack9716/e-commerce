import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import images from "@/constants/images";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes } from "@/style/typography";
import OtpInput from "@/components/common/OtpInput";
import { useAppDispatch } from "@/store/hooks";
import { verifyUser, verifyEmailCode } from "@/store/auth/authSlice";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaViewWrapper";
import { fontFamilies } from "@/style/fontFamilies";
import staticColors from "@/style/staticColors";

const OtpConfirmationScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const email = params.email ? String(params.email) : "";
  const useCase = params.useCase ? String(params.useCase) : "";
  const dispatch = useAppDispatch();

  const onVerifySuccess = async (otpCode: string) => {
    try {
      if (useCase === "create-account") {
        const result = await dispatch(
          verifyUser({ email, code: otpCode })
        ).unwrap();
        router.navigate("/OnboardingScreen");
      } else if (useCase === "password-recovery") {
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
    <SafeAreaViewWrapper>
      <View style={commonStyles.topRightImages}>
        <Image source={images.OtpCnfrmPwdNewPwd1} style={commonStyles.shape5} />
        <Image source={images.OtpCnfrmPwdNewPwd2} style={commonStyles.shape6} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
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
      </ScrollView>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    ...spacingStyles.px20,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: fontFamilies.ralewayExtraBold,
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
});

export default OtpConfirmationScreen;
