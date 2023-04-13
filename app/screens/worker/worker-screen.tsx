import React, { useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput, StyleSheet, Platform, Modal } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
// import { Button } from '@ui-kitten/components';
import * as ImagePicker from "expo-image-picker";
import { observer } from "mobx-react-lite"
import {
  FontAwesome,
  MaterialCommunityIcons,
  Entypo,
  AntDesign,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons"
import RNPickerSelect from "react-native-picker-select"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { ScrollView } from "react-native-gesture-handler"
import { Dimensions } from 'react-native';
import { format } from "date-fns"
import RNDatePicker from "@react-native-community/datetimepicker"
import DatePicker from "react-native-datepicker"
import { Appearance } from "react-native-appearance"
import { toString } from "ramda"

const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = { flex: 1 }

const TEXT: TextStyle = {
  color: '#FFFFFF',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
  backgroundColor: "#D33724",
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  maxWidth: Dimensions.get('window').width,
  alignSelf: "center",
  paddingHorizontal: spacing[1],
  paddingTop: spacing[1],
  backgroundColor: "#FFFFFF",
  borderTopRightRadius: 12,
  borderTopLeftRadius: 12
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  lineHeight: 30,
  textAlign: "left",
  letterSpacing: 1.5,
  color: "#FFFFFF"
}

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  lineHeight: 16.94,
  textAlign: "center",
  letterSpacing: 1.5,
  color: "gray",
  fontWeight: "400",
  paddingTop: 6
}

const MODAL_BUTTON_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 14,
  lineHeight: 16.94,
  textAlign: "center",
  letterSpacing: 1.5,
  color: "#FFFFFF",
  fontWeight: "700",
  paddingTop: 8
}

