import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import colors from '../css/colors';

import globalStyles from '@/app/css/styles';
import Button from './Button';
import Arrow from "@/assets/media/ArrowUpRight.svg";

type QuestProps = {
    title: string;
    subTitle: string;
    earn: string;
    link?: string;
    current?: number;
    total?: number;
    icon?: ReactNode;
    onClaim?: () => void;
}

const Quest = ({title, subTitle, earn, link, current, total, icon, onClaim}: QuestProps) => {
    const hasProgress = current !== undefined && total !== undefined;
    const safeCurrent = current ?? 0;
    const safeTotal = total ?? 0;
    const progress = safeTotal > 0 ? Math.min(safeCurrent / safeTotal, 1) : 0;
    const isClaimable = hasProgress && safeTotal > 0 && safeCurrent === safeTotal;

  return (
    <View style={styles.questContainer}>
        <View style={styles.iconContainer}>
            {icon}
        </View>
        <View style={{marginVertical:8}}>
            <View style={styles.titleContainer}>
                <Text style={[globalStyles.subTitle, styles.title]}>{title}</Text>
                <Text style={[globalStyles.bannerText, styles.earnBadge]}>{earn}</Text>
            </View>
            <Text style={[globalStyles.subTitle, styles.subtitle]}>{subTitle}</Text>
            {link ? (
                <View style={styles.connectLink}>
                    <Text style={[globalStyles.bannerTextBlue, styles.linkText]}>{link}</Text>
                    <Arrow width={16} height={16}/>
                </View>
            ) : null}
        </View>
        {hasProgress ? (
            isClaimable ? (
            <Button
                title="Claim Reward"
                variant="blue"
                fullWidth
                onPress={onClaim}
                paddingVertical={8}
                fontSize={14}
            />
        ) : (
            <View style={styles.processBar}>
                <View style={[styles.processFill, { width: `${progress * 100}%` }]} />
                <Text style={styles.processText}>{safeCurrent}/{safeTotal}</Text>
            </View>
        )
        ) : null}
    </View>
  )
}

export default Quest

const styles = StyleSheet.create({
    questContainer:{
        backgroundColor:colors.white,
        borderWidth:1,
        borderColor:colors.stroke,
        paddingHorizontal:10,
        paddingVertical:12,
        borderRadius:12
    },
    iconContainer:{
        width:40,
        height:40,
        backgroundColor:colors.stroke,
        borderRadius:999,
        alignItems:"center",
        justifyContent:"center"
    },
    titleContainer:{
        display:"flex",
        flexDirection:"row",
        gap:8,
    },
    title:{
        color:colors.black,
        textAlign:"left",
        fontFamily:"DMSans-Medium",
    },
    subtitle:{
        textAlign:"left",
        fontFamily:"DMSans-Medium",
        lineHeight:20
    },
    connectLink:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:4,
        marginTop:4,
    },
    linkText:{
        textAlign:"left",
        fontSize:14,
    },
    earnBadge:{
        backgroundColor:colors.todinBlueBackground,
        paddingHorizontal:8,
        paddingVertical:5,
        borderRadius:999,
        color:colors.todinBlue,
        fontSize:12,
        fontFamily:"DMSans-Medium",
    },
    processBar:{
        backgroundColor:colors.stroke,
        borderRadius:999,
        alignItems:"center",
        justifyContent:"center",
        height:24,
        overflow:"hidden",
        position:"relative"
    },
    processFill:{
        position:"absolute",
        left:0,
        top:0,
        bottom:0,
        backgroundColor:colors.todinBlue,
        borderRadius:999,
    },
    processText:{
        color:colors.black,
        fontFamily:"DMSans-Medium",
        fontSize:12,
        zIndex:1,
    }
})
