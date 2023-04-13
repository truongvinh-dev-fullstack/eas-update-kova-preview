import React from "react"
import {
  View, StyleSheet, TouchableOpacity,
  // Dimensions,
} from "react-native"
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import { faHome, faPaintRoller, faAtom, faBookOpen, faImage } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  HouseScreen, ListColorScreen, ListHousePaintedScreen, PaintHouseScreen,
} from "../screens"
import { useNavigation } from "@react-navigation/native"

const getTabBarIcon = (name) => ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={name} color={color} size={size} />
)

const bottomItems = [
  {
    name: "HouseScreen",
    component: HouseScreen,
    title: "HouseScreen",
    icon: getTabBarIcon(faBookOpen),
    isVisible: true
  },
  {
    name: "ListHousePaintedScreen",
    component: ListHousePaintedScreen,
    title: "ListHousePaintedScreen",
    icon: getTabBarIcon(faImage),
    isVisible: true
  },
  {
    name: "PaintHouseScreen",
    component: PaintHouseScreen,
    title: "PaintHouseScreen",
    icon: getTabBarIcon(faPaintRoller),
    isVisible: true
  },
  {
    name: "ListColorScreen",
    component: ListColorScreen,
    title: "ListColorScreen",
    icon: getTabBarIcon(faAtom),
    isVisible: true
  },
]

const BottomTabs = createBottomTabNavigator()

export default function BottomTabsPaintHouseScreen() {
  const navigation = useNavigation();
  return (
    <>
      <BottomTabs.Navigator
        tabBar={(props) => (
          <View style={styles.navigatorContainer}>
            <BottomTabBar {...props} />
          </View>
        )}
        tabBarOptions={{
          style: styles.navigator, showLabel: false, tabStyle: { height: 53 },
          activeTintColor: "#E55300",
          inactiveTintColor: "white",

        }}
        initialRouteName="Paint">
        {bottomItems.map((item) => (
          <BottomTabs.Screen
            key={item.name}
            name={item.name}
            component={item.component}
            options={{
              title: item.title,
              tabBarIcon: item.icon,
              tabBarLabel: item.title,
              tabBarVisible: item.isVisible,
            }}
          />

        ))}
        <BottomTabs.Screen
          key={`home`}
          name={`home`}
          component={HouseScreen}
          options={{
            tabBarIcon: getTabBarIcon(faHome),
            tabBarVisible: true,
            tabBarButton: (props) => (
              <TouchableOpacity  {...props} onPress={() => navigation && navigation.navigate("primaryStack")} />
            )
          }}
        />
      </BottomTabs.Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
  },
  button: {},
  navigatorContainer: {
    marginBottom: -53
  },
  navigator: {
    zIndex: 99,
    backgroundColor: "#142433",
    bottom: 72,
    marginHorizontal: 16,
    borderRadius: 16,
    height: 53,
    borderTopWidth: 0
  }
})
