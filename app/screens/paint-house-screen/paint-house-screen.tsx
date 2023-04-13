import {
  TextStyle, View, ViewStyle, StyleSheet, ImageBackground,
  Dimensions,
  Text,
  ActivityIndicator, Alert, FlatList, TouchableOpacity, Modal, TextInput, Image,
} from "react-native"
import { HeaderAuth, Screen, TableColor, Wallpaper } from "../../components"
import { color, typography } from "../../theme"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import Svg, { Circle, G, Path } from "react-native-svg"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import { faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { StorageKey } from "../../services/storage";
import ViewShot from "react-native-view-shot";
import RNPickerSelect from "react-native-picker-select"
import { Input } from "@ui-kitten/components"
import { Slider } from 'react-native';

class FengShui {
  Id: string;
  YearId: string;
  FateId: string;
  Year: string;
  Fate: string;
  IsActive: boolean;

  ListFateColor: Array<Color>;
  ListCompatibilityColor: Array<Color>;
}

class ColorGroup {
  CategoryId: string;
  CategoryName: string;
  ListColor: Array<Color>;
  IsActive: boolean;

  listColorHex: Array<string>

  constructor() {
    this.ListColor = [];
    this.listColorHex = [];
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
}

class House {
  Id: string;
  Url: string;
  ViewBox: string;
  ImageBase64: string;
  IsFavorite: boolean;
  ImageUrl: string;

  ListHouseModelAttribute: Array<HouseModelAttributeDetai>;
  constructor() {
    this.ListHouseModelAttribute = [];
  }
}

class GroupHouseModelAttributeDetai {
  Index: 1;
  Poisition: string;
  ColorHex: string;
  Rgb: string;
  ColorId: string;
  ColorCode: string;
  ColorName: string;

  Cx: string;
  Cy: string;

  PointSize: string;

  ListHouseModelAttribute: Array<HouseModelAttributeDetai>;

  constructor() {
    this.ListHouseModelAttribute = [];
  }
}

class HouseModelAttributeDetai {
  Id: string;
  HouseModelId: string;
  PositionId: string;
  Tranform: string;
  Path: string;
  Position: string;
  ColorId: string;
  ColorCode: string;
  ColorName: string;
  ColorHex: string;
  Rgb: string;
}

const FULL: ViewStyle = {
  flex: 1,
}

const TEXT: TextStyle = {
  color: "white",
  fontFamily: typography.primary,
}

const TEXT_RIGHT: TextStyle = {
  color: "#E55300",
  fontFamily: typography.primary,
}

const CONTAINER: ViewStyle = {
  backgroundColor: "black",
}

const HEADER_TITLE: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  letterSpacing: 1.5,
  lineHeight: 15,
  textAlign: "center",
  color: "white",
}

const { width } = Dimensions.get("window");

const _unitOfWork = new UnitOfWorkService();

const images = {
  logo: require("../../images/logo-1.png"),
}

// const ListColor = ["#045150", "#FFC623", "#58764B", "#2B2B40", "#DC0360", "#C158FD", "#7EC0EE", "#3F6077", "#7EFF03", "#420DAB", "#093669", "#F931B4", "#E94276",
//   "#F09E2E", "#C01025", "#306100", "#E3E6FF", "#997615", "#7F6311", "#023030"];

export function PaintHouseScreen(props: any) {
  // Biến điều kiện
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isLoading, setLoading] = useState(false);
  const [isRefresh, setRefresh] = useState(false);
  // Chụp màn hỉnh
  const viewShotRef = useRef<any>();
  // Data house
  const [data, setData] = useState<House>(null);

  const [mauNhaLQ, setMauNhaLQ] = useState<any>([]);
  const [listMauNhaLienQuan, setListMauNhaLienQuan] = useState<Array<any>>([]);
  const [listFullMauNhaLienQuan, setListFullMauNhaLienQuan] = useState<Array<any>>([]);
  const [listGroupPath, setListGroupPath] = useState<Array<GroupHouseModelAttributeDetai>>([]);

  // Id truyền vào
  const [houseId, setHouseId] = useState<string>(null);
  const [historyId, setHistoryId] = useState<string>();

  const [isFromHome, setIsFromHome] = useState<boolean>(false);

  const [query, setQuery] = useState("");
  const [groupColor, setGroupColor] = useState<Array<ColorGroup>>([]);
  const [fengShui, setFengShui] = useState([]);
  // const [fengShuiCurrent, setFengShuiCurrent] = useState<FengShui>([]);
  const [trendName, setTrendName] = useState<string>('');
  const [listTrendColor, setListTrendColor] = useState<Array<Color>>([]);

  const [colorFanName, setColorFanName] = useState<string>('');
  const [listColorFan, setListColorFan] = useState<Array<Color>>([]);

  const [listQuicklyColor, setListQuicklyColor] = useState<Array<Color>>([]);
  const [listHistoryColor, setListHistoryColor] = useState<Array<Color>>([]);
  const [listAllColor, setListAllColor] = useState<Array<Color>>([]);

  const [currentGroup, setCurrentGroup] = useState<any>(null);
  const [currentFengShui, setCurrentFengShui] = useState<FengShui>(null);
  const [currentColor, setCurrentColor] = useState<Color>();
  const [isShowButton, setIsShowButton] = useState<boolean>(true);
  const [colorViewShot, setColorViewShot] = useState<string>("black");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>(null);
  const [valueOpacity, setValueOpacity] = useState<number>(0);
  const [valueOverlay, setValueOverLay] = useState<number>(1);
  const [isTakePhoto, setIsTakePhoto] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchDataColor().catch(err => {
        setLoading(false);
        goBack();
      });
    }
  }, [isFocused, isRefresh]);

  useEffect(() => {
    if (isFocused) {
      fetchData().catch(err => {
        setLoading(false);
        goBack();
      });
    }
  }, [isFocused, isRefresh]);

  const fetchData = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let isFromHouse: any = await _unitOfWork.storage.getItem(StorageKey.ISFROMHOUSE);
      setIsFromHome(isFromHouse);
      // Lấy từ mẫu nhà công ty
      if (isFromHouse) {
        let houseId = await _unitOfWork.storage.getItem(StorageKey.HOUSE_MODEL_ID);
        setHouseId(houseId);
        setLoading(true);
        const response = await _unitOfWork.user.detailHouseModel({
          "HouseModelId": houseId,
        });
        setLoading(false);
        if (response.StatusCode == 200) {
          let house: House = response.HouseModel;
          house.ImageUrl = _unitOfWork.user.fixAvatar(house.ImageUrl);
          let lstViewbox = [];
          if (house.ViewBox) {
            lstViewbox = house.ViewBox.split(' ');
          }
          let sizePoint = parseInt(lstViewbox[3]);

          let listGroup = groupBy(house.ListHouseModelAttribute);

          // Tính vị trí của các điểm tô màu
          listGroup.forEach(item => {
            if (item.ListHouseModelAttribute.length <= 3) {
              let list = item.ListHouseModelAttribute[0].Path.split(",");
              item.Cx = list[0].substring(list[0].indexOf(" ") + 1, list[0].length);
              item.Cy = list[1].substring(0, list[1].indexOf(" "));
              item.PointSize = (sizePoint / 30).toString();
            } else if (item.ListHouseModelAttribute.length > 3) {
              let centerIndex = (item.ListHouseModelAttribute.length - item.ListHouseModelAttribute.length % 2) / 2;
              let list = item.ListHouseModelAttribute[centerIndex].Path.split(",");
              item.Cx = list[0].substring(list[0].indexOf(" ") + 1, list[0].length);
              item.Cy = list[1].substring(0, list[1].indexOf(" "));
              item.PointSize = (sizePoint / 30).toString();
            }
          });
          setListGroupPath(listGroup);
          setData(house);

          // Mẫu nhà liên quan
          let lstMauNhaLienQuan: Array<any> = response.ListMauNhaLienQuan;
          let mauNha = lstMauNhaLienQuan.find(c => c.Id == houseId);
          setMauNhaLQ(mauNha);
          setListMauNhaLienQuan(lstMauNhaLienQuan);
          setListFullMauNhaLienQuan(lstMauNhaLienQuan);

        } else if (response.StatusCode == 401) {
          goToScreen("LoginScreen");
        }
      }
      // Lấy từ lịch sử sơn nhà
      else {
        let historyId = await _unitOfWork.storage.getItem(StorageKey.HISTORY_ID);
        setHistoryId(historyId);
        setLoading(true);
        const response = await _unitOfWork.user.getHouseModelDetailFromHistoryId({
          "HistoryPaintedId": historyId,
        });
        setLoading(false);
        if (response.StatusCode == 200) {
          let house: House = response.HouseModel;
          let lstViewbox = [];
          if (house.ViewBox) {
            lstViewbox = house.ViewBox.split(' ');
          }
          let sizePoint = parseInt(lstViewbox[3]);
          house.ImageUrl = _unitOfWork.user.fixAvatar(house.ImageUrl);
          let listGroup = groupBy(house.ListHouseModelAttribute);

          // Tính vị trí của các điểm tô màu
          listGroup.forEach(item => {
            if (item.ListHouseModelAttribute.length <= 3) {
              let list = item.ListHouseModelAttribute[0].Path.split(",");
              item.Cx = list[0].substring(list[0].indexOf(" "), list[0].length);
              item.Cy = list[1].substring(0, list[1].indexOf(" "));
              item.PointSize = (sizePoint / 30).toString();
            } else if (item.ListHouseModelAttribute.length > 3) {
              let centerIndex = (item.ListHouseModelAttribute.length - item.ListHouseModelAttribute.length % 2) / 2;
              let list = item.ListHouseModelAttribute[centerIndex].Path.split(",");
              item.Cx = list[0].substring(list[0].indexOf(" "), list[0].length);
              item.Cy = list[1].substring(0, list[1].indexOf(" "));
              item.PointSize = (sizePoint / 30).toString();
            }
          });
          setListGroupPath(listGroup);
          setData(house);

          // Mẫu nhà liên quan
          let lstMauNhaLienQuan: Array<any> = response.ListMauNhaLienQuan;
          let mauNha = lstMauNhaLienQuan.find(c => c.Id == houseId);
          setMauNhaLQ(mauNha);
          setListMauNhaLienQuan(lstMauNhaLienQuan);
          setListFullMauNhaLienQuan(lstMauNhaLienQuan);

        } else if (response.StatusCode == 401) {
          goToScreen("LoginScreen");
        }
      }
    }
  }

  const fetchDataColor = async () => {
    setRefresh(false);
    if (!isRefresh) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      setLoading(true);
      const response = await _unitOfWork.user.getMasterDataColor({
        "UserId": userId,
      });
      setLoading(false);
      let list: Array<ColorGroup> = response.ListGroupColor;

      list.forEach(item => {
        if (item.CategoryId == null) {
          item.IsActive = true;
          setCurrentGroup(item);
        }
        item.listColorHex = item.ListColor.map(c => c.ColorHex);
      });
      setGroupColor(list);

      let listFengShui: Array<any> = response.ListFengShui;
      listFengShui.map((item: { label: any; Id: any; value: any; Year: any }) => {
        item.label = item.Year
        item.value = item.Id
        return item
      });
      setFengShui(listFengShui);

      setListTrendColor(response.ListTrendColor);
      setTrendName(response.TrendName);
      setListColorFan(response.ListColorFan);
      setColorFanName(response.ColorFanName);
      setListAllColor(response.ListAllColor);
      setValueOpacity(0);
      setValueOverLay(1);
      let listQuicly = response.ListQuicklyColor;
      setListQuicklyColor(listQuicly);
    }
  }

  const findData = (query: string) => {
    let data = listFullMauNhaLienQuan.filter(c => query == null || query == '' ||
      c.Heading?.trim().toLowerCase().includes(query?.trim().toLowerCase()));
    setListMauNhaLienQuan(data);
  }


  const searchColor = function (str: string) {
    let searchStr = str ? str.trim() : '';
    groupColor.forEach(item => {
      if (item.CategoryId == null) {
        item.ListColor = listAllColor.filter(c => (searchStr === '' || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
          || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
      } else {
        item.ListColor = listAllColor.filter(c => (c.GroupColorId === item.CategoryId) && (searchStr === ''
          || c.ColorCode.toLowerCase().includes(searchStr.toLowerCase())
          || c.ColorName.toLowerCase().includes(searchStr.toLowerCase())));
      }
    });
  }
  function goToScreen(page: string) {
    navigation && navigation.navigate(page);
  }

  const goToHouseColorInforScreen = async () => {
    setIsShowButton(false);
    console.log(isShowButton);
    setColorViewShot("white");
    let imageBase64: string = await viewShotRef.current.capture();
    setColorViewShot("black");
    setIsShowButton(true);
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
    if (userId) {
      let house = { WorkerId: userId, HouserModelId: houseId, ImageBase64: imageBase64 };
      navigation && navigation.navigate("HouseColorInforScreen",
        { house: house, listGroupPath: listGroupPath, historyId: historyId })
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

  const groupBy = (collection: Array<HouseModelAttributeDetai>) => {
    let result: Array<GroupHouseModelAttributeDetai> = [];
    for (let i = 0; i < collection?.length; i++) {
      let val = result.find(c => c.Poisition == collection[i].Position);
      if (val) {
        let index = result.indexOf(val);
        result[index].ListHouseModelAttribute.push(collection[i]);
      }
      else {
        let model = new GroupHouseModelAttributeDetai();
        model.Poisition = collection[i].Position;
        model.ColorId = collection[i].ColorId;
        model.ColorCode = collection[i].ColorCode;
        model.ColorName = collection[i].ColorName;
        model.ColorHex = collection[i].ColorHex;
        model.Rgb = collection[i].Rgb;

        model.ListHouseModelAttribute.push(collection[i]);
        result.push(model);
      }
    }

    return result;
  }

  // @ts-ignore
  const touchImage = (index: any) => {
    let list = [...listGroupPath];
    list[index].ColorHex = currentColor ? currentColor.ColorHex : null;
    list[index].Rgb = currentColor ? currentColor.Rgb : null;
    list[index].ColorId = currentColor ? currentColor.Id : null;
    list[index].ColorCode = currentColor ? currentColor.ColorCode : null;
    list[index].ColorName = currentColor ? currentColor.ColorName : null;

    setListGroupPath(list);
  }

  const undo = () => {
    setIsShowButton(!isShowButton);
    setIsTakePhoto(!isTakePhoto);
  }

  const fillColor = (item: GroupHouseModelAttributeDetai) => {
    return item?.ColorHex ?? item?.Rgb;
  }

  const selectedMauNhaLienQuan = async (value: any) => {
    await _unitOfWork.storage.setItem(StorageKey.ISFROMHOUSE, true);
    await _unitOfWork.storage.setItem(StorageKey.HOUSE_MODEL_ID, value.Id);
    setMauNhaLQ(value);
    fetchData().catch(err => {
      setLoading(false);
      goBack();
    });
    setModalVisible(false);
    setQuery('');
  }

  const changeCurrentGroup = async (item: ColorGroup, index: number) => {
    let _listCategory = [...groupColor];
    _listCategory.forEach((value, i) => {
      if (i != index) {
        value.IsActive = false;
      } else {
        value.IsActive = true;
      }
    });
    setGroupColor(_listCategory);
    setCurrentGroup(item);
    searchColor(searchString);
  }
  const changeCurrentColor = async (item: Color) => {
    setCurrentColor(item);

    let listHistory: Array<Color> = [...listHistoryColor];

    let color = new Color();
    color.Id = item.Id;
    color.ColorHex = item.ColorHex;
    color.Rgb = item.Rgb;
    color.ColorCode = item.ColorCode;
    color.ColorName = item.ColorName;

    let check = listHistory.find(c => c.Id == item.Id);
    if (!check) {
      listHistory.push(color);
      setListHistoryColor(listHistory);
    }
  }

  const topComponent = () => {
    return (
      <View style={paintHouseStyles.container}>
        {
          isFromHome ?
            <View style={{
              width: "100%", paddingBottom: 10, borderTopColor: "#61615E",
              borderTopWidth: 1, borderBottomColor: "#61615E", borderBottomWidth: 1,
            }}>
              <View style={[paintHouseStyles.inputSection_infor, paintHouseStyles.input, { justifyContent: "space-between" }]}>
                <Text style={{
                  color: "white", fontSize: 18,
                  fontWeight: "700",
                  alignSelf: "center",
                  paddingTop: 8,
                  paddingLeft: 10
                }}>{mauNhaLQ?.Heading}</Text>
                <TouchableOpacity style={{
                  backgroundColor: "#191919",
                  width: 120,
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 15,
                  paddingTop: 10,
                  marginTop: 10,
                  marginHorizontal: 10
                }} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={{
                    color: "#E55300", fontSize: 13,
                    fontWeight: "500", lineHeight: 18,
                    textAlign: "center",
                  }}>Chọn mẫu nhà</Text>
                </TouchableOpacity>
              </View>
            </View> : null
        }
        <View style={{ flex: 15, alignItems: "center" }}>
          <Slider
            style={{ width: "80%", height: 40 }}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#807F7F"
            value={0.5}
            onSlidingComplete={value => {
              if (value > 0.5) {
                setValueOpacity(0);
                setValueOverLay(1.5 - value);
              } else if (value < 0.5) {
                setValueOpacity(0.5 - value);
                setValueOverLay(1);
              } else {
                setValueOpacity(0);
                setValueOverLay(1);
              }
            }}
          />
          <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: "jpg", quality: 1, result: "data-uri" }}>
            <ImageBackground source={{ uri: data?.ImageUrl }} resizeMode="contain"
              style={{
                width: width, height: 300, justifyContent: "center", flexDirection: "row",
                backgroundColor: colorViewShot
              }}>
              <View style={{ flexDirection: "row" }}>
                <Svg width={width} height="300" viewBox={data?.ViewBox}
                  preserveAspectRatio="xMidYMid meet" style={{}}>
                  {
                    listGroupPath && listGroupPath.map((item, index) => [
                      item?.ListHouseModelAttribute && item?.ListHouseModelAttribute.map((value: { Path: string }, j: any) =>
                        <G key={index + j} fill={fillColor(item)} stroke="none" opacity={valueOverlay}>
                          <Path d={value.Path} />
                          <G key={index + j} fill="#000" stroke="none" opacity={valueOpacity}>
                            <Path d={value.Path} />
                          </G>
                        </G>,
                      ),
                      isShowButton == true ?
                        <Circle key={index + 3}
                          onPress={() => {
                            touchImage(index)
                          }}
                          cx={item?.Cx}
                          cy={item?.Cy}
                          r={item?.PointSize}
                          stroke="white"
                          strokeWidth="6"
                          fill={fillColor(item)}
                        /> : null
                    ])
                  }
                </Svg>
              </View>
            </ImageBackground>
            <Image source={images.logo} style={{ resizeMode: "contain", width: 40, height: 20, position: "absolute", top: 40, left: 45 }} />
          </ViewShot>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 5, paddingTop: 2 }}>
            <Text style={{ color: "red", fontStyle: "italic", fontSize: 11, paddingRight: 5 }}>*</Text>
            <Text style={{ color: "white", fontStyle: "italic", fontSize: 11, }}>Hình ảnh phối màu mang tính chất tham khảo và có thể chênh lệch so
              với thực tế do kỹ thuật hiển thị hình ảnh</Text>
          </View>
          {/*Màu theo trend*/}
          <View style={{
            padding: 10, width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
            paddingVertical: 8, borderTopWidth: 1, borderColor: "#5A5A5A", marginTop: 10
          }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>{trendName} : </Text>
            {
              listTrendColor && listTrendColor.length != 0 ?
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={listTrendColor}
                  keyExtractor={(item, index) => "quick" + index + String(item)}
                  renderItem={({ item, index }) =>
                    <View style={{ paddingHorizontal: 3, alignItems: "center", height: "100%" }}>
                      <TouchableOpacity
                        onPress={() => changeCurrentColor(item)}
                        style={{
                          backgroundColor: item?.ColorHex ?? item?.Rgb,
                          height: 30, width: 30,
                          borderRadius: 8,
                          borderColor: "white", borderWidth: 1,
                        }} >
                      </TouchableOpacity>
                      {
                        (item == currentColor) ?
                          <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                      }
                    </View>
                  }
                  style={{ marginLeft: 10 }} /> : null
            }
          </View>
          {/*Màu theo color Fan*/}
          <View style={{
            padding: 10, width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
            paddingVertical: 8, borderTopWidth: 1, borderColor: "#5A5A5A", marginTop: 10
          }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>{colorFanName} : </Text>
            {
              listColorFan && listColorFan.length != 0 ?
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={listColorFan}
                  keyExtractor={(item, index) => "quick" + index + String(item)}
                  renderItem={({ item, index }) =>
                    <View style={{ paddingHorizontal: 3, alignItems: "center", height: "100%" }}>
                      <TouchableOpacity
                        onPress={() => changeCurrentColor(item)}
                        style={{
                          backgroundColor: item?.ColorHex ?? item?.Rgb,
                          height: 30, width: 30,
                          borderRadius: 8,
                          borderColor: "white", borderWidth: 1,
                        }} >
                      </TouchableOpacity>
                      {
                        (item == currentColor) ?
                          <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                      }
                    </View>
                  }
                  style={{ marginLeft: 10 }} /> : null
            }
          </View>
          <View style={{ backgroundColor: "black", flex: 1 }}>
            <View style={{
              borderTopWidth: 1,
              borderTopColor: "#61615E",
              flexDirection: "row",
              paddingTop: 5
            }}>
              <View style={{ width: "85%" }}>
                <TextInput style=
                  {{
                    paddingTop: 5,
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
              <View style={{ flexDirection: "row", width: "15%", justifyContent: "space-between", paddingHorizontal: 10, paddingTop: 5 }}>
                <AntDesign name="search1" size={22} color="white" />
              </View>
            </View>
          </View>
          <View style={{ width: "100%", paddingTop: 10 }}>
            {groupColor && groupColor.length ?
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={groupColor}
                keyExtractor={(item, index) => "paint" + index + String(item)}
                renderItem={({ item, index }) =>
                  <View style={[{ borderTopColor: "#61615E", borderBottomColor: "#61615E", borderTopWidth: 1, borderBottomWidth: 1 },
                  item.IsActive ? { borderBottomColor: '#F14950' } : {}]}>
                    <TouchableOpacity onPress={() => changeCurrentGroup(item, index)}>
                      <View style={{ marginHorizontal: 20, }}>
                        <Text style={[{ color: "white", marginVertical: 10 },
                        item.IsActive ? { color: '#F14950', fontWeight: '500' } : {}
                        ]}>{item.CategoryName}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              /> : null
            }
          </View>
          <View style={{ width: "100%", flexDirection: "row", alignItems: "center", padding: 16, }}>
            <TableColor name={currentGroup?.CategoryName} colors={currentGroup?.listColorHex} />
            <FlatList
              style={{ height: "100%" }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={currentGroup?.ListColor}
              keyExtractor={(item, index) => "paint" + index + String(item)}
              renderItem={({ item, index }) =>
                <View style={{ alignItems: "center", height: "100%", marginTop: 24, paddingLeft: 2 }}>
                  <TouchableOpacity
                    onPress={() => {
                      changeCurrentColor(item);
                    }}
                    style={{
                      width: 30, height: 30, backgroundColor: item?.ColorHex ?? item?.Rgb, borderWidth: 1, borderColor: "white",
                      borderRadius: 8, marginHorizontal: 4, marginBottom: 12, alignItems: "center",
                    }}>
                    {
                      (item == currentColor) ?
                        <AntDesign style={{ position: "absolute", top: 24 }} name="caretdown" size={16} color={item?.ColorHex ?? item?.Rgb} /> : <View />
                    }
                  </TouchableOpacity>
                  {
                    (item == currentColor) ?
                      <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                  }
                </View>
              } />
          </View>

          {/*START : Màu Phong thủy*/}
          <View style={{
            width: "100%", paddingBottom: 10, borderTopColor: "#61615E", paddingHorizontal: 10,
            borderTopWidth: 1, borderBottomColor: "#61615E", borderBottomWidth: 1,
          }}>
            <View style={[paintHouseStyles.inputSection_infor, paintHouseStyles.input]}>
              <Text style={{
                fontSize: 16,
                paddingVertical: 6,
                marginTop: 9,
                fontWeight: "700",
                color: 'white',
                minWidth: "45%",
              }}>Màu phong thủy : </Text>
              <RNPickerSelect
                value={currentFengShui?.Id}
                style={{ inputIOS: paintHouseStyles.genderInputIOS, inputAndroid: paintHouseStyles.inputAndroid }}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "Năm", value: null }}
                onValueChange={(value) => {
                  let feng = fengShui.find(c => c.Id === value);
                  setCurrentFengShui(feng);
                }}
                items={fengShui} />
            </View>
          </View>
          {currentFengShui?.ListFateColor && currentFengShui?.ListFateColor.length ?
            <View style={{ width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 8 }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Bản mệnh : </Text>
              <FlatList
                style={{ height: "100%", }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={currentFengShui?.ListFateColor}
                keyExtractor={(item, index) => "paint" + index + String(item)}
                renderItem={({ item, index }) =>
                  <View style={{ alignItems: "center", height: "100%", marginVertical: 5, paddingLeft: 2 }}>
                    <TouchableOpacity
                      onPress={() => {
                        changeCurrentColor(item);
                      }}
                      style={{
                        width: 30, height: 30, backgroundColor: item?.ColorHex ?? item?.Rgb, borderWidth: 1, borderColor: "white",
                        borderRadius: 8, marginHorizontal: 4, marginBottom: 12, alignItems: "center",
                      }}>
                      {
                        (item == currentColor) ?
                          <AntDesign style={{ position: "absolute", top: 24 }} name="caretdown" size={16} color={item?.ColorHex ?? item?.Rgb} /> : <View />
                      }
                    </TouchableOpacity>
                    {
                      (item == currentColor) ?
                        <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                    }
                  </View>
                } />
            </View> : null
          }
          {
            currentFengShui?.ListCompatibilityColor && currentFengShui?.ListCompatibilityColor.length ?

              <View style={{ width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 8 }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Tương sinh : </Text>
                <FlatList
                  style={{ height: "100%", }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={currentFengShui?.ListCompatibilityColor}
                  keyExtractor={(item, index) => "paint" + index + String(item)}
                  renderItem={({ item, index }) =>
                    <View style={{ alignItems: "center", height: "100%", marginVertical: 5, paddingLeft: 2 }}>
                      <TouchableOpacity
                        onPress={() => {
                          changeCurrentColor(item);
                        }}
                        style={{
                          width: 30, height: 30, backgroundColor: item?.ColorHex ?? item?.Rgb, borderWidth: 1, borderColor: "white",
                          borderRadius: 8, marginHorizontal: 4, marginBottom: 12, alignItems: "center",
                        }}>
                        {
                          (item == currentColor) ?
                            <AntDesign style={{ position: "absolute", top: 24 }} name="caretdown" size={16} color={item?.ColorHex ?? item?.Rgb} /> : <View />
                        }
                      </TouchableOpacity>
                      {
                        (item == currentColor) ?
                          <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                      }
                    </View>
                  } />

              </View> : null
          }
          {/*END :Màu Phong thủy*/}

          {/*Màu ưa thích*/}
          <View style={{
            padding: 10, width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
            paddingVertical: 8, borderTopWidth: 1, borderColor: "#5A5A5A",
          }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Màu ưa thích : </Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={listQuicklyColor}
              keyExtractor={(item, index) => "quick" + index + String(item)}
              renderItem={({ item, index }) =>
                <View style={{ paddingHorizontal: 3, alignItems: "center", height: "100%" }}>
                  <TouchableOpacity
                    onPress={() => changeCurrentColor(item)}
                    style={{
                      backgroundColor: item?.ColorHex ?? item?.Rgb,
                      height: 30, width: 30,
                      borderRadius: 8,
                      borderColor: "white", borderWidth: 1,
                    }} >
                  </TouchableOpacity>
                  {
                    (item == currentColor) ?
                      <Text style={{ color: "white", bottom: 0, fontSize: 12, fontWeight: "500" }}>{item?.ColorCode}</Text> : <View />
                  }
                </View>
              }
              style={{ marginLeft: 10 }} />
          </View>
          {/*Màu đã chọn*/}
          {
            listHistoryColor && listHistoryColor.length ?
              <View style={{
                padding: 10, width: "100%", flexDirection: "row", alignItems: "center", paddingHorizontal: 10,
                paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#5A5A5A",
              }}>
                <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>Màu đã chọn : </Text>
                <FlatList
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  data={listHistoryColor}
                  keyExtractor={(item, index) => "quick" + index + String(item)}
                  renderItem={({ item, index }) =>
                    <View style={{ paddingHorizontal: 3, alignItems: "center", height: "100%" }}>
                      <TouchableOpacity
                        onPress={() => changeCurrentColor(item)}
                        style={{
                          backgroundColor: item?.ColorHex ?? item?.Rgb,
                          height: 30, width: 30,
                          borderRadius: 8, borderColor: "white", borderWidth: 1
                        }} />
                      {
                        (item == currentColor) ?
                          <Text style={{ color: "white", fontSize: 12, fontWeight: "500", lineHeight: 20 }}>{item?.ColorCode}</Text> : <View />
                      }
                    </View>
                  }
                  style={{ marginLeft: 10 }} />
              </View> : null
          }
        </View>
      </View >
    )
  }
  const footerComponent = () => {
    return (
      <View style={{ marginBottom: 88 }} />
    )

  }
  const ItemView = () => {
    return (
      <View />
    )
  }
  const onRefresh = () => {
    setRefresh(true)
  }
  return (
    <>
      {isLoading &&
        <View style={paintHouseStyles.loading}>
          <ActivityIndicator size="large" color="white" />
        </View>
      }
      <View testID="PaintHouseScreen" style={FULL}>
        <Wallpaper />
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            centerIcon={isShowButton == true ? faEye : faEyeSlash}
            centerIconStyle={TEXT}
            rightTx={"Lưu lại"}
            rightStyle={TEXT_RIGHT}
            onCenterPress={() => undo()}
            onRightPress={async () => {
              await goToHouseColorInforScreen();
            }}
            onLeftPress={() => navigation && navigation.goBack()}
          />
          <View style={{ flex: 1 }}>
            <FlatList
              refreshing={isRefresh}
              onRefresh={() => onRefresh()}
              style={{ backgroundColor: "black" }}
              ListHeaderComponent={topComponent()}
              ListFooterComponent={footerComponent()}
              data={[]}
              renderItem={ItemView}
              keyExtractor={(item, index) => "Overview" + index + item.toString()}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}>
            <View style={paintHouseStyles.centeredView} >
              <View style={paintHouseStyles.modalView}>
                <View style={{
                  justifyContent: "center",
                  marginBottom: 5,
                  width: "100%",
                  paddingHorizontal: 15,
                }}>
                  <View style={[{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 }]}>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                      <Ionicons name="md-close" size={18} color="black" />
                    </TouchableOpacity>
                    <Text style={[paintHouseStyles.modal_title]}>Mẫu nhà liên quan</Text>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={{ fontSize: 11, color: "#E55300" }}>   </Text>
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
                      listMauNhaLienQuan && listMauNhaLienQuan.length ?
                        <FlatList
                          horizontal={false}
                          data={listMauNhaLienQuan}
                          keyExtractor={(item, index) => "cus" + index + String(item.Id)}
                          renderItem={({ item, index }) =>
                            <View style={[{ borderTopColor: "#F4F5F7", borderBottomColor: "#F4F5F7", borderTopWidth: 1, borderBottomWidth: 1 }]}>
                              <TouchableOpacity onPress={() => selectedMauNhaLienQuan(item)}>
                                <View style={{ marginHorizontal: 20, }}>
                                  <Text style={[{ color: "black", marginVertical: 10 },]}>{item?.Heading}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          }
                        /> : null
                    }
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </Screen>
      </View>
    </>
  )
}

const paintHouseStyles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "black",
  },
  inputSection_infor: {
    flex: 1,
    flexDirection: 'row',
  },
  input: {
    width: "100%",
  },
  inputIOS: {
    fontSize: 13,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    marginTop: 2,
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    minWidth: "100%",
  },
  genderInputIOS: {
    fontSize: 18,
    paddingVertical: 6,
    marginTop: 9,
    fontWeight: "700",
    color: 'white',
    minWidth: "100%",
    textAlign: "left",
    backgroundColor: "black"
  },
  genderInputIOS2: {
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 26,
    marginTop: 9,
    color: '#757577',
    minWidth: "100%",
    marginHorizontal: -26,
    borderRadius: 4,
  },
  inputAndroid: {
    fontSize: 15,
    marginTop: 9,
    fontWeight: "700",
    color: 'white',
    minWidth: "100%",
    textAlign: "left"
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
  modal_title: {
    alignItems: "center",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18.75,
    textAlign: "center"
  },
})
