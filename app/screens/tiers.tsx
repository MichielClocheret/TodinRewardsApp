import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "@/app/css/styles";
import GoBack from "@/app/components/GoBack";
import GradientView from "../components/GradientView";
import TierCard from "../components/TierCard";
import { tiers } from "@/app/API/tiers";
import colors from "../css/colors";

const currentTierId = "bronze";

const Tiers = () => {
  const listHeader = (
    <View style={{ marginBottom: 32 }}>
      <Text style={[globalStyles.titleLeft, styles.pageTitle, { textAlign: "center" }]}>Tier</Text>
      <Text style={globalStyles.subTitle}>Unlock the Ultimate Experience</Text>
    </View>
  );

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView
        style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}
        edges={["top", "left", "right"]}
      >
        <View style={globalStyles.container}>
          <GoBack />
          <FlatList
            style={styles.screenContent}
            data={tiers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            ListHeaderComponent={listHeader}
            renderItem={({ item }) => (
              <TierCard tier={item} isCurrentTier={item.id === currentTierId} />
            )}
          />
        </View>
      </SafeAreaView>
    </GradientView>
  );
};

export default Tiers;

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
});
