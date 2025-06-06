import * as ImagePicker from "expo-image-picker";

export const pickImages = async (
  setShowImagePickerModal: (value: boolean) => void,
  source: "camera" | "gallery" | "cancel"
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
          }).then((result) => {
            if (!result.canceled && result.assets?.length > 0) {
              resolve(result.assets.map((asset) => asset.uri));
            } else {
              resolve([]);
            }
            setShowImagePickerModal(false);
          });
        } else {
          resolve([]);
          setShowImagePickerModal(false);
        }
      });
    } else if (source === "gallery") {
      ImagePicker.requestMediaLibraryPermissionsAsync().then((mediaLibraryPermission) => {
        if (mediaLibraryPermission.granted) {
          ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          }).then((result) => {
            if (!result.canceled && result.assets?.length > 0) {
              resolve(result.assets.map((asset) => asset.uri));
            } else {
              resolve([]);
            }
            setShowImagePickerModal(false);
          });
        } else {
          resolve([]);
          setShowImagePickerModal(false);
        }
      });
    }
  });
};