import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="forgetPassword" options={{ title: 'ForgetPasword' ,  headerShown: false}} />
    </Stack>
  );
}
