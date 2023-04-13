import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient'
// import { HeaderAuth, Screen } from "../../components"
import {
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  StyleSheet, Alert, ActivityIndicator, Dimensions, Modal, TouchableWithoutFeedback, Keyboard,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  HeaderKova,
} from "../../components"
import {
  Entypo,
  AntDesign,
  MaterialIcons,
  FontAwesome5
} from "@expo/vector-icons"

import { StorageKey } from "../../services/storage"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"

import { homeStyles } from "../home-screen/home-screen"
import { format } from "date-fns"

const FULL: ViewStyle = {
  flex: 1,
  backgroundColor: "white"
}
// 

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

const _unitOfWork = new UnitOfWorkService();

export const GiftScreen = observer(function GiftScreen() {
  const navigation = useNavigation();
  // const isFocused = useIsFocused()
  //-----------------------------------------------------
  /*BIẾN KHAI BÁO*/
  const [giftInfor, setGiftInfo] = useState({
    Id: null,
    Name: "",
    ImageUrl: "",
    Point: 0,
    Price: 0
  });

  //-----------------------------------------------------
  /*BIẾN ĐIỀU KIỆN*/
  const [isLoading, setLoading] = useState(false)
  // const isFocused = useIsFocused();
  const [isRefresh, setRefresh] = useState(false);
  //-----------------------------------------------------
  /*MASTER DATA*/
  const [, setUserId] = useState<any>(null);
  // Thầu thợ
  const [worker, setWorker] = useState<any>({
    Id: '',
    FullName: '',
    Phone: '',
    CurrentPoints: 0,
    WorkPlace: '',
    Rank: '',
    CreatedDate: null,
    UsedPoint: 0,
    NotUsedPoint: 0,
    StartRankPoint: 0,
    EndRankPoint: 0,
    RankPoint: 0,
    CustomerNumber: 0
  });
  // Thông tin nhận hàng
  const [person, setPerson] = useState<any>({
    Id: '',
    FullName: '',
    Phone: '',
    CurrentPoints: 0,
    WorkPlace: '',
    Rank: '',
    CreatedDate: null,
    UsedPoint: 0,
    NotUsedPoint: 0,
    StartRankPoint: 0,
    EndRankPoint: 0,
    RankPoint: 0
  });
  const [listItems, setListItems] = useState<any>(null);
  const currentDate = new Date();

  function goToScreen(page: string) {
    navigation && navigation.navigate(page);
  }

  //----------------------------------------------------
  /*MODAL*/
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalRegisterAddressVisible, setRegisterAddressVisible] = useState(false);
  const [modalSuccessVisible, setModalSuccessVisible] = useState(false);

  const openModal = function (gift: any) {
    setModalConfirmVisible(!modalConfirmVisible);
    setGiftInfo(gift);
  }

  const closeModal = function () {
    setModalConfirmVisible(!modalConfirmVisible);
    setGiftInfo(null);
  }

  const confirmGift = function () {
    if (worker.NotUsedPoint < giftInfor.Point) {
      Alert.alert("Thông báo", "Số điểm hiện tại của bạn không đủ để đổi quà!");
    } else {
      setModalConfirmVisible(!modalConfirmVisible);
      setRegisterAddressVisible(!modalRegisterAddressVisible);
    }
  }

  const closeModalRegisterAddress = function () {
    setModalConfirmVisible(false);
    setRegisterAddressVisible(false);
    setGiftInfo(null);
  }

  const openSuccessModal = function () {
    setRegisterAddressVisible(false);
    setModalConfirmVisible(false);
    setModalSuccessVisible(!modalSuccessVisible);
  }

  const closeSuccessModal = function () {
    setRegisterAddressVisible(false);
    setModalConfirmVisible(false);
    setModalSuccessVisible(!modalSuccessVisible);

    setGiftInfo(null);
    fetchData();
  }

  //-----------------------------------------------------
  /*START : HÀM GET MASTER DATA*/
  useEffect(() => {
    fetchData().catch(err => {
      setLoading(false);
      goBack();
    });
  }, [isRefresh]);

  useEffect(() => {
    fetchGiftData().catch(err => {
      setLoading(false);
      goBack();
    });
  }, [isRefresh]);

  const fetchData = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      setUserId(userId);
      const response = await _unitOfWork.user.getDataWorkerDetailById({ "WorkerId": userId })
      if (response.StatusCode == 200) {
        setWorker(response.Worker);
        setPerson(response.Worker);
      } else {

      }
    }
  }

  const fetchGiftData = async () => {
    setRefresh(false);
    if (!isRefresh) {
      setLoading(true)
      const response = await _unitOfWork.user.getMasterDataGiftWorker({});
      setLoading(false)
      if (response.StatusCode == 200) {
        response.ListGift.forEach(item => {
          item.ImageUrl = _unitOfWork.user.fixAvatar(item.ImageUrl);
        });
        setListItems(response.ListGift);
      } else {
      }
    }
  }
  /*END : HÀM GET MASTER DATA*/


  // ---------------------------------------------------------------
  /*ĐỔI QUÀ TẶNG*/
  const tradeGift = async () => {
    setRegisterAddressVisible(false)
    setLoading(true);
    const response = await _unitOfWork.user.tradeGift({
      "Gift": giftInfor,
      "Worker": person
    });
    setLoading(false);
    if (response.StatusCode != 200) {
      Alert.alert("Thông báo", "Đã xảy ra lỗi! Không đăng ký đổi được quà tặng!");
      return false;
    } else {
      openSuccessModal();
      return true;
    }
  }
  /*END*/

  const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
    Alert.alert("Thông báo", err,
      [{
        text: "OK", onPress: () => {
          navigation && navigation.goBack()
        },
      }], { cancelable: false });
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

  //--------------------------------------------------------------
  const topComponent = () => {
    return (
      <View>
        <View>
          {/*background*/}
          <View>
            <Image style={[homeStyles.w_100, homeStyles.position_absolute]} source={images.background1} />
            <Image style={[homeStyles.w_100, { height: 333 }]} source={images.background2} />
          </View>
          <HeaderKova />
          {/*user: avatar, name*/}
          <View style={homeStyles.header_center}>
            <Image style={[homeStyles.w_100, { position: "absolute" }]} source={images.card_gardient} />
            <Image style={[homeStyles.w_100, { opacity: .25 }]} source={images.card} />
            <View style={{ position: "absolute", top: 30, left: 32, flexDirection: "row" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 25, fontWeight: "bold", lineHeight: 30 }}>
                {worker?.NotUsedPoint ? formatNumber(worker?.NotUsedPoint) : '0'}</Text><Text style={{ color: "#FFFFFF", alignSelf: "center", paddingHorizontal: 5, fontSize: 24 }}>điểm</Text>
            </View>
            <Text style={{ position: "absolute", top: 62, left: 32, fontSize: 9, color: "white" }}>{worker?.Rank ?? "Không cấp"} - {formatNumber(worker?.CurrentPoints) ?? '0'}</Text>

            <View style={{ position: "absolute", top: 100, left: 32, flexDirection: "row" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold", lineHeight: 21 }}>{worker?.FullName ?? "Họ và tên"}</Text>
            </View>
            <Text style={{ position: "absolute", top: 125, left: 32, fontSize: 9, color: "white" }}>{worker?.WorkPlace ?? "Địa chỉ"} - {worker?.CustomerNumber} khách hàng</Text>
            <Text style={{ position: "absolute", top: 140, left: 32, fontSize: 9, color: "white" }}>{format(worker?.CreatedDate, "DD.MM.YYYY")} - {format(currentDate, "DD.MM.YYYY")}</Text>
            <View style={{ position: "absolute", top: 30, right: 20, }}>
              <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => goToScreen("HistoryScreen")}>
                <Text style={{ color: "white", width: 52, lineHeight: 13, fontSize: 9, textAlign: "right", fontWeight: "400" }}>Lịch sử giao dịch</Text>
                <Entypo name="chevron-thin-right" size={21} color="#EDEDED" style={{ alignSelf: "center", paddingLeft: 5 }} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>Tích lũy điểm xếp hạng</Text>
            <View style={[giffStyles.w_100, { flexDirection: "row" }]}>
              <Progress.Bar progress={worker?.RankPoint} width={Dimensions.get('window').width - Dimensions.get('window').width * 0.1} style={giffStyles.progressBar}
                height={10} color={"#6BB3CB"} />
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFBE5C', '#FFEF5C']} style={giffStyles.linearGradient}>
                <AntDesign name="star" size={12} color="#E65608" />
              </LinearGradient>
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "95%" }}>
              <Text style={giffStyles.fontPoint}>{formatNumber(worker?.StartRankPoint)} điểm</Text>
              <View />
              <Text style={giffStyles.fontPoint}>{formatNumber(worker?.EndRankPoint)} điểm</Text>
            </View>
          </View>
        </View>
        <View style={[giffStyles.ads_container]}>
          <Text style={giffStyles.ads_title}>Đổi điểm thưởng lấy quà</Text>
        </View>
      </View>
    )
  }
  const footerComponent = () => {
    return (
      <View style={{ marginBottom: 80 }} />
    )
  }

  const ItemView = ({ item, index }) => {
    return (
      <View style={[giffStyles.item]}>
        <View>
          <TouchableOpacity onPress={() => {
            openModal(item);
          }}>
            <Image style={giffStyles.item_image} source={{ uri: item?.ImageUrl }} />
          </TouchableOpacity>
          <TouchableOpacity>
            {
              item.isFavorite ?
                <MaterialIcons style={giffStyles.item_favorite} name="favorite" size={24} color="red" /> :
                <MaterialIcons style={giffStyles.item_favorite} name="favorite-outline" size={24} color="white" />
            }
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={giffStyles.item_title}>{item?.Name}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFBE5C', '#FFEF5C']} style={giffStyles.icon_star}>
            <AntDesign name="star" size={12} color="#FFFFFF" style={{ alignSelf: "center", alignContent: "center", marginTop: 1 }} />
          </LinearGradient>
          <Text style={giffStyles.item_point}>{formatNumber(item?.Point)} điểm</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const onRefresh = () => {
    setRefresh(true)
  }
  return (
    <>
      {isLoading &&
        <View style={giffStyles.loading}>
          <ActivityIndicator size="large" color="white" />
        </View>
      }
      <View style={FULL}>
        <FlatList
          onRefresh={() => onRefresh()}
          refreshing={isRefresh}
          ListHeaderComponent={topComponent()}
          ListFooterComponent={footerComponent()}
          data={listItems}
          keyExtractor={(item, index) => "home" + index + String(item)}
          renderItem={ItemView}
          columnWrapperStyle={giffStyles.flatListColumnWrapperStyle}
          horizontal={false}
          numColumns={2}
        />
      </View>
      {/*Model xác nhận đổi quà*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalConfirmVisible}
        onRequestClose={() => {
          setModalConfirmVisible(!modalConfirmVisible);
        }}>
        <View style={giffStyles.centeredView}>
          <View style={giffStyles.modalView}>
            <View style={{ marginTop: 0, width: "100%" }}>
              <View>
                <Image style={[giffStyles.w_100, homeStyles.position_absolute, giffStyles.modal_image]} source={images.modalBackgroup1} />
                <Image style={[giffStyles.w_100, giffStyles.modal_image, { opacity: .4 }]} source={images.modalBackgroup2} />
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", position: "absolute" }}>
                  <View />
                  <View />
                  <TouchableOpacity style={giffStyles.close_button} onPress={() => closeModal()}>
                    <FontAwesome5 name="times" size={18} color="#212121" />
                  </TouchableOpacity>
                </View>

                <View style={{ width: "100%", flex: 1, flexDirection: "row", justifyContent: "space-between", position: "absolute", top: 20 }}>
                  <View />
                  <View style={{ alignItems: "center" }}>
                    <Image style={[giffStyles.modal_image_gift]} source={{ uri: giftInfor?.ImageUrl }} />
                    <Text style={giffStyles.modal_gift_name}>{giftInfor?.Name}</Text>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingTop: 5 }}>
                      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFBE5C', '#FFEF5C']} style={giffStyles.modal_icon_star}>
                        <AntDesign name="star" size={10} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={giffStyles.modal_point}>{giftInfor?.Point.toLocaleString('ja-JP')} điểm</Text>
                    </View>
                  </View>
                  <View />
                </View>
                <View style={{ width: "100%", flex: 1, flexDirection: "row", justifyContent: "space-between", position: "absolute", bottom: 18 }}>
                  <View />

                  <View />
                </View>
              </View>

              <View style={{ paddingBottom: 30, paddingTop: 30, marginHorizontal: 0 }}>
                <View>
                  <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", position: "absolute" }}>
                    <View />
                    <View style={{ alignItems: "center" }}>
                      <Text style={giffStyles.modal_title}>Xác nhận đổi điểm</Text>
                      <Text style={giffStyles.modal_used_point}>- {giftInfor?.Point.toLocaleString('ja-JP')} điểm</Text>
                      <Text style={{ fontSize: 10, fontWeight: "400", marginTop: 8 }}>Điểm sẽ được trừ trực tiếp vào tổng điểm thưởng của bạn</Text>
                    </View>
                    <View />
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                <TouchableOpacity style={giffStyles.backButton} onPress={() => closeModal()}>
                  <Text style={{ color: "#505050", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={giffStyles.confirmButton} onPress={() => confirmGift()}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={giffStyles.linearButtonGradient}>
                    <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Đồng ý</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/*Đăng ký địa chỉ nhận quà*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalRegisterAddressVisible}
        onRequestClose={() => {
          setRegisterAddressVisible(!modalRegisterAddressVisible);
        }}>
        <View style={giffStyles.centeredView} >
          <View style={giffStyles.modalView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View style={{ width: "100%" }}>
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                  <View />
                  <Text style={[giffStyles.modal_title, { marginLeft: 10 }]}>Đăng ký địa chỉ nhận quà</Text>
                  <TouchableOpacity onPress={() => closeModalRegisterAddress()} style={{ marginRight: 15 }}>
                    <FontAwesome5 name="times" size={18} color="#212121" />
                  </TouchableOpacity>
                </View>
                <View style={{ paddingBottom: 30, paddingTop: 20, marginHorizontal: 0 }}>
                  <Text style={[giffStyles.input_title, { marginLeft: 35, }]}>Tên người nhận</Text>
                  <View style={[giffStyles.inputSection, giffStyles.input,]}>
                    {/*(isSubmit && userinfo?.userName == "") ? { borderColor: color.dangerX } : {},*/}
                    <TextInput style={[giffStyles.input, { marginLeft: 10 }]} value={person?.FullName}
                      placeholder="Người nhận"
                      autoCapitalize='none'
                      onChangeText={(str) => {
                        let per = { ...person }
                        per.FullName = str
                        setPerson(per);
                      }}
                      underlineColorAndroid="transparent" />
                  </View>
                  <Text style={[giffStyles.input_title, { marginLeft: 35, marginTop: 15 }]}>Số điện thoại liên hệ</Text>
                  <View style={[giffStyles.inputSection, giffStyles.input]}>
                    {/*(isSubmit && userinfo?.userName == "") ? { borderColor: color.dangerX } : {},*/}
                    <TextInput keyboardType={"numeric"} style={[giffStyles.input, { marginLeft: 10 }]}
                      value={person?.Phone}
                      onChangeText={(str) => {
                        let per = { ...person }
                        per.Phone = str
                        setPerson(per);
                      }}
                      placeholder="Số điện thoại"
                      autoCapitalize='none' underlineColorAndroid="transparent" />
                  </View>
                  <Text style={[giffStyles.input_title, { marginLeft: 35, marginTop: 15 }]}>Địa chỉ giao hàng</Text>
                  <View style={[giffStyles.inputSection, giffStyles.input, { minHeight: 100 }]}>
                    {/*(isSubmit && userinfo?.userName == "") ? { borderColor: color.dangerX } : {},*/}
                    <TextInput style={[giffStyles.input, { marginLeft: 10, marginRight: 10, minHeight: 98 }]}
                      multiline={true}
                      numberOfLines={8}
                      value={person?.Address}
                      onChangeText={(str) => {
                        let per = { ...person }
                        per.Address = str
                        setPerson(per);
                      }}
                      placeholder="Địa chỉ"
                      autoCapitalize='none' underlineColorAndroid="transparent" />
                  </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 150 }}>
                  <TouchableOpacity style={giffStyles.backButton} onPress={() => closeModalRegisterAddress()}>
                    <Text style={{ color: "#505050", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={giffStyles.confirmButton} onPress={() => tradeGift()}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={giffStyles.linearButtonGradient}>
                      <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Xác nhận</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>

      {/*Đổi quà tặng thành công*/}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSuccessVisible}
        onRequestClose={() => {
          setModalSuccessVisible(!modalSuccessVisible);
        }}>
        <View style={giffStyles.centeredView}>
          <View style={giffStyles.modalView}>
            <View style={{ marginTop: 0, width: "100%" }}>
              <View>
                <Image style={[giffStyles.w_100, homeStyles.position_absolute, giffStyles.modal_image]} source={images.modalBackgroup1} />
                <Image style={[giffStyles.w_100, giffStyles.modal_image, { opacity: .4 }]} source={images.modalBackgroup2} />
                <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", position: "absolute" }}>
                  <View />
                  <View />
                  <TouchableOpacity style={giffStyles.close_button} onPress={() => closeSuccessModal()}>
                    <FontAwesome5 name="times" size={18} color="#212121" />
                  </TouchableOpacity>
                </View>

                <View style={{ width: "100%", flex: 1, flexDirection: "row", justifyContent: "center", position: "absolute", top: 35 }}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#4AED61', '#62EE81', '3FF358']} style={giffStyles.successGradient}>
                    <Image style={{ alignSelf: "center", marginTop: 15, height: 50, marginLeft: 5 }} source={images.vector_success} />
                  </LinearGradient>
                </View>
              </View>

              <View style={{ paddingBottom: 30, paddingTop: 30, marginHorizontal: 0 }}>
                <View>
                  <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", position: "absolute" }}>
                    <View />
                    <View style={{ alignItems: "center" }}>
                      <Text style={giffStyles.modal_title}>Xác nhận thành công</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 11, fontWeight: "400", marginTop: 8, marginHorizontal: 40, textAlign: "center", lineHeight: 17 }}>Quà tặng <Text style={{ color: "#17C5E8" }}>{giftInfor?.Name ?? ""} </Text>
                          sẽ được chuyển đến địa chỉ<Text style={{ color: "#17C5E8" }}> {person?.Address}</Text> trong vòng vài ngày tới. Bạn vui lòng để ý điện thoại! </Text>
                      </View>
                    </View>
                    <View />
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 65, marginRight: 15 }}>
                <TouchableOpacity style={giffStyles.confirmButton} onPress={() => closeSuccessModal()}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={giffStyles.linearButtonGradient}>
                    <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
})

