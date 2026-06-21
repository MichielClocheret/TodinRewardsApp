import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyles from "@/app/css/styles";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import BreakLine from "@/app/components/BreakLine";
import LoginSocials from "@/app/components/LoginSocials";
import BottomBanner from "@/app/components/BottomBanner";
import GoBack from "@/app/components/GoBack";
import { OnboardStackParamsList } from "@/app/navigators/types";

import { register as registerUser } from "@/app/API/authentication";
import { useFormik } from "formik";
import * as Yup from "yup";

type RegisterNavProp = NativeStackNavigationProp<OnboardStackParamsList, "register">;

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required().min(8),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password does not match")
    .required(),
});


export default function Register() {
  const navigation = useNavigation<RegisterNavProp>();
  const [step, setStep] = useState<"personalInformation" | "password">("personalInformation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldTouched,
    validateForm,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      const apiResult = await registerUser(
        values.firstName,
        values.lastName,
        values.email,
        values.password,
        values.confirmPassword,
      );

      if (!apiResult.success) {
        setError(apiResult.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setLoading(false);
      navigation.navigate("verificateEmail", { email: values.email });
    },
    validationSchema,
    validateOnMount: true,
  });

  const showPasswordScreen = async () => {
    const nextErrors = await validateForm();

    await setFieldTouched("firstName", true);
    await setFieldTouched("lastName", true);
    await setFieldTouched("email", true);

    if (nextErrors.firstName || nextErrors.lastName || nextErrors.email) {
      return;
    }

    setStep("password");
  };

  const handleRegisterPress = async () => {
    const nextErrors = await validateForm();

    await setFieldTouched("password", true);
    await setFieldTouched("confirmPassword", true);

    if (nextErrors.password || nextErrors.confirmPassword) {
      return;
    }

    handleSubmit();
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
        <View style={globalStyles.container}>
          <GoBack onPress={() => navigation.navigate("startScreen")} />
          <View style={styles.headerTitle}>
            <Text style={[globalStyles.titleLeft, { marginBottom: 0 }]}>Hello!</Text>
            <Text style={[globalStyles.titleLeft, { marginBottom: 24 }]}>Register to get started.</Text>
          </View>

          {step === "personalInformation" && (
            <View style={globalStyles.inputFieldsContainer}>
              <InputField
                title="First Name"
                placeholder="John"
                value={values.firstName}
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                autoCapitalize="words"
                error={touched.firstName ? errors.firstName : undefined}
              />
              <InputField
                title="Last Name"
                placeholder="Doe"
                value={values.lastName}
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                autoCapitalize="words"
                error={touched.lastName ? errors.lastName : undefined}
              />
              <InputField
                title="Email"
                placeholder="john@example.com"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                autoComplete="email"
                error={touched.email ? errors.email : undefined}
              />
              <View style={styles.buttonNext}>
                <Button
                  title="Next"
                  variant="fill"
                  onPress={showPasswordScreen}
                />
              </View>
            </View>
          )}

          {step === "password" && (
            <View style={globalStyles.inputFieldsContainer}>
              <InputField
                title="Password"
                placeholder="Enter your password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                error={touched.password ? errors.password : undefined}
              />
              <InputField
                title="Confirm Password"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                error={touched.confirmPassword ? errors.confirmPassword : undefined}
              />
              <View style={styles.buttonNext}>
                <Button
                  title={loading || isSubmitting ? "Registering..." : "Register"}
                  variant="fill"
                  onPress={handleRegisterPress}
                  disabled={loading || isSubmitting}
                />
              </View>
              {error && (
                <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
              )}
            </View>
          )}

          <BreakLine text="Or" />
          <LoginSocials />

          <BottomBanner
            text="Already have an account?"
            blueText="Login here"
            onPress={() => navigation.navigate("login")}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  headerTitle: {
    paddingTop: 12,
  },
  buttonNext: {
    marginTop: 12,
  },
});
