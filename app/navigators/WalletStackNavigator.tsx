import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WalletScreen from "../screens/wallet";
import WithdrawScreen from "../screens/Withdraw";
import { WalletStackParamsList } from "./types";

const Stack = createNativeStackNavigator<WalletStackParamsList>();

const WalletStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="walletMain" component={WalletScreen} />
      <Stack.Screen name="Withdraw" component={WithdrawScreen} />
    </Stack.Navigator>
  );
};

export default WalletStackNavigator;
