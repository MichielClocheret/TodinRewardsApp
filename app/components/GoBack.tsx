import { StyleSheet, Image, Pressable, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import colors from "../css/colors";

interface GoBackProps {
  onPress?: () => void;
}

const GoBack = ({ onPress }: GoBackProps) => {
  const navigation = useNavigation();

  return (
    <View style={{marginTop:32}}>
      <Pressable style={styles.iconContainer}
        onPress={onPress ?? (() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        })}>
        <Image style={styles.goBackIcon}
          source={require("@/assets/media/GoBackIcon.png")}/>
      </Pressable>
    </View>
  );
};

export default GoBack;

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 999,
    alignSelf: "flex-start",
    padding: 12,
    borderColor: colors.stroke,
  },
  goBackIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});
