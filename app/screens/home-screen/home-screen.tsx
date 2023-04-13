import React, { useState, useEffect, useRef } from "react"
import {
  View,
  ViewStyle,
  // TextStyle,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet, Alert, ActivityIndicator, Dimensions, Platform, Linking,
} from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import {
  HeaderKova,
} from "../../components"
import {
  color,
  // spacing, typography
} from "../../theme"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
// import { useIsFocused } from "@react-navigation/native"
import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
  Entypo
} from "@expo/vector-icons"
import { StorageKey } from "../../services/storage"
import Carousel from 'react-native-banner-carousel';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

class Advertisement {
  Id: string;
  PromotionName: string;
  Description: string;
  ImageUrl: string;
  ShortDescription: string;
}

class ModelHouse {
  Title: string;
  ImageUrl: any;
  Color: string;
  Icon: string;
  Index: number;
}

const FULL: ViewStyle = {
  flex: 1,
}

const images = {
  background1: require("../../images/background1.png"),
  background2: require("../../images/background2.png"),
  logo: require("../../images/icons/KOVA.png"),
  bell: require("../../images/icons/group1.png"),
  settings: require("../../images/icons/group2.png"),
  avatar: require("../../images/avatar.png"),
  subtract: require("../../images/icons/subtract.png"),
  rectangle: require("../../images/icons/rectangle.png"),
  rank: require("../../images/icons/vector1.png"),
  ads: require("../../images/ads.png"),
  author: require("../../images/icons/group3.png"),
  like: require("../../images/icons/group4.png"),
  room: require("../../images/room.png"),
  company: require("../../images/company_house.jpg"),
  house: require("../../images/house.jpg"),
  loading_gif: require("../../images/gif/id-loading-5.gif"),
}

