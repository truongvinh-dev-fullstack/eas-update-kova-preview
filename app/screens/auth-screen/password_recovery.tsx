import React, { useState } from "react"
import { View, ViewStyle, TextStyle, ActivityIndicator, Alert, TextInput, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Button, } from '@ui-kitten/components';
import {
  FontAwesome5
} from "@expo/vector-icons"
import { StorageKey } from "../../services/storage"

import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
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
  color: "rgba(0, 0, 0, 1)"
}


export const PasswordRecoveryScreen = observer(function PasswordRecoveryScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  const submit = async () => {
    if (checkInfo()) {
      setLoading(true);
      let res = await _unitOfWork.user.forgotPasswordWorker({ Phone: phone })
      setLoading(false);
      if (res.StatusCode != 200) {
        Alert.alert("Thông báo", res.Message)
      } else {
        await _unitOfWork.storage.setItem(StorageKey.PHONE, phone);
        Alert.alert("Thông báo", "Đặt lại mật khẩu thành công! Vui lòng kiểm tra điện thoại của bạn!", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    }
  }

  const checkInfo = function () {
    if (phone == "") {
      Alert.alert("Thông báo", "Số điện thoại không được để trống!");
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
          <HeaderAuth
            //style={HEADER} 
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            headerText={"Lấy lại mật khẩu"}
            rightStyle={TEXT}
            onLeftPress={navigation.goBack}
          />
          <View style={CONTAINER_PADDING}>

            <View style={AuthStyles.banner}>
              <View style={AuthStyles.banner_img}></View>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 15, marginBottom: 10, marginLeft: 8 }}>
              Số điện thoại
            </Text>
            <View style={{ justifyContent: "center", marginBottom: 12 }}>
              <FontAwesome5 style={{ position: "absolute", left: 20, zIndex: 1 }} name="user" size={16}
                color="#8B8B8B" />
              <TextInput keyboardType={"numeric"}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  height: 50,
                  borderRadius: 12,
                  paddingHorizontal: 48,
                  fontSize: 16,
                  lineHeight: 20,
                  color: "#8B8B8B",
                  borderWidth: 1,
                  borderColor: "black"
                }}
                onChangeText={(searchString) => {
                  setPhone(searchString)
                }}
                underlineColorAndroid="transparent"
                onSubmitEditing={() => { }}
                autoCapitalize='none'
              />
            </View>

            <Button style={[styles.button, AuthStyles.button, styles.mt1]} appearance='filled' onPress={() => submit()}>
              Tiếp tục
            </Button>

          </View>
        </Screen>
      </View>
    </>
  )
})
