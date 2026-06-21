import React from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoBack from "@/app/components/GoBack";
import Button from "@/app/components/Button";
import globalStyles from "@/app/css/styles";
import colors from "@/app/css/colors";
import { OnboardStackParamsList } from "@/app/navigators/types";

type VerificateEmailRouteProp = RouteProp<OnboardStackParamsList, "verificateEmail">;
type VerificateEmailNavProp = NativeStackNavigationProp<OnboardStackParamsList, "verificateEmail">;

const VerificateEmail = () => {
  const navigation = useNavigation<VerificateEmailNavProp>();
  const route = useRoute<VerificateEmailRouteProp>();
  const { email } = route.params ?? {};

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
              We sent an email to {email || "Email adress couldn't load"}
            </Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
              Please verify your account and login.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Login"
              variant="fill"
              onPress={() => navigation.navigate("login")}
            />
            <Button title="Send again" variant="fill" />
            <Button title="Change email" variant="none" />
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default VerificateEmail;

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
  },

  codeRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 32,
  },

  codeInput: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 14,
    fontFamily: "DMSans-Bold",
  },

  actions: {
    gap: 12,
  },
});
