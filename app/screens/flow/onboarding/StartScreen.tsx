import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import globalStyles from "@/app/css/styles.js";
import Button from "@/app/components/Button";
import colors from "@/app/css/colors";
import { OnboardStackParamsList } from "@/app/navigators/types";

type Nav = NativeStackNavigationProp<OnboardStackParamsList, "startScreen">;

export default function StartScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={globalStyles.safeArea}>
      <Image
        style={loginStyle.backgroundImage}
        source={require("@/assets/images/LoginBackground.png")}
      />

      <SafeAreaView style={[globalStyles.safeArea, loginStyle.safeArea]}>
        <LinearGradient
          style={[globalStyles.container, loginStyle.bottomContainer]}
          colors={["transparent", colors.transparent, colors.white]}
          locations={[0, 0.55, 0.66]}
        >
          <View style={loginStyle.textContainer}>
            <Text style={[globalStyles.titleMid, { color: colors.black }]}>
              The smartest way to shop
            </Text>

            <Text style={[globalStyles.subTitle, { color: colors.grey2 }]}>
              View and purchase your dream item. Come explore the world of
              smarter shopping with us!
            </Text>
          </View>

          <View style={loginStyle.buttonContainer}>
            <Button title="Login" variant="fill"
              onPress={() => navigation.navigate("login")}/>

            <Button title="Register" variant="stroke"
              onPress={() => navigation.navigate("register")}/>

            {/* <Button title="Continue as guest" variant="none" /> */}
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const loginStyle = StyleSheet.create({
  safeArea:{
    backgroundColor: "transparent"
  },

  backgroundImage: {
    position: "absolute",
    top: 50,
    left: 25,
    width: "100%",
    height: 680,
    resizeMode: "contain",
  },

  bottomContainer: {
    paddingBottom: 24,
    justifyContent: "flex-end",
  },

  textContainer: {
    width: "100%",
    marginBottom: 34,
  },

  buttonContainer: {
    gap: 10,
    width: "100%",
  },
});
