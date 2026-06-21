import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import colors from "@/app/css/colors";
import Check from "@/assets/media/Check.svg";
import Cross from "@/assets/media/Cross.svg";

type ConfirmationPopupProps = {
  variant: "success" | "error";
  message: string;
  visible?: boolean;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
};

const popupVariants = {
  success: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.green,
  },
  error: {
    backgroundColor: colors.lightRed,
    borderColor: colors.red,
  },
} as const;

export default function ConfirmationPopup({
  variant,
  message,
  visible = true,
  style,
}: ConfirmationPopupProps) {
  if (!visible) {
    return null;
  }

  const currentVariant = popupVariants[variant];
  const StatusIcon = variant === "success" ? Check : Cross;

  return (
    <View style={[styles.container, 
        {backgroundColor: currentVariant.backgroundColor, borderColor: currentVariant.borderColor}
        ,style,]}>
      <View style={styles.content}>
        <View style={styles.statusIcon}>
          <StatusIcon width={24} height={24} />
        </View>

        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 16,
    padding:12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  statusIcon: {
    marginTop: 2,
  },
  message: {
    flex: 1,
    color: colors.black,
    fontFamily: "DMSans-Medium",
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
});
