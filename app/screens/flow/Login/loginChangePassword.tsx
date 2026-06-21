import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import globalStyles from "@/app/css/styles";
import GoBack from "@/app/components/GoBack";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import { forgotPassword } from "@/app/API/authentication";
import { OnboardStackParamsList } from "@/app/navigators/types";
import { useFormik } from "formik";
import * as Yup from "yup";

type NavProp = NativeStackNavigationProp<OnboardStackParamsList, "loginChangePassword">;

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
});

export default function LoginChangePassword() {
  const navigation = useNavigation<NavProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, isValid, dirty } = useFormik({
    initialValues: { email: "" },
    validationSchema,
    validateOnMount: false,
    onSubmit: () => {},
  });

  const handleSubmit = async () => {
    if (!isValid || !dirty || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await forgotPassword(values.email.trim());

    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || "Unable to send reset email.");
      return;
    }

    setSuccessMessage(result.message || "Check your inbox.");
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <GoBack onPress={() => navigation.navigate("login")} />
        <View style={styles.content}>
          <Text style={[globalStyles.titleLeft, { marginBottom: 0 }]}>Reset Password</Text>
          <Text style={[globalStyles.titleLeft, { marginBottom: 24 }]}>We'll send you a link.</Text>
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
          </View>
          <View style={styles.button}>
            <Button
              title={isLoading ? "Sending..." : "Send Reset Link"}
              variant={isValid && dirty ? "fill" : "nonActive"}
              onPress={handleSubmit}
              disabled={!isValid || !dirty || isLoading}
            />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
  },
  button: {
    marginTop: 12,
  },
  errorText: {
    color: "red",
    marginTop: 8,
    fontFamily: "DMSans-Regular",
  },
  successText: {
    color: "#177245",
    marginTop: 8,
    fontFamily: "DMSans-Regular",
  },
});
