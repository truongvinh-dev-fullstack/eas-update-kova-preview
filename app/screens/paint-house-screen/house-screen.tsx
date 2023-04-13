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
import { TabActions, useNavigation } from "@react-navigation/native";
import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import { spacing, typography } from "../../theme";
import { Screen } from "../../components/screen/screen";
import { HeaderAuth } from "../../components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

class HouseCategory {
    CategoryId: string;
    CategoryName: string;
    ListHouse: Array<HouseModel>;
    IsActive: boolean;
}

class HouseModel {
    Id: string;
    HouseModelName: string;
    HouseModelGroupId: string;
    Url: string;
    ImageBase64: any;
    ImageUrl: string;
    CreateByName: string;
    Type: string;
    IsFavorite: boolean;
    IsChoosed: boolean;
}

const _unitOfWork = new UnitOfWorkService();
const FULL: ViewStyle = {
    flex: 1,
    backgroundColor: "#FFFFFF"
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

const images = {
    overlay: require("../../images/icons/origan_opacity.png"),
    vector: require("../../images/icons/Vector.png"),
}

export const HouseScreen = observer(function HouseScreen(props: any) {
    const jumpToAction = TabActions.jumpTo('PaintHouseScreen', {});
    const [isRefresh, setRefresh] = useState(false);
    const navigation = useNavigation();
    /*BIẾN ĐIỀU KIỆN*/
    const [isLoading, setLoading] = useState(false);

    /*MASTER DATA*/
    // const [, setUserId] = useState<string>(null);
    const [listCategory, setListCategory] = useState<Array<HouseCategory>>(null);
    const [listAllItems, setListAllItems] = useState<Array<HouseModel>>(null);
    const [listItems, setListItems] = useState<Array<HouseModel>>(null);

    // function goToScreen(page: string) {
    //     navigation && navigation.navigate(page);
    // }

    /*START : HÀM GET MASTER DATA*/
    useEffect(() => {
        fetchData().catch(err => {
            setLoading(false);
            goBack();
        });
    }, [isRefresh]);

    const fetchData = async () => {
        setRefresh(false);
        if (!isRefresh) {
            setLoading(true);
            const response = await _unitOfWork.user.getHouseModelCategory({});
            setLoading(false);
            if (response.StatusCode == 200) {
                let ls: Array<HouseCategory> = response.ListHouseCategory;
                ls.map((item, index) => {
                    if (index == 0) {
                        item.IsActive = true;
                    } else {
                        item.IsActive = false
                    }
                    return item
                });
                setListCategory(ls);

                let list: Array<HouseModel> = response.ListHouse;
                list.map((item) => {
                    item.IsChoosed = false;
                    item.ImageUrl = _unitOfWork.user.fixAvatar(item.ImageUrl);
                    return item;
                });
                setListAllItems(list);
                setListItems(list);
            } else {

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
    const onRefresh = () => {
        setRefresh(true)
    }

    const changeCategory = function (item: HouseCategory, index: number) {
        let _listCategory = [...listCategory]
        _listCategory.forEach((value, i) => {
            if (i != index) {
                value.IsActive = false;
            } else {
                value.IsActive = true;
            }
        });

        setListCategory(_listCategory);
        if (item.CategoryId) {
            let list = listAllItems.filter(c => c.HouseModelGroupId == item.CategoryId);
            setListItems(list);

        } else {
            setListItems(listAllItems);
        }
    }

    const chooseHouseModel = async function (item: HouseModel) {
        // let _listAllHouse = [...listAllItems];
        // let index = _listAllHouse.indexOf(item);

        // _listAllHouse.forEach((value, i) => {
        //     if (i != index) {
        //         value.IsChoosed = false;
        //     } else {
        //         value.IsChoosed = true;
        //     }
        // });
        // setListAllItems(_listAllHouse);

        // let category = listCategory.find(c => c.IsActive == true);
        // if (category.CategoryId) {
        //     let list = _listAllHouse.filter(c => c.HouseModelGroupId == item.HouseModelGroupId);
        //     setListItems(list);
        // } else {
        //     setListItems(_listAllHouse);
        // }
        await _unitOfWork.storage.setItem(StorageKey.ISFROMHOUSE, true);
        await _unitOfWork.storage.setItem(StorageKey.HOUSE_MODEL_ID, item.Id);
        navigation.dispatch(jumpToAction)
    }

    const topComponent = () => {
        return (
            <View>
                {
                    listCategory && listCategory.length ?
                        <View style={{ backgroundColor: "black", paddingBottom: 20 }}>
                            <FlatList
                                stickyHeaderIndices={[0]}
                                refreshing={isRefresh}
                                onRefresh={() => onRefresh()}
                                keyExtractor={(item, index) => `house_${index}`}
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
                        ]}>{item.CategoryName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    const ItemView = ({ item, index }) => {
        return (
            <View style={[houseStyle.item, { justifyContent: "center" }]}>
                <TouchableOpacity style={{ borderRadius: 10 }} onPress={() => chooseHouseModel(item)}>
                    <Image style={houseStyle.item_image} source={{ uri: item?.ImageUrl }} />
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
                <View style={houseStyle.loading}>
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
                        headerText={"Chọn căn hộ"}
                        rightStyle={TEXT}
                        rightTx={""}
                        onRightPress={() => { }}
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
                        columnWrapperStyle={houseStyle.flatListColumnWrapperStyle}
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
const houseStyle = StyleSheet.create({
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
        // backgroundColor: "red",
        // flex: 0.5,
        marginVertical: 8,
        // marginHorizontal: 8,
        paddingHorizontal: 8,
        width: "50%", // is 50% of container width
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