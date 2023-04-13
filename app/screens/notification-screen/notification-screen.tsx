import React, { useState, useEffect, useCallback } from "react"
import { View, TextStyle, FlatList, TouchableOpacity, StyleSheet, ViewStyle, Alert, Dimensions } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft, faClipboardCheck } from "@fortawesome/free-solid-svg-icons"
import { StorageKey } from "../../services/storage"
import { TabBar, TabView } from "react-native-tab-view"
import { format } from "date-fns"

const TEXT: TextStyle = {
  color: "white",
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
  backgroundColor: "#E1420B",
  paddingHorizontal: spacing[0],
}
const FULL: ViewStyle = {
  flex: 1,
}

const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 14,
  lineHeight: 30,
  textAlign: "left",
  letterSpacing: 1.5,
  color: "#FFFFFF"
}
const TEXT_RIGHT: TextStyle = {
  color: "#E55300",
  fontFamily: typography.primary,
  fontSize: 12
}
const _unitOfWork = new UnitOfWorkService()
const initialLayout = { width: Dimensions.get('window').width };

export const NotificationScreen = () => {
  const navigation = useNavigation()
  const [notificationsCommon, setNotificationCommon] = useState([]);
  const [notificationsDetail, setNotificationDetail] = useState([]);
  const [isRefresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused == true) {
      getNotifications().catch(err => {
        goBack();
      });
    }
  }, [isRefresh, isFocused])

  const getNotifications = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      let res = await _unitOfWork.notification.getNotificationByWorkerId({
        UserId: userId
      });
      if (res.data.StatusCode == 200) {
        setNotificationCommon(res.data.ListCommonNotification);
        setNotificationDetail(res.data.ListDetailNotifcation);
      }
    }
  }

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: '1', title: 'Chung' },
    { key: '2', title: 'Thông báo đổi quà' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return FirstRoute()
      case "2":
        return SecondRoute()
      default:
        return FirstRoute()
    }
  };
  const onRefresh = () => {
    setRefresh(true);
  }

  const FirstRoute = useCallback(
    () => {
      return (
        <>{
          notificationsCommon && notificationsCommon.length ?
            <FlatList
              refreshing={isRefresh}
              onRefresh={() => onRefresh()}
              data={notificationsCommon}
              keyExtractor={(item, index) => "common" + index + String(item.Id)}
              renderItem={ItemViewCommon}
              // columnWrapperStyle={listHouseStyle.flatListColumnWrapperStyle}
              horizontal={false}
              numColumns={1}
              style={{ backgroundColor: "white" }}
            /> : null
        }
        </>
      )
    },
    [notificationsCommon, index],
  )

  const SecondRoute = useCallback(
    () => {
      return (
        <>{
          notificationsDetail && notificationsDetail.length ?
            <FlatList
              refreshing={isRefresh}
              onRefresh={() => onRefresh()}
              data={notificationsDetail}
              keyExtractor={(item, index) => "house" + index + String(item.Id)}
              renderItem={ItemViewDetail}
              // columnWrapperStyle={listHouseStyle.flatListColumnWrapperStyle}
              horizontal={false}
              numColumns={1}
              style={{ backgroundColor: "white" }}
            /> : null
        }
        </>
      )
    },
    [notificationsDetail, index],
  )

  const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
    Alert.alert("Thông báo", err,
      [{
        text: "OK", onPress: () => {
          navigation && navigation.goBack()
        },
      }], { cancelable: false });
  }

  const checkAllSeend = async () => {
    Alert.alert("Đọc tất cả", "Bạn có muốn đánh dấu tất cả là đã đọc?",
      [
        {
          text: "Hủy bỏ", onPress: () => { },
          style: "cancel"
        },
        {
          text: "Đồng ý", onPress: async () => {
            let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
            let res: any = await _unitOfWork.notification.updateStatusNotification({
              UserId: userId,
              Type: 1
            });
            if (res.data.StatusCode == 200) {
              await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, res.data.IsNew);
              await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, res.data.NumNotification);
              getNotifications().catch(err => {
                goBack();
              });
            }
          },
        }], { cancelable: false });
  }

  const getTitle = (value, n) => value.length < n ? value : value.substring(0, n) + '...'
  // const getDate = (value) => {
  //   var date = new Date(value);
  //   return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  // }

  const ItemViewCommon = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goToNotificationDetail(item)}>
        <View style={styles.container}>
          <Text style={[item.IsSeen == true ? styles.title_notfifi_seened : styles.title_notfifi_not_seen]}>{getTitle(item.NotificationName, 40)}</Text>
          <Text style={[item.IsSeen == true ? styles.title_content_seened : styles.title_content_not_seen]}>{getTitle(item.Content, 80)}</Text>
          <Text style={[item.IsSeen == true ? styles.title_time_seened : styles.title_time_not_seen]}>{format(item?.CreateDate, "DD-MM-YYYY hh:mm a")}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const ItemViewDetail = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goToNotificationDetail(item)}>
        <View style={styles.container}>
          <Text style={[item.IsSeen == true ? styles.title_notfifi_seened : styles.title_notfifi_not_seen]}>{getTitle(item.NotificationName, 40)}</Text>
          <Text style={[item.IsSeen == true ? styles.title_content_seened : styles.title_content_not_seen]}>{getTitle(item.Content, 80)}</Text>
          <Text style={[item.IsSeen == true ? styles.title_time_seened : styles.title_time_not_seen]}>{format(item?.CreateDate, "DD-MM-YYYY hh:mm a")}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  const goToNotificationDetail = async (rowData: any) => {
    if (rowData.IsSeen == false) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      let res: any = await _unitOfWork.notification.updateStatusNotification({
        UserId: userId,
        NotificationId: rowData.Id,
        Type: 0
      });
      if (res.data.StatusCode == 200) {
        rowData.IsSeen == true;
        await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, res.data.IsNew);
        await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, res.data.NumNotification);
      }
    }
    navigation && navigation.navigate("NotificationDetailScreen", { content: rowData.Content, name: rowData.NotificationName, link: rowData?.Link })
  }

  return (
    <>
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            headerText={"Thông báo"}
            rightStyle={TEXT_RIGHT}
            onLeftPress={navigation && navigation.goBack}
            onRightPress={() => checkAllSeend()}
            rightIcon={faClipboardCheck}
            style={{ backgroundColor: "#E1420B" }} />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index) => {
              setIndex(index)
            }}
            swipeEnabled={false}
            initialLayout={initialLayout}
            renderTabBar={props => <TabBar {...props}
              indicatorStyle={{ backgroundColor: "#F14950", alignSelf: "center" }}
              renderLabel={({ route, color, focused }) => (
                <View>{
                  focused ? <Text style={{ color: '#F14950', margin: 8 }}>{route.title}</Text> :
                    <Text style={{ color: 'black', margin: 8 }}>{route.title}</Text>
                }</View>
              )}
              style={{ backgroundColor: 'white' }} />}
          />
        </Screen>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: "white",
    justifyContent: 'center',
    paddingVertical: 5,
    minHeight: 60,
    paddingHorizontal: 10,
    shadowColor: 'red',
    borderRadius: 6,
    shadowRadius: 10,
    shadowOpacity: 0.05,
    marginHorizontal: 10,
    borderColor: "#FFDADA",
    borderWidth: 1,
    marginTop: 5
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  title_notfifi_seened: {
    color: "#9899A3",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
    paddingTop: 10
  },
  title_content_seened: {
    color: "#9899A3",
    fontSize: 14,
    marginVertical: 10
  },
  title_time_seened: {
    color: "#eba38a",
    fontSize: 12,
    paddingTop: 3
  },
  title_notfifi_not_seen: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 18,
    flexWrap: "wrap",
    paddingTop: 10,
  },
  title_content_not_seen: {

    color: "black",
    fontSize: 14,
    marginVertical: 10
  },
  title_time_not_seen: {
    color: "#E1420B",
    fontSize: 12,
    paddingTop: 3
  }
})