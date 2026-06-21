import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NotificationField from '@/app/components/NotificationField'
import { SafeAreaView } from 'react-native-safe-area-context'

import globalStyles from '@/app/css/styles';
import GoBack from '@/app/components/GoBack';
import GradientView from '@/app/components/GradientView';
import { useAppDispatch, useAppSelector } from '@/app/hooks/reduxHooks';
import { toggleNewsNotifications } from '@/app/store/settings/slice';

const notifications = () => {
  const dispatch = useAppDispatch();
  const newsEnabled = useAppSelector((state) => state.settings.newsNotificationsEnabled);

  const handleNewsToggle = () => {
    if (newsEnabled) {
      Alert.alert(
        'Turn off notifications?',
        'You will no longer receive news updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Turn off', style: 'destructive', onPress: () => dispatch(toggleNewsNotifications()) },
        ]
      );
    } else {
      dispatch(toggleNewsNotifications());
    }
  };

  return (
    <GradientView
      variant="screen"
      style={globalStyles.gradient}
    >
    <SafeAreaView style={[globalStyles.safeArea, {backgroundColor:"transparent"}]}>
        <ScrollView
            style={globalStyles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerContainer}>
                <GoBack/>
                <Text style={[globalStyles.titleLeft, {marginBottom:4, marginTop:24}]}>Notification</Text>
                <Text style={[globalStyles.subTitle, {textAlign:"left"}]}>Stay informed with the updates that matter to you</Text>
            </View>
            
            <View style={styles.notificationsContainer}>
                <NotificationField
                    title="News"
                    subtitle="Stay informed when you added a new favourite shop."
                    value={newsEnabled}
                    onValueChange={handleNewsToggle}
                />
                {/* <NotificationField 
                    title="Security Alerts" 
                    subtitle="Stay protected with instant security alerts."
                />
                <NotificationField 
                    title="Event Activity" 
                    subtitle="Stay updated on upcoming activities."
                />
                <NotificationField 
                    title="Referral Updates" 
                    subtitle="Get notified when friends join and rewards are unlocked."
                />
                <NotificationField 
                    title="Rewards Notifications" 
                    subtitle="Stay updated on bonuses, cashback, and special perks."
                />
                <NotificationField 
                    title="Promotions" 
                    subtitle="Hear about new offers, events, and product updates first."
                /> */}
            </View>
        </ScrollView>
    </SafeAreaView>
    </GradientView>



  )
}

export default notifications

const styles = StyleSheet.create({
    scrollContent:{
        paddingBottom:24,
    },
    headerContainer:{
        marginBottom:16
    },
    notificationsContainer:{
        display:"flex",
        flexDirection:"column",
        gap:8
    }
})
