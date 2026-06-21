import { GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import React from "react";
import globalStyles from "@/app/css/styles";

type BottomBannerProps = {
  text: string;
  blueText: string;
  onPress?: (event: GestureResponderEvent) => void;
};

const BottomBanner = ({ text, blueText, onPress }: BottomBannerProps) => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.bannerText}>
        {text}{" "}
        <Text style={globalStyles.bannerTextBlue} onPress={onPress}>
          {blueText}
        </Text>
      </Text>
    </View>
  );
};

export default BottomBanner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
});
