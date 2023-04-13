import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
// import { HeaderAuth, Screen } from "../../components"
// import { LinearGradient } from 'expo-linear-gradient'
import {
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet, Alert, ActivityIndicator, Dimensions, Modal, TouchableWithoutFeedback, Keyboard, TextInput, Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Entypo,
  Feather,
  FontAwesome5
} from "@expo/vector-icons";

import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import { homeStyles } from "../home-screen/home-screen";
import { TabView, TabBar } from 'react-native-tab-view';
import { format } from "date-fns";
import { LinearGradient } from 'expo-linear-gradient'
import RNDatePicker from "@react-native-community/datetimepicker"
import DatePicker from "react-native-datepicker"
import { color } from "../../theme/color";
import { Appearance } from "react-native-appearance"
class TradeModel {
  ReportName: string;
  Point: number;
  Date: Date;
  Type: string;
}

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: "white"
}

const images = {
  background1: require("../../images/background1.png"),
  background2: require("../../images/backgroup_tranparent2.png"),
  card: require("../../images/card_color.png"),
  card_gardient: require("../../images/card_light_gardient.png"),
  modalBackgroup1: require("../../images/modal-header1.png"),
  modalBackgroup2: require("../../images/modal_light.png"),
  z_index: require("../../images/z_index.png"),
  vector_success: require("../../images/vector_success.png"),
}

const initialLayout = { width: Dimensions.get('window').width };