// CSS
const giffStyles = StyleSheet.create({
  loading: {
    flex: 1,
    zIndex: 1000000,
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
  progressBar: {
    width: '90%',
    marginTop: 18,
    marginLeft: 10,
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    height: 10,
  },
  linearGradient: {
    position: "absolute",
    right: 10,
    top: 16,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "white",
    minWidth: 14,
    maxWidth: 14,
    minHeight: 14,
    maxHeight: 14,
  },
  icon_star: {
    borderWidth: 1,
    borderRadius: 9,
    borderColor: "white",
    minWidth: 18,
    maxWidth: 18,
    minHeight: 18,
    maxHeight: 18,
  },
  fontPoint: {
    paddingTop: 5,
    fontSize: 11,
    color: "white"
  },
  ads_container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: -12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ads_title: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 21.09,
    marginTop: 10,
  },
  title: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginTop: 8,
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
    // backgroundColor: "red",
    // flex: 0.5,
    marginVertical: 8,
    // marginHorizontal: 8,
    paddingHorizontal: 8,
    width: "50%", // is 50% of container width
  },
  item_image: {
    // width: 170,
    width: "100%",
    height: 170,
    borderRadius: 8,
    backgroundColor: "gray",
    marginBottom: 8,
    resizeMode: "cover",
  },
  item_title: {
    color: "black",
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "700",
    marginBottom: 4,
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
  /*MODAL CSS*/
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
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
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10
  },

  modal_image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 180
  },
  close_button: {
    position: "absolute",
    top: 10,
    right: 15
  },
  modal_image_gift: {
    width: 100,
    height: 80,
    borderRadius: 8,
    backgroundColor: "gray",
    resizeMode: "cover",
  },
  modal_gift_name: {
    color: "white",
    lineHeight: 15,
    fontSize: 13,
    fontWeight: "700",
    marginHorizontal: 30,
    paddingTop: 10
  },
  modal_point: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "400",
    marginLeft: 5
  },
  modal_icon_star: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "white",
    minWidth: 14,
    maxWidth: 14,
    minHeight: 14,
    maxHeight: 14,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18.75
  },
  modal_used_point: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "700",
    color: "#E55300"
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
  successGradient: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 35,
    borderColor: "white",
    minWidth: 70,
    maxWidth: 70,
    minHeight: 70,
    maxHeight: 70,
  },
  /*END*/

});