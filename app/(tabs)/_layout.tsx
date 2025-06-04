import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, Platform, SafeAreaView, StyleSheet } from "react-native";
import colors from "@/style/staticColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import staticColors from "@/style/staticColors";
import {fontSizes} from "@/style/typography";
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
            if (route.name === "cart")
              iconName = focused ? "cart" : "cart-outline";
            if (route.name === "(profile)")
              iconName = focused ? "profile" : "person-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: staticColors.textLightGray,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopWidth: 0,

            height: Platform.OS === "ios" ? 60 + insets.bottom : 60,
            paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
          },
          contentStyle: { backgroundColor: colors.white },
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "HelveticaBold" : "helvetica",
                fontSize: fontSizes.xs,
                color,
              }}
            >
              {route.name === "index"
                ? "Home"
                : route.name === "cart"
                ? "Cart"
                : "Profile"}
            </Text>
          ),
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" />
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
