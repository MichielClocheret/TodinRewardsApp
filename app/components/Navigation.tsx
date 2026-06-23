import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../css/colors";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type NavigationTab = "home" | "perks" | "wallet" | "profile";

type NavigationProps = {
  activeTab?: NavigationTab;
  onTabPress?: (tab: NavigationTab) => void;
};

const Navigation = ({ activeTab = "home", onTabPress }: NavigationProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const tabs: {
    key: NavigationTab;
    label: string;
    renderIcon: (isActive: boolean) => React.JSX.Element;
  }[] = [
    {
      key: "home",
      label: "Home",
      renderIcon: (isActive) => (
        <Ionicons
          name={isActive ? "home" : "home-outline"}
          size={22}
          color={isActive ? colors.todinBlue : colors.grey4}
        />
      ),
    },
    {
      key: "perks",
      label: "Perks",
      renderIcon: (isActive) => (
        <Ionicons
          name={isActive ? "trophy" : "trophy-outline"}
          size={22}
          color={isActive ? colors.todinBlue : colors.grey4}
        />
      ),
    },
    {
      key: "wallet",
      label: "Wallet",
      renderIcon: (isActive) => (
        <Ionicons
          name={isActive ? "wallet" : "wallet-outline"}
          size={22}
          color={isActive ? colors.todinBlue : colors.grey4}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      renderIcon: (isActive) => (
        <Ionicons
          name={isActive ? "person" : "person-outline"}
          size={22}
          color={isActive ? colors.todinBlue : colors.grey4}
        />
      ),
    },
  ];

  return (
    <View style={[styles.shadowWrapper, { bottom: insets.bottom - 12}]}>
      <BlurView intensity={95} tint="light" style={styles.blurWrapper}>
        <View style={styles.navigationContainer}>
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Pressable
                key={tab.key}
                style={styles.navigationButton}
                onPress={() => {
                  onTabPress?.(tab.key);

                  if (!isActive) {
                    navigation.navigate(tab.key);
                  }
                }}
              >
                <View style={styles.iconWrap}>{tab.renderIcon(isActive)}</View>
                <Text
                  style={[
                    styles.navigationText,
                    isActive && styles.navigationTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  shadowWrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 5,
  },

  blurWrapper: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },

  navigationButton: {
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  navigationText: {
    fontSize: 12,
    color: colors.grey4,
    fontFamily: "DMSans-Medium",
  },

  navigationTextActive: {
    color: colors.todinBlue,
  },
});
