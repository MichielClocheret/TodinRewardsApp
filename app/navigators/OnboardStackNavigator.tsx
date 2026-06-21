import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardStackParamsList } from "./types";
import StartScreen from "../screens/flow/onboarding/StartScreen";
import LoginScreen from "../screens/flow/Login/login";
import ConfirmEmailScreen from "../screens/flow/Login/confirmEmail";
import LoginChangePasswordScreen from "../screens/flow/Login/loginChangePassword";
import RegisterScreen from "../screens/flow/Register/register";
import VerificateEmailScreen from "../screens/flow/Register/verificateEmail";

const Stack = createNativeStackNavigator<OnboardStackParamsList>();

const OnboardStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="startScreen" component={StartScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="confirmEmail" component={ConfirmEmailScreen} />
      <Stack.Screen name="loginChangePassword" component={LoginChangePasswordScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="verificateEmail" component={VerificateEmailScreen} />
    </Stack.Navigator>
  );
};

export default OnboardStackNavigator;
