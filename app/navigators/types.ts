import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type OnboardStackParamsList = {
  startScreen: undefined;
  login: undefined;
  confirmEmail: { email: string };
  register: undefined;
  verificateEmail: { email: string };
  loginChangePassword: undefined;
};

export type AppTabParamsList = {
  home: undefined;
  perks: undefined;
  wallet: undefined;
  profile: undefined;
};

export type HomeStackParamsList = {
  homeMain: undefined;
  spinning: undefined;
};

export type PerksStackParamsList = {
  perksMain: undefined;
  tiers: undefined;
};

export type WalletStackParamsList = {
  walletMain: undefined;
  Withdraw: {
    asset: string;
    assetName: string;
    balance: string;
    icon: string;
  };
};

export type ProfileStackParamsList = {
  profileMain: undefined;
  account: undefined;
  changePassword: undefined;
  referrals: undefined;
  notifications: undefined;
  faq: undefined;
  headquarters: undefined;
  rewardsPerks: undefined;
};

export type AppTabNavProps<T extends keyof AppTabParamsList> =
  BottomTabScreenProps<AppTabParamsList, T>;

export type HomeStackNavProps<T extends keyof HomeStackParamsList> =
  NativeStackScreenProps<HomeStackParamsList, T>;

export type PerksStackNavProps<T extends keyof PerksStackParamsList> =
  NativeStackScreenProps<PerksStackParamsList, T>;

export type ProfileStackNavProps<T extends keyof ProfileStackParamsList> =
  NativeStackScreenProps<ProfileStackParamsList, T>;

export type WalletStackNavProps<T extends keyof WalletStackParamsList> =
  NativeStackScreenProps<WalletStackParamsList, T>;

export type OnboardStackNavProps<T extends keyof OnboardStackParamsList> =
  NativeStackScreenProps<OnboardStackParamsList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends
        AppTabParamsList,
        HomeStackParamsList,
        PerksStackParamsList,
        ProfileStackParamsList,
        WalletStackParamsList,
        OnboardStackParamsList {}
  }
}
