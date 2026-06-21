import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "@expo/vector-icons/Feather";
import { AppTabParamsList } from "./types";
import HomeStackNavigator from "./HomeStackNavigator";
import PerksStackNavigator from "./PerksStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import WalletStackNavigator from "./WalletStackNavigator";

const Tab = createBottomTabNavigator<AppTabParamsList>();

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}>
      <Tab.Screen
        name="home"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="perks"
        component={PerksStackNavigator}
        options={{
          title: "Perks",
          tabBarIcon: ({ color, size }) => (
            <Feather name="gift" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="wallet"
        component={WalletStackNavigator}
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => (
            <Feather name="credit-card" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileStackNavigator}
        options={{
          title: "Profiel",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
