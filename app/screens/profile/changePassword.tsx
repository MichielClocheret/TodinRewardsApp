import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoBack from "@/app/components/GoBack";
import globalStyles from "@/app/css/styles";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import Popup from "@/app/components/popup";
import { changePassword as changePasswordForCurrentUser } from "@/app/API/authentication";
import GradientView from "@/app/components/GradientView";

import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .notOneOf([Yup.ref("oldPassword")], "New password must differ from current password"),
  confirmPassword: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

export default function ChangePassword() {
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, isValid, dirty, resetForm } = useFormik({
    initialValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validationSchema,
    validateOnMount: false,
    onSubmit: () => {},
  });

  const openPopup = () => {
    if (!isValid || !dirty || isSaving) return;
    setErrorMessage(null);
    setShowConfirmPopup(true);
  };

  const changePassword = async () => {
    if (isSaving) return;

    setShowConfirmPopup(false);
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await changePasswordForCurrentUser({
      currentPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmNewPassword: values.confirmPassword,
    });

    setIsSaving(false);

    if (!result.success) {
      setErrorMessage(result.message || "Unable to change password.");
      return;
    }

    setSuccessMessage(result.message || "Password changed successfully.");
    resetForm();
  };

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}>
        <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
          <View style={globalStyles.container}>
            <GoBack />
            <Text style={[globalStyles.titleLeft, styles.title]}>Change Password</Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
              Keep your account secure and up to date
            </Text>

            <View style={styles.passwordContainer}>
              <InputField
                title="Old Password"
                placeholder="Enter your current password"
                value={values.oldPassword}
                onChangeText={handleChange("oldPassword")}
                onBlur={handleBlur("oldPassword")}
                error={touched.oldPassword && errors.oldPassword ? errors.oldPassword : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="password"
                autoComplete="password"
              />
              <InputField
                title="New Password"
                placeholder="Enter a new password"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={touched.newPassword && errors.newPassword ? errors.newPassword : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
              />
              <InputField
                title="Confirm New Password"
                placeholder="Confirm your new password"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
              />

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

              <View style={styles.changePasswordButton}>
                <Button
                  title={isSaving ? "Changing..." : "Change Password"}
                  variant={isValid && dirty ? "fill" : "nonActive"}
                  onPress={openPopup}
                  disabled={!isValid || !dirty || isSaving}
                />
              </View>
            </View>
          </View>
        </Pressable>
      </SafeAreaView>
      <Popup
        visible={showConfirmPopup}
        title="Change password"
        message="Are you sure you want to update your password?"
        confirmTitle="Save Changes"
        confirmLoading={isSaving}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={changePassword}
      />
    </GradientView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  pressable: { flex: 1 },
  title: { marginBottom: 0, marginTop: 24 },
  subtitle: { textAlign: "left", marginTop: 8 },
  passwordContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  changePasswordButton: { marginTop: 16 },
  errorText: { color: "#D62828", fontFamily: "DMSans-Regular" },
  successText: { color: "#177245", fontFamily: "DMSans-Regular" },
});
