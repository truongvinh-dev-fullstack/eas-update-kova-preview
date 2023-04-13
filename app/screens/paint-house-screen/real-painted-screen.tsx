import React, { useEffect, useRef, useState } from "react"
import { View, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet, FlatList } from "react-native"
import * as reactNativeShape from 'react-native-shape';
import { useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { styles } from '../../styles'
import { observer } from "mobx-react-lite"
import {
    AntDesign,
    Feather,
    EvilIcons,
    FontAwesome
} from "@expo/vector-icons"

import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { ScrollView } from "react-native-gesture-handler"
import { Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";

const _unitOfWork = new UnitOfWorkService();

class HistoryPaint {
    Id: string;
    WorkerId: string;
    CustomerId: string;
    CustomerName: string;
    IsPainted: boolean;
    IsChoosed: boolean;
    IsFavourite: boolean;
    GroupHouseName: string;
    ImageUrl: string;
    ImageUrlReal: string;
    FileExtension: string;
    ImageBase64Real: string;
    IsDelete: boolean;

    constructor() {
        this.IsDelete = false;
    }
}

class Customer {
    Id: string;
    CustormerCode: string;
    CustomerName: string;
    Phone: string;
    Address: string;
    Description: string;
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

const FULL: ViewStyle = { flex: 1 }

const TEXT: TextStyle = {
    color: '#FFFFFF',
    fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
    backgroundColor: "black",
    paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
    maxWidth: Dimensions.get('window').width,
    alignSelf: "center",
    paddingHorizontal: spacing[1],
    paddingTop: spacing[1],
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
}
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

export const RealPaintedScreen = observer(function RealPaintedScreen(props: any) {
    let historyPaintedId = props.route.params.HistoryPaintedId;
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const takePhotoRef = useRef<Camera | null>();
    const navigation = useNavigation();
    const { width } = Dimensions.get("window");

    const [isLoading, setLoading] = useState(false);
    const [customer, setCustomer] = useState<Customer>(null);
    const [history, setHistory] = useState<HistoryPaint>(null);
    const [listColor, setListColor] = useState<Array<Color>>([]);

    const [isDisplayTakePhoto, setIsDisplayTakePhoto] = useState<boolean>(true);
    const [colorPaintedButton, setColorPantedButton] = useState<string>("#E55300");
    const [colorRealButton, setColorRealButton] = useState<string>("transparent");
    const [isTakePhoto, SetIsTakePhoto] = useState(false);

    /*START : HÀM GET MASTER DATA*/
    useEffect(() => {
        fetchData().catch(error => {
            setLoading(false);
            goBack();
        });
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const response = await _unitOfWork.user.getDetailHistoryPaintedById({
            "HistoryPaintedId": historyPaintedId
        });
        setLoading(false);

        if (response.StatusCode != 200) {
            Alert.alert("Thông báo", response.Message);
        } else if (response.Status == 401) {
            goToScreen("LoginScreen");
        } else {
            let data: HistoryPaint = response.HistoryPainted;
            data.ImageUrl = _unitOfWork.user.fixAvatar(data.ImageUrl);
            data.ImageUrlReal = _unitOfWork.user.fixAvatar(data.ImageUrlReal);

            let listColor: Array<Color> = response.ListColor;
            let customer: Customer = response.Customer;
            setCustomer(customer);
            setListColor(listColor);
            setHistory(data);
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
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    function goToScreen(page: string) {
        navigation && navigation.navigate(page);
    }

    const pressPainted = function () {
        setIsDisplayTakePhoto(true);
        setColorPantedButton("#E55300");
        setColorRealButton("transparent");
    }

    const pressReal = function () {
        setIsDisplayTakePhoto(false);
        setColorPantedButton("transparent");
        setColorRealButton("#E55300");
    }

    const TakePhoto = function () {
        SetIsTakePhoto(true);
    }

    const takePicture = async () => {
        if (takePhotoRef.current) {
            const option = { quality: 0.5, base64: true, skipProcessing: false }
            let photo = await takePhotoRef.current.takePictureAsync(option);
            let source = "data:image/jpg;base64," + photo.base64;
            if (source) {
                history.ImageBase64Real = source;
                history.IsDelete = false;
                SetIsTakePhoto(false);
            }
        }
    }

    const selectRealImage = async () => {
        let result: any = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            let his = { ...history }
            his.ImageBase64Real = `data:image/jpg;base64,${result.base64}`;
            his.IsDelete = false;
            setHistory(his);
        }
    }

    const saveHistoryColor = async function () {
        if (history?.ImageBase64Real) {
            let fileExtension = history?.ImageBase64Real.split(';')[0].split('/')[1];
            let base64 = history?.ImageBase64Real.split(',')[1];
            history.FileExtension = fileExtension;
            history.ImageBase64Real = base64;
        }
        setLoading(true);
        const response = await _unitOfWork.user.saveRealImage({
            HistoryPaint: history,
        });

        if (response.StatusCode != 200) {
            Alert.alert("Thông báo", response.Message);
        } else {
            fetchData().catch(err => {
                setLoading(false);
                goBack();
            });
            Alert.alert("Thông báo", "Đã lưu thành công");
        }
    }

    const deleteImage = async () => {
        let his = { ...history }
        his.ImageBase64Real = null;
        his.ImageUrlReal = null;
        his.IsDelete = true;
        setHistory(his);
    }

    return (
        <>
            {isLoading &&
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#A23232" />
                </View>
            }
            <View style={FULL}>
                <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
                    <View style={{ minHeight: 60 }}>
                        <HeaderAuth
                            titleStyle={HEADER_TITLE}
                            iconStyle={TEXT}
                            leftIcon={faChevronLeft}
                            headerText={"Lưu ảnh thực tế"}
                            rightStyle={TEXT_RIGHT}
                            onLeftPress={navigation.goBack}
                            onRightPress={saveHistoryColor}
                            rightTx={"Lưu lại"} />
                    </View>
                    <ScrollView style={CONTAINER_PADDING}>
                        <View style={styles.hr}></View>
                        <View style={{ width: "100%", alignItems: "center" }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: "700",
                                color: "white",
                                paddingVertical: 15
                            }}>{customer?.CustomerName}</Text>
                        </View>
                        <View style={styles.hr}></View>
                        <View style={{ width: "100%", alignItems: "center", marginBottom: 50 }}>
                            <View style={{
                                backgroundColor: "#191919",
                                width: 224,
                                marginVertical: 15,
                                height: 38,
                                borderRadius: 20,
                                borderColor: "#E55300",
                                borderWidth: 1,
                                flexDirection: "row",
                            }}>
                                <TouchableOpacity style={{
                                    width: 111,
                                    alignItems: "center",
                                    backgroundColor: colorPaintedButton,
                                    height: 36,
                                    borderRadius: 20,
                                    justifyContent: "center"
                                }}
                                    onPress={() => pressPainted()}
                                >
                                    <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Phối màu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: 111,
                                    alignItems: "center",
                                    backgroundColor: colorRealButton,
                                    height: 36,
                                    borderRadius: 20,
                                    justifyContent: "center"
                                }}
                                    onPress={() => pressReal()}>
                                    <Text style={{ color: "white" }}>Thực tế</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            isDisplayTakePhoto == true ?
                                <>
                                    <Image source={{ uri: history?.ImageUrl }}
                                        style={{
                                            width: width, height: 250,
                                            justifyContent: "center", flexDirection: "row",
                                            marginVertical: 10,
                                            resizeMode: "contain"
                                        }}
                                    />{
                                        listColor && listColor.length ?
                                            <FlatList
                                                data={listColor}
                                                keyExtractor={(item, index) => "color" + index + String(item)}
                                                renderItem={ColorView}
                                                numColumns={1}
                                                style={{ backgroundColor: "black", marginHorizontal: 20 }}
                                            /> : null
                                    }
                                </> :
                                <>
                                    {
                                        isTakePhoto == true ?
                                            <Camera
                                                flashMode={Camera.Constants.FlashMode.off}
                                                autoFocus={Camera.Constants.AutoFocus.on}
                                                whiteBalance={Camera.Constants.WhiteBalance.auto}
                                                ref={takePhotoRef}
                                                style={[realPainted.camera,]} type={type}
                                                ratio={'5:3'}>
                                                <View style={[realPainted.buttonContainer, { justifyContent: "space-between" }]}>
                                                    <TouchableOpacity
                                                        style={[realPainted.buttonCamera, { alignItems: "center", justifyContent: "center" }]}
                                                        onPress={() => {
                                                            setType(
                                                                type === Camera.Constants.Type.back
                                                                    ? Camera.Constants.Type.front
                                                                    : Camera.Constants.Type.back
                                                            );
                                                        }}>
                                                        <EvilIcons name="spinner-3" size={24} color="black" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[realPainted.buttonCamera, { alignItems: "center", justifyContent: "center" }]}
                                                        onPress={() => { SetIsTakePhoto(false) }}>
                                                        <AntDesign name="close" size={24} color="black" />
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity style={{
                                                    height: 80,
                                                    width: 80,
                                                    borderRadius: 50,
                                                    backgroundColor: "white",
                                                    opacity: .4,
                                                    marginBottom: 20, justifyContent: "center", alignSelf: "center"
                                                }}
                                                    onPress={() => takePicture()}>
                                                    <Feather name="camera" size={42} color="black" style={{ alignSelf: "center", alignItems: "center" }} />
                                                </TouchableOpacity>
                                            </Camera> :
                                            <>
                                                <Image source={{ uri: history?.ImageBase64Real ?? history?.ImageUrlReal }}
                                                    style={{
                                                        width: width, height: 285,
                                                        justifyContent: "center",
                                                        flexDirection: "row", marginVertical: 10,
                                                        resizeMode: "contain"
                                                    }}
                                                />
                                                <TouchableOpacity style={{
                                                    height: 40,
                                                    width: 40,
                                                    borderRadius: 50,
                                                    backgroundColor: "white",
                                                    opacity: .4, position: "absolute", bottom: 320, right: 20,
                                                    justifyContent: "center", alignSelf: "center"
                                                }}
                                                    onPress={() => deleteImage()}>
                                                    <FontAwesome name="close" size={22} color="black" style={{ alignSelf: "center", alignItems: "center" }} />
                                                </TouchableOpacity>
                                            </>

                                    }
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginTop: 20
                                    }}>{
                                            isTakePhoto == false ?
                                                <>
                                                    <TouchableOpacity style={{
                                                        width: width / 3,
                                                        height: width / 7,
                                                        backgroundColor: "#262626",
                                                        borderColor: "#262626",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginHorizontal: 5
                                                    }} onPress={() => TakePhoto()}>
                                                        <Feather name="camera" size={24} color="#F14950" />
                                                        <Text style={{ color: "#F14950", paddingLeft: 10, fontSize: 14 }}>Chụp ảnh</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{
                                                        width: width / 3,
                                                        height: width / 7,
                                                        backgroundColor: "#262626",
                                                        borderColor: "#262626",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginHorizontal: 5
                                                    }} onPress={async () => selectRealImage()}>
                                                        <Feather name="upload" size={24} color="#F14950" />
                                                        <Text style={{ color: "#F14950", paddingLeft: 10, fontSize: 14 }}>Tải ảnh</Text>
                                                    </TouchableOpacity>
                                                </>
                                                : null
                                        }
                                    </View>
                                </>
                        }
                    </ScrollView>
                </Screen>
            </View>
        </>
    )
})

