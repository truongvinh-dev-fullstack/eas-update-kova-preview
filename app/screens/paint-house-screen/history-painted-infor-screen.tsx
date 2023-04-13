import React, { useEffect, useRef, useState } from "react"
import {
    View, ViewStyle, TextStyle, Text, TouchableOpacity, Alert, ActivityIndicator, Image, TextInput, StyleSheet, FlatList, Modal, Keyboard,
    TouchableWithoutFeedback
} from "react-native"
import * as reactNativeShape from 'react-native-shape';
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { AuthStyles } from '../../styles/Auth'
import { styles } from '../../styles'
// import { StorageKey } from "../../services/storage";
import { observer } from "mobx-react-lite"
import {
    FontAwesome,
    AntDesign,
    FontAwesome5,
    Ionicons,
    Feather,
    EvilIcons
} from "@expo/vector-icons"

import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { ScrollView } from "react-native-gesture-handler"
import { Dimensions } from 'react-native'
import { StorageKey } from "../../services/storage"
// import RNPickerSelect from "react-native-picker-select"
import { LinearGradient } from 'expo-linear-gradient'
import { Input } from "@ui-kitten/components";
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";

const _unitOfWork = new UnitOfWorkService();

class HistoryPaint {
    Id: string;
    WorkerId: string;
    CustomerId: string;
    // ImageBase64: string;
    PaintedImageUrl: string;
    ImageUrl: string;
    ImageUrlReal: string;
    CustomerName: string;
    IsPainted: boolean;
    IsChoosed: boolean;
    IsFavourite: boolean;
    GroupHouseName: string;
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
    WorkerId: string;

    label: string;
    value: string;

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.CustomerName = '';
        this.Phone = '';
        this.Address = '';
    }
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
    borderTopLeftRadius: 12
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

