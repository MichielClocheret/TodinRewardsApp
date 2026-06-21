import { Alert, FlatList, Image, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, Pressable, View} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import globalStyles from "@/app/css/styles";
import colors from "@/app/css/colors";
import { LinearGradient } from "expo-linear-gradient";
import GradientView from "@/app/components/GradientView";

import DateIcon from "@/assets/media/Date.svg";
import DropDown from "@/assets/media/Dropdown.svg";
import CoinImage from "@/assets/images/FloatingCoins.svg";
import Search from "@/app/components/Search";
import Button from "@/app/components/Button";
import Navigation from "../components/Navigation";
import { getWallet, setPreferredWallet, getTransactions, Wallet, Transaction } from "@/app/API/wallet";
import { useRefresh } from "@/app/hooks/useRefresh";
import { formatNumber, parseNumericValue, sortWallets } from "@/app/utils/wallet";
import { AppTabParamsList, WalletStackParamsList } from "../navigators/types";

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletStackParamsList, "walletMain">,
  BottomTabScreenProps<AppTabParamsList>
>;

const WalletScreen = ({ navigation }: WalletScreenProps) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [walletSearchQuery, setWalletSearchQuery] = useState("");
  const [preferredCoinSearchQuery, setPreferredCoinSearchQuery] = useState("");
  const [showPreferredModal, setShowPreferredModal] = useState(false);
  const [selectedWalletAsset, setSelectedWalletAsset] = useState<string | null>(
    null,
  );
  const [isSavingPreferred, setIsSavingPreferred] = useState(false);

  const selectedWallet =
    wallets.find((walletItem) => walletItem.asset === selectedWalletAsset) ??
    null;

  const handleLinkWalletPress = () => {
    Alert.alert("Coming soon!", "Wallet linking will be available soon.");
  };

  const handleOpenPreferredModal = () => {
    if (!wallets.length) {
      Alert.alert(
        "No wallets found",
        "There are no wallets available to choose from yet.",
      );
      return;
    }

    setSelectedWalletAsset(
      wallets.find((walletItem) => walletItem.is_preferred)?.asset ??
        wallets[0]?.asset ??
        null,
    );
    setPreferredCoinSearchQuery("");
    setShowPreferredModal(true);
  };

  const handleClosePreferredModal = () => {
    setPreferredCoinSearchQuery("");
    setShowPreferredModal(false);
  };

  useEffect(() => {
    loadWallets();
  }, []);

  useEffect(() => {
    loadTransactions(statusFilter);
  }, [statusFilter]);

  const { refreshing, onRefresh } = useRefresh(async () => {
    await Promise.all([loadWallets(), loadTransactions(statusFilter)]);
  });

  const loadWallets = async () => {
    const [walletResult, txResult] = await Promise.all([
      getWallet(),
      getTransactions(),
    ]);

    if (!walletResult.success || !walletResult.data) {
      setWallets([]);
    } else {
      const sortedWallets = sortWallets(walletResult.data.data);
      setWallets(sortedWallets);
      setSelectedWalletAsset(
        sortedWallets.find((walletItem) => walletItem.is_preferred)?.asset ??
          sortedWallets[0]?.asset ??
          null,
      );
    }

    setTransactions(txResult.data?.data ?? []);
  };

  const loadTransactions = async (status: string) => {
    const result = await getTransactions(status !== "all" ? { status } : {});
    setTransactions(result.data?.data ?? []);
  };

  const handleOpenWithdrawScreen = (wallet: Wallet) => {
    navigation.navigate("Withdraw", {
      asset: wallet.asset,
      assetName: wallet.asset_name,
      balance: String(wallet.balance),
      icon: wallet.icon,
    });
  };

  const handleSetPreferredWallet = async () => {
    if (!selectedWalletAsset) {
      return;
    }

    setIsSavingPreferred(true);

    const result = await setPreferredWallet(selectedWalletAsset.toLowerCase());

    setIsSavingPreferred(false);

    if (!result.success) {
      Alert.alert(
        "Unable to update preferred coin",
        result.message || "Please try again.",
      );
      return;
    }

    const updatedWallets = sortWallets(
      wallets.map((walletItem) => ({
        ...walletItem,
        is_preferred: walletItem.asset === selectedWalletAsset,
      })),
    );

    setWallets(updatedWallets);
    handleClosePreferredModal();
  };

  const totalBalance = wallets.reduce((total, walletItem) => {
    const parsedValue = parseNumericValue(walletItem.value);

    if (parsedValue === null) {
      return total;
    }

    return total + parsedValue;
  }, 0);

  const formattedTotalBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalBalance);

  const normalizedWalletSearchQuery = walletSearchQuery.trim().toLowerCase();
  const normalizedPreferredCoinSearchQuery = preferredCoinSearchQuery
    .trim()
    .toLowerCase();

  const filteredWallets = wallets.filter((walletItem) => {
    if (!normalizedWalletSearchQuery) {
      return true;
    }

    return (
      walletItem.asset_name.toLowerCase().includes(normalizedWalletSearchQuery) ||
      walletItem.asset.toLowerCase().includes(normalizedWalletSearchQuery)
    );
  });

  const filteredPreferredWallets = wallets.filter((walletItem) => {
    if (!normalizedPreferredCoinSearchQuery) {
      return true;
    }

    return (
      walletItem.asset_name
        .toLowerCase()
        .includes(normalizedPreferredCoinSearchQuery) ||
      walletItem.asset
        .toLowerCase()
        .includes(normalizedPreferredCoinSearchQuery)
    );
  });

  const sortedTransactions = [...transactions].sort((a, b) => {
    const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortOrder === "newest" ? -diff : diff;
  });

  const renderTransactionItem = ({ item: tx }: { item: Transaction }) => {
    const date = new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const type = tx.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const statusColor =
      tx.status === "completed" ? colors.green :
      tx.status === "in_progress" ? colors.todinBlue :
      colors.yellow;
    return (
      <View style={styles.historyRow}>
        <Text style={[styles.rowText, styles.nameColumn]}>{date}</Text>
        <Text style={[styles.rowText, styles.progressColumn]} numberOfLines={1}>{type}</Text>
        <Text style={[styles.rowText, styles.rewardColumn]}>{tx.amount}</Text>
        <View style={styles.statusColumn}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
      </View>
    );
  };

  const transactionListHeader = (
    <View style={styles.historyHeaderRow}>
      <Text style={[styles.columnHeading, styles.nameColumn]}>Date</Text>
      <Text style={[styles.columnHeading, styles.progressColumn]}>Type</Text>
      <Text style={[styles.columnHeading, styles.rewardColumn]}>Amount</Text>
      <View style={styles.statusColumn} />
    </View>
  );

  const renderWalletItem = ({ item }: { item: Wallet }) => (
    <TouchableOpacity style={styles.walletItemContainer}
      onPress={() => handleOpenWithdrawScreen(item)}>
      <View style={styles.walletItem}>
        <View style={styles.BasicInfo}>
          <View>
            <Image style={styles.walletIcon} source={{ uri: item.icon }} />
          </View>

          <View>
            <Text style={[globalStyles.subTitle,{textAlign: "left", color: colors.black, fontFamily: "DMSans-Medium",},]}>
              {item.asset_name}
            </Text>
            {item.is_preferred ? (
              <View>
                <Text style={styles.preferredTag}>Preferred</Text>
              </View>
            ) : null}
          </View>

        </View>

        <View style={styles.valueBalance}>
          <View>
            <Text style={[{ textAlign: "right" }]}>${formatNumber(item.value, 2, 2)}</Text>
            <Text style={[globalStyles.subTitle, { textAlign: "right" }]}>
              {formatNumber(item.balance, 2, 7)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: "transparent" }]} edges={["top", "left", "right"]}>
        <View style={[globalStyles.container, styles.screen]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <LinearGradient
              style={styles.totalBalanceGradient}
              colors={[colors.white, colors.todinBlueLight2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View>
                <View>
                  <Text style={[globalStyles.bannerText, styles.totalBalanceTitle]}>
                    Total Balance
                  </Text>
                  <Text style={[globalStyles.titleLeft, styles.totalBalanceAmount]}>
                    {formattedTotalBalance}
                  </Text>
                </View>
                <View style={styles.coinImage}>
                  <CoinImage width={255.86} height={181.39} />
                </View>
              </View>
            </LinearGradient>

            <View style={styles.walletContainer}>
              <View style={styles.walletButtons}>
                <Search
                  borderRadius={999}
                  showFilter={false}
                  value={walletSearchQuery}
                  onChangeText={setWalletSearchQuery}
                  placeholder="Search coins"
                />
                <Button
                  title="Setup Preferred Coin"
                  variant="stroke"
                  paddingHorizontal={12}
                  paddingVertical={12}
                  fontSize={14}
                  onPress={handleOpenPreferredModal}
                />
              </View>
              <FlatList
                data={filteredWallets}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                style={styles.walletList}
                renderItem={renderWalletItem}
                ItemSeparatorComponent={() => <View style={styles.walletItemSeparator} />}
                ListEmptyComponent={<Text style={styles.emptyStateText}>No coins found.</Text>}
              />
            </View>

            <View style={styles.transactionContainer}>
              <View>
                <Text style={globalStyles.titleLeft}>Transaction History</Text>
                <Text style={[globalStyles.subTitle, { textAlign: "left" }]}>
                  Keep track of all your wallet activities
                </Text>
              </View>

              <View style={styles.transactionHeaderContainer}>
                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity
                    style={styles.sortByDateContainer}
                    onPress={() => { setShowSortDropdown((v) => !v); setShowStatusDropdown(false); }}
                    activeOpacity={0.8}
                  >
                    <DateIcon width={15} height={16.25} />
                    <Text>{sortOrder === "newest" ? "Newest first" : "Oldest first"}</Text>
                    <DropDown width={13.75} height={7.5} />
                  </TouchableOpacity>
                  {showSortDropdown && (
                    <View style={styles.dropdown}>
                      {(["newest", "oldest"] as const).map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[styles.dropdownItem, sortOrder === option && styles.dropdownItemActive]}
                          onPress={() => { setSortOrder(option); setShowSortDropdown(false); }}
                        >
                          <Text style={[styles.dropdownItemText, sortOrder === option && styles.dropdownItemTextActive]}>
                            {option === "newest" ? "Newest first" : "Oldest first"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.dropdownWrapper}>
                  <TouchableOpacity
                    style={styles.sortStatusContainer}
                    onPress={() => { setShowStatusDropdown((v) => !v); setShowSortDropdown(false); }}
                    activeOpacity={0.8}
                  >
                    <Text>
                      {statusFilter === "all" ? "All status" :
                       statusFilter === "in_progress" ? "In Progress" :
                       statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </Text>
                    <DropDown />
                  </TouchableOpacity>
                  {showStatusDropdown && (
                    <View style={[styles.dropdown, styles.dropdownRight]}>
                      {(["all", "pending", "in_progress", "completed"] as const).map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[styles.dropdownItem, statusFilter === option && styles.dropdownItemActive]}
                          onPress={() => { setStatusFilter(option); setShowStatusDropdown(false); }}
                        >
                          <Text style={[styles.dropdownItemText, statusFilter === option && styles.dropdownItemTextActive]}>
                            {option === "all" ? "All status" :
                             option === "in_progress" ? "In Progress" :
                             option.charAt(0).toUpperCase() + option.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <Search showFilter={false} borderRadius={999} />
              <View style={{ marginTop: 10 }}>
                <View style={styles.yourHistoryContainer}>
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

                  <FlatList
                    data={sortedTransactions}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    style={styles.historyListContainer}
                    renderItem={renderTransactionItem}
                    ListHeaderComponent={transactionListHeader}
                    ListEmptyComponent={<Text style={styles.emptyStateText}>No transactions yet.</Text>}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.floatButtonContainer}>
            <Button
              title="Link Wallet"
              variant="blue"
              paddingVertical={12}
              paddingHorizontal={12}
              fontSize={14}
              fullWidth
              onPress={handleLinkWalletPress}
            />
          </View>
        </View>

        <Modal
          visible={showPreferredModal}
          transparent
          animationType="fade"
          onRequestClose={handleClosePreferredModal}
        >
          <Pressable style={styles.modalOverlay} onPress={handleClosePreferredModal}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={[globalStyles.titleLeft, styles.modalTitle]}>
                Select Asset
              </Text>
              <Text style={[globalStyles.subTitle, styles.modalSubtitle]}>
                Pick one asset to use as your preferred one.
              </Text>

              <Search
                showFilter={false}
                borderRadius={999}
                style={{ marginBottom: 10 }}
                value={preferredCoinSearchQuery}
                onChangeText={setPreferredCoinSearchQuery}
                placeholder="Search preferred coin"
              />

              <FlatList
                data={filteredPreferredWallets}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyStateText}>No coins found.</Text>
                }
                renderItem={({ item }) => {
                  const isSelected = item.asset === selectedWalletAsset;

                  return (
                    <TouchableOpacity style={[styles.walletOption, isSelected && styles.walletOptionSelected]}
                      onPress={() => setSelectedWalletAsset(item.asset)}
                    >
                      <Image style={styles.walletOptionIcon}
                        source={{ uri: item.icon }}
                      />
                      <View style={styles.walletOptionText}>
                        <Text style={[globalStyles.bannerText, styles.walletOptionName,]}>
                          {item.asset_name}
                        </Text>
                        <Text style={[globalStyles.subTitle, styles.walletOptionAsset,]}>
                          {item.asset}
                        </Text>
                      </View>
                      {item.is_preferred ? (
                        <Text style={styles.preferredTag}>Current</Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />

              <View style={styles.modalButtons}>
                <View style={styles.modalButton}>
                  <Button
                    title="Cancel"
                    variant="stroke"
                    onPress={handleClosePreferredModal}
                    fullWidth
                  />
                </View>
                <View style={styles.modalButton}>
                  <Button
                    title={isSavingPreferred ? "Saving..." : "Select"}
                    variant="blue"
                    onPress={handleSetPreferredWallet}
                    disabled={!selectedWallet || isSavingPreferred}
                    fullWidth
                  />
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <Navigation activeTab="wallet" />
      </SafeAreaView>
    </GradientView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 50,
  },
  totalBalanceGradient: {
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  coinImage: {
    position: "absolute",
    right: -35,
    top: -70,
    transform: [{ rotate: "-25deg" }],
  },
  totalBalanceTitle: {
    textAlign: "left",
    fontFamily: "DMSans",
    color: colors.grey3,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    zIndex: 1,
  },

  walletContainer: {
    backgroundColor: colors.white,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 20,
    marginBottom: 16,
  },
  walletButtons: {
    display: "flex",
    gap: 8,
    marginBottom: 16,
  },
  walletList: {
    marginVertical:12,
  },
  emptyStateText: {
    color: colors.grey,
    textAlign: "center",
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    paddingVertical: 16,
  },
  walletItemContainer: {
    display: "flex",
    gap: 16,
    paddingHorizontal:12,
    paddingVertical:6,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  walletItem: {
    gap: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  valueBalance: {
    display: "flex",
    gap: 10,
  },
  walletItemSeparator: {
    borderBottomWidth: 1,
    borderColor: colors.stroke,
    marginVertical: 8,
  },
  BasicInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems:"center",
    gap: 12,
  },
  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: "50%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "rgba(21, 21, 21, 0.24)",
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: "75%",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  modalSubtitle: {
    textAlign: "left",
    marginBottom: 16,
  },
  modalList: {
    gap: 12,
    paddingBottom: 16,
  },
  walletOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
  },
  walletOptionSelected: {
    borderColor: colors.todinBlue,
  },
  walletOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
  walletOptionText: {
    flex: 1,
  },
  walletOptionName: {
    textAlign: "left",
    color: colors.black,
    marginBottom: 2,
  },
  walletOptionAsset: {
    textAlign: "left",
  },
  preferredTag: {
    backgroundColor: colors.todinBlueBackground,
    color: colors.todinBlue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    fontFamily: "DMSans-Medium",
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    marginTop: 16,
  },

  floatButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    paddingHorizontal: 16,
    zIndex: 10,
  },

  transactionContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  transactionHeaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  sortByDateContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 48,

    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  sortStatusContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 48,

    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  yourHistoryContainer: {
    backgroundColor: colors.white,
    marginTop: 20,
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
  historyListContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
  },
  historyHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingVertical: 16,
    columnGap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  columnHeading: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
    color: colors.grey,
    textAlign: "left",
  },
  nameColumn: {
    flex: 1.6,
  },
  progressColumn: {
    flex: 1.5,
  },
  rewardColumn: {
    flex: 1.2,
  },
  statusColumn: {
    width: 24,
    alignItems: "center",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    columnGap: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.stroke,
  },
  rowText: {
    fontSize: 13,
    fontFamily: "DMSans-Regular",
    color: colors.black,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 10,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 12,
    overflow: "hidden",
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownRight: {
    left: "auto" as unknown as number,
    right: 0,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: colors.todinBlueBackground,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: colors.black,
  },
  dropdownItemTextActive: {
    fontFamily: "DMSans-Medium",
    color: colors.todinBlue,
  },

});
