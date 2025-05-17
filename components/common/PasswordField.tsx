import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";

interface PasswordFieldProps extends TextInputProps {
  label?: string;
  value?: string;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  style,
  value,
  error,
  onFocus,
  onBlur,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const isFloating = isFocused || !!value;

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            isFloating ? styles.labelFloating : styles.labelStatic,
            isFocused && styles.labelFocused,
            error && styles.labelError, 
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            style,
            isFocused && styles.inputFocused,
            error && styles.inputError, 
            label && { paddingTop: 12 },
          ]}
          secureTextEntry={!showPassword}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={18}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default PasswordField;

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.mb10,
    position: "relative",
    width: "100%",
  },
  label: {
    position: "absolute",
    left: 12,
    color: staticColors.textLightGray,
    backgroundColor: staticColors.white,
    zIndex: 1,
    paddingHorizontal: 4,
  },
  labelStatic: {
    top: 12,
    fontSize:fontSizes.sm
  },
  labelFloating: {
    top: -8,
    fontSize: fontSizes.sm,
    fontWeight: "bold",
  },
  labelFocused: {
    color: staticColors.primary,
    fontWeight: "bold",
  },
  labelError: {
    color: "red", 
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: 6,
    ...spacingStyles.p10,
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    fontSize: fontSizes.sm,
     color:staticColors.textDarkGray
  },
  inputFocused: {
    borderColor: staticColors.primary,
  },
  inputError: {
    borderColor: staticColors.errorColor, 
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.sm,
    ...spacingStyles.mt5,
  },
});
