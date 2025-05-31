import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Button } from "@/components/common/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { getApiUrl } from "@/utils/apiUtils";
import borderRadius from "@/style/borderRadius";

const BaseURL: React.FC = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadApiUrl = async () => {
      const storedUrl = await getApiUrl();
      setApiUrl(storedUrl);
    };

    loadApiUrl();
  }, []);

  const handleSavePress = async () => {
    setErrorMessage("");
    if (!apiUrl.trim()) {
      setErrorMessage("Please enter a valid URL");
      return;
    }
    try {
      await AsyncStorage.setItem("apiUrl", apiUrl);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "API URL updated!",
      });
    } catch (error) {
      setErrorMessage("Failed to save API URL");
    }
  };

  const handleClearPress = () => {
    setApiUrl("");
    setErrorMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={commonStyles.authInput}
        placeholder="Enter Base URL..."
        value={apiUrl}
        onChangeText={(text) => {
          setApiUrl(text);
          setErrorMessage("");
        }}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <Button
          title="SAVE URL"
          onPress={handleSavePress}
          style={commonStyles.authButton}
        />
        <Button
          title="CLEAR"
          onPress={handleClearPress}
          style={styles.clearButton}
          textStyle={styles.clearText}
        />
      </View>
    </View>
  );
};

export default BaseURL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    ...spacingStyles.px20,
    backgroundColor: staticColors.white,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    ...spacingStyles.mt15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: staticColors.lightGray,
    ...spacingStyles.py15,
    borderRadius: borderRadius.r16,
  },
  clearText: {
    color: staticColors.CharcoalGray,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
    ...spacingStyles.px20,
  },
});
