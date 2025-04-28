import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import TextField from "@/components/common/TextField";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/components/common/Button";
import { FontAwesome } from "@expo/vector-icons";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";

const { height } = Dimensions.get("window");

const UserInformationScreen = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: null as "male" | "female" | null,
    selectedImage: null as string | null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setUserData((prevData) => ({
        ...prevData,
        selectedImage: result.assets[0].uri,
      }));
    }
  };

  const handleContinue = () => {
    alert("Continue pressed!");
    console.log("User Data:", userData);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectionChange = (field: "gender", value: "male" | "female") => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#242555", "#1B7CA5"]} style={styles.topCurve}>
        <Text style={styles.accountText}>Account Details!</Text>
      </LinearGradient>

      <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
        {userData.selectedImage ? (
          <Image
            source={{ uri: userData.selectedImage }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.iconWrapper]}>
            <FontAwesome name="user" size={50} color="#ccc" />
          </View>
        )}
        <Text style={styles.uploadText}>Tap to upload your image</Text>
      </TouchableOpacity>

      <View style={styles.rowInput}>
        <View style={{ flex: 1 }}>
          <TextField
            label="First Name *"
            value={userData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TextField
            label="Last Name *"
            value={userData.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
          />
        </View>
      </View>

      <TextField
        label="Phone Number *"
        value={userData.phoneNumber}
        onChangeText={(value) => handleInputChange("phoneNumber", value)}
      />

      <Text style={styles.label}>Select Gender</Text>
      <View style={styles.cardRow}>
        <TouchableOpacity
          onPress={() => handleSelectionChange("gender", "male")}
          style={[
            styles.card,
            userData.gender === "male" && styles.selectedCard,
          ]}
        >
          <Image
            source={require("@/assets/images/images/gender-male.png")}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSelectionChange("gender", "female")}
          style={[
            styles.card,
            userData.gender === "female" && styles.selectedCard,
          ]}
        >
          <Image
            source={require("@/assets/images/images/gender-female.png")}
            style={styles.cardImage}
          />
          <Text style={styles.cardText}>Female</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Having trouble filling this out?</Text>
        <TouchableOpacity>
          <Text style={styles.helpLink}> Get help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserInformationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.whiteColor,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: height * 0.18,
    minHeight: "100%",
  },
  topCurve: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.25,
    backgroundColor: "#7881FC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
  accountText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.whiteColor,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.lightColor,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#f1f1f1",
  },
  uploadText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: colors.lightColor,
    borderStyle: "dotted",
  },
  rowInput: {
    flexDirection: "row",
    width: "100%",
    gap: 15,
  },
  buttonWrapper: {
    width: "80%",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    alignSelf: "flex-start",
    color: staticColors.cardTitleColor,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginBottom: 20,
    width: "100%",
  },

  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: colors.whiteColor,
  },

  selectedCard: {
    borderColor: "#232454",
    backgroundColor: "#E8F6FF",
  },

  cardImage: {
    width: 60,
    height: 55,
    marginBottom: 8,
    resizeMode: "contain",
  },

  cardText: {
    fontSize: 14,
    color: "#1A1651",
    fontFamily: "HelveticaBold",
  },

  dobPicker: {
    width: "100%",
    ...spacingStyles.p10,
    borderWidth: 1,
    borderColor:staticColors.lightColor,
    borderRadius: 10,
    marginBottom: 15,
  },

  dobText: {
    fontSize: 16,
    color:staticColors.cardTitleColor,
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    ...spacingStyles.mt10,
    borderBottomWidth: 1,
    borderColor: colors.lightColor,
    borderStyle: "dotted",
  },
  helpText: {
    marginTop: -5,
    fontSize: 13,
    color: "#878686",
  },
  helpLink: {
    marginTop: -5,
    color: "#232454",
    fontWeight: "bold",
  },
});


