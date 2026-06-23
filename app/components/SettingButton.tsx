import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { type SvgProps } from 'react-native-svg'

import globalStyles from '@/app/css/styles';
import colors from '../css/colors';

type settingButtonProps = {
    title: string;
    image: React.FC<SvgProps>;
    onPress?: (event: GestureResponderEvent) => void;

}

const SettingButton = ({title, image, onPress} : settingButtonProps) => {
  const Icon = image;

  return (
    <TouchableOpacity onPress={onPress}>
        <View style={styles.profileButtonContainer}>
            <Icon width={20} height={20} />
            <Text style={[globalStyles.bannerText, styles.text]}>{title}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default SettingButton

const styles = StyleSheet.create({
profileButtonContainer:{
    display:"flex",
    flexDirection:"row",
    gap:12,
    alignItems:"center",
    paddingVertical:4,
},
text:{
    textAlign:"left",
    color:colors.black,
    fontFamily:"DMSans"
}
})
