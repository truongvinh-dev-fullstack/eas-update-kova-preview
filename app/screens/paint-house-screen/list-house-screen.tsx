import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native"
import {
    MaterialIcons,
    SimpleLineIcons
} from "@expo/vector-icons";
import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import { homeStyles } from "../home-screen/home-screen";
import { TabView, TabBar } from 'react-native-tab-view';
import { color, spacing, typography } from "../../theme";
import { HeaderAuth, Screen } from "../../components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

class HouseModel {
    Id: string;
    HouseModelName: string;
    Url: string;
    ImageBase64: any;
    CreateByName: string;
    Type: string;
    IsFavorite: boolean;
    ImageUrl: string;
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
    CreateByName: string;
}

const _unitOfWork = new UnitOfWorkService();

const FULL: ViewStyle = {
    flex: 1,
    backgroundColor: "white"
}
const initialLayout = { width: Dimensions.get('window').width };

const CONTAINER: ViewStyle = {
    backgroundColor: "#E1420B",
    paddingHorizontal: spacing[0],
}
const TEXT: TextStyle = {
    color: "white",
    fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER_TITLE: TextStyle = {
    ...TEXT,
    ...BOLD,
    fontSize: 14,
    lineHeight: 30,
    textAlign: "left",
    letterSpacing: 1.5,
    color: "#FFFFFF"
}
const TEXT_RIGHT: TextStyle = {
    color: "#E55300",
    fontFamily: typography.primary,
    fontSize: 12
}

export const ListHouseScreen = observer(function ListHouseScreen(props: any) {
    const navigation = useNavigation();
    const { params } = props.route.params;
    const [isRefresh, setRefresh] = useState(false);
    //-----------------------------------------------------
    /*BIẾN ĐIỀU KIỆN*/
    const [isLoading, setLoading] = useState(false);

    /*MASTER DATA*/
    const [listHouseModelOfSelf, setlistHouseModelOfSelf] = useState<Array<HistoryPaint>>([]);
    const [listHouseModelCompany, setlistHouseModelCompany] = useState<Array<HouseModel>>([]);

    // function goToScreen(page: string) {
    //     navigation && navigation.navigate(page);
    // }

    const changeFavorite = function (mo: HouseModel) {
        /*call api*/
    }

    const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
        Alert.alert("Thông báo", err,
            [{
                text: "OK", onPress: () => {
                    navigation && navigation.goBack()
                },
            }], { cancelable: false });
    }

    function goToScreen(page: string) {
        navigation && navigation.navigate(page);
    }

    //-----------------------------------------------------
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
            let userId = await _unitOfWork.storage.getItem(StorageKey.USERID)
            setLoading(true);
            const response = await _unitOfWork.user.listHouseModel({
                "WorkerId": userId
            });
            setLoading(false);
            if (response.StatusCode == 200) {
                let list: Array<HouseModel> = response.ListHouseModel;
                let list2: Array<HistoryPaint> = response.ListHistoryHousePainted;

                list.forEach(item => {
                    item.ImageUrl = _unitOfWork.user.fixAvatar(item.ImageUrl);
                })

                list2.forEach(item => {
                    item.ImageUrl = _unitOfWork.user.fixAvatar(item.ImageUrl);
                });
                setlistHouseModelCompany(list);
                setlistHouseModelOfSelf(list2);
            } else if (response.StatusCode == 401) {
                goToScreen("LoginScreen");
            }
            else {

            }
        }

    }
    //----------------------------------------------------
    const [index, setIndex] = React.useState(params.Index);

    const [routes] = React.useState([
        { key: '1', title: 'Mẫu nhà điển hình' },
        { key: '2', title: 'Phương án ưa thích' },
    ]);

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "1":
                return FirstRoute()
            case "2":
                return SecondRoute()
            default:
                return FirstRoute()
        }
    };
    const onRefresh = () => {
        setRefresh(true);
    }

    const goToPaintedHouse = async (item: any, type: boolean) => {
        if (type) {
            await _unitOfWork.storage.setItem(StorageKey.HOUSE_MODEL_ID, item?.Id);
            await _unitOfWork.storage.setItem(StorageKey.ISFROMHOUSE, true);
            navigation && navigation.navigate("SecondNavigator", {
                params: { Type: 1 }
            });
        } else {
            await _unitOfWork.storage.setItem(StorageKey.HISTORY_ID, item?.Id);
            await _unitOfWork.storage.setItem(StorageKey.ISFROMHOUSE, false);
            navigation && navigation.navigate("SecondNavigator", {
                params: { Type: 1 }
            });
        }
    }

    const FirstRoute = useCallback(
        () => {
            return (
                <>{
                    listHouseModelCompany && listHouseModelCompany.length ?
                        <FlatList
                            refreshing={isRefresh}
                            onRefresh={() => onRefresh()}
                            data={listHouseModelCompany}
                            keyExtractor={(item, index) => "house" + index + String(item.Id)}
                            renderItem={ItemView}
                            columnWrapperStyle={listHouseStyle.flatListColumnWrapperStyle}
                            horizontal={false}
                            numColumns={2}
                            style={{ backgroundColor: "white" }}
                        /> : null
                }
                </>
            )
        },
        [listHouseModelCompany, index],
    )

    const SecondRoute = useCallback(
        () => {
            return (
                <>{
                    listHouseModelOfSelf && listHouseModelOfSelf.length ?
                        <FlatList
                            refreshing={isRefresh}
                            onRefresh={() => onRefresh()}
                            data={listHouseModelOfSelf}
                            keyExtractor={(item, index) => "house" + index + String(item.Id)}
                            renderItem={ItemViewOfSelf}
                            columnWrapperStyle={listHouseStyle.flatListColumnWrapperStyle}
                            horizontal={false}
                            numColumns={2}
                            style={{ backgroundColor: "white" }}
                        /> : null
                }
                </>
            )
        },
        [listHouseModelOfSelf, index],
    )

    const ItemView = ({ item, index }) => {
        return (
            <View style={[listHouseStyle.item]}>
                <View>
                    <TouchableOpacity onPress={() => goToPaintedHouse(item, true)}>
                        <Image style={listHouseStyle.item_image} source={{ uri: item?.ImageUrl }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeFavorite(item)}>
                        {
                            item.IsFavorite == true ?
                                <MaterialIcons style={homeStyles.item_favorite} name="favorite" size={24} color="red" /> :
                                <MaterialIcons style={homeStyles.item_favorite} name="favorite-outline" size={24} color="white" />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={listHouseStyle.item_title}>{item?.HouseModelName}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <SimpleLineIcons name="user" size={13} color="#8B8B8B" />
                        <Text style={listHouseStyle.item_point}>{item?.CreateByName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const ItemViewOfSelf = ({ item, index }) => {
        return (
            <View style={[listHouseStyle.item]}>
                <View>
                    <TouchableOpacity onPress={() => goToPaintedHouse(item, false)}>
                        <Image style={[listHouseStyle.item_image, { borderWidth: 1, borderColor: "#E5E5E5" }]}
                            source={{ uri: item?.ImageUrl }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changeFavorite(item)}>
                        {
                            item.IsFavorite == true ?
                                <MaterialIcons style={homeStyles.item_favorite} name="favorite" size={24} color="red" /> :
                                <MaterialIcons style={homeStyles.item_favorite} name="favorite-outline" size={24} color="white" />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text style={listHouseStyle.item_title}>{item?.CustomerName}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <SimpleLineIcons name="user" size={13} color="#8B8B8B" />
                        <Text style={listHouseStyle.item_point}>{item?.CreateByName}</Text>
                    </View>
                </TouchableOpacity>
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
                <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
                    <HeaderAuth
                        titleStyle={HEADER_TITLE}
                        iconStyle={TEXT} leftIcon={faChevronLeft}
                        headerText={"Mẫu thiết kế nhà"}
                        rightStyle={TEXT_RIGHT}
                        onLeftPress={navigation && navigation.goBack}
                        onRightPress={() => { }}
                        rightTx={"  "}
                        style={{ backgroundColor: "#E1420B" }} />
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={(index) => {
                            setIndex(index)
                        }}
                        swipeEnabled={false}
                        initialLayout={initialLayout}
                        renderTabBar={props => <TabBar {...props}
                            indicatorStyle={{ backgroundColor: "#F14950", alignSelf: "center" }}
                            renderLabel={({ route, color, focused }) => (
                                <View>{
                                    focused ? <Text style={{ color: '#F14950', margin: 8 }}>{route.title}</Text> :
                                        <Text style={{ color: 'black', margin: 8 }}>{route.title}</Text>
                                }</View>
                            )}
                            style={{ backgroundColor: 'white' }} />}
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
        // backgroundColor: "red",
        marginVertical: 8,
        paddingHorizontal: 8,
        width: "50%", // is 50% of container width
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