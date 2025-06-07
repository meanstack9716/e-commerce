import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import {
  fetchUserProfile,
  resetState,
  updateProfile,
  updateProfilePicture,
} from "@/store/user/userSlice";
import * as ImagePicker from "expo-image-picker";
import borderRadius from "@/style/borderRadius";
import { fontFamilies } from "@/style/fontFamilies";
import gapSizes from "@/style/gapSizes";
import spacingStyles from "@/style/spacingStyles";
import staticColors from "@/style/staticColors";
import { fontSizes, fontWeights } from "@/style/typography";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaViewWrapper } from "@/components/common/SafeAreaView/SafeAreaViewWrapper";

export const pickImages = async (
  setShowImagePickerModal: (value: boolean) => void,
  setProfilePicLoading: (value: boolean) => void,
  source: "camera" | "gallery" | "cancel",
  dispatch: ReturnType<typeof useAppDispatch>
): Promise<string[]> => {
  return new Promise((resolve) => {
    if (source === "cancel") {
      setShowImagePickerModal(false);
      resolve([]);
      return;
    }

    if (source === "camera") {
      ImagePicker.requestCameraPermissionsAsync().then((cameraPermission) => {
        if (cameraPermission.granted) {
          ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          }).then(async (result) => {
            if (!result.canceled && result.assets?.length > 0) {
              const uri = result.assets[0].uri;
              const mimeType = result.assets[0].mimeType || "image/jpeg";
              const fileName = uri.split("/").pop() || "profile.jpg";
              const formData = new FormData();
              formData.append("image", {
                uri,
                name: fileName,
                type: mimeType,
              } as any);
              setProfilePicLoading(true);
              await dispatch(updateProfilePicture(formData)).unwrap();
              resolve([uri]);
            } else {
              resolve([]);
            }
            setShowImagePickerModal(false);
            setProfilePicLoading(false);
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "Camera permission is required to take a photo.",
          });
          resolve([]);
          setShowImagePickerModal(false);
        }
      });
    } else if (source === "gallery") {
      ImagePicker.requestMediaLibraryPermissionsAsync().then(
        (mediaLibraryPermission) => {
          if (mediaLibraryPermission.granted) {
            ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsMultipleSelection: false,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            }).then(async (result) => {
              if (!result.canceled && result.assets?.length > 0) {
                const uri = result.assets[0].uri;
                const mimeType = result.assets[0].mimeType || "image/jpeg";
                const fileName = uri.split("/").pop() || "profile.jpg";
                const formData = new FormData();
                formData.append("image", {
                  uri,
                  name: fileName,
                  type: mimeType,
                } as any);
                setProfilePicLoading(true);
                await dispatch(updateProfilePicture(formData)).unwrap();
                resolve([uri]);
              } else {
                resolve([]);
              }
              setShowImagePickerModal(false);
              setProfilePicLoading(false);
            });
          } else {
            Toast.show({
              type: "error",
              text1: "Permission Denied",
              text2: "Gallery permission is required to select an image.",
            });
            resolve([]);
            setShowImagePickerModal(false);
          }
        }
      );
    }
  });
};

export default function UserManageAccount() {
  const dispatch = useAppDispatch();
  const [initialLoad, setInitialLoad] = useState(true);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [profilePicLoading, setProfilePicLoading] = useState(false);

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
    dispatch(resetState());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profile_url: user.profile_url || "",
      });
      setProfilePicLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (success && !initialLoad) {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
      dispatch(resetState());
    }
    setInitialLoad(false);
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });
      dispatch(resetState());
      setProfilePicLoading(false);
    }
  }, [error, dispatch]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDetails = () => {
    const { first_name, last_name, email, phone_number } = formData;
    if (
      first_name.trim() &&
      last_name.trim() &&
      email.trim() &&
      phone_number.trim()
    ) {
      dispatch(updateProfile(formData));
    } else {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all fields.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaViewWrapper style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={staticColors.darkGray}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Your Profile</Text>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              {profilePicLoading ? (
                <ActivityIndicator size="large" color="#005CFF" />
              ) : formData.profile_url ? (
                <Image
                  source={{ uri: formData.profile_url }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons name="person" size={40} color="#005CFF" />
              )}
            </View>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => setShowImagePickerModal(true)}
              disabled={profilePicLoading}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={formData.first_name}
            placeholder="First Name"
            onChangeText={(text) => handleChange("first_name", text)}
          />
          <TextInput
            style={styles.input}
            value={formData.last_name}
            placeholder="Last Name"
            onChangeText={(text) => handleChange("last_name", text)}
          />
          <TextInput
            style={styles.input}
            value={formData.email}
            placeholder="Email"
            editable={false}
          />
          <TextInput
            style={styles.input}
            value={formData.phone_number}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("phone_number", text)}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSaveDetails}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showImagePickerModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImagePickerModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an option</Text>

            <View style={styles.rowOptions}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={async () => {
                  await pickImages(
                    setShowImagePickerModal,
                    setProfilePicLoading,
                    "camera",
                    dispatch
                  );
                }}
              >
                <Ionicons
                  name="camera"
                  size={20}
                  color="#005CFF"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={async () => {
                  await pickImages(
                    setShowImagePickerModal,
                    setProfilePicLoading,
                    "gallery",
                    dispatch
                  );
                }}
              >
                <Ionicons
                  name="image"
                  size={20}
                  color="#005CFF"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaViewWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: staticColors.white,
  },
  container: {
    flex: 1,
    ...spacingStyles.p12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: gapSizes.lg,
    ...spacingStyles.mb25,
  },
  profileContainer: {
    ...spacingStyles.mb25,
    alignItems: "center",
  },
  heading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: staticColors.black,
  },
  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.circle,
    backgroundColor: staticColors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: staticColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.circle,
    backgroundColor: "#E5E4FD",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: borderRadius.r14,
    backgroundColor: "#005CFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: staticColors.white,
  },
  inputContainer: {
    gap: 16,
    ...spacingStyles.mb25,
  },
  input: {
    backgroundColor: "#F4F6FF",
    ...spacingStyles.p15,
    borderRadius: borderRadius.r10,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.raleway,
    borderWidth: 1,
    borderColor: "#E5E4FD",
  },
  saveButton: {
    backgroundColor: "#005CFF",
    ...spacingStyles.py15,
    borderRadius: borderRadius.r12,
    alignItems: "center",
    marginTop: "auto",
    ...spacingStyles.mb20,
  },
  saveButtonDisabled: {
    backgroundColor: "#99BFFF",
  },
  saveButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.ralewayBold,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.md,
    ...spacingStyles.my10,
    ...spacingStyles.px20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    ...spacingStyles.px20,
  },
  modalContent: {
    backgroundColor: staticColors.white,
    borderRadius: borderRadius.r16,
    ...spacingStyles.p20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    textAlign: "center",
    ...spacingStyles.mb20,
    color: staticColors.black,
  },
  modalCancelButton: {
    ...spacingStyles.py15,
  },
  modalCancelText: {
    textAlign: "center",
    fontSize: fontSizes.base,
    color: staticColors.DarkRed,
    fontWeight: fontWeights.bold,
  },
  rowOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: gapSizes.md,
    ...spacingStyles.mb15,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    ...spacingStyles.py10,
    backgroundColor: staticColors.blue100,
    borderRadius: borderRadius.r10,
  },
  optionIcon: {
    ...spacingStyles.mr5,
  },
  optionText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: staticColors.primaryBlue,
  },
});