import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import colors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import gapSizes from "@/style/gapSizes";
import textStyles from "@/style/textStyles";
import spacingStyles from "@/style/spacingStyles";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendEmailCode } from "@/store/auth/authSlice";
import { AppDispatch } from "@/store/store";
import { OtpInputProps } from "@/types/types";
import { OTP_RESEND_TIMER } from "@/constants/constants";

const OtpInput: React.FC<OtpInputProps> = ({
  email,
  onVerifySuccess,
  onStepBack,
  cancelText = "Cancel",
  confirmText = "Verify",
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(OTP_RESEND_TIMER);
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const dispatch: AppDispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (index === otp.length - 1) {
      Keyboard.dismiss();
    }

    if (otpError || error) {
      setOtpError("");
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      try {
        await dispatch(sendEmailCode(email)).unwrap();
        console.log("sdnjknsjdndsj")
        setTimer(OTP_RESEND_TIMER);
        setOtp(new Array(6).fill(""));
        setOtpError("");
      } catch (err) {
        setOtpError("Failed to resend OTP");
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("").trim();
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete OTP");
      return;
    }

    try {
      onVerifySuccess(enteredOtp);
    } catch (err) {
      setOtpError((err as string) || "Invalid OTP");
      setOtp(new Array(6).fill(""));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={textStyles.subtitle}>Enter the code sent to your email</Text>
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
            ref={(ref) => (inputsRef.current[index] = ref)}
            style={[styles.otpBox, otpError && styles.otpError]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>
      <Text style={styles.resendText}>
        Didn't get the code?{" "}
        <Text
          style={[styles.resendLink, timer > 0 && styles.disabledResend]}
          onPress={timer === 0 ? handleResend : undefined}
        >
          {loading ? (
            <ActivityIndicator size={12} color={colors.borderSecondaryLight} />
          ) : (
            "Resend"
          )}
        </Text>
      </Text>
      {(otpError || error) && (
        <Text style={styles.errorMessage}>{otpError || error}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onStepBack}
        >
          <Text style={[styles.cancelText]}>{cancelText}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={[styles.confirmText]}>{confirmText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  timerBox: {
    alignItems: "center",
    ...spacingStyles.mt10,
  },
  timerText: {
    fontSize: fontSizes.sm,
    color: colors.darkGray,
    fontWeight: "500",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...spacingStyles.mt20,
    gap: gapSizes.md,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: fontSizes.lg,
  },
  otpError: {
    borderColor: colors.errorColor,
  },
  resendText: {
    fontSize: fontSizes.sm,
    ...spacingStyles.my20,
    color: colors.darkGray,
  },
  resendLink: {
    color: colors.linkDefault,
    fontWeight: "600",
  },
  disabledResend: {
    color: colors.textLightGray,
  },
  errorMessage: {
    color: colors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mt10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: gapSizes.xl,
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
    backgroundColor: colors.lightGray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.primary,
    fontFamily: "HelveticaBold",
  },
  confirmText: {
    color: colors.white,
    fontFamily: "HelveticaBold",
  },
});
