import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Image } from "react-native";

import globalStyles from "@/app/css/styles.js";
import colors from "../css/colors";
import { LinearGradient } from "expo-linear-gradient";

interface LoadingScreenProps {
  task: () => Promise<() => void>;
}

export default function LoadingScreen({ task }: LoadingScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let navigate: (() => void) | null = null;
    let taskDone = false;
    let timerDone = false;

    const tryNavigate = () => {
      if (taskDone && timerDone && navigate) {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => navigate!());
      }
    };

    task().then((callback) => {
      navigate = callback;
      taskDone = true;
      tryNavigate();
    });

    const timer = setTimeout(() => {
      timerDone = true;
      tryNavigate();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[globalStyles.safeArea, { opacity }]}>
      <LinearGradient
        style={styles.gradient}
        colors={[colors.todinBlueDark, colors.todinBlueLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.5, y: 1.2 }}
      >
        <Image style={styles.logo} source={require('../../assets/media/LogoTodinWhite.png')} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    maxWidth: 100,
    minWidth: 250,
    resizeMode: "contain",
  },
});
