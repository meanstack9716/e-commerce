import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="product-search"
          options={{ headerShown: false, title: "Product Search" }}
        />
           <Stack.Screen
          name="product-reviews"
          options={{ headerShown: false, title: "Product Reviews" }}
        />
      </Stack>
    );
}