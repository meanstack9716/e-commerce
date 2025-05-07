import * as ImagePicker from "expo-image-picker";

export const pickImages= async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Image Picker Error:", error);
    return null;
  }
};
