import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamsList } from "./types";
import ProfileScreen from "../screens/profile";
import AccountScreen from "../screens/profile/account";
import ChangePasswordScreen from "../screens/profile/changePassword";
import ReferralsScreen from "../screens/profile/referrals";
import NotificationsScreen from "../screens/profile/notifications";
import FaqScreen from "../screens/profile/faq";
import HeadquartersScreen from "../screens/profile/headquarters";
import RewardsPerksScreen from "../screens/profile/rewardsPerks";
import TiersScreen from "../screens/tiers";

const Stack = createNativeStackNavigator<ProfileStackParamsList>();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profileMain" component={ProfileScreen} />
      <Stack.Screen name="account" component={AccountScreen} />
      <Stack.Screen name="changePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="referrals" component={ReferralsScreen} />
      <Stack.Screen name="notifications" component={NotificationsScreen} />
      <Stack.Screen name="faq" component={FaqScreen} />
      <Stack.Screen name="headquarters" component={HeadquartersScreen} />
      <Stack.Screen name="rewardsPerks" component={RewardsPerksScreen} />
      <Stack.Screen name="tiers" component={TiersScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
