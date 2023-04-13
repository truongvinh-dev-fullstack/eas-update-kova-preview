import React, { useRef, useEffect, useState } from "react"
import { View, ActivityIndicator, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, Image, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEnvelopeSquare, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Button, Divider } from '@ui-kitten/components';
import RNPickerSelect from 'react-native-picker-select';
import { StorageKey } from '../../services/storage';
import { useIsFocused } from '@react-navigation/native';
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: '#A23232',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
  paddingLeft: spacing[6],
  paddingRight: spacing[6],
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  lineHeight: 30,
  textAlign: "left",
  letterSpacing: 1.5,
  color: "rgba(0, 0, 0, 1)"
}

export const ChangeInfoScreen = observer(function ChangeInfoScreen(props: any) {
  const navigation = useNavigation();
  const [userinfo, setUserInfo] = useState({
    UserId: null,
    AvartarUrl: "https://i.pinimg.com/originals/53/93/b7/5393b7a307aa4b904db9d6c573e7866a.jpg",
    FullName: null,
    Phone: null,
    Height: null,
    Weight: null,
    BirthOfYear: null,
    Gender: false,
  });
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    getUser();
  }, [isFocused]);
  const getUser = async function () {
    setLoading(true);
    let res = await _unitOfWork.user.getUser({ userId: "751f3d3b-dc27-498f-af4f-b37163fe7c28" });
    setLoading(false);

    if (res.data.StatusCode != 200) {
      Alert.alert("Thông báo", res.data.Message);
      return false;
    }
    setUserInfo(res.data.User)
  }

  const goToPasswordRecovery = (): void => {
    navigation && navigation.navigate("PasswordRecoveryScreen")
  }

  const updateUser = async () => {
    userinfo.UserId = props.route.params.user.Id;
    setLoading(true);
    let res = await _unitOfWork.user.updateInformationUser(userinfo);
    _unitOfWork.storage.setItem(StorageKey.USER_INFO, userinfo);
    setLoading(false);

    if (res.data.StatusCode != 200) {
      Alert.alert("Thông báo", res.data.Message);
      return false;
    }

    Alert.alert("Thông báo", res.data.Message);
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
            headerText={"Tài khoản"}
            rightStyle={TEXT}
            onLeftPress={navigation.goBack}
          />
          <View style={CONTAINER_PADDING}>

            <View style={AuthStyles.avatar_banner}>
              <Image source={{ uri: userinfo.AvartarUrl }} style={AuthStyles.avatar_img} />
            </View>
            <View style={AuthStyles.table_view}>
              <View style={AuthStyles.row_view}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Họ tên</Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <TextInput
                    style={styles.input2}
                    placeholder="Cập nhật"
                    value={userinfo.FullName}
                    onChangeText={(value) => {
                      let uif = { ...userinfo };
                      uif.FullName = value;
                      setUserInfo(uif);
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View style={AuthStyles.row_view}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Email</Text>
                </View>
                <View style={AuthStyles.col_view}>
                  <Text style={AuthStyles.black_label}>abc@gmail.com</Text>
                </View>
              </View>
              <View style={AuthStyles.row_view}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Số điện thoại</Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <TextInput
                    style={styles.input2}
                    placeholder="Cập nhật"
                    value={userinfo.Phone}
                    onChangeText={(value) => {
                      let uif = { ...userinfo };
                      uif.Phone = value;
                      setUserInfo(uif);
                    }}
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>
              <View style={[AuthStyles.row_view, styles.mt1]}>
                <TouchableOpacity onPress={() => goToPasswordRecovery()}>
                  <Text style={AuthStyles.link_txt}>Đổi mật khẩu</Text>
                </TouchableOpacity>
              </View>

              <View style={[AuthStyles.row_view, styles.mt2]}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Giới tính</Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <RNPickerSelect
                    value={userinfo.Gender}
                    style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                    onValueChange={(value) => {
                      let uif = { ...userinfo };
                      uif.Gender = value;
                      setUserInfo(uif);
                    }}
                    items={[
                      { label: 'Nữ', value: false },
                      { label: 'Nam', value: true },
                    ]}
                  />
                </View>
              </View>
              <View style={[AuthStyles.row_view, styles.mt1]}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Chiều cao </Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <RNPickerSelect
                    value={userinfo.Height}
                    style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                    onValueChange={(value) => {
                      let uif = { ...userinfo };
                      uif.Height = value;
                      setUserInfo(uif);
                    }}
                    items={[
                      { label: '100', value: 100 },
                      { label: '160', value: 160 },
                      { label: '161', value: 161 },
                      { label: '162', value: 162 },
                    ]}
                  />
                </View>
              </View>

              <View style={[AuthStyles.row_view, styles.mt1]}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Cân nặng </Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <RNPickerSelect
                    value={userinfo.Weight}
                    style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                    onValueChange={(value) => {
                      let uif = { ...userinfo };
                      uif.Weight = value;
                      setUserInfo(uif);
                    }}
                    items={[
                      { label: '50', value: 50 },
                      { label: '58', value: 58 },
                      { label: '60', value: 60 },
                      { label: '70', value: 70 },
                    ]}
                  />
                </View>
              </View>

              <View style={[AuthStyles.row_view, styles.mt1]}>
                <View style={[AuthStyles.col_view, AuthStyles.col_left]}>
                  <Text style={AuthStyles.gray_label}>Năm sinh</Text>
                </View>
                <View style={[styles.inputSectionSm, AuthStyles.input]}>
                  <RNPickerSelect
                    value={userinfo.BirthOfYear}
                    style={{ inputIOS: styles.inputIOS, inputAndroid: styles.inputAndroid }}
                    onValueChange={(value) => {
                      let uif = { ...userinfo };
                      uif.BirthOfYear = value;
                      setUserInfo(uif);
                    }}
                    items={[
                      { label: '1991', value: 1991 },
                      { label: '1997', value: 1997 },
                      { label: '1998', value: 1998 },
                      { label: '1999', value: 1999 },
                    ]}
                  />
                </View>
              </View>
            </View>
            <View style={AuthStyles.title}>
              <Text>Cập nhật thông tin để trải nghiệm tốt hơn</Text>
            </View>
            <Button style={[styles.button, AuthStyles.button, styles.mt3]} appearance='filled' onPress={updateUser}>
              Lưu thông tin
          </Button>
          </View>
        </Screen>
      </View>
    </>
  )
})
