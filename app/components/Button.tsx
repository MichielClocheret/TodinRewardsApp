import React from "react";
import { StyleSheet, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import colors from "../css/colors";

type ButtonProps = {
  title: string;
  variant?: "fill" | "blue" | "stroke" | "nonActive" | "none";
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  paddingVertical?: number;
  paddingHorizontal?: number;
  fontSize?: number;
  fullWidth?: boolean;
};

const Button = ({
  title,
  variant = "fill",
  onPress,
  disabled = false,
  paddingVertical,
  paddingHorizontal,
  fontSize,
  fullWidth = false,
}: ButtonProps) => {
  const isDisabled = disabled || variant === "nonActive";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        paddingVertical !== undefined && { paddingVertical },
        paddingHorizontal !== undefined && { paddingHorizontal },
        variant === "fill" && styles.fillButton,
        variant === "blue" && styles.blueButton,
        variant === "stroke" && styles.strokeButton,
        variant === "nonActive" && styles.nonActiveButton,
        variant === "none" && styles.noneButton,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.buttonText,
          fontSize !== undefined && { fontSize },
          (variant === "fill" || variant === "blue") && styles.fillText,
          (variant === "stroke" || variant === "none") && styles.strokeText,
          variant === "nonActive" && styles.nonActiveText,
          variant === "none" && styles.noneText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  fullWidth: {
    width: "100%",
  },

  fillButton: {
    backgroundColor: colors.black,
  },

  blueButton: {
    backgroundColor: colors.todinBlue,
  },

  strokeButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
  },

  nonActiveButton:{
    backgroundColor: colors.nonActive,
  },

  noneButton: {
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 0,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
  },

  fillText: {
    color: colors.white,
  },

  strokeText: {
    color: colors.black,
  },

  nonActiveText:{
    color:colors.grey,
  },

  noneText: {
    color: colors.grey,
  }
});