export const HistoryPaintedInforScreen = observer(function HistoryPaintedInforScreen(props: any) {
    let historyPaintedId = props.route.params.HistoryPaintedId;
    const navigation = useNavigation();
    const { width } = Dimensions.get("window");
    const [isRefresh, setRefresh] = useState(false);
    const isFocused = useIsFocused();
    const viewShotRef = useRef<any>();
    const [isTakePhoto, SetIsTakePhoto] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);

    const takePhotoRef = useRef<Camera | null>();

    const [isLoading, setLoading] = useState(false);
    const [isSubmit, setSubmit] = useState(false);

    //BIẾN LƯU DỮ LIỆU
    const [customer, setCustomer] = useState<Customer>(null);
    const [customerInfor, setCustomerInfo] = useState<Customer>(new Customer());

    const [listCustomer, setListCustomer] = useState<Array<Customer>>([]);
    const [listFullCustomer, setListFullCustomer] = useState<Array<Customer>>([]);

    const [history, setHistory] = useState<HistoryPaint>(null);
    const [listColor, setListColor] = useState<Array<Color>>([]);
    // MODAL
    const [modalVisible, setModalVisible] = useState(false);
    const [modalChonKhachHangVisible, setModalChonKhachHangVisible] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);


    /*START : HÀM GET MASTER DATA*/
    useEffect(() => {
        if (isFocused == true) {
            fetchData().catch(err => {
                setLoading(false);
                goBack();
            });
            fetchDataListCustomer().catch(err => {
                setLoading(false);
                goBack();
            });
        }
    }, [isRefresh, isFocused]);

    const fetchData = async () => {
        setRefresh(false);
        if (!isRefresh) {
            setLoading(true);
            const response = await _unitOfWork.user.getDetailHistoryPaintedById({
                "HistoryPaintedId": historyPaintedId
            });
            setLoading(false);

            if (response.StatusCode == 200) {
                let data: HistoryPaint = response.HistoryPainted;
                let listColor: Array<Color> = response.ListColor;
                let customer: Customer = response.Customer;
                setCustomer(customer);
                setListColor(listColor);

                data.PaintedImageUrl = _unitOfWork.user.fixAvatar(data.ImageUrl);
                if (data.ImageUrlReal) {
                    data.ImageUrlReal = _unitOfWork.user.fixAvatar(data.ImageUrlReal);
                }
                setHistory(data);
            } else {

            }
        }
    }


    const fetchDataListCustomer = async () => {
        setRefresh(false);
        if (!isRefresh) {
            let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
            setLoading(true);
            const response = await _unitOfWork.user.getCustomerByWorkerId({
                "WorkerId": userId
            });
            setLoading(false);
            if (response.StatusCode == 200) {
                let lstCustomer: Array<Customer> = response.ListCustomer;
                setListCustomer(lstCustomer);
                setListFullCustomer(lstCustomer);
            } else {
            }
        }
    }
    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const openModal = function () {
        setModalVisible(!modalVisible);
    }

    const closeModal = function () {
        setModalVisible(false);
        setSubmit(false);
    }
    const goBack = (err = "Có lỗi xảy ra, vui lòng thử lại") => {
        Alert.alert("Thông báo", err,
            [{
                text: "OK", onPress: () => {
                    navigation && navigation.goBack()
                },
            }], { cancelable: false });
    }

    const saveHistoryColor = async function () {
        if (history?.ImageBase64Real) {
            let fileExtension = history?.ImageBase64Real.split(';')[0].split('/')[1];
            let base64 = history?.ImageBase64Real.split(',')[1];
            history.FileExtension = fileExtension;
            history.ImageBase64Real = base64;
        }   
        setLoading(true);
        let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
        const response = await _unitOfWork.user.saveInformationHousePainted({
            Customer: customer ? customer : null,
            WorkerId: userId,
            HistoryPaint: history
        });
        setLoading(false);
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

    const createCustomer = async function () {
        setSubmit(true);
        if (customerInfor.CustomerName == "" || customerInfor.Phone == "") {

        } else {
            setLoading(true);
            try {
                let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
                customerInfor.WorkerId = userId;
                const response = await _unitOfWork.user.createOrUpdateCustomer({
                    Customer: customerInfor,
                });
                setLoading(false);
                if (response.StatusCode != 200) {
                    Alert.alert("Thông báo", response.Message);
                } else {
                    fetchDataListCustomer();
                    setModalVisible(!modalVisible);
                    setSubmit(false);
                }
            } catch (err) {
                setLoading(false);
            }
        }
    }

    const findData = (query: string) => {
        let data = listFullCustomer.filter(c => query == null || query == '' ||
            c.CustomerName?.trim().toLowerCase().includes(query?.trim().toLowerCase())
            || c.Phone?.trim().toLowerCase().includes(query?.trim().toLowerCase()));
        setListCustomer(data);
    }

    const selectedCustomer = function (item: any) {
        setCustomer(item);
        setModalChonKhachHangVisible(!modalChonKhachHangVisible);
    }

    const goToTakeScreen = async function () {
        navigation && navigation.navigate("RealPaintedScreen", {
            HistoryPaintedId: historyPaintedId
        });
    }
    const onRefresh = () => {
        setRefresh(true)
    }

    const share = async function () {
        let imageBase64: string = await viewShotRef.current.capture();
        openShareDialogAsync(imageBase64);
    }


    const openShareDialogAsync = async (imageBase64: any) => {
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }
        const base64Code = imageBase64.split("data:image/jpeg;base64,")[1];
        const filename = FileSystem.documentDirectory + "kova.png";
        await FileSystem.writeAsStringAsync(filename, base64Code, {
            encoding: FileSystem.EncodingType.Base64,
        });
        await Sharing.shareAsync(filename)
    };


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
                            iconStyle={TEXT}
                            leftIcon={faChevronLeft}
                            onLeftPress={navigation.goBack}
                            titleStyle={HEADER_TITLE}
                            headerText={"Lưu thông tin"}
                            rightStyle={TEXT_RIGHT}
                            onRightPress={saveHistoryColor}
                            rightTx={"Lưu Lại"} />
                    </View>
                    <ScrollView style={CONTAINER_PADDING}>
                        <View style={styles.hr}></View>
                        <View style={[historyStyles.inputSection, AuthStyles.input]}>
                            <TouchableOpacity style={{
                                backgroundColor: "#191919",
                                width: 200,
                                height: 40,
                                alignSelf: "center",
                                borderWidth: 1,
                                borderRadius: 15,
                                paddingTop: 10,
                                marginTop: 10,
                                marginHorizontal: 10
                            }} onPress={() => setModalChonKhachHangVisible(!modalChonKhachHangVisible)}>
                                <Text style={{
                                    color: "#E55300", fontSize: 13,
                                    fontWeight: "500", lineHeight: 18,
                                    textAlign: "center",
                                }} >Chọn khách hàng</Text>
                            </TouchableOpacity>
                        </View>{
                            customer?.Id ?
                                <>
                                    <View style={styles.hr}></View>
                                    <View style={[historyStyles.inputSection, AuthStyles.input]}>
                                        <FontAwesome5 name="user" size={18} color="#8B8B8B" style={[styles.inputStartIcon, { paddingRight: 2 }]} />
                                        <TextInput
                                            value={customer?.CustomerName}
                                            style={historyStyles.input}
                                            placeholder="Nhập tên khách hàng"
                                            placeholderTextColor="#9098B1"
                                            onChangeText={(str) => {
                                                let con = { ...customer }
                                                con.CustomerName = str
                                                setCustomer(con)
                                            }}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                    <View style={styles.hr}></View>
                                    <View style={[historyStyles.inputSection, AuthStyles.input]}>
                                        <FontAwesome name="mobile-phone" size={24} color='#9098B1' style={[styles.inputStartIcon, { paddingHorizontal: 3 }]} />
                                        {/*@ts-ignore*/}
                                        <TextInput numeric keyboardType={"numeric"}
                                            style={historyStyles.input} placeholder="Số điện thoại"
                                            placeholderTextColor="#9098B1"
                                            value={customer?.Phone}
                                            autoCapitalize='none'
                                            onChangeText={(str) => {
                                                let con = { ...customer }
                                                con.Phone = str
                                                setCustomer(con)
                                            }} underlineColorAndroid="transparent" />
                                    </View>
                                    <View style={styles.hr}></View>
                                    <View style={[historyStyles.inputSection, AuthStyles.input]}>
                                        <AntDesign name="home" size={20} color='#9098B1' style={[styles.inputStartIcon, { paddingRight: 3 }]} />
                                        <TextInput
                                            value={customer?.Address}
                                            style={historyStyles.input}
                                            placeholder="Địa chỉ"
                                            placeholderTextColor="#9098B1"
                                            onChangeText={(str) => {
                                                let con = { ...customer }
                                                con.Address = str
                                                setCustomer(con)
                                            }}
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </> : null
                        }
                        <View style={styles.hr}></View>
                        <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: "jpg", quality: 1, result: "data-uri" }}>
                            <Image source={{ uri: history?.PaintedImageUrl }}
                                style={{
                                    width: width - 10, height: 280, justifyContent: "center", flexDirection: "row",
                                    marginVertical: 10, resizeMode: "contain",
                                }}
                            />{
                                listColor && listColor.length ?
                                    <FlatList
                                        refreshing={isRefresh}
                                        onRefresh={() => onRefresh()}
                                        data={listColor}
                                        keyExtractor={(item, index) => "color" + index + String(item)}
                                        renderItem={ColorView}
                                        numColumns={1}
                                        style={{ backgroundColor: "black" }}
                                    /> : null
                            }
                        </ViewShot>
                        <TouchableOpacity onPress={() => share()}
                            style={{
                                backgroundColor: "#191919",
                                marginVertical: 10,
                                width: 150,
                                alignSelf: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderRadius: 10
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="sharealt" size={20} color='#E55300' style={[styles.inputStartIcon, { marginLeft: 0 }]} />
                                <Text style={{ color: "#E55300", fontSize: 14, fontWeight: "500", lineHeight: 24 }}>Chia sẻ</Text>
                                <View></View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.hr}></View>
                        {
                            (history?.ImageUrlReal || history?.ImageBase64Real) ?
                                <>

                                    {
                                        isTakePhoto == true ?
                                            <Camera
                                                flashMode={Camera.Constants.FlashMode.off}
                                                autoFocus={Camera.Constants.AutoFocus.on}
                                                whiteBalance={Camera.Constants.WhiteBalance.auto}
                                                ref={takePhotoRef}
                                                style={[historyStyles.camera,]} type={type}
                                                ratio={'5:3'}>
                                                <View style={[historyStyles.buttonContainer, { justifyContent: "space-between" }]}>
                                                    <TouchableOpacity
                                                        style={[historyStyles.buttonCamera, { alignItems: "center", justifyContent: "center" }]}
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
                                                        style={[historyStyles.buttonCamera, { alignItems: "center", justifyContent: "center" }]}
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
                                                        width: width - 10, height: 290, justifyContent: "center",
                                                        flexDirection: "row",
                                                        marginVertical: 10, resizeMode: "contain"
                                                    }}
                                                />
                                                <TouchableOpacity style={{
                                                    height: 40,
                                                    width: 40,
                                                    borderRadius: 50,
                                                    backgroundColor: "white",
                                                    opacity: .4, position: "absolute", bottom: 410, right: 20,
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
                                                        height: 40,
                                                        backgroundColor: "#262626",
                                                        borderColor: "#262626",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginHorizontal: 5
                                                    }} onPress={() => TakePhoto()}>
                                                        <Feather name="camera" size={20} color="#F14950" />
                                                        <Text style={{ color: "#F14950", paddingLeft: 10, fontSize: 12 }}>Chụp ảnh</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{
                                                        width: width / 3,
                                                        height: 40,
                                                        backgroundColor: "#262626",
                                                        borderColor: "#262626",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        flexDirection: "row",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginHorizontal: 5
                                                    }} onPress={async () => selectRealImage()}>
                                                        <Feather name="upload" size={20} color="#F14950" />
                                                        <Text style={{ color: "#F14950", paddingLeft: 10, fontSize: 12 }}>Tải ảnh</Text>
                                                    </TouchableOpacity>
                                                </>
                                                : null
                                        }
                                    </View>
                                </>
                                : null
                        }
                        <TouchableOpacity onPress={() => goToTakeScreen()}
                            style={{
                                backgroundColor: "#191919",
                                marginVertical: 30,
                                minWidth: 200,
                                maxWidth: 200,
                                alignSelf: "center",
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: "#191919"
                            }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <AntDesign name="pluscircleo" size={20} color='#F14950' style={styles.inputStartIcon} />
                                <Text style={{ color: "#F14950", fontSize: 12, fontWeight: "500", lineHeight: 24 }}>Chụp ảnh sau khi sơn</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalChonKhachHangVisible}
                        onRequestClose={() => {
                            setModalChonKhachHangVisible(!modalChonKhachHangVisible)
                        }}>
                        <View style={historyStyles.centeredView} >
                            <View style={historyStyles.modalView}>
                                <View style={{
                                    justifyContent: "center",
                                    marginBottom: 5,
                                    width: "100%",
                                    paddingHorizontal: 15,
                                }}>
                                    <View style={[{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }]}>
                                        <TouchableOpacity onPress={() => setModalChonKhachHangVisible(!modalChonKhachHangVisible)}>
                                            <Ionicons name="md-close" size={18} color="black" />
                                        </TouchableOpacity>
                                        <Text style={[historyStyles.modal_title]}>Chọn khách hàng</Text>
                                        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                            <Text style={{ fontSize: 11, color: "#E55300" }}>Thêm KH</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Input autoCapitalize='none' autoCorrect={false}
                                        value={query}
                                        onChangeText={(searchString) => {
                                            findData(searchString);
                                            setQuery(searchString);
                                        }}
                                        status='info'
                                        placeholderTextColor={color.palette.lightGrey}
                                        clearButtonMode='always' placeholder='Tìm kiếm'
                                        style={{ borderRadius: 8, borderColor: "#F9F8FD", backgroundColor: "#F9F8FD", paddingVertical: 10 }}
                                        textStyle={{ color: "#000" }}
                                    />
                                    <View style={{ height: Dimensions.get("window").height - 550 }}>
                                        {
                                            listCustomer && listCustomer.length ?
                                                <FlatList
                                                    horizontal={false}
                                                    data={listCustomer}
                                                    keyExtractor={(item, index) => "cus" + index + String(item.Id)}
                                                    renderItem={({ item, index }) =>
                                                        <View style={[{ borderTopColor: "#F4F5F7", borderBottomColor: "#F4F5F7", borderTopWidth: 1, borderBottomWidth: 1 }]}>
                                                            <TouchableOpacity onPress={() => selectedCustomer(item)}>
                                                                <View style={{ marginHorizontal: 20, }}>
                                                                    <Text style={[{ color: "black", marginVertical: 10 },]}>{item.Phone} - {item.CustomerName}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    }
                                                />
                                                : null
                                        }
                                    </View>
                                </View>
                            </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    openModal();
                                }}>
                                <View style={historyStyles.centeredView} >
                                    <View style={historyStyles.modalView}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                                            <View style={{ width: "100%" }}>
                                                <Text style={[historyStyles.modal_title, { marginTop: 20 }]}>Thêm khách hàng</Text>
                                                <View style={{ paddingBottom: 30, paddingTop: 20 }}>
                                                    <Text style={[historyStyles.input_title]}>Tên khách hàng <Text style={[historyStyles.require]}>*</Text></Text>
                                                    <View style={[historyStyles.inputSectionModal, historyStyles.inputModal, (isSubmit && customerInfor?.CustomerName == "") ? { borderColor: color.dangerX } : {},]}>
                                                        <TextInput
                                                            value={customerInfor?.CustomerName}
                                                            style={historyStyles.inputModal}
                                                            placeholder="Nhập tên khách hàng"
                                                            placeholderTextColor="#9098B1"
                                                            onChangeText={(str) => {
                                                                let con = { ...customerInfor }
                                                                con.CustomerName = str
                                                                setCustomerInfo(con)
                                                            }}
                                                            underlineColorAndroid="transparent"
                                                        />
                                                    </View>
                                                    <Text style={[historyStyles.input_title]}>Số điện thoại <Text style={[historyStyles.require]}>*</Text></Text>
                                                    <View style={[historyStyles.inputSectionModal, historyStyles.inputModal, (isSubmit && customerInfor?.CustomerName == "") ? { borderColor: color.dangerX } : {},]}>
                                                        {/*@ts-ignore*/}
                                                        <TextInput numeric keyboardType={"numeric"}
                                                            style={historyStyles.inputModal} placeholder="Số điện thoại"
                                                            placeholderTextColor="#9098B1"
                                                            value={customerInfor?.Phone}
                                                            autoCapitalize='none'
                                                            onChangeText={(str) => {
                                                                let con = { ...customerInfor }
                                                                con.Phone = str
                                                                setCustomerInfo(con)
                                                            }} underlineColorAndroid="transparent" />
                                                    </View>
                                                    <Text style={[historyStyles.input_title]}>Địa chỉ</Text>
                                                    <View style={[historyStyles.inputSectionModal, historyStyles.inputModal]}>
                                                        <TextInput
                                                            value={customerInfor?.Address}
                                                            style={historyStyles.inputModal}
                                                            placeholder="Địa chỉ"
                                                            placeholderTextColor="#9098B1"
                                                            onChangeText={(str) => {
                                                                let con = { ...customerInfor }
                                                                con.Address = str
                                                                setCustomerInfo(con)
                                                            }}
                                                            underlineColorAndroid="transparent"
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 100 }}>
                                                    <TouchableOpacity style={historyStyles.backButton} onPress={() => closeModal()}>
                                                        <Text style={{ color: "#505050", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Quay lại</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={historyStyles.confirmButton} onPress={() => createCustomer()}>
                                                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#DB2323', '#E55300']} style={historyStyles.linearButtonGradient}>
                                                            <Text style={{ color: "white", alignSelf: "center", marginTop: 8, fontWeight: "700", fontSize: 14 }}>Xác nhận</Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </Modal>
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
            <View style={[historyStyles.item]}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingLeft: 10 }}>
                        <reactNativeShape.Octagon color={item?.ColorHex ?? item?.Rgb} scale={0.6} rotate={0} />
                        <View style={{ paddingLeft: 20, flexDirection: "column" }}>
                            <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>{item?.ColorCode}</Text>
                            <Text style={{ color: "white", fontSize: 10, fontWeight: "400" }}>{item?.ColorName}</Text>
                        </View>
                    </View>
                </View>{
                }
            </View>
            <View style={styles.hr} />
        </>
    )
}

