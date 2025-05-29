import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import images from "@/constants/images";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import borderRadius from "@/style/borderRadius";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendEmailCode } from "@/store/auth/authSlice";

export default function PasswordRecoveryScreen() {
  const [selectedOption, setSelectedOption] = useState<"Email" | null>(null);
  const { loading } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { email } = useLocalSearchParams();
  const handleNextPress = async () => {
    if (!selectedOption) {
      Toast.show({
        type: "error",
        text1: "Please select an option",
        position: "top",
      });
      return;
    }

    try {
      const resultAction = await dispatch(sendEmailCode(email as string));
      if (sendEmailCode.fulfilled.match(resultAction)) {
        router.navigate({
          pathname: "/OtpConfirmationScreen",
          params: { email: email as string, source: "password-recovery" },
        });
      } else {
        Toast.show({
          type: "error",
          text1: (resultAction.payload as string) || "Failed to send code",
          position: "top",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
        position: "top",
      });
    }
  };

  const handleCancelButton = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={commonStyles.topRightImages}>
        <Image source={images.shape05} style={commonStyles.shape5} />
        <Image source={images.shape06} style={commonStyles.shape6} />

        <View style={commonStyles.contentContainer}>
          <Image source={images.avatar} style={commonStyles.avatar} />

          <Text style={styles.title}>Password Recovery</Text>
          <Text style={styles.subtitle}>
            How you would like to restore{"\n"}your password?
          </Text>

          <TouchableOpacity
            style={[
              styles.optionContainer,
              selectedOption === "Email" && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption("Email")}
          >
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.optionText,
                  selectedOption === "Email" && styles.selectedOptionText,
                ]}
              >
                Email
              </Text>
            </View>
            <View style={commonStyles.radioOuter}>
              {selectedOption === "Email" && (
                <View style={commonStyles.radioInner} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={[commonStyles.bottomContainer, { bottom: insets.bottom }]}>
          <TouchableOpacity
            style={commonStyles.authButton}
            onPress={handleNextPress}
          >
            {loading ? (
              <ActivityIndicator size="small" color={staticColors.white} />
            ) : (
              <Text style={commonStyles.authButtonText}>Next</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <View style={commonStyles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  title: {
    fontSize: fontSizes.lg,
    fontFamily: "RalewayeExtraBold",
    color: staticColors.darkSlate,
    ...spacingStyles.my15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.md,
    fontFamily: "NunitoSans",
    color: staticColors.black,
    textAlign: "center",
    ...spacingStyles.mb20,
  },
  optionContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: staticColors.lightRose,
    ...spacingStyles.p15,
    borderRadius: borderRadius.circle,
    width: "85%",
    justifyContent: "space-between",
    ...spacingStyles.mb10,
    borderColor: "transparent",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: staticColors.iceBlue,
  },
  optionText: {
    fontSize: fontSizes.sm,
    color: staticColors.black,
    fontWeight: fontWeights.medium,
  },
  selectedOptionText: {
    color: staticColors.primaryBlue,
    fontWeight: fontWeights.bold,
  },
  cancelButton: {
    marginVertical: 10,
  },
  cancelText: {
    color: staticColors.darkSlate,
    fontSize: fontSizes.sm,
    textAlign: "center",
    ...spacingStyles.mt10,
    ...spacingStyles.mb20,
  },
});
