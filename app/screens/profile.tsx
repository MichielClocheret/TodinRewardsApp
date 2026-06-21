import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountInfo, clearAuthTokens, getAccountInfo } from "@/app/API/authentication";
import { useRefresh } from "@/app/hooks/useRefresh";
import globalStyles from "@/app/css/styles";
import colors from "../css/colors";
import Navigation from "../components/Navigation";
import SettingButton from "../components/SettingButton";

import AccountIcon from "../../assets/media/profile/accountIcon.svg";
import ChatIcon from "../../assets/media/profile/ChatIcon.svg";
import LogoutIcon from "../../assets/media/profile/LogoutIcon.svg";
import NotificationIcon from "../../assets/media/profile/NotificationIcon.svg";
import PeopleIcon from "../../assets/media/profile/PeopleIcon.svg";
import ShopIcon from "../../assets/media/profile/PeopleIcon.svg";
import QuestionIcon from "../../assets/media/profile/QuestionIcon.svg";
import ReviewIcon from "../../assets/media/profile/StarIcon.svg";
import SlotIcon from "../../assets/media/profile/SlotIcon.svg";
import LegalIcon from "../../assets/media/profile/ReviewIcon.svg";

const getDisplayName = (account: AccountInfo | null) => {
  if (!account) 
    return "Login first to see your profile";

  const firstName = typeof account.firstname === "string" ? account.firstname.trim() : "";
  const lastName = typeof account.lastname === "string" ? account.lastname.trim() : "";
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) return fullName;
  if (typeof account.email === "string" && account.email.trim()) 
    return account.email.trim();

  return "Your profile";
};

const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();
const [account, setAccount] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccount = async () => {
    const result = await getAccountInfo();

    if (!result.success) {
      setError(result.message || "Unable to load account info.");
      setIsLoading(false);
      return;
    }

    setAccount(result.data || null);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const { refreshing, onRefresh } = useRefresh(loadAccount);

  const displayName = getDisplayName(account);
  const email =
    typeof account?.email === "string" && account.email.trim()
      ? account.email.trim()
      : "Couldn't load email";

  const logOut = async () => {
    await clearAuthTokens();
router.replace("/screens/onboard");
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, styles.screen]} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          {isLoading ? (
            <Text style={styles.stateText}>Loading account...</Text>
          ) : error ? (
            <>
              <Text style={styles.stateText}>Could not load profile</Text>
              <Text style={styles.errorText}>{error}</Text>
            </>
          ) : (
            <>
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profileEmail}>{email}</Text>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.section}>
                  <Text style={globalStyles.profileTitle}>Account setting</Text>
                  <View>
                    <SettingButton
                      title="Account"
                      image={AccountIcon}
                      onPress={() => navigation.navigate("account")}
                    />
                    <SettingButton
                      title="Change password"
                      image={SlotIcon}
                      onPress={() => navigation.navigate("changePassword")}
                    />
                    <SettingButton
                      title="Favourite Shops"
                      image={PeopleIcon}
                      onPress={() => navigation.navigate("favouriteshops")}
                    />
                    <SettingButton
                      title="Refferals"
                      image={ShopIcon}
                      onPress={() => navigation.navigate("referrals")}
                    />
                    {/* <SettingButton
                      title="Rewards & Perks"
                      image={AccountIcon}
                      onPress={() => navigation.navigate("rewardsPerks")}
                    /> */}
                    <SettingButton
                      title="Notifications"
                      image={NotificationIcon}
                      onPress={() => navigation.navigate("notifications")}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.section}>
                  <Text style={globalStyles.profileTitle}>Support</Text>
                  <View>
                    <SettingButton
                      title="FAQ"
                      image={QuestionIcon}
                      onPress={() => navigation.navigate("faq")}
                    />
                    <SettingButton
                      title="Headquarters"
                      image={ChatIcon}
                      onPress={() => navigation.navigate("headquarters")}
                    />
                    {/* <SettingButton title="Live chat" image={ChatIcon} /> */}
                    {/* <SettingButton title="Legal" image={LegalIcon} /> */}
                    {/* <SettingButton title="Review this app" image={ReviewIcon} /> */}
                  </View>
                  </View>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.section}>
                  <SettingButton
                    title="Log out"
                    image={LogoutIcon}
                    onPress={logOut}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Navigation activeTab="profile" />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  content: {
    paddingVertical: 24,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 4,
  },
  profileName: {
    fontFamily: "DMSans-Medium",
    fontSize: 22,
    fontWeight: "600",
    color: colors.black,
  },
  profileEmail: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: colors.grey,
  },
  sectionContainer: {
    paddingHorizontal:12,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderWidth:1,
    borderColor: colors.stroke,
    borderRadius:20,
  },
  stateText: {
    color: colors.grey,
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#C62828",
    fontFamily: "DMSans-Regular",
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
