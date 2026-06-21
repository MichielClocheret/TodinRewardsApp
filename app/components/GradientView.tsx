import { ReactNode } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../css/colors'

type GradientViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'card' | 'screen';
};

const GradientView = ({
  children,
  style,
  variant = 'card',
}: GradientViewProps) => {
  return (
    <LinearGradient
      style={[variant === 'screen' ? styles.screen : styles.card, style]}
      colors={[colors.white, colors.todinBlueLight2]}
      start={{ x: 0, y: 0 }}
      end={variant === 'screen' ? { x: 0, y: 1 } : { x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  )
}

export default GradientView

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: 20,
    borderRadius: 20,
  }
})
