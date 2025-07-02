import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="CreateAccountScreen"
        options={{ title: "CreateAccountScreen", headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        options={{ title: "LoginScreen", headerShown: false }}
      />
      <Stack.Screen
        name="PasswordScreen"
        options={{ title: "PasswordScreen", headerShown: false , animation: "none",}}
      />
      <Stack.Screen
        name="forgetPassword"
        options={{ title: "ForgetPasword", headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmailOtpScreen"
        options={{ title: "VerifyEmailOtpScreen", headerShown: false }}
      />
      <Stack.Screen
        name="PasswordRecoveryScreen"
        options={{ title: "PasswordRecoveryScreen", headerShown: false }}
      />
      <Stack.Screen
        name="OtpConfirmationScreen"
        options={{ title: "OtpConfirmationScreen", headerShown: false }}
      />
      <Stack.Screen
        name="SetupNewPassword"
        options={{ title: "SetupNewPassword", headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingScreen"
        options={{ title: "OnboardingScreen", headerShown: false }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        options={{ title: "WelcomeScreen", headerShown: false }}
      />
        <Stack.Screen
        name="BaseURL"
        options={{ title: "BaseURL", headerShown: false }}
      />
       <Stack.Screen
        name="ReferAndEarnScreen"
        options={{ title: "ReferAndEarnScreen", headerShown: false }}
      />
    </Stack>
  );
}
