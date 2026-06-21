import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/home";
import SpinningScreen from "../screens/spinning";
import { HomeStackParamsList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamsList>();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homeMain" component={HomeScreen} />
      <Stack.Screen name="spinning" component={SpinningScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
