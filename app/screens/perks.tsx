import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "@/app/css/styles";
import Navigation from "../components/Navigation";
import AnimatedFire from "../components/AnimatedFire";
import BronzePerk from "@/assets/media/BronzePerk.svg";

import Medal from "@/assets/media/Medal.svg";
import Coins from "@/assets/media/coins.svg";
import Users from "@/assets/media/Users.svg";
import Cake from "@/assets/media/BirthdayCake.svg";
import Cart from "@/assets/media/ShoppingCart.svg";
import X from "@/assets/media/xIcon.svg";
import NordVpn from "@/assets/media/NordVPNIcon.svg";

import Day from "../components/Day";
import Button from "../components/Button";
import GradientView from "../components/GradientView";
import ProgressBar from "../components/ProgressBar";
import { AccountInfo, getAccountInfo } from "../API/authentication";
import { checkInStreak } from "../API/streak";
import { useRefresh } from "../hooks/useRefresh";
import { getWallet } from "../API/wallet";
import { formatNumber, parseNumericValue } from "../utils/wallet";
import colors from "../css/colors";
import Quest from "../components/Quest";

const dayTitles = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getLoginStreakValue = (account: AccountInfo | null) => {
  const rawValue = account?.login_streak;

  if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
    return Math.max(0, Math.floor(rawValue));
  }

  if (typeof rawValue === "string") {
    const parsedValue = Number.parseInt(rawValue, 10);
    if (Number.isFinite(parsedValue)) {
      return Math.max(0, parsedValue);
    }
  }

  return 0;
};

const getActiveDayIndexes = (streakCount: number, currentDayIndex: number) => {
  if (streakCount <= 0) {
    return new Set<number>();
  }
  const daysElapsedThisWeek = currentDayIndex + 1;
  const visibleDays = Math.min(streakCount, daysElapsedThisWeek);

  const activeIndexes = new Set<number>();
  for (let offset = 0; offset < visibleDays; offset += 1) {
    activeIndexes.add(currentDayIndex - offset);
  }

  return activeIndexes;
};