export const HistoryScreen = observer(function HistoryScreen() {
  const [colorScheme, setColorScheme] = useState<any>();
  const _unitOfWork = new UnitOfWorkService();
  const navigation = useNavigation();
  //-----------------------------------------------------
  /*BIẾN ĐIỀU KIỆN*/
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false)

  /*BỘ LỌC*/
  const [title, setTitle] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  //-----------------------------------------------------
  /*MASTER DATA*/
  const [userId, setUserId] = useState<any>(null);
  const [listHistory, setListHistory] = useState<Array<TradeModel>>();
  const [listFullHistory, setListFullHistory] = useState<Array<TradeModel>>();
  const [listItems, setListItems] = useState<Array<TradeModel>>(null);
  // const currentDate = new Date();

  // function goToScreen(page: string) {
  //   navigation && navigation.navigate(page);
  // }

  //-----------------------------------------------------
  /*START : HÀM GET MASTER DATA*/
  useEffect(() => {
    let colorScheme = Appearance.getColorScheme()
    setColorScheme(colorScheme)
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  //----------------------------------------------------
  /*MODAL*/

  const openModal = function () {
    setModalVisible(!modalVisible);
    // setGiftInfo(gift);
  }

  const closeModal = function () {
    setModalVisible(!modalVisible);
    // setGiftInfo(null);
  }

  /*END*/

  //----------------------------------------------------
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: '1', title: 'Tất cả' },
    { key: '2', title: 'Tích điểm' },
    { key: '3', title: 'Đổi điểm' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return null;
      case '2':
        return null;
      case '3':
        return null;
      default:
        return null;
    }
  };

  const fetchData = async () => {
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
    setUserId(userId);

    setLoading(true);
    let response = await _unitOfWork.user.getHistoryWorkerTrade({ "WorkerId": userId, "Index": 0 });
    setLoading(false);
    if (response.StatusCode != 200) {
      Alert.alert("Thông báo", response.Message);
      return false;
    } else {
      setListFullHistory(response.ListReport);
      setListHistory(response.ListReport);
      setListItems(response.ListReport);
      return true;
    }
  }

  const findData = (query: string) => {
    let data = listFullHistory.filter(c => query == null || query == '' ||
      c.ReportName?.trim().toLowerCase().includes(query?.trim().toLowerCase()));
    setListHistory(data);
    switch (index) {
      case 0:
        setListItems(data);
        break;
      case 1:
        let list1 = data.filter(c => c.Type == "Import");
        setListItems(list1);
        break;
      case 2:
        let list2 = data.filter(c => c.Type == "Exchange");
        setListItems(list2);
        break;
      default:
        break;
    }
  }

  // const getHistoryTrade = async () => {
  //   setLoading(true);
  //   let response = await _unitOfWork.user.getHistoryWorkerTrade(
  //     {
  //       "WorkerId": userId,
  //       "Index": index,
  //       "Tilte": title,
  //       "FromDate": null,
  //       "ToDate": null,
  //     }
  //   );
  //   setLoading(false);
  //   if (response.StatusCode != 200) {
  //     Alert.alert("Thông báo", response.Message);
  //     return false;
  //   } else {
  //     setListItems(response.ListReport);
  //     return true;
  //   }
  // }

  const changeIndex = async (index: number) => {
    switch (index) {
      case 0:
        setListItems(listHistory);
        break;
      case 1:
        let list1 = listHistory.filter(c => c.Type == "Import");
        setListItems(list1);
        break;
      case 2:
        let list2 = listHistory.filter(c => c.Type == "Exchange");
        setListItems(list2);
        break;
      default:
        break;
    }
  }
  const formatNumber = (num: any) => {
    if (num) {
      return ('' + num).replace(
        /(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g,
        function (m, s1, s2) {
          return s2 || (s1 + ',');
        }
      );
    }
    return 0
  }

  const topComponent = () => {
    return (
      <View>
        <View>
          <Image style={[homeStyles.w_100, homeStyles.position_absolute, Platform.OS === "ios" ? historyStyles.heightOS : historyStyles.heightAnroid]} source={images.background1} />
          <Image style={[homeStyles.w_100, Platform.OS === "ios" ? historyStyles.heightOS : historyStyles.heightAnroid]} source={images.background2} />
        </View>
        <View style={[Platform.OS === "ios" ? historyStyles.topOS : historyStyles.topAdroid]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 2 }}>
            <Entypo name="chevron-left" size={26} color="white" />
          </TouchableOpacity>
          <Text style={[historyStyles.title, { marginLeft: Dimensions.get('window').width * 0.08 }]}>Lịch sử giao dịch</Text>
          <TouchableOpacity onPress={() => openModal()}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "400" }}>Chọn lọc</Text>
          </TouchableOpacity>
        </View>
        <View style={[historyStyles.ads_container]}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index) => {
              changeIndex(index);
              setIndex(index)
            }}
            initialLayout={initialLayout}
            renderTabBar={props => <TabBar {...props}
              indicatorStyle={{ backgroundColor: "#F14950", width: 80, alignSelf: "center", marginHorizontal: 24 }}
              renderLabel={({ route, color, focused }) => (
                <View>{
                  focused ? <Text style={{ color: '#F14950', margin: 8 }}>{route.title}</Text> :
                    <Text style={{ color: 'black', margin: 8 }}>{route.title}</Text>
                }</View>
              )}
              style={{ backgroundColor: 'white', marginTop: -15 }} />}
          />
        </View>
        <View style={{ backgroundColor: "#000000", height: 1, width: "100%", opacity: .1, marginBottom: 10 }}></View>
      </View >
    )
  }
  const footerComponent = () => {
    return (
      <View style={{ marginBottom: 80 }} />
    )
  }
  const ItemView = ({ item, index }) => {
    return (
      <View style={[historyStyles.item]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, paddingHorizontal: 8, }}>
          <View>{
            item?.Type == "Exchange" ?
              <Text style={historyStyles.item_title}>Đổi quà "{item?.ReportName}"</Text> :
              <Text style={historyStyles.item_title}>{item?.ReportName}</Text>
          }
            <View style={{ flexDirection: "row", paddingTop: 3 }}>
              <Feather name="clock" size={16} color="#004AB9" />
              <Text style={{ color: "black", fontSize: 12, fontWeight: "400", lineHeight: 13, alignSelf: "center", paddingLeft: 5 }}>{format(item?.Date, "H:mm DD/MM/YYYY")}</Text>
            </View>
          </View>
          <View />
          <View>{
            item?.Type == "Exchange" ?
              <Text style={[historyStyles.item_point]}>- {formatNumber(item?.Point)} điểm</Text> :
              <Text style={[historyStyles.item_point, { color: "#F14950" }]}>+ {formatNumber(item?.Point)} điểm</Text>
          }
          </View>
        </View>
        <View style={{ backgroundColor: "black", opacity: .1, height: 1 }} />
      </View>
    )
  }
  return (
    <>
      {isLoading &&
        <View style={historyStyles.loading}>
          <ActivityIndicator size="large" color="#125fa1" />
        </View>
      }
      <View style={FULL}>
        <FlatList
          stickyHeaderIndices={[0]}
          ListHeaderComponent={topComponent()}
          ListFooterComponent={footerComponent()}
          data={listItems}
          keyExtractor={(item, index) => "home" + index + String(item)}
          renderItem={ItemView}
          columnWrapperStyle={historyStyles.flatListColumnWrapperStyle}
          horizontal={false}
          numColumns={2}
        />
      </View>
      {/*Filter*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={historyStyles.centeredView} >
          <View style={historyStyles.modalView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={{ width: "100%" }}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                  <View />
                  <Text style={[historyStyles.modal_title, { marginLeft: 10 }]}>Bộ lọc</Text>
                  <TouchableOpacity onPress={() => closeModal()} style={{ marginRight: 15 }}>
                    <FontAwesome5 name="times" size={18} color="#212121" />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 30, paddingTop: 20, marginHorizontal: 0 }}>
                  <View style={[historyStyles.inputSection, historyStyles.input,]}>
                    <TextInput style={[historyStyles.input, { marginLeft: 10 }]}
                      value={title}
                      placeholder="Nhập tiêu đề"
                      autoCapitalize='none'
                      onChangeText={(str) => {
                        setTitle(str);
                        findData(str)
                      }}
                      underlineColorAndroid="transparent" />
                  </View>
                  {/* <Text style={[historyStyles.input_title, { marginLeft: 35, marginTop: 10 }]}>Từ ngày</Text>
                  <View style={[historyStyles.inputSection, historyStyles.input, {
                    width: "90%", justifyContent: "flex-start", marginHorizontal: 20
                  }]}>
                    <DatePicker
                      locale={"vi"}
                      display="spinner"
                      showIcon={false}
                      mode="date" placeholder="Từ ngày" format="DD/MM/YYYY"
                      minDate="01/01/1920" maxDate={new Date()}
                      confirmBtnText="Xác nhận" cancelBtnText="Huỷ"
                      date={fromDate}
                      onDateChange={(date) => {
                        let _arr = date.split("/")
                        let _d = new Date(_arr[2], _arr[1] - 1, _arr[0], 7, 0, 0)
                        setFromDate(_d)
                      }}
                      iOSDatePickerComponent={(props) => (
                        <RNDatePicker {...props} display={Platform.OS === "ios" ? "spinner" : "default"} />)}
                      customStyles={{
                        dateInput: {
                          borderWidth: 0,
                          padding: 0,
                          margin: 0,
                          marginLeft: -56,
                        },
                        btnTextConfirm: { color: color.primary },
                        btnTextCancel: { color: color.dangerX },
                        datePicker: { backgroundColor: colorScheme === "dark" ? "#222" : "white" },
                        datePickerCon: { backgroundColor: colorScheme === "dark" ? "#222" : "white" },
                      }}
                    />
                  </View>
                  <Text style={[historyStyles.input_title, { marginLeft: 35, marginTop: 10 }]}>Đến ngày</Text>
                  <View style={[historyStyles.inputSection, historyStyles.input, {
                    width: "90%", justifyContent: "flex-start", marginHorizontal: 20
                  }]}>
                    <DatePicker
                      locale={"vi"}
                      display="spinner"
                      showIcon={false}
                      mode="date" placeholder="Đến ngày" format="DD/MM/YYYY"
                      minDate="01/01/1920" maxDate={new Date()}
                      confirmBtnText="Xác nhận" cancelBtnText="Huỷ"
                      date={toDate}
                      onDateChange={(date) => {
                        let _arr = date.split("/")
                        let _d = new Date(_arr[2], _arr[1] - 1, _arr[0], 7, 0, 0)
                        setToDate(_d)
                      }}
                      iOSDatePickerComponent={(props) => (
                        <RNDatePicker {...props} display={Platform.OS === "ios" ? "spinner" : "default"} />)}
                      customStyles={{
                        dateInput: {
                          borderWidth: 0,
                          padding: 0,
                          margin: 0,
                          marginLeft: -56,
                        },
                        btnTextConfirm: { color: color.primary },
                        btnTextCancel: { color: color.dangerX },
                        datePicker: { backgroundColor: colorScheme === "dark" ? "#222" : "white" },
                        datePickerCon: { backgroundColor: colorScheme === "dark" ? "#222" : "white" },
                      }}
                    />
                  </View> */}
                </View>
                {/* <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100 }}>
                  <TouchableOpacity style={historyStyles.backButton} onPress={() => closeModal()}>
                    <Text style={{ color: "#505050", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={historyStyles.confirmButton} onPress={() => findData(title)}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={historyStyles.linearButtonGradient}>
                      <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Tìm kiếm</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View> */}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </>
  )
})