export const WorkerScreen = observer(function WorkerScreen(props: any) {
  const navigation = useNavigation();
  const [isSubmit, setSubmit] = useState(false);

  const { params } = props.route.params;
  const [isLoading, setLoading] = useState(false);
  const inputFullName = useRef(null);

  const [oldPassword, setOldPasswrod] = useState('');
  const [newPassword, setNewPasswrod] = useState('');
  const [confrimNewPassword, setConfirmNewPasswrod] = useState('');

  const [hidepass1, setShowpass1] = useState(true);
  const [hidepass2, setShowpass2] = useState(true);
  const [hidepass3, setShowpass3] = useState(true);

  const images = {
    banner: { uri: "https://i.pinimg.com/originals/53/93/b7/5393b7a307aa4b904db9d6c573e7866a.jpg" },
    login_banner: require('../../images/login_banner.png'),
    eye_icon: require('../../images/eye.png'),
    lock_icon: require('../../images/lock.png'),
    mail_icon: require('../../images/mail.png'),
    google: require('../../images/google.png'),
    facebook: require('../../images/facebook.png'),
    apple: require('../../images/apple.png'),
    camera: require("../../images/take-photo-icon.png"),
    plus: require("../../images/plus.png"),
    subtract: require("../../images/icons/subtract.png"),
  }
  const [colorScheme, setColorScheme] = useState<any>();
  /*BIẾN ĐIỀU KIỆN*/
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setEdit] = useState(false);
  /*END*/
  const logout = async () => {
    await _unitOfWork.user.logout()
    closeModal()
    navigation && navigation.navigate("LoginScreen")
  }
  const closeModal = function () {
    setSubmit(false);
    setModalVisible(!modalVisible);
    setOldPasswrod("");
    setNewPasswrod("");
    setConfirmNewPasswrod("");
  }

  const [date, setDate] = useState<any>()
  const [date_cmnd, setDate_cmnd] = useState<any>()
  const [listProvince, setListProvicne] = useState([]);
  const [listAgencyCode, setListAngencyCode] = useState([]);
  const [userinfo, setUserInfo] = useState({
    Id: null,
    AvartarUrl: null,
    UserName: "",
    Password: "",
    CurrentPoints: 0,
    LevelWorkerId: null,
    LevelWorkerName: "",
    ImageBase64: "",
  });
  const [contactInfor, setContactInfo] = useState({
    Id: "",
    Phone: "",
    Email: "",
    WorkerPlaceId: "",
    FirstName: "",
    LastName: "",
    AgencyCode: "",
    WorkPlace: "",
    Dob: null,
    Address: "",
    IdentityCard: "",
    WorkerPlaceName: "",
    FullName: "",
    AgencyCodeId: "",
    NgayCapCmnd : null,
    NoiCapCmnd : "",
    ThonXom: "",
    XaPhuong: "",
    QuanHuyen: "",
    TinhThanhPho: "",
    ChuTaiKhoanNganHang : "",
    SoTaiKhoanNganHang : "",
    TenNganHang: ""
  });


  useEffect(() => {
    let colorScheme = Appearance.getColorScheme()
    setColorScheme(colorScheme)
  }, []);

  /*GET MASTER DATA*/
  useEffect(() => {
    getMasterData();
  }, []);

  const selectAvatar = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.cancelled) {
      let uif = { ...userinfo }
      uif.AvartarUrl = `data:image/jpg;base64,${result.base64}`
      uif.ImageBase64 = `data:image/jpg;base64,${result.base64}`
      setUserInfo(uif)
    }
  }

  const getMasterData = async function () {
    setLoading(true)
    let res = await _unitOfWork.user.getMasterDataWorker({ "WorkerId": params.id });
    setLoading(false)
    if (res.data.StatusCode != 200) {
      Alert.alert("Thông báo", res.data.Message)
    } else {
      res.data.ListProvince.map((item: { label: any; ProvinceId: any; value: any; ProvinceName: any }) => {
        item.label = item.ProvinceName
        item.value = item.ProvinceId
        return item
      });
      setListProvicne(res.data.ListProvince);

      res.data.ListAgentCode.map((item: { label: any; CategoryId: any; value: any; CategoryName: any }) => {
        item.label = item.CategoryName;
        item.value = item.CategoryId;
        return item;
      });
      setListAngencyCode(res.data.ListAgentCode);

      res.data.User.AvartarUrl = _unitOfWork.user.fixAvatar(res.data.User.AvartarUrl);
      setUserInfo(res.data.User);
      setContactInfo(res.data.Contact);
      console.log("check info: ", res.data.Contact)

      let _birthday = format(res.data.Contact.Dob, "DD/MM/YYYY");
      setDate(_birthday)
      let _date_cmnd = format(res.data.Contact.NgayCapCmnd, "DD/MM/YYYY")
      setDate_cmnd(_date_cmnd)
    }
  }
  /*END*/

  const editName = async () => {
    await setEdit(true);
    inputFullName.current.focus();
  }

  /*CHỈNH SỬA THÔNG TIN*/
  const saveUser = async () => {
    if (checkInfo()) {
      setLoading(true)
      let res = await _unitOfWork.user.createOrUpdateWorker({ User: userinfo, Contact: contactInfor })
      setLoading(false)
      if (res.data.StatusCode != 200) {
        Alert.alert("Thông báo", res.data.Message)
      } else {
        Alert.alert("Thông báo", "Lưu thông tin thành công!")
      }
    }
  }
  /*END*/

  const changePassword = async () => {
    setSubmit(true)
    if (checkPassword()) {
      setLoading(true)
      let res = await _unitOfWork.user.changePassword({ OldPassword: oldPassword, NewPassword: newPassword, RepNewPassword: confrimNewPassword, UserId: params.id })
      setLoading(false)
      if (res.data.StatusCode != 200) {
        Alert.alert("Thông báo", res.data.Message)
        return false
      }
      Alert.alert("Thông báo", "Thay đổi mật khẩu thành công!",
        [{
          text: "Ok",
          onPress: () => logout()
        }])
    }
    return true;
  }

  const checkInfo = function () {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    if (contactInfor.FullName == "") {
      Alert.alert("Thông báo", "Họ và tên không được để trống!");
      return false;
    }

    if (contactInfor.AgencyCodeId == "") {
      Alert.alert("Thông báo", "Mã đại lý không được để trống!");
      return false;
    }
    if (contactInfor.Phone == "") {
      Alert.alert("Thông báo", "Số điện thoại không được để trống!");
      return false;
    }
    if (contactInfor.WorkerPlaceId == null) {
      Alert.alert("Thông báo", "Khu vực không được để trống!");
      return false;
    }
    if (contactInfor.NgayCapCmnd  == null) {
      Alert.alert("Thông báo", "Ngày cấp CMND không được để trống!");
      return false;
    }
    if (contactInfor.NoiCapCmnd  == "") {
      Alert.alert("Thông báo", "Nơi cấp CMND không được để trống!");
      return false;
    }
    if (contactInfor.IdentityCard  == "") {
      Alert.alert("Thông báo", "Số CMND không được để trống!");
      return false;
    }
    if (contactInfor.ChuTaiKhoanNganHang  == "") {
      Alert.alert("Thông báo", "Chủ tài khoản không được để trống!");
      return false;
    }
    if (contactInfor.SoTaiKhoanNganHang  == "") {
      Alert.alert("Thông báo", "Số tài khoản không được để trống!");
      return false;
    }
    if (contactInfor.TenNganHang  == "") {
      Alert.alert("Thông báo", "Tên ngân hàng không được để trống!");
      return false;
    }

    return true;
  }

  const checkPassword = function () {
    if (oldPassword == "" || newPassword == "" || confrimNewPassword == "") {

      return false;
    }
    if (newPassword != confrimNewPassword) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không trùng với mật khẩu mới!");
      return false;
    }
    return true;
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

          <View style={{ minHeight: 240 }}>
            <HeaderAuth titleStyle={HEADER_TITLE} iconStyle={TEXT} leftIcon={faChevronLeft}
              headerText={"Thông tin cá nhân"} rightStyle={TEXT} onLeftPress={navigation.goBack}
              rightTx={"Cập nhật"} onRightPress={saveUser} />
            <View style={[AuthStyles.avatar_banner, { marginBottom: 65 },
              // (isSubmit && userinfo?.avatar == null) ? { borderColor: color.dangerX } : {},
            ]}>
              <TouchableOpacity onPress={selectAvatar}>
                <Image source={userinfo.AvartarUrl ? { uri: userinfo.AvartarUrl } : images.camera}
                  style={AuthStyles.register_avatar_img} />
              </TouchableOpacity>
            </View>
            <View style={[styles.fullName]}>
              <TextInput
                value={contactInfor.FullName}
                editable={isEdit}
                style={styles.inputFullName}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.FullName = searchString
                  setContactInfo(con)
                }}
                ref={inputFullName}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => setEdit(false)}
              />
              <TouchableOpacity onPress={editName}>
                <FontAwesome name="pencil" size={18} color='#EBBD42' style={styles.fullNameIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={CONTAINER_PADDING}>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome name="mobile-phone" size={24} color='#9098B1' style={styles.inputStartIcon} />
              {/*@ts-ignore*/}
              <TextInput numeric keyboardType={"numeric"} style={styles.input} placeholder="Số điện thoại *"
                value={userinfo.UserName}
                editable={false}
                autoCapitalize='none'
                onChangeText={(searchString) => {
                  let uif = { ...userinfo }
                  uif.UserName = searchString
                  setUserInfo(uif);
                  let contact = { ...contactInfor }
                  contact.Phone = searchString
                  setContactInfo(contact)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <AntDesign name="qrcode" size={24} color='#9098B1' style={styles.inputStartIcon} />
              {/* <TextInput
                value={contactInfor.AgencyCode}
                style={styles.input}
                placeholder="Mã đại lý *"
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.AgencyCode = searchString
                  setContactInfo(con)
                }}
                underlineColorAndroid="transparent"
              /> */}
              <RNPickerSelect
                value={contactInfor.AgencyCodeId}
                style={{ inputIOS: styles.genderInputIOS, inputAndroid: detailStyle.inputAndroid }}
                placeholder={{ label: "Mã đại lý *", value: null }}
                onValueChange={(value) => {
                  const _temp = { ...contactInfor }
                  _temp.AgencyCodeId = value;
                  setContactInfo(_temp)
                }}
                items={listAgencyCode} />
            </View>
            {/*Khu vực*/}
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="map-signs" size={24} color="#9098B1" style={styles.inputStartIcon} />
              <RNPickerSelect
                value={contactInfor.WorkerPlaceId}
                style={{ inputIOS: styles.genderInputIOS, inputAndroid: detailStyle.inputAndroid }}
                placeholder={{ label: "Khu vực *", value: null }}
                onValueChange={(value) => {
                  const _temp = { ...contactInfor }
                  _temp.WorkerPlaceId = value;
                  setContactInfo(_temp)
                }}
                items={listProvince} />
            </View>

            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <MaterialCommunityIcons name="email-outline" size={23} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput
                value={contactInfor.Email}
                style={styles.input}
                placeholder="Email"
                onChangeText={(searchString) => {
                  let contact = { ...contactInfor }
                  contact.Email = searchString
                  setContactInfo(contact);
                }}
                underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <Entypo name="address" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="Địa chỉ"
                // autoCapitalize='none'
                value={contactInfor.Address}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.Address = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input,
            {
              width: "100%", minWidth: "100%", maxWidth: Dimensions.get("window").width,
              justifyContent: "flex-start",
            },]}>
              <FontAwesome5 name="birthday-cake" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <DatePicker
                locale={"vi"}
                display="spinner"
                showIcon={false}
                mode="date" placeholder="Ngày sinh" format="DD/MM/YYYY"
                minDate="01/01/1920" maxDate={new Date()}
                confirmBtnText="Xác nhận" cancelBtnText="Huỷ"
                date={date}
                onDateChange={(date) => {
                  setDate(date)
                  let _arr = date.split("/")
                  let _d = new Date(_arr[2], _arr[1] - 1, _arr[0], 7, 0, 0)
                  let con = { ...contactInfor }
                  con.Dob = _d
                  setContactInfo(con)
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
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome name="address-card" size={24} color='#9098B1' style={[styles.inputStartIcon]} />
              <TextInput style={styles.input} placeholder="CMT/Căn cước công dân"
                value={contactInfor.IdentityCard}
                autoCapitalize='none'
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.IdentityCard = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input,
            {
              width: "100%", minWidth: "100%", maxWidth: Dimensions.get("window").width,
              justifyContent: "flex-start",
            },]}>
              <FontAwesome5 name="calendar-day" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <DatePicker
                locale={"vi"}
                display="spinner"
                showIcon={false}
                mode="date" placeholder="     Ngày cấp CMND" format="DD/MM/YYYY"
                minDate="01/01/1920" maxDate={new Date()}
                confirmBtnText="Xác nhận" cancelBtnText="Huỷ"
                date={date_cmnd ? date_cmnd : null}
                onDateChange={(date) => {
                  setDate_cmnd(date)
                  let _arr = date.split("/")
                  let _d = new Date(_arr[2], _arr[1] - 1, _arr[0], 7, 0, 0)
                  let con = { ...contactInfor }
                  con.NgayCapCmnd = _d
                  setContactInfo(con)
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
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="address-card" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="Nơi cấp CMND"
                // autoCapitalize='none'
                value={contactInfor.NoiCapCmnd}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.NoiCapCmnd = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="id-badge" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="thôn/xóm"
                // autoCapitalize='none'
                value={contactInfor.ThonXom}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.ThonXom = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="id-badge" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="xã/phường"
                // autoCapitalize='none'
                value={contactInfor.XaPhuong}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.XaPhuong = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="id-badge" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="quận/huyện"
                // autoCapitalize='none'
                value={contactInfor.QuanHuyen}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.QuanHuyen = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="id-badge" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="tỉnh/tp"
                // autoCapitalize='none'
                value={contactInfor.TinhThanhPho}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.TinhThanhPho = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
      
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="user-alt" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="Tên tài khoản"
                // autoCapitalize='none'
                value={contactInfor.ChuTaiKhoanNganHang}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.ChuTaiKhoanNganHang = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="money-check" size={24} color='#9098B1' style={styles.inputStartIcon} />
              {/*@ts-ignore*/}
              <TextInput numeric keyboardType={"numeric"} style={styles.input} placeholder="Số tài khoản *"
                value={contactInfor.SoTaiKhoanNganHang}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.SoTaiKhoanNganHang = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={styles.hr}></View>
            <View style={[styles.inputSection_infor, AuthStyles.input]}>
              <FontAwesome5 name="university" size={24} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput style={styles.input} placeholder="Tên ngân hàng"
                // autoCapitalize='none'
                value={contactInfor.TenNganHang}
                onChangeText={(searchString) => {
                  let con = { ...contactInfor }
                  con.TenNganHang = searchString
                  setContactInfo(con)
                }} underlineColorAndroid="transparent" />
            </View>
            <View style={detailStyle.changePassword}>
              <TouchableOpacity style={detailStyle.changePasswordButton} onPress={() => setModalVisible(true)}>
                <Text style={BUTTON_TEXT}>Thay đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Screen>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={detailStyle.centeredView}>
            <View style={detailStyle.modalView}>
              <View style={{ marginTop: 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30, paddingTop: 20, marginHorizontal: -16 }}>
                  <View />
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Thay đổi mật khẩu</Text>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Feather name="x" size={18} color="black" />
                  </TouchableOpacity>
                </View>
                <Text style={detailStyle.input_title}>Mật khẩu cũ</Text>
                <View style={[detailStyle.inputSection, AuthStyles.input, (isSubmit && oldPassword == "") ? { borderColor: color.dangerX } : {},
                ]}>
                  <Feather name="lock" size={18} color='#9098B1' style={styles.inputStartIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu cũ"
                    onChangeText={(searchString) => {
                      setOldPasswrod(searchString)
                    }}
                    secureTextEntry={hidepass1}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity onPress={() => { setShowpass1(!hidepass1) }}>
                    <Image source={images.eye_icon} style={detailStyle.inputEndIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={detailStyle.input_title}>Mật khẩu mới</Text>
                <View style={[detailStyle.inputSection, AuthStyles.input, (isSubmit && newPassword == "") ? { borderColor: color.dangerX } : {},
                ]}>
                  <Feather name="lock" size={18} color='#9098B1' style={styles.inputStartIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    onChangeText={(searchString) => {
                      setNewPasswrod(searchString)
                    }}
                    secureTextEntry={hidepass2}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity onPress={() => { setShowpass2(!hidepass2) }}>
                    <Image source={images.eye_icon} style={detailStyle.inputEndIcon} />
                  </TouchableOpacity>
                </View>
                <Text style={detailStyle.input_title}>Nhập lại mật khẩu mới</Text>
                <View style={[detailStyle.inputSection, AuthStyles.input, (isSubmit && confrimNewPassword == "") ? { borderColor: color.dangerX } : {},
                ]}>
                  <Feather name="lock" size={18} color='#9098B1' style={styles.inputStartIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu mới"
                    onChangeText={(searchString) => {
                      setConfirmNewPasswrod(searchString)
                    }}
                    secureTextEntry={hidepass3}
                    underlineColorAndroid="transparent"
                  />
                  <TouchableOpacity onPress={() => { setShowpass3(!hidepass3) }}>
                    <Image source={images.eye_icon} style={detailStyle.inputEndIcon} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={detailStyle.changePasswordButtonModal} onPress={changePassword}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={detailStyle.linearGradient}>
                    <Text style={MODAL_BUTTON_TEXT}>Xác nhận</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
})

export const detailStyle = StyleSheet.create({
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 10
  },

  /*MODAL CSS*/
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    // padding: 35,
    paddingHorizontal: 35,
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
  changePasswordButtonModal: {
    backgroundColor: "transparent",
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 38,
    maxHeight: 38,
    minWidth: 150,
    borderColor: "white",
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
    fontSize: 13,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 12,
    borderWidth: 0,
    borderRadius: 4,
    color: '#9098B1',
    paddingRight: 30, // to ensure the text is never behind the icon
    minWidth: Dimensions.get('window').width - 60
  },
  /*END*/
})