/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your PrimaryNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { PrimaryNavigator } from "./primary-navigator"
import { SecondNavigator } from "./second-navigator"
// import { createDrawerNavigator } from "@react-navigation/drawer"
// import BottomTabsScreen from './bottom-tab-navigator'
import {
    HomeScreen,
    LoginScreen,
    NotificationScreen,
    NotificationDetailScreen,
    FaqScreen,
    FaqDetailScreen,
    PasswordRecoveryScreen,
    PasswordRecovery2Screen,
    RegisterScreen,
    ChangeInfoScreen,
    NewsCategoryScreen,
    NewsListScreen,
    NewsDetailScreen,
    AccountScreen,
    AvatarListScreen,
    PaintHouseScreen,
    WorkerScreen,
    GiftScreen,
    HistoryScreen,
    RankingScreen,
    ListHouseScreen,
    HouseScreen,
    ListColorScreen,
    ColorGroupScreen,
    HouseColorInforScreen,
    ListHousePaintedScreen,
    HistoryPaintedInforScreen,
    RealPaintedScreen,
    PromotionDetailScreen,
} from "../screens"
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
    LoginScreen: undefined,
    primaryStack: undefined,
    HomeScreen: undefined,
    NotificationScreen: undefined,
    NotificationDetailScreen: undefined,
    FaqScreen: undefined,
    FaqDetailScreen: undefined,
    BannerScreen: undefined,
    Register: undefined,
    PasswordRecoveryScreen: undefined,
    PasswordRecovery2Screen: undefined,
    ChangeInfoScreen: undefined,
    AccountScreen: undefined
    NewsCategoryScreen: undefined,
    NewsListScreen: undefined,
    NewsDetailScreen: undefined,
    AvatarListScreen: undefined,
    PaintHouseScreen: undefined,
    WorkerScreen: undefined,
    GiftScreen: undefined,
    HistoryScreen: undefined,
    RankingScreen: undefined,
    ListHouseScreen: undefined,
    HouseScreen: undefined,
    SecondNavigator: undefined,
    ListColorScreen: undefined,
    ColorGroupScreen: undefined,
    HouseColorInforScreen: undefined,
    ListHousePaintedScreen: undefined,
    HistoryPaintedInforScreen: undefined,
    RealPaintedScreen: undefined,
    PromotionDetailScreen: undefined
}

const Stack = createStackNavigator<RootParamList>()
// const Drawer = createDrawerNavigator<RootParamList>()

const RootStack = () => {
    return (
        // <Stack.Navigator
        //   screenOptions={{
        //     headerShown: false,
        //     gestureEnabled: true,
        //   }}
        // >
        //   <Stack.Screen
        //     name="primaryStack"
        //     component={PrimaryNavigator}
        //     options={{
        //       headerShown: false,
        //     }}
        //   />
        // </Stack.Navigator>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName="LoginScreen"
        >
            <Stack.Screen name="AvatarListScreen" component={AvatarListScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="primaryStack" component={PrimaryNavigator} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="NotificationDetailScreen" component={NotificationDetailScreen} />
            <Stack.Screen name="FaqScreen" component={FaqScreen} />
            <Stack.Screen name="FaqDetailScreen" component={FaqDetailScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="PasswordRecoveryScreen" component={PasswordRecoveryScreen} />
            <Stack.Screen name="ChangeInfoScreen" component={ChangeInfoScreen} />
            <Stack.Screen name="PasswordRecovery2Screen" component={PasswordRecovery2Screen} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen name="NewsCategoryScreen" component={NewsCategoryScreen} />
            <Stack.Screen name="NewsListScreen" component={NewsListScreen} />
            <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
            <Stack.Screen name="PaintHouseScreen" component={PaintHouseScreen} />
            <Stack.Screen name="WorkerScreen" component={WorkerScreen} />
            <Stack.Screen name="GiftScreen" component={GiftScreen} />
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
            <Stack.Screen name="RankingScreen" component={RankingScreen} />
            <Stack.Screen name="ListHouseScreen" component={ListHouseScreen} />
            <Stack.Screen name="HouseScreen" component={HouseScreen} />
            <Stack.Screen name="SecondNavigator" component={SecondNavigator} />
            <Stack.Screen name="ListColorScreen" component={ListColorScreen} />
            <Stack.Screen name="ColorGroupScreen" component={ColorGroupScreen} />
            <Stack.Screen name="HouseColorInforScreen" component={HouseColorInforScreen} />
            <Stack.Screen name="ListHousePaintedScreen" component={ListHousePaintedScreen} />
            <Stack.Screen name="HistoryPaintedInforScreen" component={HistoryPaintedInforScreen} />
            <Stack.Screen name="RealPaintedScreen" component={RealPaintedScreen} />
            <Stack.Screen name="PromotionDetailScreen" component={PromotionDetailScreen} />
        </Stack.Navigator>
    )
}

export const RootNavigator = React.forwardRef<
    NavigationContainerRef,
    Partial<React.ComponentProps<typeof NavigationContainer>>
>((props, ref) => {
    return (
        <NavigationContainer {...props} ref={ref}>
            <RootStack />
        </NavigationContainer>    
    )
})

RootNavigator.displayName = "RootNavigator"
