import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/store/store";
import { useCartStorage } from "@/hooks/useCartStorage";

SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const colorScheme = useColorScheme();
 useCartStorage();

  return (
    
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="/categories" />
        <Stack.Screen name="/ProductDetails" />
        <Stack.Screen name="/addNewAddress" />
        <Stack.Screen name="/payment" />
        <Stack.Screen name="/placeorder" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    HelveticaBold: require("../assets/fonts/Helvetica/Helvetica-Bold.ttf"),
    Helvetica: require("../assets/fonts/Helvetica/Helvetica.ttf"),
    helveticaCompressed: require("../assets/fonts/Helvetica/helvetica-compressed.otf"),
    helveticaOblique: require("../assets/fonts/Helvetica/Helvetica-Oblique.ttf"),
    helveticaRoundedBold: require("../assets/fonts/Helvetica/helvetica-rounded-bold.otf"),
    AbriFatfaceRegular: require("../assets/fonts/AbrilFatface-Regular.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <AppLayout />
    </Provider>
  );
}
