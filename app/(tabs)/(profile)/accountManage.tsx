import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import TextField from "@/components/common/TextField";
import borderRadius from "@/style/borderRadius";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { updateProfile, resetState } from "@/store/user/userSlice";

const AccountScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success, user } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_url: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profile_url: user.profile_url || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
        visibilityTime: 3000,
      });
      const timer = setTimeout(() => {
        dispatch(resetState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveDetails = () => {
    const { first_name, last_name, email, phone_number } = formData;
    if (
      !first_name.trim() ||
      !last_name.trim() ||
      !email.trim() ||
      !phone_number.trim()
    )
      dispatch(updateProfile(formData));
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account");
  };

   const handleBack = () => {
     router.back();
   };
 
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Your Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextField
            label="First Name"
            value={formData.first_name}
            onChangeText={(value) => handleInputChange("first_name", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextField
            label="Last Name"
            value={formData.last_name}
            onChangeText={(value) => handleInputChange("last_name", value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextField
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextField
            label="Mobile Number"
            value={formData.phone_number}
            onChangeText={(value) => handleInputChange("phone_number", value)}
            keyboardType="phone-pad"
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveDetails}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={staticColors.white} />
          ) : (
            <Text style={styles.saveButtonText}>SAVE DETAILS</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  container: {
    flex: 1,
    ...spacingStyles.p15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb25,
    gap: gapSizes.md,
  },
  headerTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: staticColors.darkGray,
  },
  inputContainer: {
    ...spacingStyles.mb15,
    ...spacingStyles.px15,
  },
  saveButton: {
    backgroundColor: staticColors.primary,
    ...spacingStyles.p10,
    borderRadius: borderRadius.r4,
    alignItems: "center",
    ...spacingStyles.my25,
    ...spacingStyles.mx15,
  },
  saveButtonDisabled: {
    backgroundColor: staticColors.lightGray,
  },
  saveButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
  },
  deleteText: {
    color: staticColors.primary,
    fontSize: fontSizes.sm,
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.pt25,
    ...spacingStyles.mt10,
    borderTopWidth: 1,
    borderTopColor: staticColors.borderLight,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt5,
    textAlign: "center",
  },
});

export default AccountScreen;
