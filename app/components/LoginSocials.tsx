import { StyleSheet, Image, View } from 'react-native'
import React from 'react'
import colors from '../css/colors'
import globalStyles from '@/app/css/styles';

const LoginSocials = () => {
  return (
    <View style={globalStyles.safeArea}>
      <View style={styles.socialContainer}>
        <View style={styles.social}>
            <Image style={styles.socialIcon} source={require("@/assets/media/GoogleIcon.png")}/>
        </View>
        <View style={styles.social}>
            <Image style={styles.socialIcon} source={require("@/assets/media/FacebookIcon.png")}/>
        </View>
        <View style={styles.social}>
            <Image style={styles.socialIcon} source={require("@/assets/media/AppleIcon.png")}/>
        </View>
      </View>
    </View>
  )
}

export default LoginSocials

const styles = StyleSheet.create({
    socialContainer:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        gap:12,
        paddingBottom:12
    },
    social:{
        paddingHorizontal:30,
        paddingVertical:12,
        borderWidth: 1,
        alignSelf:"flex-start",
        borderColor:colors.stroke,
        borderRadius:48
    },
    socialIcon:{
        width:20,
        height:20,
        marginHorizontal:13,
        marginVertical:2,
        resizeMode:"contain"
    }
})