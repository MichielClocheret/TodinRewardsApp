import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoBack from "@/app/components/GoBack";
import Button from "@/app/components/Button";
import globalStyles from "@/app/css/styles";
import { getAccountInfo, resendVerificationEmail } from "@/app/API/authentication";
import { useRouter } from "expo-router";
import { OnboardStackParamsList } from "@/app/navigators/types";

type ConfirmEmailRouteProp = RouteProp<OnboardStackParamsList, "confirmEmail">;
type ConfirmEmailNavProp = NativeStackNavigationProp<OnboardStackParamsList, "confirmEmail">;

const ConfirmEmail = () => {
  const navigation = useNavigation<ConfirmEmailNavProp>();
  const route = useRoute<ConfirmEmailRouteProp>();
  const router = useRouter();
  const { email } = route.params ?? {};
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    setMessage(null);

    const result = await getAccountInfo();

    if (!result.success || !result.data) {
      setMessage(result.message || "Unable to check verification status.");
      setIsRefreshing(false);
      return;
    }

    if (result.data.email_verified_at) {
      router.replace("/screens/app");
      return;
    }

    setMessage("Your email is not verified yet.");
    setIsRefreshing(false);
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setMessage(null);

    const result = await resendVerificationEmail();
    setMessage(result.message || "Unable to resend verification email.");
    setIsResending(false);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
        <View style={globalStyles.container}>
          <GoBack />

          <View style={styles.header}>
            <Text style={[globalStyles.titleLeft, styles.title]}>
              Confirm your email
            </Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
              We sent an email to {email || "your email address"}.
            </Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
              Please verify your account before continuing.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title={isRefreshing ? "Checking..." : "Continue"}
              variant="fill"
              onPress={handleRefreshStatus}
              disabled={isRefreshing}
            />
            <Button
              title={isResending ? "Sending..." : "Send again"}
              variant="stroke"
              onPress={handleResendVerification}
              disabled={isResending}
            />
            <Button
              title="Change email"
              variant="none"
              onPress={() => navigation.navigate("login")}
            />
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default ConfirmEmail;

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },

  header: {
    paddingTop: 24,
    marginBottom: 32,
  },

  title: {
    paddingTop: 0,
  },

  subtitle: {
    textAlign: "left",
    fontSize: 16,
  },

  actions: {
    gap: 12,
  },

  message: {
    marginTop: 12,
    color: "#C62828",
    fontFamily: "DMSans-Regular",
  },
});