const ColorView = ({ item, index }) => {
    return (
        <>{
            index == 0 ? <View style={styles.hr} /> : null
        }
            <View style={[realPainted.item]}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
                        <reactNativeShape.Octagon color={item?.ColorHex ?? item.Rgb} scale={1} rotate={0} />
                        <View style={{ paddingLeft: 40, flexDirection: "column" }}>
                            <Text style={{ color: "white", fontSize: 14, fontWeight: "700" }}>{item?.ColorCode}</Text>
                            <Text style={{ color: "white", fontSize: 12, fontWeight: "400" }}>{item?.ColorName}</Text>
                        </View>
                    </View>
                </View>{
                }
            </View>
            <View style={styles.hr} />
        </>
    )
}



export const realPainted = StyleSheet.create({
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
    item: {
        marginVertical: 5,
        paddingHorizontal: 28,
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
    header_bottom: {
        position: "absolute",
        top: 120,
        height: 50,
        backgroundColor: "#D33724",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 10
    },
    alignItemsCenter: {
        alignItems: "center",
    },
    header_bottom_icons: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
    },
    header_bottom_rhombus: {
        position: "absolute",
        bottom: 28,
        // width: 88,
        // height: 88,
    },
    header_bottom_icon: {
        bottom: 45,
        // width: 28,
        // height: 25.38,
        position: "absolute",
    },
    header_center_name: {
        color: color.white,
        fontSize: 20, fontWeight: "700", lineHeight: 16.94,
    },
    title: {
        color: color.black,
        fontSize: 18,
        fontWeight: "700",
        lineHeight: 21.09,
        paddingHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    changePassword: {
        flex: 1,
        alignSelf: "center",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: "transparent",
        minHeight: 56,
        maxHeight: 56,
        marginBottom: 64
    },
    changePasswordButton: {
        backgroundColor: "white",
        borderColor: "#E8E8E7",
        borderWidth: 1,
        borderRadius: 20,
        minHeight: 32,
        maxHeight: 32,
        minWidth: 198,
    },
    inputEndIcon: {
        width: 14,
        height: 14,
        margin: 10,
        // resizeMode: "contain",
        // color: "#9098B1",
    },
    inputSection: {
        flex: 1,
        alignSelf: "center",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: "black",
        minHeight: 45,
        maxHeight: 45,
    },
    input: {
        flex: 1,
        fontSize: 14,
        paddingRight: 10,
        paddingLeft: 0,
        marginVertical: 0,
        backgroundColor: 'black',
        color: '#FFFFFF',
        height: 35,
    },
    /*MODAL CSS*/
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        // padding: 35,
        paddingHorizontal: 35,
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalTitle: {
        position: "absolute"
    },
    input_title: {
        color: "#000000",
        marginBottom: 10,
        fontSize: 12,
        fontWeight: "400",
        marginLeft: 10
    },
    changePasswordButtonModal: {
        backgroundColor: "transparent",
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 20,
        minHeight: 38,
        maxHeight: 38,
        minWidth: 150,
        borderColor: "white",
    },
    linearGradient: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "white",
        minHeight: 38,
        maxHeight: 38,
        minWidth: 150,
    },
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
        zIndex: 9999,
        width: Dimensions.get('window').width,
        height: 250,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    buttonCamera: {
        height: 36,
        width: 36,
        backgroundColor: "white",
        opacity: .4,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: "white",
    }
    /*END*/
})