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
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import colors from "@/style/staticColors";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import fontSizes from "@/style/fontSizes";
import images from "@/constants/images";
import gapSizes from "@/style/gapSizes";
import { pickImages } from "@/utils/imagePicker";

const { height } = Dimensions.get("window");
interface UserData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female" | null;
  selectedImage: string | null;
}
const UserInformationScreen = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: null,
    selectedImage: null,
  });

  const pickImage = async () => {
    const uri = await pickImages();
    if (uri) {
      setUserData((prevData) => ({
        ...prevData,
        selectedImage: uri,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={[`${staticColors.indigoNavy}`, `${staticColors.ceruleanBlue}`]}
        style={styles.topCurve}
      >
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
            <FontAwesome name="user" size={50} color={staticColors.softGray} />
          </View>
        )}
        <Text style={styles.uploadText}>Tap to upload your image</Text>
      </TouchableOpacity>

      <View style={styles.rowInput}>
        <View style={styles.textContainer}>
          <TextField
            label="First Name *"
            value={userData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
          />
        </View>

        <View style={styles.textContainer}>
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
          onPress={() => handleInputChange("gender", "male")}
          style={[
            styles.card,
            userData.gender === "male" && styles.selectedCard,
          ]}
        >
          <Image source={images.genderMale} style={styles.cardImage} />
          <Text style={styles.cardText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleInputChange("gender", "female")}
          style={[
            styles.card,
            userData.gender === "female" && styles.selectedCard,
          ]}
        >
          <Image source={images.genderFemale} style={styles.cardImage} />

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
    backgroundColor: colors.white,
    alignItems: "center",
    ...spacingStyles.px25,
    paddingTop: height * 0.18,
    minHeight: "100%",
  },
  topCurve: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: -1,
    justifyContent: "center",
    alignItems: "center",
  },
  accountText: {
    fontSize: fontSizes["2xl"],
    fontWeight: "bold",
    color: colors.white,
  },
  avatarWrapper: {
    alignItems: "center",
    ...spacingStyles.mb15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    ...spacingStyles.mb10,
    borderWidth: 2,
    borderColor: colors.textLightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: staticColors.textLightGray,
  },
  uploadText: {
    fontSize: fontSizes.sm,
    color: staticColors.textLightGray,
    ...spacingStyles.mb10,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: colors.textLightGray,
    borderStyle: "dotted",
  },
  textContainer: {
    flex: 1,
  },
  rowInput: {
    flexDirection: "row",
    width: "100%",
    gap: gapSizes.lg,
  },
  buttonWrapper: {
    width: "80%",
  },
  label: {
    fontWeight: "600",
    ...spacingStyles.mb10,
    alignSelf: "flex-start",
    color: staticColors.darkGray,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: gapSizes.lg,
    ...spacingStyles.mb20,
    width: "100%",
  },

  card: {
    flex: 1,
    alignItems: "center",
    ...spacingStyles.py15,
    borderWidth: 1,
    borderColor: staticColors.lightGray,
    borderRadius: 12,
    backgroundColor: colors.white,
  },

  selectedCard: {
    borderColor: staticColors.primary,
    backgroundColor: staticColors.lightGreen,
  },

  cardImage: {
    width: 60,
    height: 55,
   ...spacingStyles.mb10,
    resizeMode: "contain",
  },

  cardText: {
    fontSize: fontSizes.sm,
    color: staticColors.textSecondary,
    fontFamily: "HelveticaBold",
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    ...spacingStyles.mt10,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    borderStyle: "dotted",
  },
  helpText: {
    marginTop: -5,
    fontSize: fontSizes.sm,
    color: staticColors.darkGray,
  },
  helpLink: {
    marginTop: -5,
    color: staticColors.linkDefault,
    fontWeight: "bold",
  },
});
