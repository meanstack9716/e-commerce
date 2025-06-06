import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
      <Stack.Screen
        name="userInformation"
        options={{ title: "UserInformation", headerShown: false }}
      />
       <Stack.Screen
        name="accountManage"
        options={{ title: "AccountManage", headerShown: false }}
      />
    </Stack>
  );
}
