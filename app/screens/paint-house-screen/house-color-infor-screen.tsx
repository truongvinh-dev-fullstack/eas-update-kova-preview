import React, { useEffect, useRef, useState } from "react"
import {
  View, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput, StyleSheet, FlatList, Modal, Keyboard,
  TouchableWithoutFeedback
} from "react-native"
import * as reactNativeShape from 'react-native-shape';
import { TabActions, useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { AuthStyles } from '../../styles/Auth'
import { styles } from '../../styles'
import { StorageKey } from "../../services/storage";
import { observer } from "mobx-react-lite"
import {
  FontAwesome,
  AntDesign,
  FontAwesome5,
  Ionicons
} from "@expo/vector-icons"
import { LinearGradient } from 'expo-linear-gradient'
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { ScrollView, } from "react-native-gesture-handler"
import { Dimensions } from 'react-native';
import { Input } from "@ui-kitten/components";
// import RNPickerSelect from "react-native-picker-select"
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const _unitOfWork = new UnitOfWorkService();

class Customer {
  Id: string;
  CustormerCode: string;
  CustomerName: string;
  Phone: string;
  Address: string;
  Description: string;
  WorkerId: string;

  label: string;
  value: string;

  constructor() {
    this.Id = '00000000-0000-0000-0000-000000000000';
    this.CustomerName = '';
    this.Phone = '';
    this.Address = '';
  }
}

const FULL: ViewStyle = { flex: 1 }

const TEXT: TextStyle = {
  color: '#FFFFFF',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
  backgroundColor: "black",
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  maxWidth: Dimensions.get('window').width,
  alignSelf: "center",
  paddingHorizontal: spacing[1],
  paddingTop: spacing[1],

  borderTopRightRadius: 12,
  borderTopLeftRadius: 12
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

export const HouseColorInforScreen = observer(function HouseColorInforScreen(props: any) {
  const jumpToAction = TabActions.jumpTo('ListHousePaintedScreen', {});
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const { house, listGroupPath, historyId } = props.route.params;
  const [isRefresh, setRefresh] = useState(false);
  const viewShotRef = useRef<any>();

  const [isLoading, setLoading] = useState(false);
  const [contactInfor, setContactInfo] = useState<Customer>(null);
  const [customerInfor, setCustomerInfo] = useState<Customer>(new Customer());

  const [listCustomer, setListCustomer] = useState<Array<Customer>>([]);
  const [listFullCustomer, setListFullCustomer] = useState<Array<Customer>>([]);

  const [modalChonKhachHangVisible, setModalChonKhachHangVisible] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  /*START : HÀM GET MASTER DATA*/
  useEffect(() => {
    fetchDataListCustomer().catch(err => {
      setLoading(false);
      goBack();
    });
    fetchData().catch(err => {
      setLoading(false);
      goBack();
    });

  }, [isRefresh]);

  const fetchData = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let isFromHouse = await _unitOfWork.storage.getItem(StorageKey.ISFROMHOUSE);
      if (!isFromHouse) {
        setLoading(true);
        const response = await _unitOfWork.user.getDetailHistoryPaintedById({
          "HistoryPaintedId": historyId
        });
        setLoading(false);

        if (response.StatusCode == 200) {
          let customer: Customer = response.Customer;
          setContactInfo(customer);
        } else {
        }
      }
    }
  }
  const fetchDataListCustomer = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      setLoading(true);
      const response = await _unitOfWork.user.getCustomerByWorkerId({
        "WorkerId": userId
      });
      setLoading(false);
      if (response.StatusCode == 200) {
        let lstCustomer: Array<Customer> = response.ListCustomer;
        setListCustomer(lstCustomer);
        setListFullCustomer(lstCustomer);
      } else {
      }
    }
  }

  const openModal = function () {
    setModalVisible(!modalVisible);
    // setGiftInfo(gift);
  }

  const closeModal = function () {
    setModalVisible(false);
    setSubmit(false);
  }

  const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
    Alert.alert("Thông báo", err,
      [{
        text: "OK", onPress: () => {
          navigation && navigation.goBack()
        },
      }], { cancelable: false });
  }

  const saveHistoryColor = async function () {
    let listHouseAttributes: Array<any> = listGroupPath.map((p: { ColorId: string; ListHouseModelAttribute: any[]; }) => {
      return {
        ColorId: p.ColorId, ListHouseAttributeDetailId: p.ListHouseModelAttribute.map(a => {
          return a.Id
        })
      }
    });
    let isCheck = listHouseAttributes.find(c => c.ColorId != null);
    if (!isCheck) {
      Alert.alert("Thông báo", "Mẫu nhà chưa phối màu sơn, không thể lưu lịch sử!");
      return;
    }

    let fileExtension = house?.ImageBase64.split(';')[0].split('/')[1];
    let base64 = house?.ImageBase64.split(',')[1];
    setLoading(true);
    try {
      let isFromHouse = await _unitOfWork.storage.getItem(StorageKey.ISFROMHOUSE);
      const response = await _unitOfWork.user.saveHistoryColor({
        WorkerId: house?.WorkerId,
        HouseModelId: house?.HouserModelId,
        ImageBase64: base64,
        FileExtension: fileExtension,
        Customer: contactInfor,
        ListHouseAttributes: listHouseAttributes,
        HistoryPaintedId: historyId,
        IsFromHouse: isFromHouse
      });
      setLoading(false);
      if (response.StatusCode != 200) {
        Alert.alert("Thông báo", response.Message);
      } else {
        Alert.alert("Thông báo", "Đã lưu thành công", [
          {
            text: "OK", onPress: () => {
              navigation && navigation.dispatch(jumpToAction);
              navigation.goBack();
            }
          }]);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  const createCustomer = async function () {
    setSubmit(true);
    if (customerInfor.CustomerName == "" || customerInfor.Phone == "") {

    } else {
      setLoading(true);
      try {
        let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
        customerInfor.WorkerId = userId;
        const response = await _unitOfWork.user.createOrUpdateCustomer({
          Customer: customerInfor,
        });
        setLoading(false);
        if (response.StatusCode != 200) {
          Alert.alert("Thông báo", response.Message);
        } else {
          fetchDataListCustomer();
          setCustomerInfo(new Customer());
          setSubmit(false);
          setModalVisible(!modalVisible);
        }
      } catch (err) {
        setLoading(false);
      }
    }
  }

  const findData = (query: string) => {
    let data = listFullCustomer.filter(c => query == null || query == '' ||
      c.CustomerName?.trim().toLowerCase().includes(query?.trim().toLowerCase())
      || c.Phone?.trim().toLowerCase().includes(query?.trim().toLowerCase()));
    setListCustomer(data);
  }

  const selectedCustomer = function (item: any) {
    setContactInfo(item);
    setModalChonKhachHangVisible(!modalChonKhachHangVisible);
  }

  const goToPaintHouse = async function () {
    await _unitOfWork.storage.setItem(StorageKey.HOUSE_MODEL_ID, house?.HouserModelId);
    navigation && navigation.navigate("SecondNavigator", {
      params: { Type: 1 }
    });
  }

  const openShareDialogAsync = async (imageBase64: any) => {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }
    const base64Code = imageBase64.split("data:image/jpeg;base64,")[1];
    const filename = FileSystem.documentDirectory + "kova.png";
    await FileSystem.writeAsStringAsync(filename, base64Code, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await Sharing.shareAsync(filename)
  };

  const share = async function () {
    let imageBase64: string = await viewShotRef.current.capture();
    openShareDialogAsync(imageBase64);
  }

  return (
    <>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#A23232" />
        </View>
      }
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <View style={{ minHeight: 60 }}>
            <HeaderAuth
              iconStyle={TEXT}
              leftIcon={faChevronLeft}
              onLeftPress={navigation.goBack}
              titleStyle={HEADER_TITLE}
              headerText={"Lưu thông tin"}
              rightStyle={TEXT_RIGHT}
              onRightPress={saveHistoryColor}
              rightTx={"Hoàn thành"} />
          </View>
          <ScrollView style={CONTAINER_PADDING}>
            <View style={styles.hr}></View>
            <View style={[houseColorStyle.inputSection, AuthStyles.input]}>
              <TouchableOpacity style={{
                backgroundColor: "#191919",
                width: 200,
                height: 40,
                alignSelf: "center",
                borderWidth: 1,
                borderRadius: 15,
                paddingTop: 10,
                marginTop: 10,
                marginHorizontal: 10
              }} onPress={() => setModalChonKhachHangVisible(!modalChonKhachHangVisible)}>
                <Text style={{
                  color: "#E55300", fontSize: 13,
                  fontWeight: "500", lineHeight: 18,
                  textAlign: "center",
                }} >Chọn khách hàng</Text>
              </TouchableOpacity>
            </View>{
              contactInfor?.Id ?
                <>
                  <View style={styles.hr}></View>
                  <View style={[houseColorStyle.inputSection, AuthStyles.input]}>
                    <FontAwesome5 name="user" size={18} color="#8B8B8B" style={[styles.inputStartIcon, { paddingRight: 3 }]} />
                    <TextInput
                      value={contactInfor?.CustomerName}
                      style={houseColorStyle.input}
                      placeholder="Nhập tên khách hàng"
                      placeholderTextColor="#9098B1"
                      onChangeText={(searchString) => {
                        let con = { ...contactInfor }
                        con.CustomerName = searchString
                        setContactInfo(con)
                      }}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                  <View style={styles.hr}></View>
                  <View style={[houseColorStyle.inputSection, AuthStyles.input]}>
                    <FontAwesome name="mobile-phone" size={24} color='#9098B1' style={[styles.inputStartIcon, { paddingHorizontal: 3 }]} />
                    {/*@ts-ignore*/}
                    <TextInput numeric keyboardType={"numeric"}
                      style={houseColorStyle.input} placeholder="Số điện thoại"
                      placeholderTextColor="#9098B1"
                      value={contactInfor?.Phone}
                      autoCapitalize='none'
                      onChangeText={(searchString) => {
                        let con = { ...contactInfor }
                        con.Phone = searchString
                        setContactInfo(con)
                      }} underlineColorAndroid="transparent" />
                  </View>
                  <View style={styles.hr}></View>
                  <View style={[houseColorStyle.inputSection, AuthStyles.input]}>
                    <AntDesign name="home" size={20} color='#9098B1' style={[styles.inputStartIcon, { paddingRight: 3 }]} />
                    <TextInput
                      value={contactInfor?.Address}
                      style={houseColorStyle.input}
                      placeholder="Địa chỉ"
                      placeholderTextColor="#9098B1"
                      onChangeText={(searchString) => {
                        let con = { ...contactInfor }
                        con.Address = searchString
                        setContactInfo(con)
                      }}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </> : null
            }
            <View style={styles.hr}></View>
            <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: "jpg", quality: 0.2, result: "data-uri" }}>
              <Image source={{ uri: house?.ImageBase64 }}
                style={{
                  width: width, height: 285,
                  justifyContent: "center",
                  flexDirection: "row",
                  marginVertical: 10,
                  resizeMode: "contain"
                }}
              />{
                listGroupPath && listGroupPath.length ?
                  <FlatList
                    data={listGroupPath}
                    keyExtractor={(item, index) => "path" + index + String(item)}
                    renderItem={ColorView}
                    horizontal={false}
                    numColumns={1}
                    style={{ backgroundColor: "black" }}
                  /> : null
              }
            </ViewShot>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => goToPaintHouse()}
                style={{
                  backgroundColor: "#191919",
                  marginVertical: 30,
                  minWidth: 180,
                  maxWidth: 180,
                  alignSelf: "center",
                  borderWidth: 1,
                  borderRadius: 15,
                  marginRight: 5
                }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign name="pluscircleo" size={20} color='#E55300' style={styles.inputStartIcon} />
                  <Text style={{ color: "#E55300", fontSize: 14, fontWeight: "500", lineHeight: 24 }}>Bổ sung màu sơn</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => share()}
                style={{
                  backgroundColor: "#191919",
                  marginVertical: 30,
                  minWidth: 150,
                  maxWidth: 150,
                  alignSelf: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderRadius: 15
                }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <AntDesign name="sharealt" size={20} color='#E55300' style={[styles.inputStartIcon, { marginLeft: 0 }]} />
                  <Text style={{ color: "#E55300", fontSize: 14, fontWeight: "500", lineHeight: 24 }}>Chia sẻ</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalChonKhachHangVisible}
            onRequestClose={() => {
              setModalChonKhachHangVisible(!modalChonKhachHangVisible)
            }}>
            <View style={houseColorStyle.centeredView} >
              <View style={houseColorStyle.modalView}>
                <View style={{
                  justifyContent: "center",
                  marginBottom: 5,
                  width: "100%",
                  paddingHorizontal: 15,
                }}>
                  <View style={[{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }]}>
                    <TouchableOpacity onPress={() => setModalChonKhachHangVisible(!modalChonKhachHangVisible)}>
                      <Ionicons name="md-close" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={[houseColorStyle.modal_title]}>Chọn khách hàng</Text>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={{ fontSize: 11, color: "#E55300" }}>Thêm KH</Text>
                    </TouchableOpacity>
                  </View>
                  <Input autoCapitalize='none' autoCorrect={false}
                    value={query}
                    onChangeText={(searchString) => {
                      findData(searchString);
                      setQuery(searchString);
                    }}
                    status='info'
                    placeholderTextColor={color.palette.lightGrey}
                    clearButtonMode='always' placeholder='Tìm kiếm'
                    style={{ borderRadius: 8, borderColor: "#F9F8FD", backgroundColor: "#F9F8FD", paddingVertical: 10 }}
                    textStyle={{ color: "#000" }}
                  />
                  <View style={{ height: Dimensions.get("window").height - 550 }}>
                    {
                      listCustomer && listCustomer.length ?
                        <FlatList
                          horizontal={false}
                          data={listCustomer}
                          keyExtractor={(item, index) => "cus" + index + String(item.Id)}
                          renderItem={({ item, index }) =>
                            <View style={[{ borderTopColor: "#F4F5F7", borderBottomColor: "#F4F5F7", borderTopWidth: 1, borderBottomWidth: 1 }]}>
                              <TouchableOpacity onPress={() => selectedCustomer(item)}>
                                <View style={{ marginHorizontal: 20, }}>
                                  <Text style={[{ color: "black", marginVertical: 10 },]}>{item.Phone} - {item.CustomerName}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          }
                        /> : null
                    }
                  </View>
                </View>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  openModal();
                }}>
                <View style={houseColorStyle.centeredView} >
                  <View style={houseColorStyle.modalView}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                      <View style={{ width: "100%" }}>
                        <Text style={[houseColorStyle.modal_title, { marginTop: 20 }]}>Thêm khách hàng</Text>
                        <View style={{ paddingBottom: 30, paddingTop: 20 }}>
                          <Text style={[houseColorStyle.input_title]}>Tên khách hàng <Text style={[houseColorStyle.require]}>*</Text></Text>
                          <View style={[houseColorStyle.inputSectionModal, houseColorStyle.inputModal, (isSubmit && customerInfor?.CustomerName == "") ? { borderColor: color.dangerX } : {},]}>
                            <TextInput
                              value={customerInfor?.CustomerName}
                              style={houseColorStyle.inputModal}
                              placeholder="Nhập tên khách hàng"
                              placeholderTextColor="#9098B1"
                              onChangeText={(str) => {
                                let con = { ...customerInfor }
                                con.CustomerName = str
                                setCustomerInfo(con)
                              }}
                              underlineColorAndroid="transparent"
                            />
                          </View>
                          <Text style={[houseColorStyle.input_title]}>Số điện thoại <Text style={[houseColorStyle.require]}>*</Text></Text>
                          <View style={[houseColorStyle.inputSectionModal, houseColorStyle.inputModal, (isSubmit && customerInfor?.Phone == "") ? { borderColor: color.dangerX } : {},]}>
                            {/*@ts-ignore*/}
                            <TextInput numeric keyboardType={"numeric"}
                              style={houseColorStyle.inputModal} placeholder="Số điện thoại"
                              placeholderTextColor="#9098B1"
                              value={customerInfor?.Phone}
                              autoCapitalize='none'
                              onChangeText={(str) => {
                                let con = { ...customerInfor }
                                con.Phone = str
                                setCustomerInfo(con)
                              }} underlineColorAndroid="transparent" />
                          </View>
                          <Text style={[houseColorStyle.input_title]}>Địa chỉ</Text>
                          <View style={[houseColorStyle.inputSectionModal, houseColorStyle.inputModal]}>
                            <TextInput
                              value={customerInfor?.Address}
                              style={houseColorStyle.inputModal}
                              placeholder="Địa chỉ"
                              placeholderTextColor="#9098B1"
                              onChangeText={(str) => {
                                let con = { ...customerInfor }
                                con.Address = str
                                setCustomerInfo(con)
                              }}
                              underlineColorAndroid="transparent"
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100 }}>
                          <TouchableOpacity style={houseColorStyle.backButton} onPress={() => closeModal()}>
                            <Text style={{ color: "#505050", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={houseColorStyle.confirmButton} onPress={() => createCustomer()}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={houseColorStyle.linearButtonGradient}>
                              <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Xác nhận</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </Modal>
            </View>
          </Modal>
        </Screen>
      </View>
    </>
  )
})

