import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../css/colors";

export type NavigationTab = "home" | "perks" | "wallet" | "profile";

type NavigationProps = {
  activeTab?: NavigationTab;
  onTabPress?: (tab: NavigationTab) => void;
};

const Navigation = ({ activeTab = "home", onTabPress }: NavigationProps) => {
  const navigation = useNavigation();

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
    <View style={styles.wrapper}>
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
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    paddingBottom: 30,
  },

  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.stroke,
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
