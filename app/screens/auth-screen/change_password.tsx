import React, { useState } from "react"
import { View, ImageBackground, ViewStyle, TextStyle, Text, TouchableOpacity, Animated, Image, TextInput, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Button, Divider } from '@ui-kitten/components';

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
  color: "rgba(0, 0, 0, 1)"
}

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const images = {
    banner: { uri: "https://i.pinimg.com/originals/53/93/b7/5393b7a307aa4b904db9d6c573e7866a.jpg" },
    login_banner: require('../../images/login_banner.png'),
    eye_icon: require('../../images/eye.png'),
    lock_icon: require('../../images/lock.png'),
    mail_icon: require('../../images/mail.png'),
    google: require('../../images/google.png'),
    facebook: require('../../images/facebook.png'),
    apple: require('../../images/apple.png'),
  }

  return (
    <Modal>
      <View style={FULL}>
        <Text>Hello Word</Text>
        {/* <Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            onLeftPress={() => {
              navigation.goBack()
            }}
            headerText={"Đổi mật khẩu"}
            rightStyle={TEXT}
          />
          <View style={CONTAINER_PADDING}>
            <View style={[styles.inputSection, AuthStyles.input, styles.mt2]}>
              <Image source={images.lock_icon} style={styles.inputStartIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu cũ"
                onChangeText={(searchString) => { }}
                underlineColorAndroid="transparent"
              />
              <Image source={images.eye_icon} style={styles.inputEndIcon} />
            </View>
            <Text style={AuthStyles.input_validate_txt}>(Mật khẩu có  độ cài từ 6 đến 32 ký tự)</Text>

            <View style={[styles.inputSection, AuthStyles.input]}>
              <Image source={images.lock_icon} style={styles.inputStartIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                onChangeText={(searchString) => { }}
                underlineColorAndroid="transparent"
              />
              <Image source={images.eye_icon} style={styles.inputEndIcon} />
            </View>
            <Text style={AuthStyles.input_validate_txt}>(Mật khẩu có  độ cài từ 6 đến 32 ký tự)</Text>

            <View style={[styles.inputSection, AuthStyles.input]}>
              <Image source={images.lock_icon} style={styles.inputStartIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                onChangeText={(searchString) => { }}
                underlineColorAndroid="transparent"
              />
              <Image source={images.eye_icon} style={styles.inputEndIcon} />
            </View>
            <Text style={AuthStyles.input_validate_txt}>(Mật khẩu có  độ cài từ 6 đến 32 ký tự)</Text>

            <Button style={[styles.button, AuthStyles.button, styles.mt1]} appearance='filled' onPress={() => { }}>
              Tiếp tục
          </Button>
          </View>
        </Screen> */}
      </View>
    </Modal>
  )
}

export default ChangePasswordScreen;
