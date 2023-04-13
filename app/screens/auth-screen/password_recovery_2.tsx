import React, { useState } from "react"
import { View, ViewStyle, TextStyle, Text, Image, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Feather } from "@expo/vector-icons"
import { registerStyle } from "./register"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { detailStyle } from "../worker/worker-screen"
import { LinearGradient } from 'expo-linear-gradient'
import { StorageKey } from "../../services/storage"

const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  paddingHorizontal: spacing[4],
  minWidth: 380,
  maxWidth: 450,
  alignSelf: "center",
  alignContent: "center",
}
const TEXT: TextStyle = {
  color: '#A23232',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
// const HEADER: TextStyle = {
//   paddingTop: spacing[3],
//   paddingBottom: spacing[4] + spacing[1],
//   paddingHorizontal: 0,
//   paddingLeft: spacing[6],
//   paddingRight: spacing[6],
// }
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  lineHeight: 30,
  textAlign: "left",
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
export const PasswordRecovery2Screen = observer(function PasswordRecovery2Screen(props: any) {
  const navigation = useNavigation();
  const [hidepass1, setShowpass1] = useState(true);
  const [hidepass2, setShowpass2] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setSubmit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>();
  const images = {
    eye_icon: require('../../images/eye.png'),
    lock_icon: require('../../images/lock.png'),
  }

  const submit = async () => {
    setSubmit(true)
    if (checkInfo()) {
      setLoading(true);
      let phone: any = await _unitOfWork.storage.getItem(StorageKey.PHONE);
      let res = await _unitOfWork.user.getOtpCode({ Phone: phone })
      setLoading(false);
      console.log(res);
      if (res.StatusCode == 408) {
        setModalVisible(true);
      }
      else if (res.StatusCode != 200) {
        Alert.alert("Thông báo", res.Message);
      } else {
        setModalVisible(!modalVisible);
      }
    }
  }

  const getOtp = async () => {
    setLoading(true);
    let phone: any = await _unitOfWork.storage.getItem(StorageKey.PHONE);
    let res = await _unitOfWork.user.getOtpCode({ Phone: phone })
    setLoading(false);
    console.log(res)
    if (res.StatusCode != 200) {
      Alert.alert("Thông báo", res.Message);
    } else if (res.StatusCode == 408) {
      setModalVisible(true);
    }
  }

  const confirmOtp = async () => {
    setLoading(true);
    let phone: any = await _unitOfWork.storage.getItem(StorageKey.PHONE);
    let res = await _unitOfWork.user.confirmOtp({ Phone: phone, Otp: otp, NewPassword: password })
    setLoading(false);
    if (res.StatusCode != 200) {
      Alert.alert("Thông báo", "Mã OTP không đúng! Vui lòng kiểm tra lại!");
    } else {
      setModalVisible(false);
      navigation && navigation.navigate("LoginScreen");
    }
  }

  const checkInfo = function () {
    if (!password) {
      Alert.alert("Thông báo", "Mật khẩu mới không được để trống!");
      return false;
    }
    if (!confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không được để trống!");
      return false;
    }
    if (confirmPassword != password) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không khớp với mật khẩu mới!");
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
          <HeaderAuth
            //style={HEADER} 
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            headerText={"Lấy lại mật khẩu"}
            rightStyle={TEXT}
            onLeftPress={navigation.goBack}
          // rightTx={"Trợ giúp"}
          />
          <View style={[CONTAINER_PADDING]}>

            <Text style={[registerStyle.input_title, { marginTop: 100 }]}>Mật khẩu mới</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && !password) ? { borderColor: color.dangerX } : {},]}>
              <Feather name="lock" size={22} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput
                style={[registerStyle.input]}
                placeholder="Mật khẩu *"
                onChangeText={(str) => {
                  setPassword(str)
                }}
                secureTextEntry={hidepass1}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity onPress={() => { setShowpass1(!hidepass1) }}>
                <Image source={images.eye_icon} style={styles.inputEndIcon} />
              </TouchableOpacity>
            </View>

            <Text style={registerStyle.input_title}>Nhập lại mật khẩu mới</Text>
            <View style={[registerStyle.inputSection, AuthStyles.input, (isSubmit && !confirmPassword) ? { borderColor: color.dangerX } : {},]}>
              <Feather name="lock" size={22} color='#9098B1' style={styles.inputStartIcon} />
              <TextInput
                style={registerStyle.input}
                placeholder="Nhập lại mật khẩu *"
                onChangeText={(str) => {
                  setConfirmPassword(str)
                }}
                secureTextEntry={hidepass2}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity onPress={() => { setShowpass2(!hidepass2) }}>
                <Image source={images.eye_icon} style={styles.inputEndIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, AuthStyles.button, styles.mt1, { justifyContent: "center" }]} onPress={() => submit()}>
              <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
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
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Xác nhận mã OTP</Text>
                  <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                    <Feather name="x" size={18} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={[{
                  flex: 1,
                  alignSelf: "center",
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: "#C4C4C4",
                  minHeight: 60,
                  maxHeight: 60,
                  borderRadius: 10
                }]}>
                  <TextInput
                    keyboardType={"numeric"}
                    style={{
                      flex: 1,
                      fontSize: 20,
                      paddingRight: 10,
                      paddingLeft: 0,
                      marginVertical: 0,
                      backgroundColor: '#fff',
                      color: 'gray',
                      height: 35,
                      textAlign: "center"
                    }}
                    onChangeText={(str) => {
                      setOtp(str)
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
                <TouchableOpacity onPress={() => getOtp()} style={{ paddingHorizontal: 16, paddingTop: 10, alignSelf: "center" }} >
                  <Text style={{ color: "#DB2323", fontSize: 14, lineHeight: 17, textDecorationLine: "underline" }}>
                    Bạn không nhận được mã OTP?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={detailStyle.changePasswordButtonModal} onPress={() => confirmOtp()}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={detailStyle.linearGradient}>
                    <Text style={MODAL_BUTTON_TEXT}>Xác nhận</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View >

    </>

  )
})
