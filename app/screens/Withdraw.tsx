import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from "@/app/css/styles";
import colors from "@/app/css/colors";
import GradientView from "@/app/components/GradientView";
import Button from "@/app/components/Button";
import GoBack from "@/app/components/GoBack";
import Camera from "@/app/components/Camera";
import WithdrawValue from "@/app/components/WithdrawValue";
import Search from "@/app/components/Search";
import CameraIcon from "@/assets/media/CameraIcon.svg";
import DropDown from "@/assets/media/Dropdown.svg";
import { requestWithdrawal } from "@/app/API/withdraw";
import { getWallet, Wallet } from "@/app/API/wallet";
import { formatNumber, parseNumericValue } from "@/app/utils/wallet";
import { WalletStackNavProps } from "../navigators/types";

const WITHDRAW_PERCENTAGES = [10, 25, 50, 75, 100];

const WithdrawScreen = ({
  navigation,
  route,
}: WalletStackNavProps<"Withdraw">) => {
  const [asset, setAsset] = useState(route.params.asset);
  const [assetName, setAssetName] = useState(route.params.assetName);
  const [balance, setBalance] = useState(route.params.balance);
  const [icon, setIcon] = useState(route.params.icon);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [coinSearchQuery, setCoinSearchQuery] = useState("");
  const [showCoinPicker, setShowCoinPicker] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedWithdrawPercentage, setSelectedWithdrawPercentage] = useState<
    number | null
  >(null);
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    getWallet().then((result) => {
      if (result.success && result.data) {
        setWallets(result.data.data);
      }
    });
  }, []);

  const filteredWallets = wallets.filter((w) => {
    const q = coinSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      w.asset_name.toLowerCase().includes(q) ||
      w.asset.toLowerCase().includes(q)
    );
  });

  const SelectCoin = (wallet: Wallet) => {
    setAsset(wallet.asset);
    setAssetName(wallet.asset_name);
    setBalance(String(wallet.balance));
    setIcon(wallet.icon);
    setWithdrawAmount("");
    setSelectedWithdrawPercentage(null);
    setCoinSearchQuery("");
    setShowCoinPicker(false);
  };

  const openQrScanner = () => {
    setShowQRScanner(true);
  };

  const closeQrScanner = () => {
    setShowQRScanner(false);
  };

  const scanWalletAddress = (scannedValue: string) => {
    setWalletAddress(scannedValue);
    closeQrScanner();
  };

  const selectWithdrawPercentage = (percentage: number) => {
    const availableBalance = parseNumericValue(balance);

    if (availableBalance === null || availableBalance <= 0) {
      return;
    }

    const computedAmount = (availableBalance * percentage) / 100;
    setSelectedWithdrawPercentage(percentage);
    setWithdrawAmount(
      computedAmount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8,
        useGrouping: false,
      }),
    );
  };

  const withdrawAmountChange = (value: string) => {
    setWithdrawAmount(value);
    setSelectedWithdrawPercentage(null);
  };

  const submitWithdraw = async () => {
    const destinationAddress = walletAddress.trim();
    const amountValue = parseNumericValue(withdrawAmount);
    const availableBalance = parseNumericValue(balance);

    if (!asset) {
      Alert.alert("Wallet unavailable", "No wallet was selected for withdrawal.");
      return;
    }

    if (!destinationAddress) {
      Alert.alert("Wallet address required", "Please enter a destination address.");
      return;
    }

    if (amountValue === null || amountValue <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid withdrawal amount.");
      return;
    }

    if (availableBalance === null) {
      Alert.alert("Balance unavailable", "Unable to verify the available balance.");
      return;
    }

    if (amountValue > availableBalance) {
      Alert.alert(
        "Amount too high",
        `You can withdraw up to ${formatNumber(availableBalance, 2, 7)} ${asset}.`,
      );
      return;
    }

    setIsSubmittingWithdraw(true);

    const result = await requestWithdrawal(asset, {
      amount: amountValue,
      destination_address: destinationAddress,
    });

    setIsSubmittingWithdraw(false);

    if (!result.success) {
      Alert.alert(
        "Withdraw failed",
        result.message || "Unable to request withdrawal.",
      );
      return;
    }

    Alert.alert(
      "Withdraw requested",
      result.message || "Your withdrawal request has been submitted.",
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
  };

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView
        style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={[globalStyles.container, styles.screen]}>
          <View style={styles.headerContainer}>
            <GoBack />
            <Text style={[globalStyles.titleLeft, styles.title]}>Withdraw</Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
              Withdraw your {assetName || asset} balance to another wallet.
            </Text>
          </View>

          <View style={styles.withdrawContainer}>
            <Text style={[globalStyles.bannerText, styles.sectionTitle]}>
              Wallet Address
            </Text>
            <View style={styles.walletAddressContainer}>
              <View style={styles.inputWithAction}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter wallet address"
                  placeholderTextColor={colors.grey}
                  value={walletAddress}
                  onChangeText={setWalletAddress}
                />
                <View style={styles.inlineButtons}>
                  <TouchableOpacity
                    style={styles.pasteButton}
                    onPress={openQrScanner}
                  >
                    <CameraIcon width={20} height={20} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.tip}>
                Double-check your address. This action can&apos;t be reversed.
              </Text>

              <View style={styles.withdrawAmountContainer}>
                <Text style={[globalStyles.bannerText, styles.sectionTitle]}>
                  Withdraw Amount
                </Text>
                <Text style={globalStyles.subTitle}>
                  Balance: {formatNumber(balance, 6, 7)} {asset}
                </Text>
              </View>

              <View style={styles.inputWithAction}>
                <TextInput
                  style={styles.textInput}
                  placeholder="0"
                  placeholderTextColor={colors.black}
                  keyboardType="decimal-pad"
                  value={withdrawAmount}
                  onChangeText={withdrawAmountChange}
                />
                <TouchableOpacity
                  style={[styles.inlineButtons, styles.assetBadge]}
                  onPress={() => setShowCoinPicker(true)}
                >
                  {icon ? (
                    <Image style={styles.withdrawWalletIcon} source={{ uri: icon }} />
                  ) : null}
                  <Text style={styles.pasteButtonText}>{asset}</Text>
                  <DropDown width={11} height={13} />
                </TouchableOpacity>
              </View>

              <View style={styles.withdrawValueContainer}>
                {WITHDRAW_PERCENTAGES.map((percentage) => (
                  <WithdrawValue
                    key={percentage}
                    title={percentage}
                    isSelected={selectedWithdrawPercentage === percentage}
                    onPress={() => selectWithdrawPercentage(percentage)}
                  />
                ))}
              </View>

              <View style={styles.withdrawButton}>
                <Button
                  title={isSubmittingWithdraw ? "Submitting..." : "Withdraw"}
                  variant="blue"
                  onPress={submitWithdraw}
                  disabled={isSubmittingWithdraw}
                  fullWidth
                />
              </View>
            </View>
          </View>
        </View>

        <Modal
          visible={showCoinPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCoinPicker(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowCoinPicker(false)}
          >
            <Pressable style={styles.modalCard} onPress={() => {}}>
              <Text style={[globalStyles.titleLeft, styles.modalTitle]}>
                Select Coin
              </Text>
              <Text style={[globalStyles.subTitle, styles.modalSubtitle]}>
                Pick the coin you want to withdraw.
              </Text>

              <Search
                showFilter={false}
                borderRadius={999}
                style={{ marginBottom: 10 }}
                value={coinSearchQuery}
                onChangeText={setCoinSearchQuery}
                placeholder="Search coins"
              />

              <FlatList
                data={filteredWallets}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.modalList}
                ListEmptyComponent={
                  <Text style={styles.emptyStateText}>No coins found.</Text>
                }
                renderItem={({ item }) => {
                  const isSelected = item.asset === asset;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.walletOption,
                        isSelected && styles.walletOptionSelected,
                      ]}
                      onPress={() => SelectCoin(item)}
                    >
                      <Image
                        style={styles.walletOptionIcon}
                        source={{ uri: item.icon }}
                      />
                      <Text style={[globalStyles.bannerText, styles.walletOptionName]}>
                        {item.asset_name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>

        <Modal
          visible={showQRScanner}
          animationType="slide"
          onRequestClose={closeQrScanner}
        >
          <View style={{ flex: 1 }}>
            <Camera key={String(showQRScanner)} onScanned={scanWalletAddress} />
            <TouchableOpacity
              style={styles.qrCloseButton}
              onPress={closeQrScanner}
            >
              <Text style={styles.qrCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </GradientView>
  );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: 16,
  },
  headerContainer: {
    marginBottom: 14,
  },
  title: {
    marginTop: 16,
    marginBottom: 2,
  },
  subtitle: {
    textAlign: "left",
  },
  withdrawContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  sectionTitle: {
    textAlign: "left",
    marginVertical: 5,
    color: colors.black,
  },
  walletAddressContainer: {
    gap: 10,
  },
  inputWithAction: {
    position: "relative",
    justifyContent: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.stroke,
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 84,
    width: "100%",
  },
  inlineButtons: {
    position: "absolute",
    right: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  pasteButton: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.stroke,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  assetBadge: {
    backgroundColor: "transparent",
  },
  pasteButtonText: {
    color: colors.black,
    fontFamily: "DMSans-Medium",
    fontSize: 14,
  },
  withdrawWalletIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  tip: {
    color: "#4E5055",
    fontFamily: "DMSans-Medium",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  withdrawAmountContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  withdrawValueContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  withdrawButton: {
    width: "100%",
    paddingTop: 4,
  },
  qrCloseButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  qrCloseButtonText: {
    fontFamily: "DMSans-Medium",
    fontSize: 16,
    color: colors.black,
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
  emptyStateText: {
    color: colors.grey,
    textAlign: "center",
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    paddingVertical: 16,
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
    borderRadius: 20,
  },
  walletOptionName: {
    textAlign: "left",
    color: colors.black,
  },
});
