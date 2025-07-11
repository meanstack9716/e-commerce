import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function getPushNotificationToken() {
  let token;

  // Configure notification handler 
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true, // Required for iOS
      shouldShowList: true, // Required for iOS
    }),
  });

  // Android: Set notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Check permissions (required for iOS)
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }

  // Get the Expo Push Token
  const { data: pushToken } = await Notifications.getExpoPushTokenAsync();
  console.log("Expo Push Token:", pushToken);

  return pushToken;
}