// CSS
const historyStyles = StyleSheet.create({
  loading: {
    flex: 1,
    zIndex: 9999,
    width: "100%",
    height: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#80808073",
  },
  w_100: {
    width: "100%"
  },
  position_absolute: {
    position: "absolute"
  },

  ads_container: {
    backgroundColor: "white",
    paddingTop: 16,
    marginTop: - 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: "100%",
  },
  ads_title: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 21.09,
    marginTop: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  flatListColumnWrapperStyle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    alignItems: "flex-start",
  },
  item: {
    marginVertical: 5,
    width: "100%", // is 50% of container width
  },
  item_title: {
    color: "black",
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "700",
    marginBottom: 4,
    maxWidth: 250,
  },
  item_point: {
    color: "#8B8B8B",
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "700",
    marginLeft: 10
  },
  item_author: {
    color: "#8B8B8B",
    fontSize: 11,
    lineHeight: 13,
  },
  item_author_icon: {
    backgroundColor: "white", width: 9.54, height: 10.39,
    marginRight: 4,
  },
  item_favorite: {
    position: "absolute",
    bottom: 16,
    left: 8,
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: -15
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    color: "#F14950"
  },
  /*MODAL CSS*/
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "94%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingBottom: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modal_title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18.75
  },
  input_title: {
    color: "#000000",
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10
  },
  inputSection: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#424242',
    marginHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: "transparent",
    marginTop: 19,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 38,
    maxHeight: 38,
    maxWidth: 120,
    minWidth: 120,
    borderColor: "white",
    marginLeft: 15
  },
  backButton: {
    backgroundColor: "transparent",
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 38,
    maxHeight: 38,
    maxWidth: 120,
    minWidth: 120,
    borderColor: "#505050",
  },
  linearButtonGradient: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "white",
    minWidth: 120,
    maxWidth: 120,
    minHeight: 38,
    maxHeight: 38,
  },
  heightOS: {
    height: 120,
  },
  heightAnroid: {
    height: 80
  },
  topOS: {
    width: "98%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 60
  },
  topAdroid: {
    width: "98%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    top: 20
  }
  /*END*/
});