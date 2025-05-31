import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "@/style/commonStyle";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
import gapSizes from "@/style/gapSizes";

interface PasswordTextFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const PasswordTextField: React.FC<PasswordTextFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[commonStyles.authInput, error && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor={staticColors.mutedGray}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={fontSizes.md}
            color={staticColors.CharcoalGray}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    gap: gapSizes.md,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  inputError: {
    borderColor: staticColors.errorColor,
    borderWidth: 1,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    marginTop: gapSizes.xs,
  },
});

export default PasswordTextField;
