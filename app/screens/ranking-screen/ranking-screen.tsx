import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Platform, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
import {
  HeaderKova, Text,
} from "../../components"
import { color } from "../../theme"
import { homeStyles } from ".."
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
import RNPickerSelect from "react-native-picker-select"
import { AuthStyles } from '../../styles/Auth/'
import { StorageKey } from "../../services/storage"
import {
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native"

const FULL: ViewStyle = {
  flex: 1,
  // backgroundColor: "#E55202",
  backgroundColor: "#DC2422"
}

const _unitOfWork = new UnitOfWorkService()

export const RankingScreen = () => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [userId, setUserId] = useState<string>(null);
  const [isRefresh, setRefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [listItems, setListItems] = useState<any>(null);
  const [top, setTop] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [ky_xep_hang, setKy_xep_hang] = useState<any>(null)
  const [data_kyXepHang, setData_KyXepHang] = useState<any>([])
  const [year, setYear] = useState<any>(null)
  const [data_year, setData_year] = useState<any>([])
  const [listKyTinhDiem, setListKyTinhDiem] = useState([]);

  const images = {
    background1: require("../../images/background3.png"),
    background2: require("../../images/ranking_light.png"),
    ranking: require("../../images/icons/ranking.png"),
    mark: require("../../images/icons/shutterstock.png"),
    vetSon: require("../../images/icons/vetson.png"),
    gold: require("../../images/icons/gold.png"),
    sivler: require("../../images/icons/sivler.png"),
    copper: require("../../images/icons/copper.png"),
  }
  useEffect(() => {
    setData_KyXepHang([]);
    setYear(null);
    setData_year([])
    setKy_xep_hang(null)
    getRankFollowArea(null).catch(err => {
      setLoading(false);
      goBack();
    });;
  }, [isFocused]);

  useEffect(() => {
    getRankFollowArea(null).catch(err => {
      setLoading(false);
      goBack();
    });;
  }, [isRefresh]);

  useEffect(() => {
    if(ky_xep_hang != null  || year == null && ky_xep_hang == null){
      getRankFollowArea(null)
    }
  }, [ky_xep_hang]);

  const getRankFollowArea = async function (workerPlaceId: string) {
    setRefresh(false);
    if (!isRefresh) {
      let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
      setUserId(userId);
      setLoading(true);
      const response = await _unitOfWork.user.ranking({
        "Type": 'ALL',
        "TuNgay": ky_xep_hang?.NgayBatDau ,
        "DenNgay": ky_xep_hang?.NgayKetThuc,
        "WorkerPlaceId": workerPlaceId,
        "WorkerId": userId
      });
      setLoading(false);
      if (response.StatusCode == 200) {
        if(response?.ListKyTinhDiem?.length > 0){
          setListKyTinhDiem(response?.ListKyTinhDiem)
          let data_listKyTinhDiem = response?.ListKyTinhDiem
          let arrYear = []
          data_listKyTinhDiem.map(item => {
            arrYear.push(item?.NamApDung)
          })
          arrYear = [...new Set(arrYear)]
          let _data_year = []
          arrYear.map( item => {
            _data_year.push({
              label: "Năm " + item,
              value: item
            })
          })
          setData_year(_data_year)
        }

        if (response.ListWorker.length && response.ListWorker.length >= 3) {
          response.ListWorker.forEach(item => {
            item.AvartarUrl = _unitOfWork.user.fixAvatar(item.AvartarUrl);
            item.RankImageUrl = _unitOfWork.user.fixAvatar(item.RankImageUrl);
          });
          const arr1 = response.ListWorker.slice(0, 3);

          setTop(arr1);
          setListItems(response.ListWorker);
          response.Worker.AvartarUrl = _unitOfWork.user.fixAvatar(response.Worker.AvartarUrl);
          response.Worker.RankImageUrl = _unitOfWork.user.fixAvatar(response.Worker.RankImageUrl);
          setWorker(response.Worker);
        } else {
          response.ListWorker.forEach(item => {
            item.AvartarUrl = _unitOfWork.user.fixAvatar(item.AvartarUrl);
            item.RankImageUrl = _unitOfWork.user.fixAvatar(item.RankImageUrl);
          });
          setTop(response.ListWorker)
          setListItems(response.ListWorker)

          response.Worker.AvartarUrl = _unitOfWork.user.fixAvatar(response.Worker.AvartarUrl);
          response.Worker.RankImageUrl = _unitOfWork.user.fixAvatar(response.Worker.RankImageUrl);

          setWorker(response.Worker);
        }
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

  const topComponent = () => { 
    return (
      <View style={{marginBottom: 45}}>
        <View>
          <HeaderKova />
          <Image style={[homeStyles.w_100, { height: 320 }]} source={images.background2} />
        </View>{
          Platform.OS === "ios" ?
            <>
              {/*IOS*/}
              <View style={rankingStyles.top}>
                <View style={{ width: "100%", alignItems: "center" }} >
                  <Image style={{ width: 158, height: 26 }} source={images.ranking} />
                  <View style={rankingStyles.address_time}>
                    <View style={[rankingStyles.inputSection, AuthStyles.input, { marginTop: 16 }]}>
                        <RNPickerSelect
                          style={{inputIOS: rankingStyles.selectedInputIOS, inputAndroid: rankingStyles.selectedInputAndroid }}
                          useNativeAndroidPickerStyle={false}
                          value={year}
                          placeholder={{ label: "Năm", value: null }}
                          onValueChange={(value) => {
                            setYear(value)
                            let _data_Ky = []
                            listKyTinhDiem.map(item => {
                              if(item?.NamApDung == value){
                                _data_Ky.push({
                                  label: item?.TenKy,
                                  value: {
                                    NgayBatDau: item?.NgayBatDau,
                                    NgayKetThuc: item?.NgayKetThuc
                                  }
                                })
                              }
                            })
                            setData_KyXepHang(_data_Ky)
                          }}
                          items={data_year} />
                          {
                            Platform.OS === "ios" ?
                            <Entypo name="chevron-down" size={18} color="#E5E5E5" style={{ position: "absolute", right: 4 }} /> :
                            null
                          }
                      </View>   
                      <View style={[rankingStyles.inputSection, AuthStyles.input, { marginTop: 16 }]}>
                        <RNPickerSelect
                          style={{inputIOS: rankingStyles.selectedInputIOS,  inputAndroid: rankingStyles.selectedInputAndroid }}
                          useNativeAndroidPickerStyle={false}
                          value={ky_xep_hang}
                          placeholder={{ label: "Kỳ xếp hạng", value: null }}
                          onValueChange={(value) => {
                            setKy_xep_hang(value)
                          }}
                          items={data_kyXepHang} />
                          {
                           Platform.OS === "ios" ?
                             <Entypo name="chevron-down" size={18} color="#E5E5E5" style={{ position: "absolute", right: 4 }} /> :
                             null
                          }
                      </View>
                    </View>     
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 15, height: 130 }}>
                  {/*Top 2*/}
                  <View style={{ top: 30, alignItems: "center" }}>
                    <Image source={images.sivler} style={{ height: 74, width: 74 }} />
                    <Image style={{
                      position: "absolute", width: 46, height: 46,
                      borderRadius: 46 / 2, backgroundColor: "gray", borderWidth: 1,
                      borderColor: "white", top: 14, left: 28
                    }}
                      source={{ uri: (top?.length >= 2 ? top[1]?.AvartarUrl : null), }} />
                    <View>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{
                          color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13,
                          position: "absolute", left: 11, top: 8,
                        }}>2</Text>
                      </View>
                      <View style={{ backgroundColor: "#9DE1E7", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 2 ? top[1]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, width: 100, textAlign: "center" }}>{(top?.length >= 1 ? top[1]?.FullName : "")}</Text>
                    {
                      (top?.length >= 1 && top[1]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[1]?.WorkPlace ? top[1]?.WorkPlace : "")}`}</Text> :
                        <View />
                    }
                  </View>
                  {/*Top 1*/}
                  <View style={{
                    position: "absolute", top: -2, left: 0, right: 0, justifyContent: "center", alignItems: "center",
                  }}>
                    <Image source={images.gold} />
                    <Image style={{ position: "absolute", width: 65, height: 65, borderRadius: 65 / 2, backgroundColor: "gray", top: 23, borderWidth: 1, borderColor: "white" }}
                      source={{ uri: (top?.length >= 1 ? top[0]?.AvartarUrl : null), }} />
                    <View style={{ position: "absolute", bottom: 35 }}>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{ color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13, position: "absolute", left: 11, top: 8, }}>1</Text>
                      </View>
                      <View style={{ backgroundColor: "#FCEC00", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 1 ? top[0]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, }}>{(top?.length >= 1 ? top[0]?.FullName : "")}</Text>
                    {
                      (top?.length >= 1 && top[0]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[0]?.WorkPlace ? top[0]?.WorkPlace : "")}`}</Text> :
                        <View />
                    }
                  </View>
                  {/*Top 3*/}
                  <View style={{ top: 30, alignItems: "center" }}>
                    <Image source={images.copper} style={{ height: 74, width: 74 }} />
                    <Image style={{
                      position: "absolute", width: 46, height: 46,
                      borderRadius: 46 / 2, backgroundColor: "gray", borderWidth: 1,
                      borderColor: "white", top: 13.5, left: 28
                    }}
                      source={{ uri: (top?.length >= 3 ? top[2]?.AvartarUrl : null), }} />
                    <View>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{ color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13, position: "absolute", left: 11, top: 8, }}>3</Text>
                      </View>
                      <View style={{ backgroundColor: "#F499D2", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 3 ? top[2]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, width: 100, textAlign: "center" }}>{(top?.length >= 1 ? top[2]?.FullName : "")}</Text>
                    {
                      (top?.length >= 2 && top[2]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[2]?.WorkPlace ? top[2]?.WorkPlace : "")}`}</Text> :
                        null
                    }
                  </View>
                </View>
              </View>
            </> :
            <>
              {/*Android*/}
              <View style={rankingStyles.top}>
                <View style={{ width: "100%", alignItems: "center", marginBottom: 10 }} >
                  <Image style={{ width: 120, height: 18 }} source={images.ranking} />
                    <View style={rankingStyles.address_time}>
                    <View style={[rankingStyles.inputSection, AuthStyles.input, { marginTop: 16 }]}>
                        <RNPickerSelect
                          style={{ inputAndroid: rankingStyles.selectedInputAndroid }}
                          useNativeAndroidPickerStyle={false}
                          value={year}
                          placeholder={{ label: "Năm", value: null }}
                          onValueChange={(value) => {
                            setYear(value)
                            let _data_Ky = []
                            listKyTinhDiem.map(item => {
                              if(item?.NamApDung == value){
                                _data_Ky.push({
                                  label: item?.TenKy,
                                  value: {
                                    NgayBatDau: item?.NgayBatDau,
                                    NgayKetThuc: item?.NgayKetThuc
                                  }
                                })
                              }
                            })
                            setData_KyXepHang(_data_Ky)
                          }}
                          items={data_year} />
                      </View>   
                      <View style={[rankingStyles.inputSection, AuthStyles.input, { marginTop: 16 }]}>
                        <RNPickerSelect
                          style={{ inputAndroid: rankingStyles.selectedInputAndroid }}
                          useNativeAndroidPickerStyle={false}
                          value={ky_xep_hang}
                          placeholder={{ label: "Kỳ xếp hạng", value: null }}
                          onValueChange={(value) => {
                            setKy_xep_hang(value)
                          }}
                          items={data_kyXepHang} />
                      </View>
                    </View>   
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10, height: 130 }}>
                  {/*Top 2*/}
                  <View style={{ top: 30, alignItems: "center" }}>
                    <Image source={images.sivler} style={{ height: 74, width: 74 }} />
                    <Image style={{
                      position: "absolute", width: 46, height: 46,
                      borderRadius: 46 / 2, backgroundColor: "gray", borderWidth: 1,
                      borderColor: "white", top: 14, left: 28
                    }}
                      source={{ uri: (top?.length >= 2 ? top[1]?.AvartarUrl : null), }} />
                    <View>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{ color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13, position: "absolute", left: 11, top: 8, }}>2</Text>
                      </View>
                      <View style={{ backgroundColor: "#9DE1E7", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 2 ? top[1]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, width: 100, textAlign: "center" }}>{(top?.length >= 1 ? top[1]?.FullName : "")}</Text>
                    {
                      (top?.length >= 1 && top[1]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[1]?.WorkPlace ? top[1]?.WorkPlace : "")}`}</Text> :
                        <View />
                    }
                  </View>
                  {/*Top 1*/}
                  <View style={{
                    position: "absolute", top: -2, left: 0, right: 0, justifyContent: "center", alignItems: "center",
                  }}>
                    <Image source={images.gold} />
                    <Image style={{ position: "absolute", width: 65, height: 65, borderRadius: 65 / 2, backgroundColor: "gray", top: 23, borderWidth: 1, borderColor: "white" }}
                      source={{ uri: (top?.length >= 1 ? top[0]?.AvartarUrl : null), }} />
                    <View style={{ position: "absolute", bottom: 35 }}>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{ color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13, position: "absolute", left: 11, top: 8, }}>1</Text>
                      </View>
                      <View style={{ backgroundColor: "#FCEC00", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 1 ? top[0]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, }}>{(top?.length >= 1 ? top[0]?.FullName : "")}</Text>
                    {
                      (top?.length >= 1 && top[0]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[0]?.WorkPlace ? top[0]?.WorkPlace : "")}`}</Text> :
                        <View />
                    }
                  </View>
                  {/*Top 3*/}
                  <View style={{ top: 30, alignItems: "center" }}>
                    <Image source={images.copper} style={{ height: 74, width: 74 }} />
                    <Image style={{
                      position: "absolute", width: 46, height: 46,
                      borderRadius: 46 / 2, backgroundColor: "gray", borderWidth: 1,
                      borderColor: "white", top: 13.5, left: 28
                    }}
                      source={{ uri: (top?.length >= 3 ? top[2]?.AvartarUrl : null), }} />
                    <View>
                      <View style={{ position: "absolute", zIndex: 2, top: -4, left: -8 }}>
                        <MaterialCommunityIcons name="rhombus" size={28} color="white" />
                        <Text style={{ color: "#000000", fontSize: 11, fontWeight: "bold", lineHeight: 13, position: "absolute", left: 11, top: 8, }}>3</Text>
                      </View>
                      <View style={{ backgroundColor: "#F499D2", borderRadius: 12, alignItems: "center", paddingRight: 12, paddingLeft: 24, paddingVertical: 4, }}>
                        <Text numberOfLines={1} style={{ color: "#000000", fontSize: 10, fontWeight: "bold", lineHeight: 12, }}>{(top?.length >= 3 ? top[2]?.CurrentPoints : 0)}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "bold", lineHeight: 17, marginBottom: 1, width: 100, textAlign: "center" }}>{(top?.length >= 1 ? top[2]?.FullName : "")}</Text>
                    {
                      (top?.length >= 2 && top[2]?.WorkPlace) ?
                        <Text style={{ fontSize: 8, lineHeight: 12, color: "#FEF799", }}>{`Chi nhánh ${(top?.length >= 1 && top[2]?.WorkPlace ? top[2]?.WorkPlace : "")}`}</Text> :
                        <View />
                    }
                  </View>
                </View>
              </View>
            </>
        }

      </View>
    )
  }
  const footerComponent = () => {
    return (
      <View style={{ marginBottom: 140 }} />
    )
  }

  const format = (num) => {
    if (num) {
      return ('' + num).replace(
        /(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g,
        function (m, s1, s2) {
          return s2 || (s1 + ',');
        }
      );
    }
    return 0
  }


  const ItemView = ({ item, index }) => {
    return (
      <View style={rankingStyles.item}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingRight: 8, paddingLeft: 16, justifyContent: "space-between", }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: color.black, fontSize: 14, fontWeight: "bold", lineHeight: 17, marginRight: 8, }}>{index + 1}</Text>
            <View style={{ width: 38, height: 38, borderRadius: 38 / 2, marginRight: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Image style={{ width: 40, height: 40, borderRadius: 40 / 2, position: 'absolute' }}
                source={{ uri: item?.RankImageUrl, }} />
              <Image style={{ width: 26, height: 26, borderRadius: 26 / 2, backgroundColor: "gray", }}
                source={{ uri: item?.AvartarUrl, }} />
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text style={[{ color: color.black, fontSize: 14, fontWeight: "bold", lineHeight: 17, flexWrap: "wrap", maxWidth: 145 }, (item.WorkPlace ? { marginBottom: 2 } : {}),]}>{item?.FullName}</Text>
              {
                item.WorkPlace ?
                  <Text style={{ color: "#6697E5", fontSize: 10, fontWeight: "500", lineHeight: 12, }}>{`Chi nhánh ` + (item.WorkPlace ? item.WorkPlace : "")}</Text> :
                  <View />
              }
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", lineHeight: 17, color: "#000000", }}>{(format(item?.CurrentPoints)) + ` `}</Text>
            <Text style={{ fontSize: 14, lineHeight: 17, color: "#000000" }}>điểm</Text>
          </View>
        </View>
      </View>
    )
  }

  const onRefresh = () => {
    setRefresh(true)
  }

  return (
    <>
      {isLoading &&
        <View style={homeStyles.loading}>
          <ActivityIndicator size="large" color="white" />
        </View>
      }
      <View testID="RankingScreen" style={[FULL, {}]}>
        <Image style={[homeStyles.w_100, homeStyles.position_absolute]} source={images.background1} />
        <FlatList
          refreshing={isRefresh}
          onRefresh={() => onRefresh()}
          ListHeaderComponent={topComponent()}
          ListFooterComponent={footerComponent()}
          renderItem={ItemView}
          data={listItems}
          keyExtractor={(item, index) => "ranking" + index + String(item)}

        />
        <View style={[Platform.OS === "ios" ? rankingStyles.poitionWorker : rankingStyles.poitionWorkerAndroid, {

        }]}>
          <Image style={[{ position: "absolute" }, { width: Dimensions.get("window").width - 12 }]}
                 resizeMode="contain"
                 source={images.vetSon} />
          <TouchableOpacity style={{ flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10 }} onPress={() => {
            navigation.navigate("WorkerScreen", {
              params: { id: userId },
            })
          }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: color.white, fontSize: 14, fontWeight: "bold", lineHeight: 17, marginLeft: 25, marginRight: 16, }}>{worker?.Index}</Text>{
                Platform.OS === "ios" ?
                  <View style={{ width: 38, height: 38, borderRadius: 38 / 2, marginRight: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 36, height: 36, borderRadius: 36 / 2, position: 'absolute' }}
                      source={{ uri: worker?.RankImageUrl, }} />
                    <Image style={{
                      position: "absolute", width: 22, height: 22, borderRadius: 22 / 2,
                      backgroundColor: "gray", left: 8, top: 8
                    }}
                      source={{ uri: worker?.AvartarUrl, }} />
                  </View> :
                  <View style={{ width: 38, height: 38, borderRadius: 38 / 2, marginRight: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 36, height: 36, borderRadius: 36 / 2, position: 'absolute' }}
                      source={{ uri: worker?.RankImageUrl, }} />
                    <Image style={{
                      position: "absolute", width: 22, height: 22, borderRadius: 22 / 2,
                      backgroundColor: "gray", left: 9, top: 8
                    }}
                      source={{ uri: worker?.AvartarUrl, }} />
                  </View>
              }
              <View style={{ justifyContent: "center" }}>
                <Text style={[{ color: color.white, fontSize: 14, fontWeight: "bold", lineHeight: 17, flexWrap: "wrap", maxWidth: 145 }, (worker?.WorkPlace ? { marginBottom: 2 } : {}),]}>{worker?.FullName}</Text>
                {
                  worker?.WorkPlace ?
                    <Text style={{ color: "#6697E5", fontSize: 10, fontWeight: "500", lineHeight: 12, }}>{`Chi nhánh ` + (worker?.WorkPlace ? worker.WorkPlace : "")}</Text> :
                    <View />
                }
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 50 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", lineHeight: 17, color: "#FFFFFF", }}>{format(worker?.CurrentPoints) + ` `}</Text>
              <Text style={{ fontSize: 14, lineHeight: 17, color: "#FFFFFF" }}>điểm</Text>
              <Entypo name="chevron-right" size={24} color="#C4C4C4" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export const rankingStyles = StyleSheet.create({
  top: {
    flex: 1,
    position: "absolute",
    top: 60,
    width: "100%",
  },
  item: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedInputIOS: {
    fontSize: 12,
    fontWeight: "400",
    paddingVertical: 11,
    paddingHorizontal: 10,
    color: '#757577',
    minWidth: "100%",
    // marginHorizontal: -26,
    borderRadius: 4,
    textAlign: "center"
  },
  selectedInputAndroid: {
    fontSize: 12,
    fontWeight: "400",
    borderWidth: 0,
    borderRadius: 4,
    lineHeight: 20,
    color: '#757577',
    alignItems: 'center',
    paddingRight: 35,
    marginLeft: 20,
  },
  inputSection: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 24,
    maxHeight: 36,
    borderRadius: 20,
    minWidth: 80,
    maxWidth: 120,
  },
  inputSection_top: {
    flex: 1,
    alignSelf: "center",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: "#C4C4C4",
    minHeight: 35,
    maxHeight: 50,
    borderRadius: 20,
    minWidth: 100,
    maxWidth: 150,
  },
  
  poitionWorker: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 80,
    left: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    width: "90%",
  },
  poitionWorkerAndroid: {
    flex: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 46,
    left: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    width: "100%",
  },
  address_time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%'
  },
})
