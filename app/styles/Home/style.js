
import {StyleSheet} from "react-native"
export const HomeStyles = StyleSheet.create({
    banner: {
      resizeMode: "cover",
      justifyContent: "flex-end",
      height: 600,
    },
    long_line : {
      borderBottomColor: '#4D5358',
      borderBottomWidth: 3,
      marginLeft: "6%",
      marginRight: "6%",
    },
    short_line_left : {
      marginRight: 5,
      width: 30,
      height: 3
    },
    short_line_right : {
      marginLeft: 5,
      width: 30,
      height: 3
    },
    banner_bottom: {
      marginLeft: "6%",
      marginRight: "6%",
    },
    banner_bottom_text_left : {
      fontWeight: "600",
      fontSize: 22,
      color: 'rgba(77, 83, 88, 1)',
      textTransform: "uppercase",
    },
    banner_bottom_text_right : {
      fontSize: 20,
      color: 'rgba(77, 83, 88, 1)',
      textTransform: "uppercase",
      textAlign: "right",
      letterSpacing: 5, 
    },
    category_title: {
        height: 60,
        // paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 1000,
    },
    category_title_text : {
        fontSize: 22,
        fontWeight: "bold",
    },
    category_title_text2 : {
        fontSize: 16,
        lineHeight: 19,
        color: "rgba(105, 112, 119, 1)",
    },
    category_title_text2_black : {
        fontSize: 16,
        lineHeight: 19,
        color: "rgba(221, 225, 230, 1)",
    },
    noi_bat: {
      height: 550,
      position: "relative",
    },
    viewpage_area: {
        justifyContent: "flex-end",
        position: "absolute",
        height: 200,
        width: "65%",
        bottom: "10%",
        paddingLeft: 15,
        backgroundColor:"red",
    },
    viewpage_area_text1: {
        color: "#DDE1E6",
        fontSize: 16,
        lineHeight: 19,
        marginBottom:5,
    },
    viewpage_area_text2: {
        color: "#FFFFFF",
        fontSize: 32,
        lineHeight: 39,
        textShadowColor: "rgba(0, 0, 0, 0.25)",
        textShadowOffset: {width: -1, height: 4},
        textShadowRadius: 4,
        marginBottom:10,
    }, 
    viewpage_area_btn: {
        color: "rgba(153, 29, 29, 1)",
        borderColor: "rgba(153, 29, 29, 1)",
        width: "50%",
    },
    product_cat:{
        height: 390,
        padding: 10,
        paddingTop: 0,
    },
    
    product_cat_row:{
        margin: 0,
        height: 150,
    },
    product_cat_item: {
        width: 150,
        height: 150,
        padding: 2,
        marginRight: 20,
        marginBottom: 20,
        position: "relative",
    },
    product_cat_img: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    product_cat_title: {
        marginTop: 5,
        fontSize: 16,
        alignSelf: "center",
    },
    logo_page: {
        backgroundColor: "rgba(18, 22, 25, 1)",
    },
    logo_title: {
        marginTop: 5,
        fontSize: 16,
        alignSelf: "center",
        color: "rgba(242, 244, 248, 1)",
        textTransform: "uppercase",
    },
    
    mix_cat:{
        height: 730,
        padding: 10,
        paddingTop: 0,
    },
    mix_title: {
        marginTop: 5,
        fontSize: 16,
        alignSelf: "flex-start",
        color: "rgba(162, 169, 176, 1)"
    },
    mix_price1_row: {
        marginTop: 5,
    },
    mix_price1: {
        color: "rgba(153, 29, 29, 1)",
        fontSize: 18,
        fontWeight: "bold",
    },
    mix_price1_currency : {
        color: "rgba(153, 29, 29, 1)",
        fontSize: 10,
        marginLeft: 2,
    },
    mix_price2_row: {
        marginTop: 5,
    },
    mix_price2: {
        color: "rgba(105, 112, 119, 1)",
        fontSize: 14,
        fontWeight: "bold",
        textDecorationLine: "line-through",
    },
    mix_price2_currency : {
        color: "rgba(105, 112, 119, 1)",
        fontSize: 10,
        marginLeft: 2,
    },
    favorite_touch:{
        position: "absolute",
        right: 5,
        top: 10,
    },
    favorite_img:{
        width: 35,
        height: 35,
    },
    bottom_section: {
        height: 400,
        backgroundColor: "#6C0F0F",
        position: "relative",
    },
    bottom_text :{
        color: "#F2F4F8",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
        fontSize: 16,
    },
    bottom_logo : {
        marginTop: 80,
        marginBottom: 20,
        alignSelf: "center",
        width: 150,
        height: 80,
        resizeMode: "cover",
    },
    to_top: {
        position: "absolute",
        width: 50,
        height: 50,
        right: 10,
        top: 20,
    }

});