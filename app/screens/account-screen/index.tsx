import React, { useEffect, useState } from "react"
import { View, ImageBackground, ViewStyle, TextStyle, Text, TouchableOpacity, ActivityIndicator, Image, TextInput, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEnvelopeSquare, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Button, Divider } from '@ui-kitten/components';
import { IndexPath, Menu, MenuItem } from '@ui-kitten/components';
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { StorageKey, Storage } from "../../services/storage";
import { useIsFocused } from '@react-navigation/native';
import { ApisauceInstance, ApiResponse } from "apisauce";
const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  paddingHorizontal: spacing[4],
  paddingTop: 20
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

export const AccountScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [hidepass, setShowpass] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [isLoading, setLoading] = useState(false);
  const goToLogin = () => {
    navigation && navigation.navigate("LoginScreen");
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const fetchUserInfo = async () => {
    let res = await _unitOfWork.storage.getItem(StorageKey.USER_INFO);
    setUserInfo(res);
  }
  const menuSelect = async indexPath => {
    setSelectedIndex(indexPath);
    if (indexPath.row === 0) {
      navigation && navigation.navigate("CartOnlineScreen", { user: userInfo });
    }
    if (indexPath.row === 1) {
      navigation && navigation.navigate("AvatarListScreen", { user: userInfo });
    }
    if (indexPath.row === 2) {
      await _unitOfWork.storage.logout();
      navigation && navigation.navigate("LoginScreen");
    }
  }
  useEffect(() => {
    fetchUserInfo();
  }, [isFocused]);
  return (
    <>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#A23232" />
        </View>
      }
      <View style={FULL}>
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>
          <View style={CONTAINER_PADDING}>
            {
              userInfo && userInfo.Id ? <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: 80, height: 80, borderColor: '#ccc', borderRadius: 40, borderWidth: 1 }}>
                  </View>
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: '700', lineHeight: 40, marginTop: 20, marginLeft: 25 }}>
                      {userInfo.FullName}
                    </Text>
                    <TouchableOpacity onPress={() => navigation && navigation.navigate('ChangeInfoScreen', { user: userInfo })}>
                      <Text style={{ fontSize: 15, lineHeight: 20, marginLeft: 25, color: 'blue', fontStyle: 'italic' }}>
                        Cập nhật thông tin
                    </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Menu
                  style={{ marginTop: 15 }}
                  selectedIndex={selectedIndex}
                  onSelect={menuSelect}>
                  <MenuItem title='Tủ đồ online' />
                  <MenuItem title='Avatar list' />
                  <MenuItem title='Đăng xuất' />
                </Menu>
              </View> : <View>
                <View style={{ paddingVertical: 15 }}>
                  <TouchableOpacity onPress={goToLogin}>
                    <Text>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
                <Menu
                  selectedIndex={selectedIndex}
                  onSelect={index => setSelectedIndex(index)}>
                  <MenuItem disabled={true} title={() => <Text style={{ color: '#ccc' }}>Tủ đồ online</Text>} />
                  <MenuItem disabled={true} title={() => <Text style={{ color: '#ccc' }}>Avatar list</Text>} />
                  <MenuItem disabled={true} title={() => <Text style={{ color: '#ccc' }}>Đăng nhập</Text>} />
                </Menu>
              </View>
            }

          </View>
        </Screen>
      </View>
    </>
  )
}
