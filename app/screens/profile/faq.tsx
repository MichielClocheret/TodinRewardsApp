import { StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview';
import React from 'react'
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from "@/app/css/styles";
import GoBack from '@/app/components/GoBack';
import colors from '@/app/css/colors';

const faq = () => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.container}>
            <GoBack/>
            <WebView
            style={styles.webview}
            source={{ uri: 'https://todin.be' }} />
        </View>
    </SafeAreaView>

  )
}

export default faq

const styles = StyleSheet.create({
    webview:{
        flex:1,
        marginTop:24,
        borderRadius:20,
        borderWidth:1,
        borderColor:colors.stroke,
    },
})