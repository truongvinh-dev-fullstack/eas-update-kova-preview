/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
// import { createStackNavigator } from "@react-navigation/stack"
import {
  createDrawerNavigator
} from "@react-navigation/drawer"
import BottomTabsPaintHouseScreen from './bottom-tab-paint-house'

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */

const Drawer = createDrawerNavigator()

export function SecondNavigator(props: any) {
  let type = props.route.params.params.Type;
  if (type == 0) {
    return (
      <Drawer.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Drawer.Screen name="MainScreen" component={BottomTabsPaintHouseScreen} initialParams={{ screen: 'HouseScreen' }} />
      </Drawer.Navigator>
    )
  }
  if (type == 1) {
    return (
      <Drawer.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Drawer.Screen name="MainScreen" component={BottomTabsPaintHouseScreen} initialParams={{ screen: 'PaintHouseScreen' }}  />
      </Drawer.Navigator>
    )
  }
  if (type == 2) {
    return (
      <Drawer.Navigator
        initialRouteName="MainScreen"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Drawer.Screen name="MainScreen" component={BottomTabsPaintHouseScreen} initialParams={{ screen: 'ListHousePaintedScreen' }} />
      </Drawer.Navigator>
    )
  } else {
    return null;
  }
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["Paint"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
