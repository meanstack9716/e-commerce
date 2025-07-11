import { useEffect } from "react";
import { Provider } from "react-redux";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/store/store";
import { AuthStateInitializer } from "@/components/auth/AuthStateInitializer";
import Toast from "react-native-toast-message";
SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (data: any) => {
      if (data?.url) {
        const url = data.url;
        const parsed = Linking.parse(url);
        if (parsed.path === "orderHistory") {
          router.navigate("/orderHistory");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="/categories" />
        <Stack.Screen name="/ProductDetails" />
        <Stack.Screen name="/addNewAddress" />
        <Stack.Screen name="/payment" />
        <Stack.Screen name="/placeorder" />
        <Stack.Screen name="/order" />
        <Stack.Screen name="/wishlist" />
        <Stack.Screen name="/faqs" />
        <Stack.Screen name="/product-filter" />
        <Stack.Screen name="/faq" />
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
    RalewayeRegular: require("../assets/fonts/Raleway/static/Raleway-Regular.ttf"),
    RalewayeExtraBold: require("../assets/fonts/Raleway/static/Raleway-ExtraBold.ttf"),
    RalewayeBold: require("../assets/fonts/Raleway/static/Raleway-Bold.ttf"),
    RalewayeMedium: require("../assets/fonts/Raleway/static/Raleway-Medium.ttf"),
    RalewayeSemiBold: require("../assets/fonts/Raleway/static/Raleway-SemiBold.ttf"),
    NunitoSans: require("../assets/fonts/Nunito_Sans/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <AuthStateInitializer />
      <AppLayout />
      <Toast />
    </Provider>
  );
}
