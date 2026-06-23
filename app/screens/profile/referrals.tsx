import { Clipboard, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import globalStyles from "@/app/css/styles";
import colors from "@/app/css/colors";
import GoBack from "@/app/components/GoBack";
import GradientView from "@/app/components/GradientView";

import CheckIcon from "@/assets/media/Check.svg";
import CopyIcon from "@/assets/media/Copy.svg";
import SearchIcon from "@/assets/media/Search.svg";
import Coins from "@/assets/media/coins.svg";
import User from "@/assets/media/User.svg";
import Link from "@/assets/media/Link.svg";

import StatsReferral from "@/app/components/StatsReferral";
import ShowMoreList from "@/app/components/ShowMoreList";
import { getReferral, Referral, ReferralItem } from "@/app/API/referral";

type ReferralRow = {
  key: string;
  name: string;
  progressStep: number;
  rewardAmount: string;
  statusColor: string;
};

type ProgressLabel = {
  key: string;
  value: number;
};

const PROGRESS_LABELS: ProgressLabel[] = [
  { key: "step-1", value: 1 },
  { key: "step-2", value: 2 },
  { key: "step-3", value: 3 },
];

const formatNumber = (value: number | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }

  return value.toLocaleString("en-US");
};

const getItemName = (item: ReferralItem) => item.name;

const getItemReward = (item: ReferralItem) => `${item.reward} TDN`;

const getProgressStep = (item: ReferralItem) => {
  return Math.max(0, Math.min(3, item.progress));
};

const getStatusColor = (
  status: ReferralItem["status"],
  progressStep: number
) => {
  if (status === "completed" || progressStep >= 3) {
    return colors.green;
  }

  if (status === "pending" || progressStep <= 0) {
    return colors.yellow;
  }

  return colors.todinBlue;
};

const buildReferralRows = (referralData: Referral | null): ReferralRow[] => {
  if (!referralData) {
    return [];
  }

  const inProgressRows = referralData.in_progress.map((item, index) => {
    const progressStep = getProgressStep(item);

    return {
      key: `in-progress-${index}`,
      name: getItemName(item),
      progressStep,
      rewardAmount: getItemReward(item),
      statusColor: getStatusColor(item.status, progressStep),
    };
  });

  const historyRows = referralData.history.map((item, index) => {
    const progressStep = getProgressStep(item);

    return {
      key: `history-${index}`,
      name: getItemName(item),
      progressStep,
      rewardAmount: getItemReward(item),
      statusColor: getStatusColor(item.status, progressStep),
    };
  });

  return [...inProgressRows, ...historyRows];
};

const ProgressLabels = ({ progressStep }: { progressStep: number }) => {
  const renderLabel = ({ item }: { item: ProgressLabel }) => (
    <Text
      style={[
        styles.progressLabelText,
        item.value <= progressStep && styles.progressLabelTextActive,
      ]}
    >
      {item.value}
    </Text>
  );

  return (
    <FlatList
      data={PROGRESS_LABELS}
      keyExtractor={(item) => item.key}
      renderItem={renderLabel}
      horizontal
      scrollEnabled={false}
      contentContainerStyle={styles.progressLabels}
    />
  );
};

