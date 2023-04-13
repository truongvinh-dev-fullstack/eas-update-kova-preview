import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import {
    View,
    ViewStyle,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet, Alert, ActivityIndicator, Dimensions, TextStyle
} from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import {
    AntDesign
} from "@expo/vector-icons";
import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import { Screen } from "../../components/screen/screen";
import { HeaderAuth } from "../../components/header-auth/header-auth";
import { spacing, typography } from "../../theme";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

class Category {
    Index: number;
    Title: string;
    IsActive: boolean;
}

class HistoryPaint {
    Id: string;
    WorkerId: string;
    CustomerId: string;
    ImageUrl: string;
    CustomerName: string;
    IsPainted: boolean;
    IsChoosed: boolean;
    IsFavourite: boolean;
    GroupHouseName: string;
}

const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = {
    flex: 1,
    backgroundColor: "white"
}

const CONTAINER: ViewStyle = {
    paddingHorizontal: spacing[0],
    backgroundColor: "black"
}
const TEXT: TextStyle = {
    color: 'white',
    fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER_TITLE: TextStyle = {
    ...TEXT,
    ...BOLD,
    fontSize: 14,
    lineHeight: 14,
    textAlign: "left",
    letterSpacing: 1.5,
    color: "white"
}

const images = {
    overlay: require("../../images/icons/origan_opacity.png"),
    vector: require("../../images/icons/Vector.png"),
}

export const ListHousePaintedScreen = observer(function ListHousePaintedScreen(props: any) {
    const navigation = useNavigation();
    /*BIẾN ĐIỀU KIỆN*/
    const [isLoading, setLoading] = useState(false);
    const isFocused = useIsFocused();
    const [isRefresh, setRefresh] = useState(false);

    /*MASTER DATA*/
    const [, setUserId] = useState<string>(null);
    const [listCategory, setListCategory] = useState<Array<Category>>([
        { Index: 0, Title: "Tất cả", IsActive: true },
        { Index: 1, Title: "Chưa sơn", IsActive: false },
        { Index: 2, Title: "Đã sơn", IsActive: false },
        { Index: 3, Title: "Phương án ưa thích", IsActive: false },
    ]);
    const [listAllItems, setListAllItems] = useState<Array<HistoryPaint>>([]);
    const [listItems, setListItems] = useState<Array<HistoryPaint>>([]);

    function goToScreen(page: string) {
        navigation && navigation.navigate(page);
    }

    /*START : HÀM GET MASTER DATA*/
    useEffect(() => {
        fetchData().catch(err => {
            setLoading(false);
            goBack();
        });
    }, [isFocused == true, isRefresh]);

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
            const response = await _unitOfWork.user.getHistoryPainted({
                "WorkerId": userId
            });
            setLoading(false);

            if (response.StatusCode != 200) {
                Alert.alert("Thông báo", response.Message);
            } else if (response.StatusCode == 401) {
                goToScreen("LoginScreen");
            } else {
                let _listCategory = [...listCategory];
                _listCategory.forEach((value, i) => {
                    value.IsActive = false;
                    if (value.Index == 0) value.IsActive = true;
                });

                setListCategory(_listCategory);
                let list: Array<HistoryPaint> = response.ListHistoryPainted;
                list.forEach(item => {
                    item.ImageUrl = _unitOfWork.user.fixAvatar(item.ImageUrl);
                })
                list.map((item) => {
                    item.IsChoosed = false;
                    return item;
                });
                setListAllItems(list);
                setListItems(list);
            }
        }
    }

    const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
        Alert.alert("Thông báo", err,
            [{
                text: "OK", onPress: () => {
                    navigation && navigation.goBack()
                },
            }], { cancelable: false });
    }

    const changeCategory = function (item: Category, index: number) {
        let _listCategory = [...listCategory]
        _listCategory.forEach((value, i) => {
            if (i != index) {
                value.IsActive = false;
            } else {
                value.IsActive = true;
            }
        });

        setListCategory(_listCategory);
        switch (item.Index) {
            case 0:
                setListItems(listAllItems);
                break;
            case 1:
                let list1 = listAllItems.filter(c => c.IsPainted == false);
                setListItems(list1);
                break;
            case 2:
                let list2 = listAllItems.filter(c => c.IsPainted == true);
                setListItems(list2);
                break;
            case 3:
                let list3 = listAllItems.filter(c => c.CustomerId == null);
                setListItems(list3);
                break;
        }
    }

    const chooseHistoryPaint = async function (item: HistoryPaint) {
        navigation && navigation.navigate("HistoryPaintedInforScreen", {
            HistoryPaintedId: item?.Id
        });
    }
    
    const onRefresh = () => {
        setRefresh(true)
    }
    
    const topComponent = () => {
        return (
            <View>
                {
                    listCategory && listCategory.length ?
                        <View style={{ backgroundColor: "black", paddingBottom: 20 }}>
                            <FlatList
                                stickyHeaderIndices={[0]}
                                keyExtractor={(item, index) => `history_${index}`}
                                renderItem={ItemViewCategory}
                                data={listCategory}
                                horizontal={true}
                                style={{ backgroundColor: "black" }}
                            />
                        </View> : null
                }
            </View>
        )
    }
    const footerComponent = () => {
        return (
            <View style={{ marginBottom: 80 }} />
        )
    }
    const ItemViewCategory = ({ item, index }) => {
        return (
            <View style={[{ borderTopColor: "#61615E", borderBottomColor: "#61615E", borderWidth: 1 }, item.IsActive ? { borderBottomColor: '#F14950' } : {}]}>
                <TouchableOpacity onPress={() => changeCategory(item, index)}>
                    <View style={{ marginHorizontal: 20, }}>
                        <Text style={[{ color: "white", marginVertical: 10 },
                        item.IsActive ? { color: '#F14950', fontWeight: '500' } : {}
                        ]}>{item.Title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    const ItemView = ({ item, index }) => {
        return (
            <View style={[listHouseStyle.item, { justifyContent: "center" }]}>
                <TouchableOpacity style={{ borderRadius: 10 }} onPress={() => chooseHistoryPaint(item)}>
                    <Image style={[listHouseStyle.item_image]} source={{ uri: item?.ImageUrl }} />
                    <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name="home" size={11} color='#9098B1' />
                            <Text style={[{ color: "#9098B1", fontSize: 11, fontWeight: "400", paddingLeft: 2 }]}>{item.GroupHouseName}</Text>
                        </View>{
                            item.IsPainted == true ?
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ backgroundColor: "#66E077", height: 10, width: 10, borderRadius: 5 }} />
                                    <Text style={[{ color: "#66E077", fontSize: 11, fontWeight: "400", paddingLeft: 2 }]}>đã sơn</Text>
                                </View> :
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ backgroundColor: "#FDCD33", height: 10, width: 10, borderRadius: 5 }} />
                                    <Text style={[{ color: "#FDCD33", fontSize: 11, fontWeight: "400", paddingLeft: 2 }]}>chưa sơn</Text>
                                </View>
                        }
                    </View>
                    <Text style={[{ color: "#FFFFFF", fontSize: 16, fontWeight: "400", paddingTop: 5 }]}>{item.CustomerName}</Text>
                </TouchableOpacity>{
                    item.IsChoosed ?
                        <>
                            < Image style={{ position: "absolute", width: "100%", left: 8 }} source={images.overlay} />
                            <Image style={{ position: "absolute", left: Dimensions.get('window').width * 0.2 }} source={images.vector} />
                        </> : <></>
                }
            </View>
        )
    }
    return (
        <>
            {isLoading &&
                <View style={listHouseStyle.loading}>
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
                        headerText={"Căn hộ đã phối màu"}
                        rightStyle={TEXT}
                        rightTx={""}
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
                        columnWrapperStyle={listHouseStyle.flatListColumnWrapperStyle}
                        horizontal={false}
                        numColumns={2}
                        style={{ backgroundColor: "black" }}
                    />
                </Screen>
            </View>
        </>
    )
})

// CSS
const listHouseStyle = StyleSheet.create({
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
        backgroundColor: "white",
        paddingTop: 16,
        marginTop: - 16,
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

        marginVertical: 8,
        // marginHorizontal: 8,
        paddingHorizontal: 8,
        width: "50%", // is 50% of container width
    },
    backgroupImage: {
        width: "100%",
        height: 170,
        borderRadius: 8,
        backgroundColor: "white",
        marginBottom: 8,
    },
    item_image: {
        width: "100%",
        height: 170,
        borderRadius: 8,
        backgroundColor: "gray",
        marginBottom: 8,
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