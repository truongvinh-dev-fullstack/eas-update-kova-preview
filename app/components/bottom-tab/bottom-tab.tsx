import * as React from "react"
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { flatten } from "ramda"
import { AntDesign } from "@expo/vector-icons"
import { Feather } from "@expo/vector-icons"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface BottomTabProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  screen?: string,
}

/**
 * Describe your component here
 */
export const BottomTab = observer(function BottomTab(props: BottomTabProps) {
  const {
    style,
    screen,
  } = props
  const styles = flatten([CONTAINER, style])
  const navigation = useNavigation()

  const goToScreen = (page) => {
    navigation && navigation.navigate(page)
  }

  return (
    <View style={[styles, bottomTabStyles.container]}>
      {
        (screen == "home") ?
          <View style={[bottomTabStyles.background]}>
            <TouchableOpacity onPress={() => goToScreen("HomeScreen")}>
              <AntDesign name="home" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToScreen("RankingScreen")}>
              <AntDesign name="Trophy" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={bottomTabStyles.store} onPress={() => goToScreen("HouseScreen")}>
              <LinearGradient colors={["#DB2323", "#E55300"]} style={bottomTabStyles.store_btn}>
                <FontAwesome5 name="paint-roller" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goToScreen("GiftScreen")} >
              <Feather name="gift" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View> : <View />
      }
    </View>
  )
})

export const bottomTabStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  background: {
    width: "100%",
    backgroundColor: "#142433",
    height: 53,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  store: {
    width: 39,
    height: 38,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  store_btn: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
})
