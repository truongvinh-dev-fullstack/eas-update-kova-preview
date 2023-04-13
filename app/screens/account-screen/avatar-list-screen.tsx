import React, { useState, useEffect } from "react"
import { View, ImageBackground, ViewStyle, TextStyle, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEnvelopeSquare, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { UnitOfWorkService } from '../../services/api/unitOfWork-service';
import { Button, Divider } from '@ui-kitten/components';
import RNPickerSelect from 'react-native-picker-select';
const _unitOfWork = new UnitOfWorkService();
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
    backgroundColor: color.background,
    paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
    paddingHorizontal: spacing[4],
    marginTop: spacing[2],
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
    fontSize: 14,
    lineHeight: 14,
    textAlign: "left",
    letterSpacing: 1.5,
    color: "rgba(0, 0, 0, 1)"
}
const { width } = Dimensions.get('window');
export const AvatarListScreen = (props) => {
    const navigation = useNavigation();
    const [avatarLists, setAvatarLists] = useState([]);
    // const categories = new Array(10).fill({
    //   icon: { uri: "https://salt.tikicdn.com/ts/product%2Ffe%2Fd5%2F15%2F7282697fb242d4d4aac0c1579ebf0c8a.jpg" },
    //   name: "Áo khoác nam",
    //   cat_name: "CANIFA",
    //   href: null
    // });
    useEffect(() => {
        fetchCategories();
    }, [])
    const fetchCategories = async () => {
        let res = await _unitOfWork.user.getUserAvatarList({ UserId: props.route.params.user.Id });
        console.log(res);
        if (res && res.data.StatusCode === 200) {
            setAvatarLists(res.data.UserAvatarList)
        }
    }
    const getCloumn = function () {
        if (Dimensions.get('window').width > 550) {
            return 3;
        }
        return 2;
    }

    const _renderItem = ({ item }) => (
        <TouchableOpacity style={{ width: (width - 40) / 2 }} onPress={() => { }}>
            <ImageBackground source={{ uri: item.Image }} style={{ ...AuthStyles.cart_on_img, height: 270 }}>
            </ImageBackground>
            <View style={{ width: (width - 40) / 2, backgroundColor: '#aaa', height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: '700' }}>Mặc định</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={FULL}>
            <Screen style={CONTAINER} backgroundColor={color.background}>
                <HeaderAuth
                    //style={HEADER} 
            
                    titleStyle={HEADER_TITLE}
                    iconStyle={TEXT}
                    leftIcon={faChevronLeft}
                    headerText={"Avatar list"}
                    rightStyle={TEXT}
                    onLeftPress={() => navigation && navigation.goBack()}
                />
                <View style={[CONTAINER_PADDING, styles.row, { flex: 1 }]}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <FlatList
                            data={avatarLists}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingVertical: 20 }}
                        />
                    </SafeAreaView>
                </View>
            </Screen>
        </View>
    )
}