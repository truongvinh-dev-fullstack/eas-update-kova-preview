import React, { useEffect, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Screen } from "../../components"
import { color, spacing } from "../../theme"
import { styles } from "../../styles/"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { StorageKey } from "../../services/storage"
import { useIsFocused } from "@react-navigation/native"
import { FontAwesome5 } from "@expo/vector-icons"
import { EvilIcons } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"

// const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const images = {
  bacbkground: require("../../images/rectangle-6.png"),
  mask: require("../../images/mask-group.png"),
  logo: require("../../images/logo-1.png"),
  login: require("../../images/icons/rectangle-46.png"),
}

const _unitOfWork = new UnitOfWorkService()

export const LoginScreen = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [hidepass, setShowpass] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const inputPassword = useRef(null);

  useEffect(() => {
    fetchUserInfo();
  }, [isFocused])

  const fetchUserInfo = async () => {
    // await _unitOfWork.storage.setItem(StorageKey.PHONE, "012345");
    // await _unitOfWork.storage.setItem(StorageKey.PASSWORD, "n8@123456");
    let phone = await _unitOfWork.storage.getItem(StorageKey.PHONE);
    let password = await _unitOfWork.storage.getItem(StorageKey.PASSWORD);
    if (phone && password) {
      setLoading(true)
      let response = await _unitOfWork.user.login({ "UserName": phone, "Password": password })
      setLoading(false)
      if (response.data.StatusCode != 200) {
        Alert.alert("Thông báo", "Số điện thoại hoặc mật khẩu không chính xác!")
      } else {
        await _unitOfWork.storage.setItem(StorageKey.PHONE, phone);
        await _unitOfWork.storage.setItem(StorageKey.PASSWORD, password);
        await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, response.data.IsNewNotification);
        await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, response.data.NumberNewNotification);
        await _unitOfWork.storage.setItem(StorageKey.USERID, response.data.UserId);
        await _unitOfWork.storage.setItem(StorageKey.JWT_TOKEN, response.data.Token);
        goToScreen("primaryStack")
      }
    }
  }

  // @ts-ignore
  const login = async function () {
    if (checkInfo()) {
      setLoading(true)
      let response = await _unitOfWork.user.login({ "UserName": phone, "Password": password })
      setLoading(false)
      if (response.data.StatusCode != 200) {
        Alert.alert("Thông báo", "Số điện thoại hoặc mật khẩu không chính xác!")
      } else {
        _unitOfWork.storage.setItem(StorageKey.PHONE, phone)
        _unitOfWork.storage.setItem(StorageKey.PASSWORD, password)
        await _unitOfWork.storage.setItem(StorageKey.USERID, response.data.UserId);
        await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, response.data.IsNewNotification);
        await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, response.data.NumberNewNotification);
        await _unitOfWork.storage.setItem(StorageKey.USER_INFO, response);
        await _unitOfWork.storage.setItem(StorageKey.JWT_TOKEN, response.data.Token);
        goToScreen("primaryStack")
      }
    }
  }

  const register = async () => {
    goToScreen("Register")
  }

  const checkInfo = function () {
    if (phone == "") {
      Alert.alert("Thông báo", "Số điện thoại không được để trống")
      return false
    }
    if (password == "") {
      Alert.alert("Thông báo", "Mật khẩu không được để trống")
      return false
    }
    return true
  }

  const goToScreen = (page: string) => {
    navigation && navigation.navigate(page)
  }

  const forgotPassword = async () => {
    goToScreen("PasswordRecoveryScreen")
  }

  return (
    <>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#A23232" />
        </View>
      }
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>
        <Image style={{ position: "absolute", bottom: 0, width: "100%" }} source={images.bacbkground} />
        <Image style={{ position: "absolute", bottom: 0, width: "100%" }} source={images.mask} />
        <View style={{ width: "100%", alignItems: "center" }}>{
          <Image source={images.logo} />
        }
        </View>
        <View style={{ width: "100%", marginTop: 100, marginBottom: 160, paddingHorizontal: 30 }}>
          <View>
            <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 15, marginBottom: 4, marginLeft: 8 }}>
              Số điện thoại
            </Text>
            <View style={{ justifyContent: "center", marginBottom: 12 }}>
              <FontAwesome5 style={{ position: "absolute", left: 20, zIndex: 1 }} name="user" size={13}
                color="#8B8B8B" />
              <TextInput keyboardType={"numeric"}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: 41,
                  borderRadius: 12,
                  paddingHorizontal: 48,
                  fontSize: 13,
                  lineHeight: 17,
                  color: "#8B8B8B",

                }}
                onChangeText={(searchString) => {
                  setPhone(searchString)
                }}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => inputPassword.current.focus()}
                autoCapitalize='none'

              />
            </View>
            <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 15, marginBottom: 4, marginLeft: 8 }}>
              Mật khẩu
            </Text>
            <View style={{ justifyContent: "center", marginBottom: 16 }}>
              <EvilIcons style={{ position: "absolute", left: 16, zIndex: 1 }} name="lock" size={23} color="#8B8B8B" />
              <TouchableOpacity style={{ position: "absolute", right: 16, zIndex: 1 }} onPress={() => {
                setShowpass(!hidepass)
              }}>
                {
                  hidepass ? <Ionicons name="eye-outline" size={19} color="#8B8B8B" /> :
                    <Ionicons name="eye-off-outline" size={19} color="#8B8B8B" />
                }
              </TouchableOpacity>
              <TextInput
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: 41,
                  borderRadius: 12,
                  paddingHorizontal: 48,
                  fontSize: 13,
                  lineHeight: 17,
                  color: "#8B8B8B",
                }}
                onChangeText={(searchString) => {
                  setPassword(searchString)
                }}
                secureTextEntry={hidepass}
                underlineColorAndroid="transparent"
                ref={inputPassword}
                onSubmitEditing={() => login().catch(err => {
                  setLoading(false);
                  Alert.alert("Thông báo", "Số điện thoại hoặc mật khẩu không chính xác!");
                })}
                autoCapitalize='none'
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Image style={{ position: "absolute", zIndex: 1 }} source={images.login} />
            <TouchableOpacity
              onPress={() => login().catch(err => {
                setLoading(false);
                Alert.alert("Thông báo", "Số điện thoại hoặc mật khẩu không chính xác!");
              })}
              style={{
                backgroundColor: "#000000",
                borderRadius: 20,
                paddingHorizontal: 54,
                paddingVertical: 12,
                zIndex: 2,
              }}>
              <Text style={{ color: "#FFE296", fontSize: 14, fontWeight: "bold", lineHeight: 17 }}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={() => forgotPassword()}>
              <Text style={{ color: "#FFE296", fontSize: 14, lineHeight: 17, textDecorationLine: "underline" }}>
                Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "100%", alignItems: "center", justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={register}>
            <Text style={{
              color: "#F4DDDD",
              fontSize: 13,
              lineHeight: 15.73,
            }}>Đăng ký tài khoản?</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    </>
  )
}

export const loginStyle = StyleSheet.create({})