export const historyStyles = StyleSheet.create({
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
        marginVertical: 1,
        paddingHorizontal: 28,
        marginLeft: 5,
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
    require: {
        color: "red"
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
        backgroundColor: "rgba(0,0,0,0.5)",
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
        fontSize: 13,
        fontWeight: "400",
        marginLeft: 20,
        marginTop: 10
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
    inputAndroid: {
        fontSize: 18,
        paddingVertical: 12,
        fontWeight: "700",
        marginTop: 12,
        borderWidth: 0,
        borderRadius: 4,
        color: 'white',
        paddingRight: 30,
        minWidth: Dimensions.get('window').width - 150,
    },
    inputIOS: {
        fontSize: 18,
        fontWeight: "700",
        paddingVertical: 11,
        paddingHorizontal: 12,
        marginTop: 9,
        color: 'white',
        minWidth: Dimensions.get("window").width - 130,
        borderRadius: 4,
    },
    /*END*/
    modal_title: {
        // marginTop: 20,
        alignItems: "center",
        fontSize: 16,
        fontWeight: "700",
        lineHeight: 18.75,
        textAlign: "center"
    },
    inputSectionModal: {
        flex: 1,
        alignSelf: "center",
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "#C4C4C4",
        minHeight: 40,
        maxHeight: 40,
        borderRadius: 5,
        width: "90%",
        justifyContent: "flex-start",
    },
    inputModal: {
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
    camera: {
        flex: 1,
        zIndex: 9999,
        width: Dimensions.get('window').width,
        height: 285,
    },
    buttonCamera: {
        height: 36,
        width: 36,
        backgroundColor: "white",
        opacity: .4,
        borderWidth: 1,
        borderRadius: 18,
        borderColor: "white",
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
})