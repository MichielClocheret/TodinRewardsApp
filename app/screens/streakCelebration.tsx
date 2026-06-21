import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import AnimatedFire from "../components/AnimatedFire";
import Button from "../components/Button";
import GradientView from "../components/GradientView";
import globalStyles from "../css/styles";
import colors from "../css/colors";
export default function StreakCelebration() {
  const router = useRouter();
  const { streak } = useLocalSearchParams<{ streak: string }>();
  const streakCount = parseInt(streak ?? "1", 10);

  const handleContinue = () => {
    router.replace("/screens/app");
  };

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView
        style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.container}>
          <AnimatedFire width={120} height={120} />
          <Text style={styles.title}>{streakCount}-Day Streak!</Text>
          <Text style={styles.subtitle}>
            You're on a roll. Keep logging in daily to keep your streak alive and unlock even more rewards.
          </Text>
          <View style={styles.buttonWrapper}>
            <Button title="Continue" variant="blue" onPress={handleContinue} />
          </View>
        </View>
      </SafeAreaView>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 8,
  },
  title: {
    fontFamily: "DMSans-Bold",
    fontSize: 40,
    color: colors.black,
    marginTop: 16,
  },
  subtitle: {
    fontFamily: "DMSans-Regular",
    fontSize: 15,
    color: colors.grey,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 4,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 24,
  },
});
