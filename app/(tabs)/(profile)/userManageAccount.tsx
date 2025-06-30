import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { router } from "expo-router";
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
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { KeyboardAvoidingViewWrapper } from "@/components/common/KeyboardAvoidingView/KeyboardAvoidingViewWrapper";

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

  const {
    errors,
    handleFieldChange,
    validateEmail,
    resetErrors,
    setFieldErrors,
    validateAllFields,
  } = useFieldValidation();

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
      setFieldErrors({ general: error });
      dispatch(resetState());
      setProfilePicLoading(false);
    }
  }, [error, dispatch, setFieldErrors]);

  const isValidName = (text: string) => /^[a-zA-Z\s]+$/.test(text);
  const isValidPhoneNumber = (text: string) => /^[0-9]{0,10}$/.test(text);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "first_name" || field === "last_name") {
      handleFieldChange(
        field,
        value,
        isValidName,
        `Invalid ${field === "first_name" ? "first" : "last"} name`
      );
    } else if (field === "email") {
      handleFieldChange(field, value, validateEmail, "Invalid email");
    } else if (field === "phone_number") {
      handleFieldChange(
        field,
        value,
        isValidPhoneNumber,
        "Invalid phone number"
      );
    }
  };

  const handleSaveDetails = () => {
    const { first_name, last_name, email, phone_number } = formData;
    const isValid = validateAllFields({
      first_name: {
        value: first_name,
        validator: isValidName,
        errorMessage: "Invalid first name",
      },
      last_name: {
        value: last_name,
        validator: isValidName,
        errorMessage: "Invalid last name",
      },
      email: {
        value: email,
        validator: validateEmail,
        errorMessage: "Invalid email",
      },
      phone_number: {
        value: phone_number,
        validator: isValidPhoneNumber,
        errorMessage: "Invalid phone number",
      },
    });

    if (isValid) {
      dispatch(updateProfile(formData));
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaViewWrapper style={styles.safeArea}>
      {/* <KeyboardAvoidingViewWrapper> */}
        <ScrollView>
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
                  <ActivityIndicator
                    size="large"
                    color={staticColors.primaryBlue}
                  />
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
                <Ionicons name="pencil" size={16} color={staticColors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View>
              <TextInput
                style={styles.input}
                value={formData.first_name}
                placeholder="First Name"
                onChangeText={(text) => handleChange("first_name", text)}
              />
              {errors.first_name ? (
                <Text style={styles.errorText}>{errors.first_name}</Text>
              ) : null}
            </View>
            <View>
              <TextInput
                style={styles.input}
                value={formData.last_name}
                placeholder="Last Name"
                onChangeText={(text) => handleChange("last_name", text)}
              />
              {errors.last_name ? (
                <Text style={styles.errorText}>{errors.last_name}</Text>
              ) : null}
            </View>
            <View>
              <TextInput
                style={styles.input}
                value={formData.email}
                placeholder="Email"
                editable={false}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            <View>
              <TextInput
                style={styles.input}
                value={formData.phone_number}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={(text) => handleChange("phone_number", text)}
              />
              {errors.phone_number ? (
                <Text style={styles.errorText}>{errors.phone_number}</Text>
              ) : null}
            </View>
          </View>

          {errors.general ? (
            <Text style={styles.errorText}>{errors.general}</Text>
          ) : null}

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
        </ScrollView>
      {/* </KeyboardAvoidingViewWrapper> */}
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
    backgroundColor: staticColors.borderLight,
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
    gap: gapSizes.lg,
  },
  input: {
    backgroundColor: staticColors.blue0,
    ...spacingStyles.p15,
    borderRadius: borderRadius.r10,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.raleway,
    borderWidth: 1,
    borderColor: staticColors.borderLight,
  },
  saveButton: {
    backgroundColor: staticColors.primaryBlue,
    ...spacingStyles.py15,
    borderRadius: borderRadius.r12,
    alignItems: "center",
    marginTop: "auto",
    ...spacingStyles.mt50,
    ...spacingStyles.mb15
  },
  saveButtonDisabled: {
    backgroundColor: staticColors.lightGray,
  },
  saveButtonText: {
    color: staticColors.white,
    fontSize: fontSizes.base,
    fontFamily: fontFamilies.ralewayBold,
  },
  errorText: {
    color: staticColors.errorColor,
    fontSize: fontSizes.xs,
    ...spacingStyles.mt10,
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
