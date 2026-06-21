import { StyleSheet, Text, View } from "react-native";
import Check from '@/assets/media/Check2.svg';
import colors from "../css/colors";

type DayProps = {
    title: string;
  active: boolean;
};

const Day = ({ title, active }: DayProps) => {
  return (
    <View style={styles.dayContainer}>
      <Text>{title}</Text>
      {active && 
      <View style={styles.active}>
        <Check width={15.6} height={11.2}/>
      </View>}
      
      {active == false && 
        <View style={styles.nonActive}/>}
    </View>
  );
};

export default Day;


const styles = StyleSheet.create({
    dayContainer:{
        display:"flex",
        gap:10,
    },
    active:{
        width:32,
        height:32,
        borderRadius:99,
        padding:12,
        backgroundColor:colors.todinBlue,
        alignItems: "center",
        justifyContent: "center",
    },
    nonActive:{
        width:32,
        height:32,
        borderRadius:99,
        padding:12,
        backgroundColor:colors.grey5,
        alignItems: "center",
        justifyContent: "center",
    },
})