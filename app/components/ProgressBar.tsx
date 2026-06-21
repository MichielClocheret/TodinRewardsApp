import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '../css/colors'

type Props = {
  value: number;
  max: number;
};

const ProgressBar = ({ value, max }: Props) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarValue, { width: `${percentage}%` }]} />
    </View>
  )
}

export default ProgressBar

const styles = StyleSheet.create({
    progressBarContainer:{
        marginTop:12,
        marginBottom:8,
        backgroundColor: colors.stroke,
        height:8,
        borderRadius:999
    },
    progressBarValue:{
        backgroundColor:colors.todinBlue,
        height:8,
        borderRadius:999
    },
})