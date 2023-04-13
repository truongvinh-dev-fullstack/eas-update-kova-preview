import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import {
    View,
    ViewStyle,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet, Alert, ActivityIndicator, TextInput, TextStyle
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
    AntDesign,
    Feather
} from "@expo/vector-icons";
import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import * as reactNativeShape from 'react-native-shape';
import { HeaderAuth, Screen } from "../../components";
import { spacing, typography } from "../../theme";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

class ColorGroup {
    CategoryId: string;
    CategoryName: string;
    ListColor: Array<Color>;
    IsActive: boolean;
}

class Color {
    Id: string;
    ColorCode: string;
    ColorName: string;
    ColorHex: string;
    Rgb: string;
    GroupColorId: string;
    IsFavorite: boolean;
    IsQuickly: boolean;
}

const _unitOfWork = new UnitOfWorkService();
const FULL: ViewStyle = {
    flex: 1,
}

const CONTAINER: ViewStyle = {
    paddingHorizontal: spacing[0],
    backgroundColor: "black"
}
// const CONTAINER_PADDING: ViewStyle = {
//     paddingHorizontal: spacing[4],
//     marginTop: spacing[2],
// }
const TEXT: TextStyle = {
    color: 'white',
    fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
// const HEADER: TextStyle = {
//     paddingTop: spacing[3],
//     paddingBottom: spacing[4] + spacing[1],
//     paddingHorizontal: 0,
//     paddingLeft: spacing[6],
//     paddingRight: spacing[6],
// }
const HEADER_TITLE: TextStyle = {
    ...TEXT,
    ...BOLD,
    fontSize: 14,
    lineHeight: 14,
    textAlign: "left",
    letterSpacing: 1.5,
    color: "white"
}

export const ListColorScreen = observer(function ListColorScreen(props: any) {
    const navigation = useNavigation();
    /*BIẾN ĐIỀU KIỆN*/
    const [isLoading, setLoading] = useState(false);
    const [isRefresh, setRefresh] = useState(false);
    // MASTER DATA
    const [userId, setUserId] = useState<string>(null);
    /*CATEGORY*/
    const [listCategory, setListCategory] = useState<Array<ColorGroup>>(null);
    const [categoryId, setCategoryId] = useState<string>(null);
    /*COLORS*/
    const [listAllItems, setListAllItems] = useState<Array<Color>>(null);
    const [listItems, setListItems] = useState<Array<Color>>(null);

    const [searchString, setSearchString] = useState<string>(null);

    function goToScreen(page: string) {
        navigation && navigation.navigate(page);
    }
    // const goToHouseColorInforScreen =  async () => {
    //     let userId = await _unitOfWork.storage.getItem(StorageKey.USERID)
    //     let colors = listItems.filter(c=>c.IsChoosed);
    //     if (userId) {
    //         navigation && navigation.navigate("HouseColorInforScreen", { userId: userId, listColors :colors })
    //     }         
    //   }
    /*START : HÀM GET MASTER DATA*/
    useEffect(() => {
        fetchData();
    }, [isRefresh]);

    const fetchData = async () => {
        setRefresh(false);
        if (!isRefresh) {
            let userId = await _unitOfWork.storage.getItem(StorageKey.USERID)
            if (userId) {
                setUserId(userId);
            } else {
                goToScreen("LoginScreen");
            }

            setLoading(true);
            const response = await _unitOfWork.user.getAllGroupColor({
                "WorkerId": userId
            });
            setLoading(false);
            if (response.StatusCode != 200) {
                Alert.alert("Thông báo", response.Message);
            } else {
                let ls: Array<ColorGroup> = response.ListGroupColor;
                ls.map((item, index) => {
                    if (index == 0) {
                        item.IsActive = true;
                    } else {
                        item.IsActive = false
                    }
                    return item
                });
                setListCategory(ls);

                // Add Color
                var list: Array<Color> = response.ListColor;
                // Lưu giá trị
                setListAllItems(list);
                // Lưu theo categoryId
                setListItems(list);
            }
        }
    }

    const saveQuicklyColor = async function () {
        let listColor = [...listAllItems];
        let listColorId = listColor.filter(c => c.IsQuickly == true).map(c => c.Id);
        setLoading(true);
        let response = await _unitOfWork.user.saveColorQuicklyColor(
            {
                "ListColorId": listColorId,
                "WorkerId": userId
            });
        setLoading(false);
        if (response.StatusCode != 200) {
            Alert.alert("Thông báo", response.Message);
        } else {
            Alert.alert("Thông báo", "Lưu dữ liệu thành công!");
        }
    }

    const changeCategory = function (item: ColorGroup, index: number) {
        let _listCategory = [...listCategory];
        _listCategory.forEach((value, i) => {
            if (i != index) {
                value.IsActive = false;
            } else {
                value.IsActive = true;
            }
        });
        setCategoryId(item.CategoryId);
        setListCategory(_listCategory);

        let searchStr = searchString ? searchString.trim() : '';
        if (item.CategoryId == null) {
            list = listAllItems.filter(c => (searchStr === '' || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
                || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
        } else {
            var list = listAllItems.filter(c => (c.GroupColorId === item.CategoryId) && (searchStr === ''
                || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
                || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
        }
        setListItems(list);
    }

    const selectedColor = function (item: Color) {
        let _listAllColor = [...listAllItems];
        let index = _listAllColor.indexOf(item);
        item.IsQuickly = !item.IsQuickly;
        _listAllColor[index] = item;
        setListAllItems(_listAllColor);
    }

    const searchColor = function (str: string) {
        let searchStr = str ? str.trim() : '';
        var list: Array<Color> = [];
        if (categoryId == null) {
            list = listAllItems.filter(c => (searchStr === '' || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
                || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
        } else {
            var list = listAllItems.filter(c => (c.GroupColorId === categoryId) && (searchStr === ''
                || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
                || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
        }
        setListItems(list);
    }
    const onRefresh = () => {
        setRefresh(true)
    }

    const goColorGroup = function () {
        navigation && navigation.navigate("ColorGroupScreen");
    }

    const topComponent = () => {
        return (
            <>
                <View style={{ backgroundColor: "black", flex: 1 }}>
                    <View style={{
                        borderTopWidth: 1,
                        borderTopColor: "#61615E",
                        flexDirection: "row",
                        paddingVertical: 14
                    }}>
                        <View style={{ width: "80%" }}>
                            <TextInput style=
                                {{
                                    paddingHorizontal: 10,
                                    color: "white",
                                    fontSize: 14,
                                    lineHeight: 18
                                }}
                                placeholder="Tìm kiếm theo mã màu hoặc tên màu sơn"
                                placeholderTextColor="#686764"
                                autoCapitalize='none'
                                onChangeText={(searchString) => {
                                    setSearchString(searchString);
                                    searchColor(searchString);
                                }} underlineColorAndroid="transparent" />
                        </View>

                        <View style={{ flexDirection: "row", width: "20%", justifyContent: "space-between", paddingHorizontal: 10 }}>
                            <AntDesign name="search1" size={22} color="white" />
                            <TouchableOpacity onPress={() => { goColorGroup() }}>
                                <Feather name="sliders" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>{
                    listCategory && listCategory.length ?
                        <FlatList
                            stickyHeaderIndices={[1]}
                            renderItem={ItemViewCategory}
                            data={listCategory}
                            horizontal={true}
                            style={{ backgroundColor: "black" }}
                        /> : null
                }

            </>
        )
    }
    const footerComponent = () => {
        return (
            <View style={{ marginBottom: 80 }} />
        )
    }
    const ItemViewCategory = ({ item, index }) => {
        return (
            <View style={[{ borderTopColor: "#61615E", borderBottomColor: "#61615E", borderTopWidth: 1, borderBottomWidth: 1 },
            item.IsActive ? { borderBottomColor: '#F14950' } : {}]}>
                <TouchableOpacity onPress={() => changeCategory(item, index)}>
                    <View style={{ marginHorizontal: 20, }}>
                        <Text style={[{ color: "white", marginVertical: 10 },
                        item.IsActive ? { color: '#F14950', fontWeight: '500' } : {}
                        ]}>{item.CategoryName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    const ItemView = ({ item, index }) => {
        return (
            <>
                <View style={[listColorStyle.item]}>
                    <TouchableOpacity style={{ borderRadius: 10 }} onPress={() => selectedColor(item)}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                                <reactNativeShape.Octagon color={item?.ColorHex ?? item?.Rgb} scale={1} rotate={0} />
                                <View style={{ paddingLeft: 30, flexDirection: "column" }}>
                                    <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>{item.ColorCode}</Text>
                                    <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}> {item.ColorName}</Text>
                                </View>
                            </View>
                            {
                                item.IsQuickly == true ?
                                    <AntDesign name="checkcircleo" size={24} color="white" style={{ opacity: .8, marginRight: 15 }} /> :
                                    <AntDesign name="pluscircleo" size={24} color="white" style={{ opacity: .4, marginRight: 15 }} />
                            }
                        </View>{
                        }
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: 1, backgroundColor: "#61615E" }} />
            </>
        )
    }
    return (
        <>
            {isLoading &&
                <View style={listColorStyle.loading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }
            <View style={FULL}>
                <Screen style={CONTAINER}>
                    <HeaderAuth
                        //style={HEADER} 
                        titleStyle={HEADER_TITLE}
                        iconStyle={TEXT}
                        leftIcon={faChevronLeft}
                        headerText={"Thêm màu"}
                        rightStyle={TEXT}
                        rightTx={"Lưu lại"}
                        onRightPress={() => saveQuicklyColor()}
                        onLeftPress={() => navigation && navigation.goBack()}
                    />
                    <FlatList
                        stickyHeaderIndices={[0]}
                        refreshing={isRefresh}
                        onRefresh={() => onRefresh()}
                        ListHeaderComponent={topComponent()}
                        ListFooterComponent={footerComponent()}
                        data={listItems}
                        keyExtractor={(item, index) => "home" + index + String(item)}
                        renderItem={ItemView}
                        columnWrapperStyle={listColorStyle.flatListColumnWrapperStyle}
                        horizontal={false}
                        numColumns={2}
                        style={{ backgroundColor: "black" }}
                    />
                </Screen>
            </View>
        </>
    )

    return (
        <>

        </>
    )
})

// CSS
const listColorStyle = StyleSheet.create({
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
    w_100: {
        width: "100%"
    },
    position_absolute: {
        position: "absolute"
    },

    ads_container: {
        backgroundColor: "black",
        paddingTop: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        width: "100%",
    },
    ads_title: {
        fontSize: 18,
        fontWeight: "800",
        lineHeight: 21.09,
        marginTop: 10,
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 21.09,
        paddingHorizontal: 16,
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
        marginVertical: 15,
        // marginHorizontal: 8,
        paddingHorizontal: 8,
        marginLeft: 10,
        width: "100%", // is 100% of container width
    },
    item_image: {
        width: "100%",
        height: 168,
        borderRadius: 8,
        backgroundColor: "gray",
        resizeMode: "cover",
    },
    item_title: {
        color: "black",
        fontSize: 15,
        lineHeight: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    item_point: {
        color: "#8B8B8B",
        fontSize: 11,
        lineHeight: 15,
        fontWeight: "400",
        marginLeft: 6
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
    scene: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        marginTop: -15
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        color: "#F14950"
    },
    /*MODAL CSS*/
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
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
    modal_title: {
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 18.75
    },
    input_title: {
        color: "#000000",
        marginBottom: 10,
        fontSize: 12,
        fontWeight: "400",
        marginLeft: 10
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
    /*END*/
});