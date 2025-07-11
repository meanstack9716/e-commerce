import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Button } from "@/components/common/Button";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { getApiUrl } from "@/utils/apiUtils";
import borderRadius from "@/style/borderRadius";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";
import { fontSizes } from "@/style/typography";

const BaseURL: React.FC = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

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
    <SafeAreaViewWrapper>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={20} color={staticColors.black} />
      </TouchableOpacity>
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
    </SafeAreaViewWrapper>
  );
};

export default BaseURL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: staticColors.white,
    ...spacingStyles.px20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    ...spacingStyles.mt15,
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
    fontSize: fontSizes.sm,
    ...spacingStyles.mt5,
    ...spacingStyles.mb10,
    ...spacingStyles.px20,
  },
});
