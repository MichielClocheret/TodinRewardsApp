import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'
import colors from '../css/colors';

import globalStyles from '@/app/css/styles';

type notificationFieldProps = {
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}


const notificationField = ({title, subtitle, value, onValueChange}: notificationFieldProps) => {
    return (
    <View style={styles.notificationContainer}>
        <View style={styles.textContainer}>
            <Text style={[globalStyles.bannerText, styles.title]}>
                {title}
            </Text>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>
                {subtitle}
            </Text>
        </View>
        <View style={styles.switchContainer}>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{false: '#D1D1D6', true: colors.todinBlue}}
                ios_backgroundColor="#D1D1D6"
            />
        </View>
    </View>
  )
}

export default notificationField

const styles = StyleSheet.create({
    title:{
        textAlign:"left",
        color:colors.black,
    },
    subtitle:{
        textAlign:"left",
        maxWidth:247,
    },
    textContainer:{
        flex:1,
    },
    notificationContainer:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.stroke,
        paddingVertical:12,
        paddingHorizontal:16,
        borderRadius:12,

        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        gap:20
    },
    switchContainer:{
        justifyContent:"center",
        alignItems:"center",
    },
})
