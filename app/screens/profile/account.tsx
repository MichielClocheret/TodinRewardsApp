import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccountInfo, getAccountInfo, updateProfile } from "@/app/API/authentication";
import GoBack from "@/app/components/GoBack";
import globalStyles from "@/app/css/styles";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import Popup from "@/app/components/popup";
import GradientView from "@/app/components/GradientView";

import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
});

export default function Account() {
  const [accountData, setAccountData] = useState<AccountInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, isValid, dirty } = useFormik({
    initialValues: {
      firstName: typeof accountData?.firstname === "string" ? accountData.firstname : "",
      lastName: typeof accountData?.lastname === "string" ? accountData.lastname : "",
      email: typeof accountData?.email === "string" ? accountData.email : "",
    },
    validationSchema,
    enableReinitialize: true,
    validateOnMount: false,
    onSubmit: () => {},
  });

  useEffect(() => {
    const loadAccount = async () => {
      const result = await getAccountInfo();

      if (!result.success) {
        setLoadError(result.message || "Unable to load account info.");
        setIsLoading(false);
        return;
      }

      setAccountData(result.data || null);
      setIsLoading(false);
    };

    loadAccount();
  }, []);

  const openPopup = () => {
    if (!isValid || !dirty || isSaving) return;
    setSaveError(null);
    setShowConfirmPopup(true);
  };

  const saveChanges = async () => {
    if (isSaving) return;

    setShowConfirmPopup(false);
    setIsSaving(true);
    setSaveError(null);
    setSuccessMessage(null);

    const initialEmail = typeof accountData?.email === "string" ? accountData.email : "";

    const result = await updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim() !== initialEmail ? values.email.trim() : undefined,
    });

    setIsSaving(false);

    if (!result.success) {
      setSaveError(result.message || "Unable to save profile changes.");
      return;
    }

    const nameChanged =
      values.firstName.trim() !== (accountData?.firstname ?? "") ||
      values.lastName.trim() !== (accountData?.lastname ?? "");
    const emailChanged = values.email.trim() !== initialEmail;

    setAccountData((current: typeof accountData) => ({
      ...(current || {}),
      firstname: values.firstName.trim(),
      lastname: values.lastName.trim(),
      email: values.email.trim(),
    }));
    setSuccessMessage(result.message || "Profile updated successfully.");
  };

  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}>
        <View style={globalStyles.container}>
          <GoBack />
          <Text style={[globalStyles.titleLeft, { marginBottom: 0, marginTop: 24 }]}>Account</Text>
          <Text style={[globalStyles.subTitle, { textAlign: "left", marginBottom: 8 }]}>
            Manage your profile details
          </Text>

          {isLoading ? (
            <Text style={globalStyles.subTitle}>Loading account...</Text>
          ) : loadError ? (
            <>
              <Text style={globalStyles.titleLeft}>Could not load account</Text>
              <Text style={globalStyles.subTitle}>{loadError}</Text>
            </>
          ) : (
            <View>
              <View style={styles.accountInputs}>
                <InputField
                  title="First Name"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                  autoCapitalize="words"
                />
                <InputField
                  title="Last Name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                  autoCapitalize="words"
                />
                <InputField
                  title="Email Address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email ? errors.email : undefined}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
              {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
              <Button
                title={isSaving ? "Saving..." : "Save Changes"}
                variant={isValid && dirty ? "fill" : "nonActive"}
                onPress={openPopup}
                disabled={!isValid || !dirty || isSaving}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
      <Popup
        visible={showConfirmPopup}
        title="Save profile changes"
        message="Are you sure you want to update your name and email?"
        confirmTitle="Save Changes"
        confirmLoading={isSaving}
        confirmLoadingTitle="Saving..."
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={saveChanges}
      />
    </GradientView>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  accountInputs: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginVertical: 16,
  },
  errorText: {
    marginBottom: 12,
    color: "#D62828",
    fontFamily: "DMSans-Regular",
  },
  successText: {
    marginBottom: 12,
    color: "#177245",
    fontFamily: "DMSans-Regular",
  },
});
