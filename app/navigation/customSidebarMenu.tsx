// Custom Navigation Drawer / Sidebar with Image and Icon in Menu Options
// https://aboutreact.com/custom-navigation-drawer-sidebar-with-image-and-icon-in-menu-options/

import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  AntDesign,
} from "@expo/vector-icons"
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigation } from "@react-navigation/native"
import { UnitOfWorkService } from "../services/api/unitOfWork-service"
import { StorageKey } from '../services/storage';

const CustomSidebarMenu = (props) => {

  const navigation = useNavigation();
  const _unitOfWork = new UnitOfWorkService()
  const images = {
    logo: require('../images/kova_logo.png'),
  }
  const goToWorker = async () => {
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID)
    navigation && navigation.navigate("WorkerScreen", {
      params: { id: userId },
    });
  }
  const goToFAQ = async () => {
    navigation && navigation.navigate("FaqScreen");
  }
  const goToNotification = async () => {
    navigation && navigation.navigate("NotificationScreen");
  }
  const logout = async () => {
    await _unitOfWork.user.logout()
    navigation && navigation.navigate("LoginScreen");
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*Top Large Image */}
      <Image
        source={images.logo}
        style={styles.item_image}
      />
      <DrawerContentScrollView {...props} style={{ marginLeft: 20 }}>
        {/* <DrawerItemList {...props} /> */}
        {/* <DrawerItem
          label="Visit Us"
          onPress={() => Linking.openURL('https://aboutreact.com/')}
        /> */}
        <TouchableOpacity onPress={() => goToWorker()}>
          <View style={{ flexDirection: "row" }}>
            <AntDesign name="user" size={24} color='#953438' style={styles.inputStartIcon} />
            <Text style={{ color: "black", fontSize: 14, fontWeight: "500", lineHeight: 24, paddingTop: 10 }}>Thông tin cá nhân</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToNotification()}>
          <View style={{ flexDirection: "row" }}>

            <AntDesign name="notification" size={24} color='#953438' style={styles.inputStartIcon} />
            <Text style={{ color: "black", fontSize: 14, fontWeight: "500", lineHeight: 24, paddingTop: 10 }}>Thông báo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToFAQ()}>
          <View style={{ flexDirection: "row" }}>

            <AntDesign name="questioncircleo" size={24} color='#953438' style={styles.inputStartIcon} />
            <Text style={{ color: "black", fontSize: 14, fontWeight: "500", lineHeight: 24, paddingTop: 10 }}>Hỏi đáp</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logout()}>
          <View style={{ flexDirection: "row", marginTop: 40 }}>
            <AntDesign name="logout" size={24} color='#953438' style={styles.inputStartIcon} />
            <Text style={{ color: "#953438", fontSize: 14, fontWeight: "500", lineHeight: 24, paddingTop: 10 }}>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>
      <Text style={{ fontSize: 16, textAlign: 'center', color: 'red', marginBottom: 10 }}>
        {/* www.kovapaint.com */}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 300,
    height: 200,
    backgroundColor: "blue",
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  item_image: {
    width: "90%",
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
    resizeMode: 'contain',
    marginVertical: 5
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStartIcon: {
    width: 26,
    height: 26,
    // resizeMode: "contain",
    margin: 15,
    color: "#9098B1",
  },
});

export default CustomSidebarMenu;
