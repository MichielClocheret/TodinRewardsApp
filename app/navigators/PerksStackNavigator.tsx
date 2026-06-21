import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PerksScreen from "../screens/perks";
import TiersScreen from "../screens/tiers";
import { PerksStackParamsList } from "./types";

const Stack = createNativeStackNavigator<PerksStackParamsList>();

const PerksStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="perksMain" component={PerksScreen} />
      <Stack.Screen name="tiers" component={TiersScreen} />
    </Stack.Navigator>
  );
};

export default PerksStackNavigator;
