import React, { useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput, StyleSheet, Platform, Dimensions, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { LinearGradient } from 'expo-linear-gradient'
import RNPickerSelect from "react-native-picker-select"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import RNDatePicker from "@react-native-community/datetimepicker"
import DatePicker from "react-native-datepicker"
import { Appearance } from "react-native-appearance"
import { raw } from "@storybook/react-native"

const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  minWidth: 380,
  maxWidth: 450,
  alignSelf: "center",
  paddingHorizontal: spacing[4],
  paddingTop: spacing[5],
}
const TEXT: TextStyle = {
  color: '#A23232',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  lineHeight: 30,
  textAlign: "left",
  letterSpacing: 1.5,
  color: "rgba(0, 0, 0, 1)"
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

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [hidepass1, setShowpass1] = useState(true);
  const [hidepass2, setShowpass2] = useState(true);
  const [isSubmit, setSubmit] = useState(false);
  const [date, setDate] = useState<any>();
  const [date_CMND_, setDate_CMND_] = useState<any>();
  const [colorScheme, setColorScheme] = useState<any>();

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
  }

  const [listProvince, setListProvicne] = useState([]);
  const [listAgencyCode, setListAngencyCode] = useState([]);

  const [userinfo, setUserInfo] = useState({
    avartarUrl: null,
    userName: "",
    password: "",
    password_confirmation: "",
  });
  const [contactInfor, setContactInfo] = useState({
    phone: "",
    area: null,
    email: "",
    workerPlaceId: "",
    firstName: "",
    lastName: "",
    agencyCode: "",
    workPlace: "",
    dob: null,
    agencyCodeId: "",
    IdentityCard: "",
    NgayCapCmnd : null, //ngày cấp cmnd
    NoiCapCmnd : "",  // nơi cấp cmnd
    ThonXom: "",
    XaPhuong: "",
    QuanHuyen: "",
    TinhThanhPho: "",
    ChuTaiKhoanNganHang : "", // chủ tài khoản
    SoTaiKhoanNganHang : "", // số tài khoản
    TenNganHang : "" // tên ngân hàng
  });

  const inputPassword = useRef(null);
  const inputPasswordConfirm = useRef(null);
  const agencyCode = useRef(null);
  const firstName = useRef(null);
  const NoiCapCmnd  = useRef(null);
  const ChuTaiKhoanNganHang  = useRef(null);
  const SoTaiKhoanNganHang  = useRef(null);
  const TenNganHang  = useRef(null);
  const IdentityCard = useRef(null);
  const thon_xom = useRef(null);
  const xa_phuong = useRef(null);
  const quan_huyen = useRef(null);
  const tinh_tp = useRef(null);

  // const lastName = useRef(null);

  useEffect(() => {
    let colorScheme = Appearance.getColorScheme()
    setColorScheme(colorScheme)
  }, []);

  useEffect(() => {
    getMasterData();
  }, []);

  const getMasterData = async function () {
    setLoading(true);
    let res = await _unitOfWork.user.getMasterDataSignUpWorker({});
    setLoading(false);
    if (res.data.StatusCode != 200) {
      Alert.alert("Thông báo", res.data.Message);
      return false;
    }
    res.data.ListProvince.map((item: { label: any; ProvinceId: any; value: any; ProvinceName: any }) => {
      item.label = item.ProvinceName;
      item.value = item.ProvinceId;
      return item;
    });
    setListProvicne(res.data.ListProvince);

    res.data.ListAngencyCode.map((item: { label: any; CategoryId: any; value: any; CategoryName: any }) => {
      item.label = item.CategoryName;
      item.value = item.CategoryId;
      return item;
    });
    setListAngencyCode(res.data.ListAngencyCode);

    return true;
  }

  const register = async () => {
    setSubmit(true)
    if (checkInfo()) {
      setLoading(true)
      let res = await _unitOfWork.user.signUpWorker({ User: userinfo, Contact: contactInfor })
      console.log({User: userinfo, Contact: contactInfor});
      
      setLoading(false)
      if (res.data.StatusCode != 200) {
        Alert.alert("Thông báo", res.data.Message)
        return false
      }
      Alert.alert("Thông báo", "Bạn đã đăng ký thành công! Vui lòng chờ đợi trong khoản thời gian quản trị viên phê duyệt!",
        [
          { text: "OK", onPress: () => navigation.goBack() }
        ])
    }
    return true
  }

  const checkInfo = function () {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    if (userinfo.userName == "" || userinfo.password == "" || userinfo.password_confirmation == "") {
      Alert.alert("Thông báo", "Số điện thoại và mật khẩu không được để trống!");
      return false;
    }

    if (userinfo.password != userinfo.password_confirmation) {
      Alert.alert("Thông báo", "Mật khẩu và mật khẩu xác nhận không giống nhau!")
      return false
    }

    if (contactInfor.firstName == "") {
      Alert.alert("Thông báo", "Họ và tên không được để trống!");
      return false;
    }

    if (contactInfor.agencyCodeId == "") {
      Alert.alert("Thông báo", "Mã đại lý không được để trống!");
      return false;
    }
    if (contactInfor.phone == "") {
      Alert.alert("Thông báo", "Số điện thoại không được để trống!");
      return false;
    }
    if (contactInfor.workerPlaceId == null) {
      Alert.alert("Thông báo", "Khu vực không được để trống!");
      return false;
    }
    if (contactInfor.dob == null) {
      Alert.alert("Thông báo", "Ngày sinh không được để trống!");
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
    if (contactInfor?.IdentityCard  == "") {
      Alert.alert("Thông báo", "Số CMND không được để trống!");
      return false;
    }
    if (contactInfor?.ThonXom  == "") {
      Alert.alert("Thông báo", "Thôn/xóm không được để trống!");
      return false;
    }
    if (specialChars.test(contactInfor?.ThonXom)) {
      Alert.alert("Thông báo", "Thôn/xóm không được phép có kí tự đặc biệt!");
      return false;
    }
    if (contactInfor?.QuanHuyen  == "") {
      Alert.alert("Thông báo", "Quận/huyện không được để trống!");
      return false;
    }
    if (specialChars.test(contactInfor?.QuanHuyen)) {
      Alert.alert("Thông báo", "Quận/huyện không được phép có kí tự đặc biệt!");
      return false;
    }
    if (contactInfor?.XaPhuong  == "") {
      Alert.alert("Thông báo", "Xã/phường không được để trống!");
      return false;
    }
    if (specialChars.test(contactInfor?.XaPhuong)) {
      Alert.alert("Thông báo", "Xã/Phường không được phép có kí tự đặc biệt!");
      return false;
    }
    if (contactInfor?.TinhThanhPho  == "") {
      Alert.alert("Thông báo", "Tỉnh/TP không được để trống!");
      return false;
    }
    if (specialChars.test(contactInfor?.TinhThanhPho)) {
      Alert.alert("Thông báo", "Tỉnh/TP không được phép có kí tự đặc biệt!");
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

  return (
    <>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#A23232" />
        </View>
      }
      <View style={FULL}>
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>
          <HeaderAuth titleStyle={HEADER_TITLE} iconStyle={TEXT} leftIcon={faChevronLeft}
            headerText={"Đăng ký tài khoản"} rightStyle={TEXT} onLeftPress={navigation.goBack} />
          <View style={CONTAINER_PADDING}>
            {/*phone*/}

            <Text style={registerStyle.input_title}>Số điện thoại</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && userinfo?.userName == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <FontAwesome name="mobile-phone" size={24} color='#9098B1' style={styles.inputStartIcon} /> */}
              {/*@ts-ignore*/}
              <TextInput numeric keyboardType={"numeric"} style={registerStyle.input} placeholder="Số điện thoại *"
                autoCapitalize='none'
                onChangeText={(str) => {
                  let uif = { ...userinfo }
                  uif.userName = str
                  setUserInfo(uif);
                  let contact = { ...contactInfor }
                  contact.phone = str
                  setContactInfo(contact)
                }} underlineColorAndroid="transparent"
                onSubmitEditing={() => inputPassword.current.focus()} />
            </View>
            <Text style={registerStyle.input_title}>Mật khẩu</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && userinfo?.password == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Feather name="lock" size={22} color='#9098B1' style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Mật khẩu *"
                onChangeText={(str) => {
                  let uif = { ...userinfo }
                  uif.password = str
                  setUserInfo(uif)
                }}
                ref={inputPassword}
                secureTextEntry={hidepass1}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => inputPasswordConfirm.current.focus()}
              />
              <TouchableOpacity onPress={() => { setShowpass1(!hidepass1) }}>
                <Image source={images.eye_icon} style={styles.inputEndIcon} />
              </TouchableOpacity>
            </View>
            {/* <Text style={AuthStyles.input_validate_txt}>(Mật khẩu có  độ cài từ 6 đến 32 ký tự)</Text> */}
            <Text style={registerStyle.input_title}>Nhập lại mật khẩu</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && userinfo?.password_confirmation == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Feather name="lock" size={22} color='#9098B1' style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Nhập lại mật khẩu *"
                onChangeText={(str) => {
                  let uif = { ...userinfo }
                  uif.password_confirmation = str
                  setUserInfo(uif)
                }}
                ref={inputPasswordConfirm}
                secureTextEntry={hidepass2}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => agencyCode.current.focus()}
              />
              <TouchableOpacity onPress={() => { setShowpass2(!hidepass2) }}>
                <Image source={images.eye_icon} style={styles.inputEndIcon} />
              </TouchableOpacity>
            </View>
            <Text style={registerStyle.input_title}>Mã đại lý</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.agencyCodeId == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <AntDesign name="qrcode" size={24} color='#9098B1' style={styles.inputStartIcon} /> */}
              {/* <TextInput
                style={registerStyle.input}
                placeholder="Mã đại lý *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.agencyCode = str
                  setContactInfo(uif)
                }}
                ref={agencyCode}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => firstName.current.focus()}
              /> */}
              <RNPickerSelect
                style={{ inputIOS: registerStyle.selectedInputIOS, inputAndroid: registerStyle.selectedInputAndroid }}
                placeholder={{ label: "Mã đại lý *", value: null }}
                onValueChange={(value) => {
                  const _temp = { ...contactInfor }
                  _temp.agencyCodeId = value;
                  setContactInfo(_temp)
                }}
                items={listAgencyCode} />
            </View>
            <Text style={registerStyle.input_title}>Họ và tên</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.firstName == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Họ và tên *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.firstName = str
                  setContactInfo(uif)
                }}
                ref={firstName}
                underlineColorAndroid="transparent"
              />
            </View>
            {/* <Text style={registerStyle.input_title}>Tên</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.lastName == "") ? { borderColor: color.dangerX } : {},]}>
              <TextInput
                style={registerStyle.input}
                placeholder="Tên *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.lastName = str
                  setContactInfo(uif)
                }}
                ref={lastName}
                underlineColorAndroid="transparent"
              />
            </View> */}
            <Text style={registerStyle.input_title}>Ngày sinh</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, {
              width: "100%", minWidth: "100%", maxWidth: Dimensions.get("window").width,
              justifyContent: "flex-start"
            }, (isSubmit && contactInfor?.dob == null) ? { borderColor: color.dangerX } : {}]}>
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
                  con.dob = _d
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
            <Text style={registerStyle.input_title}>Khu vực</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.workerPlaceId == null) ? { borderColor: color.dangerX } : {},]}>
              <RNPickerSelect
                style={{ inputIOS: registerStyle.selectedInputIOS, inputAndroid: registerStyle.selectedInputAndroid }}
                placeholder={{ label: "Khu vực *", value: null }}
                onValueChange={(value) => {
                  const _temp = { ...contactInfor }
                  _temp.workerPlaceId = value;
                  setContactInfo(_temp)
                }}
                items={listProvince} />
            </View>

            <Text style={registerStyle.input_title}>Số CMND</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.IdentityCard == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <TextInput
                keyboardType={"numeric"}
                style={registerStyle.input}
                placeholder="Số CMND *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.IdentityCard  = str
                  setContactInfo(uif)
                }}
                ref={IdentityCard}
                underlineColorAndroid="transparent"
              />
            </View>

            <Text style={registerStyle.input_title}>Ngày cấp CMND</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, {
              width: "100%", minWidth: "100%", maxWidth: Dimensions.get("window").width,
              justifyContent: "flex-start"
            }, (isSubmit && contactInfor?.NgayCapCmnd == null) ? { borderColor: color.dangerX } : {}]}>
              <DatePicker
                locale={"vi"}
                display="spinner"
                showIcon={false}
                mode="date" placeholder="Ngày cấp" format="DD/MM/YYYY"
                minDate="01/01/1920" maxDate={new Date()}
                confirmBtnText="Xác nhận" cancelBtnText="Huỷ"
                date={date_CMND_}
                onDateChange={(date) => {
                  setDate_CMND_(date)
                  let _arr = date.split("/")
                  let _d = new Date(_arr[2], _arr[1] - 1, _arr[0], 7, 0, 0)
                  let con = { ...contactInfor }
                  con.NgayCapCmnd  = _d
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

            <Text style={registerStyle.input_title}>Nơi cấp CMND</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.NoiCapCmnd == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Nơi cấp CMND *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.NoiCapCmnd  = str
                  setContactInfo(uif)
                }}
                ref={NoiCapCmnd }
                underlineColorAndroid="transparent"
              />
            </View>
            <Text style={registerStyle.input_title}>Hộ khẩu thường trú</Text>
            <View style={{flexDirection: 'row'}}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <View style={[registerStyle.inputSection_hokhau,{marginRight: '20%'}, AuthStyles.input, (isSubmit && contactInfor?.ThonXom == "") ? { borderColor: color.dangerX } : {},]}>
                <TextInput
                style={registerStyle.input_hokhau}
                placeholder="thôn/xóm"
                onChangeText={(str) => {
                  let uif = {...contactInfor}
                  uif.ThonXom  = str
                  setContactInfo(uif)
                }}
                ref={thon_xom}
                underlineColorAndroid="transparent"
                />
              </View>
              <View style={[registerStyle.inputSection_hokhau, AuthStyles.input, (isSubmit && contactInfor?.XaPhuong == "") ? { borderColor: color.dangerX } : {},]}>
                <TextInput
                style={registerStyle.input_hokhau}
                placeholder="xã/phường"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.XaPhuong  = str
                  setContactInfo(uif)
                }}
                ref={xa_phuong}
                underlineColorAndroid="transparent"
                />
              </View>            
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <View style={[registerStyle.inputSection_hokhau,{marginRight: '20%'}, AuthStyles.input, (isSubmit && contactInfor?.QuanHuyen == "") ? { borderColor: color.dangerX } : {},]}>
                <TextInput
                style={registerStyle.input_hokhau}
                placeholder="quận/huyện"
                onChangeText={(str) => {
                  let uif = { ...contactInfor}
                  uif.QuanHuyen  = str
                  setContactInfo(uif)
                }}
                ref={quan_huyen}
                underlineColorAndroid="transparent"
                />
              </View>
              <View style={[registerStyle.inputSection_hokhau, AuthStyles.input, (isSubmit && contactInfor?.TinhThanhPho == "") ? { borderColor: color.dangerX } : {},]}>
                <TextInput
                style={registerStyle.input_hokhau}
                placeholder="tỉnh/TP"
                onChangeText={(str) => {
                  let uif = { ...contactInfor}
                  uif.TinhThanhPho  = str
                  setContactInfo(uif)
                }}
                ref={tinh_tp}
                underlineColorAndroid="transparent"
                />
              </View>            
            </View>
            <Text style={registerStyle.input_title_2}>Thông tin tài khoản ngân hàng</Text>
            <Text style={registerStyle.input_title}>Chủ tài khoản</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.ChuTaiKhoanNganHang == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Chủ tài khoản *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.ChuTaiKhoanNganHang  = str
                  setContactInfo(uif)
                }}
                ref={ChuTaiKhoanNganHang }
                underlineColorAndroid="transparent"
              />
            </View>
            <Text style={registerStyle.input_title}>Số tài khoản</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.SoTaiKhoanNganHang == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <FontAwesome name="mobile-phone" size={24} color='#9098B1' style={styles.inputStartIcon} /> */}
              {/*@ts-ignore*/}
              <TextInput numeric keyboardType={"numeric"} style={registerStyle.input} placeholder="Số tài khoản *"
                autoCapitalize='none'
                onChangeText={(str) => {
                  let contact = { ...contactInfor }
                  contact.SoTaiKhoanNganHang  = str
                  setContactInfo(contact)
                }} underlineColorAndroid="transparent"
                onSubmitEditing={() => SoTaiKhoanNganHang .current.focus()} />
            </View>
            <Text style={registerStyle.input_title}>Ngân hàng</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && contactInfor?.TenNganHang == "") ? { borderColor: color.dangerX } : {},]}>
              {/* <Foundation name="text-color" size={24} color="#9098B1" style={styles.inputStartIcon} /> */}
              <TextInput
                style={registerStyle.input}
                placeholder="Ngân hàng *"
                onChangeText={(str) => {
                  let uif = { ...contactInfor }
                  uif.TenNganHang  = str
                  setContactInfo(uif)
                }}
                ref={TenNganHang}
                underlineColorAndroid="transparent"
              />
            </View>
            
            <TouchableOpacity style={registerStyle.button} onPress={register}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={registerStyle.linearGradient}>
                <Text style={MODAL_BUTTON_TEXT}>Đăng ký</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={[{ width: 320, alignSelf: "center" }, AuthStyles.section]}>
              <Text style={AuthStyles.gray_text}>Bằng việc đăng ký , bạn đã đồng ý với
                <Text style={AuthStyles.link_txt} onPress={() => { }}> Điều khoản sử dụng </Text>
                và
                <Text style={AuthStyles.link_txt} onPress={() => { }}> Chính sách riêng tư </Text>
                của chúng tôi
              </Text>
            </View>
          </View>
        </Screen>
      </View>
    </>
  )
}

export const registerStyle = StyleSheet.create({
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
  title: {
    color: color.black,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
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
    borderRadius: 10,
    paddingHorizontal: 10
  },
  inputSection_hokhau: {
    width:'35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 40,
    maxHeight: 40,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  input_hokhau: {
    fontSize: 14,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#fff',
    color: '#424242',
  },
  input_title: {
    color: "#000000",
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "400",
    marginLeft: 10
  },
  input_title_2: {
    color: "#000000",
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "400",
    
  },

  button: {
    backgroundColor: "transparent",
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 20,
    minHeight: 38,
    maxHeight: 38,
    minWidth: 150,
    borderColor: "white",
    paddingHorizontal: 40
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
  selectedInputIOS: {
    fontSize: 14,
    paddingVertical: 11,
    paddingHorizontal: 10,
    color: '#757577',
    minWidth: "100%",
    // marginHorizontal: -26,
    borderRadius: 4,
  },
  selectedInputAndroid: {
    fontSize: 13,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 6,
    borderWidth: 0,
    borderRadius: 4,
    color: 'black',
    // paddingRight: 30, // to ensure the text is never behind the icon
    minWidth: "100%",
  },

  /*END*/
})