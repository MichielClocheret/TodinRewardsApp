import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
} from "react-native";
import React from "react";

import globalStyle from "@/app/css/styles";
import colors from "@/app/css/colors";

type InputFieldProps = {
  title: string;
  tinyText?: string;
  tinyTextOnPress?: (event: GestureResponderEvent) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  textContentType?:
    | "none"
    | "password"
    | "newPassword"
    | "oneTimeCode"
    | "username"
    | "emailAddress";
  autoComplete?:
    | "off"
    | "password"
    | "new-password"
    | "email"
    | "username";
  error?: string;
};

const InputField = ({
  title,
  tinyText,
  tinyTextOnPress,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  secureTextEntry = false,
  textContentType,
  autoComplete,
  error,
}: InputFieldProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Text style={globalStyle.titleInput}>{title}</Text>
        {tinyText ? (
          <Text style={styles.tinyText} onPress={tinyTextOnPress}>
            {tinyText}
          </Text>
        ) : null}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        autoComplete={autoComplete}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tinyText: {
    color: colors.todinBlue,
    fontFamily: "DMSans-Medium",
    fontSize: 14,
  },

  input: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    fontFamily: "DMSans-Regular",
    borderColor: colors.stroke,
    borderRadius: 100,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 16,
  },

  errorText: {
    paddingHorizontal: 10,
    color: "red",
    fontFamily: "DMSans-Regular",
    fontSize: 12,
  },
});