const _unitOfWork = new UnitOfWorkService();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const HomeScreen = () => {
  const navigation = useNavigation()
  // const isFocused = useIsFocused()
  const [isLoading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [isLoadingAdver, setLoadingAdver] = useState(false)
  const [userId, setUserId] = useState<string>(null);
  const [worker, setWorker] = useState<any>({
    Id: '',
    FullName: '',
    Phone: '',
    CurrentPoints: 0,
    WorkPlace: '',
    Rank: '',
    CreatedDate: null,
    UsedPoint: 0,
    NotUsedPoint: 0,
    StartRankPoint: 0,
    EndRankPoint: 0,
    RankPoint: 0,
    Index: 0,
    CustomerNumber: 0
  });

  const [listItems,] = useState<Array<ModelHouse>>([
    {
      Title: "Mẫu nhà điển hình",
      ImageUrl: images.company,
      Color: "#FF4040",
      Icon: "building-o",
      Index: 0
    },
    {
      Title: "Phương án ưa thích",
      ImageUrl: images.house,
      Color: "#6697E5",
      Icon: "user",
      Index: 1
    }
  ]);

  const [listBanner, setListBanner] = useState<Array<Advertisement>>([]);
  const BannerWidth = Dimensions.get('window').width * 0.92;
  const BannerHeight = 180;
  const [, setExpoPushToken] = useState('');
  const [, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    // This listener is fired whenever a notification is received while the app is foregrounded
    // @ts-ignore
    notificationListener.current = Notifications.addNotificationReceivedListener(async notification => {
      // console.log(notification)
      // @ts-ignore
      setNotification(notification);
      let num: any = await _unitOfWork.storage.getItem(StorageKey.NUMBERNOTI);
      let numVar: number = parseInt(num) + 1;
      await _unitOfWork.storage.setItem(StorageKey.NUMBERNOTI, numVar);
      await _unitOfWork.storage.setItem(StorageKey.ISNEWNOTIFICATION, true);
    })

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // @ts-ignore
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content?.data?.link) {
        Linking.openURL(`${response.notification.request.content?.data?.link}`)
      }
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [isFocused]);


  useEffect(() => {
    if (isFocused == true) {
      fetchUserInfo().catch(errr => {
        setLoading(false);
        goBack();
      });
    }
  }, [isFocused]);

  useEffect(() => {
    fetchAdertisementData();
  }, [isFocused]);


  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      createExpoToken(token);
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }

  const createExpoToken = async (token) => {
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
    if (userId) {
      await _unitOfWork.notification.createExpoToken({ "UserId": userId, "ExpoToken": token });
    }
  }

  const fetchUserInfo = async () => {
    setLoading(true);
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID);
    setUserId(userId);
    // SetupNotification();
    const response = await _unitOfWork.user.getDataWorkerDetailById({ "WorkerId": userId });
    setLoading(false);
    if (response.StatusCode != 200) {
      Alert.alert("Thông báo", response.Message);
    } else {
      response.Worker.AvartarUrl = _unitOfWork.user.fixAvatar(response.Worker.AvartarUrl);
      response.Worker.RankImageUrl = _unitOfWork.user.fixAvatar(response.Worker.RankImageUrl);

      setWorker(response.Worker);
    }
  }

  const fetchAdertisementData = async () => {
    setLoadingAdver(true);
    const response = await _unitOfWork.user.getAllPromotionAdertisement({});
    setLoadingAdver(false);
    if (response.StatusCode != 200) {
      Alert.alert("Thông báo", response.Message);
    } else {
      setListBanner(response.ListAdertisement);
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

  const goToHouseColorInforScreen = async (image, index) => {
    let userId = await _unitOfWork.storage.getItem(StorageKey.USERID)
    if (userId) {
      navigation && navigation.navigate("PromotionDetailScreen", { imageUrl: image.ImageUrl, promotion: listBanner[index] })
    }
  }
  const renderPage = ({ image, index }) => {
    return (
      <View key={index} >
        <TouchableOpacity onPress={async () => { goToHouseColorInforScreen(image, index) }}>
          <Image style={{ width: BannerWidth, height: BannerHeight }} source={{ uri: image.ImageUrl }} />
          <Text style={{ fontSize: 16, fontWeight: "700", lineHeight: 16, paddingTop: 10 }}>{image.PromotionName}</Text>
          <Text style={{ color: "#8B8B8B", fontSize: 11, fontWeight: "400", lineHeight: 13, paddingTop: 2 }}>{image.ShortDescription}</Text>
        </TouchableOpacity>
      </View>
    );
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

  const topComponent = () => {
    return (
      <View>
        <View>
          {/*background*/}

          <View>
            <Image style={[homeStyles.w_100, homeStyles.position_absolute]} source={images.background1} />
            <Image style={homeStyles.w_100} source={images.background2} />
          </View>
          {/*header top: logo, bell & setting*/}
          <HeaderKova />
          {/*user: avatar, name*/}
          <View style={homeStyles.header_center}>
            <TouchableOpacity onPress={() => {
              navigation.navigate("WorkerScreen", {
                params: { id: userId },
              })
            }}>
              <Image style={{ width: 75, height: 75, marginBottom: 6, }} source={{ uri: worker?.RankImageUrl }} />
              <Image style={[homeStyles.header_center_avatar, {}]} source={{ uri: worker?.AvartarUrl }} />
            </TouchableOpacity>
            <Text style={homeStyles.header_center_name}>{worker?.FullName}</Text>
          </View>
          <View style={homeStyles.header_bottom}>
            {/**/}
            <Image style={homeStyles.header_bottom_background} source={images.subtract} />
            {/**/}
            <View style={[homeStyles.header_bottom_icons]}>
              <MaterialCommunityIcons
                style={homeStyles.header_bottom_rhombus}
                name="rhombus"
                size={72}
                color="white" />
              <FontAwesome5 style={homeStyles.header_bottom_icon} name="gem" size={28} color="#DD9202" />
              {/*<Image style={homeStyles.header_bottom_icon} source={images.rank}/>*/}
            </View>
            {/**/}
            <View style={{ bottom: 25, left: 20, flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity>
                <Entypo name="chevron-left" size={24} color="#A8C8F8" />
              </TouchableOpacity>
              <View style={{ alignItems: "center", justifyContent: "center", height: 24, width: "50%" }}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: "white", fontSize: 14, lineHeight: 17, fontWeight: "700", marginBottom: 1 }}>
                    {worker?.CurrentPoints ? format(worker?.CurrentPoints) : '0'}
                  </Text>
                  <Text style={{ color: "white", fontSize: 14, lineHeight: 17 }}> điểm</Text>
                </View>
                <Text style={{ color: "#FFE296", fontSize: 9, lineHeight: 11 }}>{worker?.CustomerNumber} khách hàng</Text>
              </View>
            </View>
            {/**/}
            <View style={{ bottom: 25, left: 20, flexDirection: "row", alignItems: "center" }}>
              <View style={{ alignItems: "center", justifyContent: "center", height: 24, width: "50%" }}>
                <View style={{ flexDirection: "row", marginBottom: 1 }}>
                  <Text style={{ color: "white", fontSize: 14, lineHeight: 17 }}>Xếp hạng #</Text>
                  <Text style={{ color: "white", fontSize: 14, lineHeight: 17, fontWeight: "700" }}>{worker?.Index}</Text>
                </View>
                <Text style={{ color: "#FFE296", fontSize: 9, lineHeight: 11 }}>{worker?.WorkPlace}</Text>
              </View>
              <TouchableOpacity>
                <Entypo name="chevron-right" size={24} color="#A8C8F8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={homeStyles.ads_container}>
          {
            isLoadingAdver == false ?
              <Carousel
                autoplay
                autoplayTimeout={5000}
                loop
                index={0}
                pageSize={BannerWidth}
                showsPageIndicator={false}
              >
                {listBanner.map((image, index) => renderPage({ image, index }))}
              </Carousel> :
              <View>
                <Image style={{ width: BannerWidth, height: BannerHeight }} source={images.loading_gif} />
              </View>
          }
        </View>
      </View>
    )
  }
  const footerComponent = () => {
    return (
      <View style={{ marginBottom: 80 }} />
    )
  }
  const ItemView = ({ item, index }) => {
    return (
      <View style={[homeStyles.item]}>
        <View>
          <TouchableOpacity onPress={() => {
            navigation.navigate("ListHouseScreen", {
              params: { Index: item.Index },
            })
          }}>
            <Image style={homeStyles.item_image} source={item?.ImageUrl} />
          </TouchableOpacity>
        </View>
        <View style={homeStyles.bottom_box}>
          <View style={{ flexDirection: "row", width: BannerWidth / 3 - 10, marginLeft: 10 }}>
            <View style={{ height: 34, width: 34, borderRadius: 17, backgroundColor: item?.Color, justifyContent: "center", alignItems: "center" }}>
              <FontAwesome name={item?.Icon} size={20} color="white" />
            </View>
            <Text style={homeStyles.item_title}>{item?.Title}</Text>
          </View>
        </View>
      </View>
    )
  }


  return (
    <>
      {isLoading &&
        <View style={homeStyles.loading}>
          <ActivityIndicator size="large" color="#125fa1" />
        </View>
      }
      <View style={FULL}>
        {/*<Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>*/}
        <FlatList
          style={homeStyles.backgroundColorWhite}
          ListHeaderComponent={topComponent()}
          ListFooterComponent={footerComponent()}
          data={listItems}
          keyExtractor={(item, index) => "home" + index + String(item)}
          renderItem={ItemView}
          columnWrapperStyle={homeStyles.flatListColumnWrapperStyle}
          horizontal={false}
          numColumns={2}
        />{
          // (Platform.OS == "ios" || Platform.OS == "macos") ? <></> :
          //   <BottomTab screen={"home"} />
        }
        {/*</Screen>*/}
      </View>
    </>
  )
}

export const homeStyles = StyleSheet.create({
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
  flatListColumnWrapperStyle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    alignItems: "flex-start",
  },
  backgroundColorWhite: {
    backgroundColor: color.white,
  },
  w_100: {
    width: "100%",
  },
  h_100: {
    height: "100%",
  },
  position_absolute: {
    position: "absolute",
  },
  header_top: {
    position: "absolute",
    top: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    zIndex: 2,
  },
  header_center: {
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    top: 50,
    zIndex: 1,
    marginTop: 8,
    // backgroundColor: "yellow",
  },
  header_center_avatar: {
    backgroundColor: "gray",
    width: 48, height: 48,
    borderRadius: 48 / 2,
    position: "absolute",
    top: 14, left: 14.5
  },
  header_center_name: {
    color: color.white,
    fontSize: 14, fontWeight: "700", lineHeight: 16.94,
  },
  header_bottom: {
    position: "absolute", bottom: 16,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  header_bottom_background: {
    width: "100%", height: 66, position: "absolute",
    bottom: 0,
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
  ads_container: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: - 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  ads_image: {
    width: "100%", borderRadius: 8, marginBottom: 8,
    height: 175,
    backgroundColor: "gray",
  },
  ads_title: {
    color: color.black, fontSize: 13, lineHeight: 15, fontWeight: "700", marginBottom: 4,
  },
  ads_description: {
    color: "#8B8B8B", fontSize: 11, lineHeight: 13,
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
    height: 224,
    borderRadius: 8,
    backgroundColor: "gray",
    marginBottom: 8,
    resizeMode: "cover",
  },
  item_title: {
    color: color.black,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
    marginBottom: 4,
    paddingLeft: 15
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
  bottom_box: {
    borderTopLeftRadius: 25,
    position: "absolute",
    marginLeft: 8,
    bottom: 0,
    backgroundColor: "white",
    width: "100%",
    height: 60,
    opacity: .7,
    justifyContent: "center"
  }
})