const referrals = () => {
  const [referralData, setReferralData] = useState<Referral | null>(null);
  const [referralRows, setReferralRows] = useState<ReferralRow[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadReferralData = async () => {
      const result = await getReferral();

      if (!result.success || !result.data) {
        setLoadError(result.message || "Unable to load referral data.");
        setReferralRows([]);
        setIsLoading(false);
        return;
      }

      setReferralData(result.data);
      setReferralRows(buildReferralRows(result.data));
      setLoadError(null);
      setIsLoading(false);
    };

    loadReferralData();
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  const referralCode = referralData?.referral_code || "No referral code found";
  const referralLink =
    referralData?.referral_code
      ? `https://todin.app/?ref=${referralData.referral_code}`
      : "https://todin.app...";
  const totalEarned = referralData?.totals.total_earned ?? 0;
  const totalCreated = referralData?.totals.total_created ?? 0;
  const totalCompleted = referralData?.totals.total_completed ?? 0;

  const copyReferralLink = () => {
    if (!referralData?.referral_code) {
      return;
    }

    Clipboard.setString(referralLink);
    setCopied(true);
  };

  const renderReferralRow = ({ item }: { item: ReferralRow }) => (
    <View style={styles.referralRow}>
      <Text style={[styles.rowText, styles.nameColumn]}>{item.name}</Text>

      <View style={styles.progressColumn}>
        <View style={styles.progressContent}>
          <ProgressLabels progressStep={item.progressStep} />
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(item.progressStep / 3) * 100}%`,
                  backgroundColor: item.statusColor,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={[styles.rowText, styles.rewardColumn]}>
        {item.rewardAmount}
      </Text>

      <View style={styles.statusColumn}>
        <View
          style={[styles.statusCircle, { backgroundColor: item.statusColor }]}
        />
      </View>
    </View>
  );

  return (
    <GradientView
      variant="screen"
      style={globalStyles.gradient}
    >
      <SafeAreaView
        style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}
      >
          <View style={[globalStyles.container, styles.screenContent]}>
            <View style={styles.headerContainer}>
              <GoBack />
              <Text style={[globalStyles.titleLeft,{ marginBottom: 4, marginTop: 24 },]}>
                Referral
              </Text>
              <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                Manage referral codes, invites, and earnings
              </Text>
            </View>

            <ScrollView style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
            <LinearGradient style={styles.referralLinkContainer}
              colors={[colors.white, colors.todinBlueLight2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.textContainer}>
                <Text style={[globalStyles.titleLeft,{ fontSize: 20, letterSpacing: -0.2 },]}>
                  Share Your Link, Get Rewards
                </Text>
                <Text style={[globalStyles.subTitle,{ textAlign: "left", lineHeight: 20 },]}>
                  Share your link, invite friends, and both of you earn $5 in
                  TDN when they complete 3 orders of at least $10 within 30
                  days.
                </Text>
              </View>

              <View>
                <Text style={[globalStyles.subTitle,{fontFamily: "DMSans-Medium",color: colors.black,textAlign: "left",marginBottom: 4,},]}>
                  Referral Code
                </Text>
                <View style={styles.linkContainer}>
                  <View style={styles.link}>
                    <SearchIcon width={20} height={20} />
                    <Text style={[globalStyles.bannerText,styles.linkText,{ color: colors.black },]}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {referralLink}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.copyButton}
                    onPress={copyReferralLink}
                    activeOpacity={0.85}
                    disabled={!referralData?.referral_code}
                  >
                    {copied ? (
                      <CheckIcon width={20} height={20} />
                    ) : (
                      <CopyIcon width={20} height={20} />
                    )}
                    <Text style={[globalStyles.bannerText, { color: colors.white }]}>
                      {copied ? "Copied!" : "Copy"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>

            {isLoading ? (
              <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                Loading referrals...
              </Text>
            ) : loadError ? (
              <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                {loadError}
              </Text>
            ) : (
              <View style={styles.statsContainer}>
                <StatsReferral
                  icon={<Coins width={20} height={20} />}
                  title="Your account earns"
                  stats={`${formatNumber(totalEarned)} TDN`}
                  insight={`${formatNumber(totalCompleted)} completed`}
                />
                <StatsReferral
                  icon={<User width={20} height={20} />}
                  title="Account Created"
                  stats={formatNumber(totalCreated)}
                  insight={`${formatNumber(
                    referralData?.in_progress.length ?? 0
                  )} in progress`}
                />
                <StatsReferral
                  icon={<Link width={20} height={20} />}
                  title="Completed Referrals"
                  stats={formatNumber(totalCompleted)}
                  insight={`${formatNumber(referralRows.length)} total referrals`}
                />

                <View style={styles.yourReferralsContainer}>
                  <View style={styles.legendeContainer}>
                    <View style={styles.legende}>
                      <View style={styles.circleYellow} />
                      <Text>Pending</Text>
                    </View>
                    <View style={styles.legende}>
                      <View style={styles.circleBlue} />
                      <Text>In Progress</Text>
                    </View>
                    <View style={styles.legende}>
                      <View style={styles.circleGreen} />
                      <Text>Completed</Text>
                    </View>
                  </View>

                  <View style={styles.yourReferralsTextContainer}>
                    <Text style={[globalStyles.titleLeft,{ fontSize: 20, marginBottom: 4 },]}>
                      Your Referrals
                    </Text>
                    <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                      Track your referrals and rewards
                    </Text>
                  </View>

                  <View style={styles.referralsListContainer}>
                    <View style={styles.referralsHeaderRow}>
                      <Text style={[styles.columnHeading, styles.nameColumn]}>
                        Your Referrals
                      </Text>
                      <Text style={[styles.columnHeading, styles.progressColumn]}>
                        Purchases
                      </Text>
                      <Text style={[styles.columnHeading, styles.rewardColumn]}>
                        Reward
                      </Text>
                      <View style={styles.statusColumn} />
                    </View>

                    <ShowMoreList
                      data={referralRows}
                      keyExtractor={(item) => item.key}
                      renderItem={renderReferralRow}
                      ListEmptyComponent={
                        <View style={styles.emptyState}>
                          <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                            No referrals yet.
                          </Text>
                        </View>
                      }
                    />
                  </View>
                </View>
              </View>
            )}
            </ScrollView>
          </View>
      </SafeAreaView>
    </GradientView>
  );
};

export default referrals;

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 16,
  },
  referralLinkContainer: {
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  textContainer: {
    marginBottom: 16,
  },
  linkContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  link: {
    width: 220,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 16,
    borderRadius: 100,
  },
  linkText: {
    flexShrink: 1,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.todinBlue,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 48,
  },
  statsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  yourReferralsTextContainer: {
    flex: 1,
  },
  yourReferralsContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 20,
    padding: 20,
  },
  legendeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  legende: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleYellow: {
    height: 10,
    width: 10,
    backgroundColor: colors.yellow,
    borderRadius: 999,
  },
  circleBlue: {
    height: 10,
    width: 10,
    backgroundColor: colors.todinBlue,
    borderRadius: 999,
  },
  circleGreen: {
    height: 10,
    width: 10,
    backgroundColor: colors.green,
    borderRadius: 999,
  },
  referralsListContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
  },
  referralsHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 16,
    columnGap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  referralRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    columnGap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  emptyState: {
    paddingVertical: 24,
  },
  columnHeading: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
    color: colors.grey,
    textAlign: "left",
  },
  rowText: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
    color: colors.black,
    textAlign: "left",
  },
  nameColumn: {
    flex: 1.6,
  },
  progressColumn: {
    flex: 1.5,
  },
  rewardColumn: {
    flex: 1.1,
  },
  statusColumn: {
    width: 24,
    alignItems: "center",
  },
  progressContent: {
    gap: 8,
  },
  progressLabels: {
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  progressLabelText: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
    color: colors.grey,
  },
  progressLabelTextActive: {
    color: colors.black,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#EEF0F3",
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: 2,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  statusCircle: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
