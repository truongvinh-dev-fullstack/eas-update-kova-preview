import React from "react"
import {
  View, StyleSheet, TouchableOpacity, Platform,
  // Dimensions,
} from "react-native"
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import { faCamera, faPaintRoller, faGift, faStoreAlt, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  GiftScreen,
  HomeScreen,
  HouseScreen,
  ListHousePaintedScreen,
  RankingScreen,
} from "../screens"
import { useNavigation } from "@react-navigation/native"

const getTabBarIcon = (name) => ({ color, size }: { color: string; size: number }) => (
  <FontAwesomeIcon icon={name} color={color} size={size} />
)

const BottomTabs = createBottomTabNavigator()

export default function BottomTabsScreen(props) {
  const navigation = useNavigation();
  // function goToScreen(page: string) {
  //   navigation && navigation.navigate(page);
  // }
  return (
    <>
      <BottomTabs.Navigator
        tabBar={(props) => (
          <View style={Platform.OS === "ios" ? styles.navigatorContainer : styles.navigatorContainerAndroid}>
            <BottomTabBar {...props} />
          </View>
        )}
        tabBarOptions={{
          style: styles.navigator, showLabel: false, tabStyle: { height: 53 },
          activeTintColor: "#E55300",
          inactiveTintColor: "white",
        }}
        initialRouteName="Trang chủ">
        <BottomTabs.Screen
          key={`home`}
          name={`home`}
          component={HomeScreen}
          options={{
            tabBarIcon: getTabBarIcon(faStoreAlt),
            tabBarVisible: true,
          }}
        />
        <BottomTabs.Screen
          key={`rank`}
          name={`rank`}
          component={RankingScreen}
          options={{
            tabBarIcon: getTabBarIcon(faTrophy),
            tabBarVisible: true,
          }}
        />
        <BottomTabs.Screen
          key={`paint`}
          name={`paint`}
          component={HouseScreen}
          options={{
            tabBarIcon: getTabBarIcon(faPaintRoller),
            tabBarVisible: true,
            tabBarButton: (props) => (
              <TouchableOpacity  {...props} onPress={() => navigation && navigation.navigate("SecondNavigator", {
                params: { Type: 0 }
              })} />
            )
          }}
        />
        <BottomTabs.Screen
          key={`gift`}
          name={`gift`}
          component={GiftScreen}
          options={{
            tabBarIcon: getTabBarIcon(faGift),
            tabBarVisible: true,
          }}
        />
        <BottomTabs.Screen
          key={`camera`}
          name={`camera`}
          component={ListHousePaintedScreen}
          options={{
            tabBarIcon: getTabBarIcon(faCamera),
            tabBarVisible: true,
            tabBarButton: (props) => (
              <TouchableOpacity  {...props} onPress={() => navigation && navigation.navigate("SecondNavigator", {
                params: { Type: 2 }
              })} />
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
  button: {
  },
  navigatorContainer: {
    bottom: 16,
    position: 'absolute',
    width: '100%'
  },
  navigatorContainerAndroid: {
    bottom: 1,
    position: 'absolute',
    width: '100%'
  },
  navigator: {
    backgroundColor: "black",
    bottom: 0,
    marginHorizontal: 16,
    borderRadius: 16,
    height: 53,
    borderTopWidth: 0,
  }
})
