import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../css/colors";

type WithdrawValueProps = {
  title: number;
  isSelected?: boolean;
  onPress?: () => void;
};

const WithdrawValue = ({
  title,
  isSelected = false,
  onPress,
}: WithdrawValueProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.withdrawValueContainer,
          isSelected && styles.withdrawValueContainerSelected,
        ]}
      >
        <Text style={[styles.withdrawValueText, isSelected && styles.withdrawValueTextSelected]}>
          {title}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default WithdrawValue;

const styles = StyleSheet.create({
  withdrawValueContainer: {
    backgroundColor: colors.stroke,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
    borderRadius: 999,
  },
  withdrawValueContainerSelected: {
    backgroundColor: colors.todinBlue,
  },
  withdrawValueText: {
    color: colors.black,
    fontFamily: "DMSans-Medium",
  },
  withdrawValueTextSelected: {
    color: colors.white,
  },
});
