import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountInfo, clearAuthTokens, getAccountInfo } from "@/app/API/authentication";
import { useRefresh } from "@/app/hooks/useRefresh";
import { useReferralData } from "@/app/hooks/useReferralData";
import { useWalletData } from "@/app/hooks/useWalletData";
import { parseNumericValue } from "@/app/utils/wallet";
import globalStyles from "@/app/css/styles";
import colors from "../css/colors";
import Navigation from "../components/Navigation";
import SettingButton from "../components/SettingButton";
import GradientView from "../components/GradientView";

import AccountIcon from "../../assets/media/profile/accountIcon.svg";
import ChatIcon from "../../assets/media/profile/ChatIcon.svg";
import LogoutIcon from "../../assets/media/profile/LogoutIcon.svg";
import NotificationIcon from "../../assets/media/profile/NotificationIcon.svg";
import ShopIcon from "../../assets/media/profile/PeopleIcon.svg";
import QuestionIcon from "../../assets/media/profile/QuestionIcon.svg";
import ReviewIcon from "../../assets/media/profile/StarIcon.svg";
import SlotIcon from "../../assets/media/profile/SlotIcon.svg";
import LegalIcon from "../../assets/media/profile/ReviewIcon.svg";
import ArrowIcon from '../../assets/media/ArrowRight.svg';

import CoinImage from "@/assets/images/FloatingCoins.svg";


const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

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
  const referralData = useReferralData();
  const { wallets } = useWalletData();

  const totalEarned = referralData?.totals.total_earned ?? null;

  const tdnWallet = wallets?.find((w) => w.asset.toUpperCase() === "TDN") ?? null;
  const tdnBalance = parseNumericValue(tdnWallet?.balance);
  const tdnValue = parseNumericValue(tdnWallet?.value);
  const tdnPricePerCoin = tdnBalance && tdnValue && tdnBalance > 0 ? tdnValue / tdnBalance : null;
  const totalEarnedUsd =
    totalEarned !== null && tdnPricePerCoin !== null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalEarned * tdnPricePerCoin)
      : null;

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
    <GradientView variant="screen" style={globalStyles.gradient}>
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
              <View style={[styles.sectionContainer, { marginTop: 20 }]}>
                <View style={styles.section}>
                  <SettingButton title="Log out" image={LogoutIcon} onPress={logOut} />
                </View>
              </View>
            </>
          ) : (
            <>
            <TouchableOpacity onPress={() => navigation.navigate("account")}>
              <View style={styles.nameHeaderWrapper}>
                <View style={styles.profileHeaderRow}>
                  <View style={styles.initialsCircle}>
                    <Text style={styles.initialsText}>{getInitials(displayName)}</Text>
                  </View>
                  <View style={styles.profileHeader}>
                    <Text style={styles.profileName}>{displayName}</Text>
                    <Text style={styles.profileEmail}>{email}</Text>
                  </View>
                </View>
                <ArrowIcon/>
              </View>
            </TouchableOpacity>

              <View style={styles.sectionContainerWrapper}>
                <View style={[styles.sectionContainer, styles.gridCell]}>
                  <View style={[styles.section, { flex: 1, display:"flex", gap:15 }]}>
                    <Text style={globalStyles.profileTitle}>Level Up</Text>
                    <View>
                      <Text style={[globalStyles.subTitle, styles.tierValue]}>tierName</Text>
                      <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>Your Level</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.sectionContainer, styles.gridCell]}>
                  <View style={[styles.section, { overflow: "hidden", flex: 1, display:"flex", justifyContent:"space-between" }]}>
                    <Text style={styles.earningsValue}>
                      {totalEarnedUsd ?? "$0"}
                    </Text>
                    <Text style={[globalStyles.subTitle, {textAlign:"left", lineHeight:0}]}>Your referral earnings</Text>
                    <View style={styles.coinImage}>
                      <CoinImage width={255.86} height={181.39} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.section}>
                  <Text style={globalStyles.profileTitle}>Account setting</Text>
                  <View>
                    <SettingButton
                      title="Change password"
                      image={SlotIcon}
                      onPress={() => navigation.navigate("changePassword")}
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
    </GradientView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.transparent,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 120,
  },
  nameHeaderWrapper:{
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    paddingHorizontal: 16,
    marginBottom:24,
  },

  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  initialsCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.todinBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    fontFamily: "DMSans-Bold",
    fontSize: 16,
    color: colors.white,
  },
  profileHeader: {
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
  sectionContainerWrapper:{
    flexDirection: "row",
  },
  sectionContainer: {
    paddingHorizontal:12,
  },
  gridCell: {
    flex: 1,
    maxWidth: "50%",
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderWidth:1,
    borderColor: colors.stroke,
    borderRadius:20,
    backgroundColor: colors.white,
  },

  tierValue:{
    textAlign:"left",
    fontFamily: "DMSans-Bold",
    fontSize:17,
    color:colors.todinBlue,
    lineHeight:0,
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
  earningsValue: {
    fontFamily: "DMSans-Medium",
    fontSize: 20,
    fontWeight: "600",
    color: colors.todinBlue,
    marginTop: 4,
  },
    coinImage: {
    position: "absolute",
    right: -160,
    top: -80,
    transform: [{ rotate: "-25deg" }],
  },
});
