import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from '@/app/css/styles';
import GoBack from "@/app/components/GoBack";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import BreakLine from "@/app/components/BreakLine";
import LoginSocials from "@/app/components/LoginSocials";
import BottomBanner from "@/app/components/BottomBanner";
import { getAccountInfo, login } from "@/app/API/authentication";
import { OnboardStackParamsList } from "@/app/navigators/types";

import { useFormik } from "formik";
import * as Yup from "yup";

type LoginNavProp = NativeStackNavigationProp<OnboardStackParamsList, "login">;

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const navigation = useNavigation<LoginNavProp>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, isValid, dirty } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    validateOnMount: false,
    onSubmit: () => {},
  });

  const handleLogin = async () => {
    if (!isValid || !dirty || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    const loginResult = await login(values.email, values.password);

    if (!loginResult.success) {
      setErrorMessage(loginResult.message || "Unable to sign in.");
      setIsLoading(false);
      return;
    }

    const accountInfoResult = await getAccountInfo();

    if (!accountInfoResult.success || !accountInfoResult.data) {
      setErrorMessage(accountInfoResult.message || "Unable to load account info.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    if (accountInfoResult.data.email_verified_at) {
      router.replace("/screens/app");
      return;
    }

    navigation.navigate("confirmEmail", { email: values.email });
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <GoBack onPress={() => navigation.navigate("startScreen")} />
        <View style={styles.loginContainer}>
          <Text style={[globalStyles.titleLeft, { marginBottom: 0 }]}>Welcome back!</Text>
          <Text style={[globalStyles.titleLeft, { marginBottom: 24 }]}>Nice to see you again.</Text>
          <View style={globalStyles.inputFieldsContainer}>
            <InputField
              title="Email"
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && errors.email ? errors.email : undefined}
            />
            <InputField
              title="Password"
              tinyText="Reset Password?"
              tinyTextOnPress={() => navigation.navigate("loginChangePassword")}
              placeholder="Enter your password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password && errors.password ? errors.password : undefined}
            />
          </View>
          <View style={styles.loginButton}>
            <Button
              title={isLoading ? "Logging in..." : "Login"}
              variant={isValid && dirty ? "fill" : "nonActive"}
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <BreakLine text="Or" />
          <LoginSocials />
        </View>
      </View>
      <BottomBanner
        text="No account yet?"
        blueText="Register here"
        onPress={() => navigation.navigate("register")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    paddingVertical: 12,
  },
  loginButton: {
    marginTop: 12,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    fontFamily: "DMSans-Regular",
  },
});
