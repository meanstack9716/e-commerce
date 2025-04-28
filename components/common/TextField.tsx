import spacingStyles from "@/style/spacingStyles";
import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  Platform,
} from "react-native";
import staticColors from "@/style/staticColors";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  style,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
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
    <View style={styles.wrapper}>
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
        <TextInput
          {...props}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            style,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            label && { paddingTop: 12 },
          ]}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.mb10,
    width: "100%",
  },
  container: {
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 12,
    color: staticColors.lightGray,
    backgroundColor: staticColors.whiteColor,
    zIndex: 1,
   ...spacingStyles.px5
  },
  labelStatic: {
    top: 12,
    fontSize: 12,
  },
  labelFloating: {
    top: -8,
    fontSize: 13,
    fontWeight: "bold",
  },
  labelFocused: {
    color: staticColors.primaryColor,
    fontWeight: "bold",
  },
  labelError: {
    color: staticColors.errorColor,
  },
  input: {
    borderWidth: 1,
    borderColor: staticColors.lightColor,
    borderRadius: 6,
    ...spacingStyles.p10,
    paddingVertical: Platform.OS === "ios" ? 8 : 5,
    fontSize: 14,
  },
  inputFocused: {
    borderColor: staticColors.primaryColor,
  },
  inputError: {
    borderColor: staticColors.errorColor,
  },
  errorText: {
    ...spacingStyles.mt5,
    ...spacingStyles.ml5,
    color: staticColors.errorColor,
    fontSize: 13,
  },
});
  