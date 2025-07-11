import React, { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import staticColors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import borderRadius from "@/style/borderRadius";
import { fontSizes, fontWeights } from "@/style/typography";
import gapSizes from "@/style/gapSizes";
import { useAppSelector } from "@/store/hooks";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

const ReferAndEarnScreen = () => {
  const user = useAppSelector((state) => state.auth.user);
  const referralCode = user?.referral_code;

  const [message, setMessage] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setMessage(null), 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!referralCode) return;
    try {
      await Clipboard.setStringAsync(referralCode);
      setCodeCopied(true)
      showMessage("Referral code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      showMessage("Failed to copy code", true);
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaViewWrapper>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={22} color={staticColors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Refer & Earn</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Ionicons
            name="gift-outline"
            size={80}
            color={staticColors.primary}
          />
        </View>

        <Text style={styles.title}>Refer now & earn up to 100 points 🎉🎉</Text>
        <Text style={styles.subText}>
          Send a referral link to your friends via SMS / Email / Whatsapp
        </Text>

        {referralCode ? (
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode}</Text>
            <TouchableOpacity onPress={handleCopy}>
              <Ionicons
                name={codeCopied ? "checkmark-circle-outline" : "copy-outline"}
                size={20}
                color={staticColors.linkPrimary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.codeBox, styles.disabledCodeBox]}>
            <Text style={[styles.codeText, styles.disabledCodeText]}>
              No referral code available
            </Text>
          </View>
        )}

        {message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
      </View>
    </SafeAreaViewWrapper>
  );
};

export default ReferAndEarnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...spacingStyles.px20,
    backgroundColor: staticColors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: gapSizes.sm,
    ...spacingStyles.m10,
  },
  headerText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
  },
  imageContainer: {
    ...spacingStyles.mb20,
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: staticColors.primaryBlue,
    textAlign: "center",
    ...spacingStyles.mb10,
  },
  subText: {
    fontSize: fontSizes.sm,
    color: staticColors.textDarkGray,
    textAlign: "center",
    ...spacingStyles.px20,
  },
  codeBox: {
    flexDirection: "row",
    backgroundColor: staticColors.bgSecondary,
    ...spacingStyles.py15,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    ...spacingStyles.mt30,
  },
  disabledCodeBox: {
    backgroundColor: staticColors.bgCardLight,
    justifyContent: "center",
  },
  codeText: {
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
    color: staticColors.primary,
  },
  disabledCodeText: {
    color: staticColors.textMuted,
  },
  messageBox: {
    ...spacingStyles.mt20,
    backgroundColor: staticColors.lightGreen50,
    ...spacingStyles.py10,
    ...spacingStyles.px20,
    borderRadius: borderRadius.r10,
  },
  messageText: {
    color: staticColors.lightGreen100,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
});
