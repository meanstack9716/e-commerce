import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, Platform, SafeAreaView, StyleSheet } from "react-native";
import colors from "@/style/staticColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";
import { fontSizes } from "@/style/typography";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[styles.safeAreaContainer, { paddingBottom: insets.bottom }]}
    >
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === "index") {
              return (
                <Image
                  source={require("@/assets/images/favicon.png")}
                  style={{
                    width: 28,
                    height: 28,
                    resizeMode: "contain",
                  }}
                />
              );
            }

            let iconName: any;
            if (route.name === "cart") {
              iconName = focused ? "cart" : "cart-outline";
            } else if (route.name === "wishlist") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "(profile)") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primaryBlue,
          tabBarInactiveTintColor: staticColors.textLightGray,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 23 + insets.bottom : 60,
            paddingBottom: Platform.OS === "ios" ? 0 : 0,
          },
          contentStyle: { backgroundColor: colors.white },
          tabBarLabel: ({ focused, color }) => {
            let label = "";
            if (route.name === "index") label = "Home";
            else if (route.name === "cart") label = "Cart";
            else if (route.name === "wishlist") label = "Wishlist";
            else if (route.name === "(profile)") label = "Profile";

            return (
              <Text
                style={{
                  fontFamily: focused ? "HelveticaBold" : "helvetica",
                  fontSize: fontSizes.xs,
                  color,
                }}
              >
                {label}
              </Text>
            );
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="wishlist" />
        <Tabs.Screen name="cart" />
        <Tabs.Screen name="(profile)" />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
