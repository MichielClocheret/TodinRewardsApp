import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import globalStyles from '@/app/css/styles';
import GoBack from '@/app/components/GoBack';
import colors from '@/app/css/colors';
import NotificationField from '@/app/components/NotificationField';

const rewardsPerks = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.container, styles.screenContent]}>
            <GoBack/>
            <Text style={[globalStyles.titleLeft, {marginTop:24}]}>Rewards & Perks</Text>
            <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>Manage referral codes, invites, and earnings</Text>

            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[globalStyles.bannerText, {color:colors.black, textAlign:"left"}]}>
                        Overview
                    </Text>
                    <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>
                        Track your referrals and rewards in one place
                    </Text>
                </View>
                <View style={styles.content}>
                    <NotificationField
                    title='Show Rewards Summary'
                    subtitle='Display an overview of your perks and rewards'    
                    />
                    <NotificationField
                    title='Show Rewards Summary'
                    subtitle='Display an overview of your perks and rewards'    
                    />
                    <NotificationField
                    title='Show Rewards Summary'
                    subtitle='Display an overview of your perks and rewards'    
                    />
                </View>
            </View>

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[globalStyles.bannerText, {color:colors.black, textAlign:"left"}]}>
                        Daily Streaks
                    </Text>
                    <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>
                        Manage your check-ins and streak progress
                    </Text>
                </View>
                <View style={styles.content}>
                    <NotificationField
                    title='Daily Check-In Reminder'
                    subtitle='Receive reminders to log in daily and keep your streak alive'    
                    />
                    <NotificationField
                    title='Streak Progress Display '
                    subtitle='Show your current streak progress and milestones'    
                    />
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[globalStyles.bannerText, {color:colors.black, textAlign:"left"}]}>
                        Tiers & Levels
                    </Text>
                    <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>
                        Monitor your tier benefits and progress
                    </Text>
                </View>
                <View style={styles.content}>
                    <NotificationField
                    title='Show Tier Progress'
                    subtitle='Display your current tier and progress towards the next level'    
                    />
                    <NotificationField
                    title='Tier Expiry Reminder'
                    subtitle='Get alerts when your tier is about to expire'    
                    />
                    <NotificationField
                    title='Enable Upcoming Rewards Alerts'
                    subtitle='Receive notifications about rewards that are on the way'    
                    />
                </View>
            </View>
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

export default rewardsPerks

const styles = StyleSheet.create({
    screenContent:{
        flex:1,
    },
    scrollArea:{
        flex:1,
    },
    scrollContent:{
        paddingBottom:24,
    },
    container:{
        marginTop:16,
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.stroke,
        padding:16,
        borderRadius:20,
    },
        header:{
        marginBottom:20
    },
    content:{
        display:"flex",
        flexDirection:"column",
        gap:8
    },
})
