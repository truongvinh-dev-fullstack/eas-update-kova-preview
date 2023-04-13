import * as React from "react"
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Feather } from "@expo/vector-icons"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { HeaderProps } from "../header-auth/header.props"
import { DrawerActions } from '@react-navigation/native';
import { useEffect, useState } from "react"
import { StorageKey } from "../../services/storage"
import { Text } from "../text/text"

export interface HeaderKovaProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */

const images = {
  logo: require("../../images/icons/KOVA.png"),
}

const _unitOfWork = new UnitOfWorkService()

export function HeaderKova(props: HeaderProps) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isNew, setIsNew] = useState<boolean>(false);
  const [numNotification, setNumNotification] = useState<any>('0');

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const fetchData = async () => {
    let isNew: any = await _unitOfWork.storage.getItem(StorageKey.ISNEWNOTIFICATION);
    let num: any = await _unitOfWork.storage.getItem(StorageKey.NUMBERNOTI);
    setNumNotification(num);
    setIsNew(isNew);
  }
  const goToNotification = async () => {
    navigation && navigation.navigate("NotificationScreen")
  }

  return (
    <View style={headerStyles.header_top}>
      <TouchableOpacity>
        <Image style={{ width: 57, height: 20 }} source={images.logo} />
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => goToNotification()}>{
          isNew == false ?
            <MaterialCommunityIcons name="bell-outline" size={22} color="white" />
            : <>
              <MaterialCommunityIcons name="bell-ring-outline" size={22} color="white" />
              <View style={{
                width: 20, height: 16, borderRadius: 8, backgroundColor: "red",
                position: "absolute", right: -12, top: -4,
                justifyContent: "center", alignItems: "center",
              }}>
                <Text style={{ fontSize: 9, fontWeight: "500" }}>{numNotification}</Text>
              </View></>
        }
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 20, marginRight: 8 }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Feather name="settings" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const headerStyles = StyleSheet.create({
  header_top: {
    position: "absolute",
    top: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    zIndex: 2,
  },
})
