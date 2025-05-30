import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button } from "@/components/common/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { commonStyles } from "@/style/commonStyle";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { getApiUrl } from "@/utils/apiUtils";
import Toast from "react-native-toast-message"; 

const Base_URL: React.FC = () => {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const loadApiUrl = async () => {
      const storedUrl = await getApiUrl();
      setApiUrl(storedUrl);
    };

    loadApiUrl();
  }, []);

  const handleSavePress = async () => {
    if (!apiUrl.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid URL",
      });
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
      console.error("Failed to save API URL to AsyncStorage:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save API URL",
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={commonStyles.authInput}
        placeholder="Enter Base URL..."
        value={apiUrl}
        onChangeText={setApiUrl}
      />
      <Button
        title="SAVE URL"
        onPress={handleSavePress}
        style={commonStyles.authButton}
      />
    </View>
  );
};

export default Base_URL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    ...spacingStyles.px20,
    backgroundColor: staticColors.white,
  },
});