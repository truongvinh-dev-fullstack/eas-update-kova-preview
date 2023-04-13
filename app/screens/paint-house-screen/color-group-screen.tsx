import { useEffect, useState } from "react";
import * as React from 'react';
import { observer } from "mobx-react-lite";
import {
    View,
    ViewStyle,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet, Alert, ActivityIndicator, TextStyle
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StorageKey } from "../../services/storage";
import { UnitOfWorkService } from "../../services/api/unitOfWork-service";
import { List } from 'react-native-paper';
import { Checkbox } from "../../components/checkbox/checkbox"

import * as reactNativeShape from 'react-native-shape';
import { spacing, typography } from "../../theme";
import { HeaderAuth, Screen } from "../../components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

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
    IsChoosed: boolean;
    IsSelected: boolean;
}

const _unitOfWork = new UnitOfWorkService();
const FULL: ViewStyle = {
    flex: 1,
    backgroundColor: "black"
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


export const ColorGroupScreen = observer(function ColorGroupScreen(props: any) {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string>(null);
    const [listCategory, setListCategory] = useState<Array<ColorGroup>>([]);
    const [listAllItems, setListAllItems] = useState<Array<Color>>([]);
    const [isRefresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchData();
    }, [isRefresh]);

    const fetchData = async () => {
        setRefresh(false);
        if (!isRefresh) {
            setLoading(true);
            let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
            setUserId(userId);

            const response = await _unitOfWork.user.getAllGroupWorkerColor({ WorkerId: userId });
            setLoading(false);
            if (response.StatusCode == 200) {
                let ls: Array<ColorGroup> = response.ListGroupColor;
                setListCategory(ls);
                // Add Color
                var list: Array<Color> = response.ListColor;
                list.map((item) => {
                    item.IsChoosed = false;
                });
                // Lưu giá trị
                setListAllItems(list);
            } else {
            }
        }
    }

    const changeValueCheckBox = function (item: Color, i: number) {
        let list: Array<Color> = [...listAllItems];
        list.forEach(color => {
            if (color.Id == item.Id) color.IsSelected = !item.IsSelected
        });
        setListAllItems(list);
    }

    const applyColorGroup = async () => {

        var listColors = listAllItems?.filter(c => c.IsSelected).map(a => a.Id);

        const response = await _unitOfWork.user.saveColorGroup({ WorkerId: userId, ListColors: listColors });
        if (response.StatusCode != 200) {
            Alert.alert("Thông báo", response.Message);

        } else {
            Alert.alert("Thông báo", "Đã lưu thành công");
        }
    }

    const topComponent = () => {
        return (
            <></>
        )
    }
    const footerComponent = () => {
        return (
            <View style={{ marginBottom: 80 }} />
        )
    }

    const ItemView = ({ item, index }) => {

        var listItems = listAllItems == null ? [] : listAllItems.filter(x => x.GroupColorId == item.CategoryId);
        return (
            <View>
                {/*@ts-ignore*/}
                <List.Section style={{ marginVertical: 0 }}  >
                    <List.Accordion theme={{ colors: { primary: 'white' } }}
                        title={item.CategoryName?.toUpperCase()}
                        titleStyle={{ color: "white", fontSize: 14, fontWeight: "700" }}
                        style={{
                            backgroundColor: 'black',
                            padding: 5,
                            borderBottomColor: "#898989",
                            borderBottomWidth: 1
                        }}
                    >
                        <FlatList
                            stickyHeaderIndices={[0]}
                            ListFooterComponent={() => { return (<View />) }}
                            data={listItems}
                            keyExtractor={(item, index) => "list" + index + String(item)}
                            renderItem={AccordioView}
                            horizontal={false}
                            numColumns={1}
                            style={{ backgroundColor: "black" }}
                        />
                    </List.Accordion>
                </List.Section>
            </View>
        )
    }

    const AccordioView = ({ item, index }) => {
        return (
            <>
                <View style={[colorGroupStyle.item]}>
                    <TouchableOpacity style={{ borderRadius: 10 }}>
                        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
                                <reactNativeShape.Octagon color={item.ColorHex ?? item.Rgb} scale={1} rotate={0} />
                                <View style={{ paddingLeft: 30, flexDirection: "column" }}>
                                    <Text style={{ color: "#3374DD", fontSize: 14, fontWeight: "700" }}>{item.ColorCode}</Text>
                                    <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}> {item.ColorName}</Text>
                                </View>
                            </View>
                            {
                                <Checkbox value={item.IsSelected} onToggle={() => {
                                    changeValueCheckBox(item, index)
                                }} style={{ marginRight: 15, borderColor: "white", }} />
                            }
                        </View>{
                        }
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%", height: 1, backgroundColor: "#61615E" }} />
            </>
        )
    }
    const onRefresh = () => {
        setRefresh(true)
    }
    return (
        <>
            {isLoading &&
                <View style={colorGroupStyle.loading}>
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
                        headerText={"Phân loại màu"}
                        rightStyle={TEXT}
                        rightTx={"Áp dụng"}
                        onRightPress={() => applyColorGroup()}
                        onLeftPress={() => navigation && navigation.goBack()}
                    />
                    <FlatList
                        stickyHeaderIndices={[0]}
                        refreshing={isRefresh}
                        onRefresh={() => onRefresh()}
                        ListHeaderComponent={topComponent()}
                        ListFooterComponent={footerComponent()}
                        data={listCategory}
                        keyExtractor={(item, index) => "list" + index + String(item)}
                        renderItem={ItemView}
                        horizontal={false}
                        numColumns={1}
                    />
                </Screen>
            </View>
        </>
    )
})

// CSS
const colorGroupStyle = StyleSheet.create({
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