import * as ImagePicker from "expo-image-picker";

export const pickImages = async (setModal: (value: boolean) => void, source: string) => {
  try {
    let result;
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required!");
        setModal(false);
        return [];
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else if (source === "gallery") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Gallery permission is required!");
        setModal(false);
        return [];
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      setModal(false);
      return [];
    }

    if (!result.canceled && result.assets) {
      setModal(false);
      return result.assets.map((asset) => asset.uri);
    }
    setModal(false);
    return [];    
  } catch (error) {
    console.error("Image picker error:", error);
    setModal(false);
    return [];
  }
};