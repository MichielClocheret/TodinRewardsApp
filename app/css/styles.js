import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  gradient: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white
  },

  container: {
    flex: 1,
    paddingHorizontal:12
  },

  bigTitleMid:{
    colors:colors.black,
    textAlign: "center",
    fontFamily:"DMSans-Medium",
    fontSize:32,
    fontStyle:"normal",
    fontWeight:500,
    lineHeight:38.4,
    letterSpacing:-0.512
  },

  titleMid: {
    margin: 0,
    marginBottom: 8,
    textAlign: "center",
    color: colors.black,
    fontFamily: "DMSans-Medium",
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: -0.048,
  },

  titleLeft: {
    margin: 0,
    marginBottom: 8,
    color: colors.black,
    fontFamily: "DMSans-Medium",
    fontSize: 24,
    fontStyle:"normal",
    fontWeight: 500,
    letterSpacing: -0.048,
  },
    profileTitle: {
    margin: 0,
    paddingVertical:4,
    color: colors.black,
    fontFamily: "DMSans",
    fontSize: 24,
    fontStyle:"normal",
    fontWeight: 700,
    lineHeight:24,
    letterSpacing: -0.048,
  },

  titleInput:{
    margin:0,
    paddingHorizontal:10,
    colors: colors.black,
    fontFamily: "DMSans-Medium",
    fontSize:14,
    fontWeight:500,
    letterSpacing:0.014
  },
    
  inputFieldsContainer:{
    display:"flex",
    flexDirection:"column",
    gap:12
  },

  subTitle: {
    margin: 0,
    textAlign: "center",
    color: colors.grey3,
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    lineHeight:24,
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: 0.014,
  },
  bannerText: {
    margin: 0,
    textAlign: "center",
    color: colors.grey,
    fontFamily: "DMSans-Medium",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: 0.014,
  },
  bannerTextBlue: {
    margin: 0,
    textAlign: "center",
    color: colors.todinBlue,
    fontFamily: "DMSans-Medium",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: 0.014,
  },
});
