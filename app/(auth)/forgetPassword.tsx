import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import CreateNewPassword from "@/components/auth/CreateNewPassword";
import TextField from "@/components/common/TextField";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import {
  clearAuthError,
  sendEmailCode,
  verifyEmailCode,
  setResetCredentials,
} from "@/store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import colors from "@/style/staticColors";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";

export default function ForgetPassword() {
  const router = useRouter();
  const { errors, handleEmailValidation } = useFieldValidation();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState(30);
  const [otpError, setOtpError] = useState("");
  const { error, sendCodeLoading, verifyCodeLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleCancel = () => {
    if (step === "otp") {
      setStep("email");
      setOtp(new Array(6).fill(""));
      setTimer(30);
      setOtpError("");
    } else {
      router.back();
    }
    dispatch(clearAuthError());
  };

  const onEmailChange = (text: string) => {
    setEmail(text);
    handleEmailValidation(text);
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleConfirmEmail = async () => {
    handleEmailValidation(email);
    if (!email.trim()) return;
    if (errors.email) return;

    try {
      await dispatch(sendEmailCode(email)).unwrap();
      setStep("otp");
    } catch (error) {
      console.error("Failed to send email code", error);
    }
  };

  const handleChangeOtp = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    if (otpError || error) {
      setOtpError("");
      dispatch(clearAuthError());
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      try {
        await dispatch(sendEmailCode(email)).unwrap();
        setTimer(30);
        setOtp(new Array(6).fill(""));
      } catch (err) {
        console.error("Failed to resend OTP:", err);
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("").trim();
    if (enteredOtp.length === 6) {
      try {
        await dispatch(verifyEmailCode({ email, code: enteredOtp })).unwrap();
        dispatch(setResetCredentials({ email, code: enteredOtp }));
        setStep("password");
      } catch (err) {
        setOtpError(err as string);
        setOtp(new Array(6).fill(""));
      }
    } else {
      setOtpError("Please enter the complete OTP");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacer} />
      <View style={styles.innerContainer}>
        {step === "email" && (
          <>
            <Image
              source={require("../../assets/images/favicon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Reset Password</Text>
            <TextField
              label="Enter your Email"
              onChangeText={onEmailChange}
              keyboardType="email-address"
              error={errors.email || error || undefined}
              value={email}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirmEmail}
                disabled={sendCodeLoading}
              >
                {sendCodeLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === "otp" && (
          <>
            <Image
              source={require("../../assets/images/favicon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={textStyles.title}>Verification</Text>
            <Text style={textStyles.subtitle}>
              Enter the code sent to your email
            </Text>
            <View style={styles.timerBox}>
              {timer > 0 ? (
                <Text style={styles.timerText}>Resend code in {timer}s</Text>
              ) : (
                <Text style={styles.timerText}>Resend code now</Text>
              )}
            </View>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[styles.otpBox, otpError && styles.otpError]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChangeOtp(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                />
              ))}
            </View>
            <Text style={styles.resendText}>
              Didn't get the code?{" "}
              <Text
                style={[styles.resendLink, timer > 0 && styles.disabledResend]}
                onPress={timer === 0 ? handleResend : undefined}
              >
                {sendCodeLoading ? (
                  <ActivityIndicator size={12} color="#ddd" />
                ) : (
                  <Text>Resend</Text>
                )}
              </Text>
            </Text>
            {(otpError || error) && (
              <Text style={styles.errorMessage}>{otpError || error}</Text>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleVerifyOtp}
                disabled={verifyCodeLoading}
              >
                {verifyCodeLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === "password" && <CreateNewPassword />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
  spacer: {
    height: 40,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    ...spacingStyles.px25,
  ...spacingStyles.mt20,
  },
  logo: {
    width: 120,
    height: 150,
  },
  title: {
    ...textStyles.title,
    ...spacingStyles.mb25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
    ...spacingStyles.mt15,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.lightColor,
  },
  confirmButton: {
    backgroundColor: colors.primaryColor,
  },
  cancelText: {
    color: colors.primaryColor,
    fontFamily: "HelveticaBold",
  },
  confirmText: {
    color: colors.whiteColor,
    fontFamily: "HelveticaBold",
  },
  timerBox: {
    alignItems: "center",
    ...spacingStyles.mt10,
  },
  timerText: {
    fontSize: 14,
    color: colors.backgroundMuted,
    fontWeight: "500",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.mt20,
    gap: 10,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
  },
  otpError: {
    borderColor: colors.errorColor,
  },
  resendText: {
    fontSize: 15,
    ...spacingStyles.my20,
    color: colors.backgroundMuted,
  },
  resendLink: {
    color: colors.linkColor,
    fontWeight: "600",
  },
  disabledResend: {
    color: colors.backgroundMuted,
  },
  errorMessage: {
    color: colors.errorColor,
    fontSize: 14,
    ...spacingStyles.mt10,
  },
});
