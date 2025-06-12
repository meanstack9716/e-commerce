import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import staticColors from "@/style/staticColors";
import borderRadius from "@/style/borderRadius";
import spacingStyles from "@/style/spacingStyles";
import { fontSizes, fontWeights } from "@/style/typography";
import { TextFieldWithLabelProps } from "./TextFieldWithLabel.types";

const TextFieldWithLabel: React.FC<TextFieldWithLabelProps> = ({
  label,
  placeholder,
  errorMessage,
  value,
  field,
  isNumeric,
  isEditable = true,
  maxLength,
  onChangeText,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, errorMessage && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={staticColors.textSecondary}
        value={value}
        editable={isEditable}
        {...(isNumeric ? { keyboardType: "numeric" } : {})}
        {...(isNumeric && maxLength ? { maxLength } : {})}
        onChangeText={(text) => onChangeText(field, text)}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    ...spacingStyles.pt10,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    ...spacingStyles.mb8,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.inputBg,
    borderRadius: borderRadius.r8,
    backgroundColor: staticColors.inputBg,
    ...spacingStyles.pt10,
    ...spacingStyles.px10,
  },
  disableInput: {
    backgroundColor: staticColors.white,
    color: staticColors.textDarkGray,
  },
  inputError: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt5,
    ...spacingStyles.mb10,
  },
});

export default TextFieldWithLabel;
