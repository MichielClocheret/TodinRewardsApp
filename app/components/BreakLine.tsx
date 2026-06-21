import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../css/colors'

type BreakLineProps = {
    text: string,
}

const BreakLine = ({text}: BreakLineProps) => {
  return (
    <View style={styles.breakContainer}>
        <View style={styles.line} />
        <Text style={styles.breakText}>{text}</Text>
        <View style={styles.line} />
    </View>
  )
}

export default BreakLine

const styles = StyleSheet.create({
  breakContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical:8,
    marginVertical:24
  },
  line:{
    flex: 1,
    height: 1,
    backgroundColor: colors.stroke,
  },
  breakText:{
    paddingHorizontal: 16,
    marginHorizontal:8,
    fontSize: 12,
    color: colors.grey4,
  }
})