const Perks = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const maxValue = "1,000 TDN";
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [tdnBalance, setTdnBalance] = useState<string>("0");
  const [tdnBalanceRaw, setTdnBalanceRaw] = useState<number>(0);
  const [, setIsLoading] = useState(true);

  const loadAccount = async () => {
    const [accountResult, walletResult] = await Promise.all([
      getAccountInfo(),
      getWallet(),
    ]);

    if (!accountResult.success) {
      setIsLoading(false);
      return;
    }

    setAccount(accountResult.data || null);

    const tdnWallet = walletResult.data?.data.find((w) => w.asset === "TDN");
    if (tdnWallet) {
      setTdnBalance(formatNumber(tdnWallet.balance, 0, 2));
      setTdnBalanceRaw(parseNumericValue(tdnWallet.balance) ?? 0);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const { refreshing, onRefresh } = useRefresh(loadAccount);

  const countStreak = getLoginStreakValue(account);
  const currentDayIndex = (new Date().getDay() + 6) % 7;
  const activeDayIndexes = getActiveDayIndexes(countStreak, currentDayIndex);

  const CheckIn = async () => {
    const result = await checkInStreak();
    if (!result.success) {
      Alert.alert("Check-in failed", result.message ?? "Something went wrong.");
      return;
    }
    if (result.isNewCheckIn) {
      const accountResult = await getAccountInfo();
      const streak = getLoginStreakValue(accountResult.data ?? null);
      loadAccount();
      router.push({ pathname: "/screens/streakCelebration", params: { streak: String(streak) } });
    } else {
      Alert.alert("Already checked in", "You've already checked in today. Come back tomorrow!");
    }
  };

  const openVerifyWallet = () => {
    Alert.alert("Coming soon!");
  };

  return (
      <SafeAreaView
        style={[globalStyles.safeArea, { backgroundColor: colors.white }]}
        edges={["top", "left", "right"]}
      >
        <View style={[globalStyles.container, styles.screenContent]}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.streakTierContainer}>
              <GradientView>
                <View style={styles.headerContent}>
                  <View style={styles.textContent}>
                    <Text style={[globalStyles.titleLeft, { fontSize: 20 }]}>
                      {countStreak}-Day Streak!
                    </Text>
                    <Text
                      style={[
                        globalStyles.subTitle,
                        { textAlign: "left", lineHeight: 20 },
                      ]}
                    >
                      Check in daily to keep your streak alive and unlock extra
                      rewards.
                    </Text>
                  </View>
                  <View style={styles.fireContainer}>
                    <AnimatedFire width={60} height={60} />
                  </View>
                </View>
                <View style={styles.whiteContainer}>
                  {dayTitles.map((title, index) => (
                    <Day
                      key={title}
                      title={title}
                      active={activeDayIndexes.has(index)}
                    />
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Check In" variant="blue" onPress={CheckIn}/>
                  <Button title="View Quest" variant="stroke"/>
                </View>
              </GradientView>
              
              <GradientView>
                <View style={styles.headerContent}>
                  <View style={styles.textContent}>
                    <Text style={[globalStyles.titleLeft, { fontSize: 20 }]}>
                      Your Tier
                    </Text>
                    <Text
                      style={[
                        globalStyles.subTitle,
                        { textAlign: "left", lineHeight: 20 },
                      ]}
                    >
                      Your tier defines your benefits. Keep progressing to claim
                      more rewards.
                    </Text>
                  </View>
                  <BronzePerk width={60} height={60} />
                </View>
                <View style={styles.yourTierContainer}>
                  <View style={styles.perkValueContainer}>
                    <View style={styles.iconTitleContainer}>
                      <BronzePerk width={24} height={24} />
                      <Text>Bronze</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text>{tdnBalance} / {maxValue}</Text>
                    </View>
                  </View>
                  <ProgressBar value={tdnBalanceRaw} max={1000} />
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Verify Wallet" variant="blue" onPress={openVerifyWallet}/>
                  <Button title="View Tier" variant="stroke" onPress={() => navigation.navigate("tiers")} />
                </View>
              </GradientView>
            </View>

            {/* FUNCTIONALITEIT VOOR LATER, NIET INBEGREPEN IN DEZE OPDRACHT */}

            {/*<View style={styles.upcomingRewardsContainer}>
              <View style={styles.headerUpcomingRewards}>
                <View>
                  <Text style={[globalStyles.titleLeft, {marginBottom:0}]}>Upcoming Rewards</Text>
                  <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>Track your referrals and rewards</Text>
                </View>
                <Text style={globalStyles.bannerTextBlue}>View All</Text>
              </View>
              <Quest 
                title="Daily Streak Bonus"
                subTitle="Daily bonus for logging in consecutively based on your streak"
                earn="+25 TDN"
                current={2}
                total={7}
                icon={<Medal width={20} height={20} />}           
              />

              <Quest 
                title="Cashback Pending"
                subTitle="Cashback from your transaction is being processed and will be confirmed once"
                earn="+25 TDN"
                current={4}
                total={10}
                icon={<Coins width={20} height={20} />}            
              />
              <Quest 
                title="Referral Pending"
                subTitle="Points will be granted once your invited friend registers"
                earn="+25 TDN"
                current={2}
                total={2}
                icon={<Users width={20} height={20} />}            
              />
              <Quest 
                title="Birthday Bonus"
                subTitle="Special reward available during your birthday month"
                earn="+25 TDN"
                current={0}
                total={20}
                icon={<Cake width={20} height={20} />}            
              />
              <Quest 
                title="First Purchase Bonus"
                subTitle="Reward unlocked after your first successful purchase"
                earn="+25 TDN"
                current={1}
                total={3}
                icon={<Cart width={20} height={20} />}            
              />
            </View>

            <View style={styles.upcomingRewardsContainer}>
              <View style={styles.headerUpcomingRewards}>
                <View>
                  <Text style={[globalStyles.titleLeft, {marginBottom:0}]}>Connected Accounts</Text>
                  <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>All your past rewards in one place</Text>
                </View>
              </View>
              <Quest 
                title="Connect X"
                subTitle="Connect your account to get 100% back in TDN and tier-based discounts."
                earn="+25 TDN"
                link="Connect"
                icon={<X width={40} height={40} />}           
              />

              <Quest 
                title="Cashback Pending"
                subTitle="Cashback from your transaction is being processed and will be confirmed once"
                earn="+25 TDN"
                link="Connect"
                icon={<NordVpn width={40} height={40} />}            
              />
            </View>*/}
          </ScrollView>
        </View>
        <Navigation activeTab="perks" />
      </SafeAreaView>
  );
};

export default Perks;

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  streakTierContainer:{
    display:"flex",
    gap:20
  },
  headerContent: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  textContent: {
    flex: 1,
    flexShrink: 1,
  },
  fireContainer: {
    width: 60,
    height: 60,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  whiteContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,

    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap:8
  },
  yourTierContainer:{
    backgroundColor: colors.white,
    borderWidth:1,
    borderColor: colors.stroke,
    padding: 12,
    borderRadius:16,
    marginTop:12,
    marginBottom: 20,
  },
  perkValueContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  iconTitleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  amountContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  upcomingRewardsContainer:{
    display:"flex",
    gap:20,
    backgroundColor:colors.white,
    borderWidth:1,
    borderColor:colors.stroke,
    padding:20,
    borderRadius:20,
    marginTop:20
  },
  headerUpcomingRewards:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"baseline"
  },
});
