import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../css/colors';

import globalStyles from '@/app/css/styles';

type StatsReferralProps = {
    title: string;
    stats: string;
    insight: string;
    icon?: React.ReactNode;
    insightIcon?: React.ReactNode;
}


const StatsReferral = ({title, stats, insight, icon, insightIcon}: StatsReferralProps) => {
  return (
    <View style={styles.container}>
        {icon ? (
            <View style={styles.iconContainer}>
                {icon}
            </View>
        ) : null}
        <View style={styles.statsContainer}>
            <Text style={[globalStyles.bannerText, {color:colors.black, textAlign:"left", marginBottom:8}]}>{title}</Text>

            <View style={styles.statsInsightContainer}>
                <Text style={[globalStyles.titleLeft, {marginBottom:0}]}>{stats}</Text>
                <View style={styles.insightContainer}>
                    {insightIcon ? (
                        <View style={styles.insightIconContainer}>
                            {insightIcon}
                        </View>
                    ) : null}
                    <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>{insight}</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default StatsReferral

const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.stroke,
        padding:16,
        borderRadius:16
    },
    iconContainer:{
        marginBottom:16,
        backgroundColor:colors.stroke,
        alignSelf:"flex-start",
        padding:12,
        borderRadius:999,
    },
    statsContainer:{
        display:"flex",
        flexDirection:"column",
        gap:8
    },
    statsInsightContainer:{
        flexDirection:"row",
        alignItems:"center",
        gap:4
    },
    insightContainer:{
        flexDirection:"row",
        alignItems:"center",
        gap:4,
    },
    insightIconContainer:{
        justifyContent:"center",
        alignItems:"center",
    },
})