const ColorView = ({ item, index }) => {
  return (
    <>{
      item?.ColorId ?
        <View style={[houseColorStyle.item]}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
              <reactNativeShape.Octagon color={item.ColorHex ?? item.Rgb} scale={0.6} rotate={0} />
              <View style={{ paddingLeft: 20, flexDirection: "column" }}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{item?.ColorCode}</Text>
                <Text style={{ color: "white", fontSize: 10, fontWeight: "400" }}>{item?.ColorName}</Text>
              </View>
            </View>
          </View>{
          }
        </View> : null
    }
      <View style={styles.hr} />
    </>
  )
}

export const houseColorStyle = StyleSheet.create({
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
  item: {
    marginVertical: 2,
    paddingHorizontal: 28,
    marginLeft: 10,
    width: "100%", // is 100% of container width
  },
  item_image: {
    width: "100%",
    height: 168,
    borderRadius: 8,
    backgroundColor: "gray",
    resizeMode: "cover",
  },
  header_bottom: {
    position: "absolute",
    top: 120,
    height: 50,
    backgroundColor: "#D33724",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  header_bottom_icons: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
  },
  header_bottom_rhombus: {
    position: "absolute",
    bottom: 28,
    // width: 88,
    // height: 88,
  },
  header_bottom_icon: {
    bottom: 45,
    // width: 28,
    // height: 25.38,
    position: "absolute",
  },
  header_center_name: {
    color: color.white,
    fontSize: 20, fontWeight: "700", lineHeight: 16.94,
  },
  title: {
    color: color.black,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  changePassword: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 56,
    maxHeight: 56,
    marginBottom: 64
  },
  changePasswordButton: {
    backgroundColor: "white",
    borderColor: "#E8E8E7",
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 32,
    maxHeight: 32,
    minWidth: 198,
  },
  inputEndIcon: {
    width: 14,
    height: 14,
    margin: 10,
    // resizeMode: "contain",
    // color: "#9098B1",
  },
  inputSection: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: "black",
    minHeight: 40,
    maxHeight: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingRight: 10,
    paddingLeft: 0,
    marginVertical: 0,
    backgroundColor: 'black',
    color: '#FFFFFF',
    height: 35,
    paddingTop: 8
  },
  require: {
    color: "red"
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTitle: {
    position: "absolute"
  },
  input_title: {
    color: "#000000",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 10
  },
  linearGradient: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "white",
    minHeight: 38,
    maxHeight: 38,
    minWidth: 150,
  },
  inputAndroid: {
    fontSize: 18,
    paddingVertical: 12,
    fontWeight: "700",
    marginTop: 12,
    borderWidth: 0,
    borderRadius: 4,
    color: 'white',
    paddingRight: 30,
    minWidth: Dimensions.get('window').width - 150,
  },
  inputIOS: {
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 11,
    paddingHorizontal: 16,
    color: 'white',
    minWidth: Dimensions.get("window").width - 130,
    borderRadius: 4,
    height: 48
  },
  /*END*/
  modal_title: {
    alignItems: "center",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18.75,
    textAlign: "center"
  },
  inputSectionModal: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 5,
    width: "90%",
    justifyContent: "flex-start",
  },
  inputModal: {
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
})