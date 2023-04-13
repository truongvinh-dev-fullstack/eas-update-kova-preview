import React, { useState, useEffect } from "react"
import { View, ImageBackground, Dimensions, ViewStyle, TextStyle, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEnvelopeSquare, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { UnitOfWorkService } from '../../services/api/unitOfWork-service';
import { styles } from '../../styles/'
import {Helper} from "../../utils/helper";

const _unitOfWork = new UnitOfWorkService();
const width = Helper.windowWidth;
const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const TEXT: TextStyle = {
  color: '#A23232',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
  paddingLeft: spacing[6],
  paddingRight: spacing[6],
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 16,
  lineHeight: 30,
  textAlign: "left",
  letterSpacing: 1.5,
  color: "rgba(0, 0, 0, 1)"
}
const categoryItemMobileStyle = { 
  width: (width - 36) / 2, 
  height: (width - 36) / 2, 
  backgroundColor: '#EDEAE6', 
  borderRadius: 10, 
  marginRight: 12, 
  marginTop: 12 
}
const categoryItemTabletStyle = { 
  width: "100%", 
  minHeight: 200,
  backgroundColor: '#EDEAE6', 
  borderRadius: 10, 
  marginRight: 12, 
  marginTop: 12 
}
const SafeAreaViewMobileStyle = { 
  flex: 1
}
const SafeAreaViewTabletStyle = { 
  flex: 1,
  minWidth: 200,
  maxWidth: 300,
  height: "auto",
  
}
const newListMobileStyle: ViewStyle = {
  display: "none",
}
const newListTabletStyle: ViewStyle = {
  flex: 1,
  padding: 20,
}

const newListStyle = Helper.isTablet() ? newListTabletStyle : newListMobileStyle;
const categoryItemStyle = Helper.isTablet() ? categoryItemTabletStyle : categoryItemMobileStyle;
const SafeAreaViewStyle = Helper.isTablet() ? SafeAreaViewTabletStyle : SafeAreaViewMobileStyle;


export const NewsCategoryScreen = observer(function NewsCategoryScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [lstPostDetail, setLstPostDetail] = useState([]);
  const column = (Helper.isTablet() ? 1 : 2);
  const images = {
    news_icon: require('../../images/news.png'),
    help_icon: require('../../images/help.png'),
    event_icon: require('../../images/event.png'),
    info_icon: require('../../images/info.png'),
  }
  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchCategories = async () => {
    let res = await _unitOfWork.post.getMasterDataPostOfMobile({});
    if (res && res.data.StatusCode === 200) {
      let posts = res.data.ListCategoryPost;
      posts.forEach(element => {
        if(lstPostDetail.length == 0 && element.lstPostDetail.length > 0){
          setLstPostDetail(element.lstPostDetail);
        }
      });
      setCategories(posts);
    }
  }
  const goToNewList = (item) => {
    console.log(Helper.isTablet());
    if(Helper.isTablet()){
      setLstPostDetail(item.lstPostDetail);
    }else{
      navigation && navigation.navigate('NewsListScreen', { list: item.lstPostDetail });
    }
  }
  const goToNewDetail = (item) => {
    navigation && navigation.navigate('NewsDetailScreen', { detail: item })
  }
  const _renderItem = ({ item, index }) => (
    <TouchableOpacity style={categoryItemStyle} onPress={() => goToNewList(item)}>
      <View>
        <Image
          style={AuthStyles.news_cate_icon}
          source={item.icon}
        />
        <Text style={{ color: '#697077', fontSize: 14, fontWeight: 'bold', alignSelf: 'center', marginTop: 110, textTransform: 'uppercase' }}>{item.Name}</Text>
      </View>
    </TouchableOpacity>
  );

  const _renderNewsItem = ({ item }) => {
    return <TouchableOpacity style={AuthStyles.news_item} onPress={() => goToNewDetail(item)}>
      <>
        <View style={AuthStyles.news_left_col}>
          <Image
            style={AuthStyles.news_image}
            source={{ uri: item.ImageBase64 }}
          />
        </View>
        <View style={AuthStyles.news_right_col}>
          <Text style={AuthStyles.news_title}>{item.Title}</Text>
          <TouchableOpacity style={AuthStyles.news_item_cate}>
            <Text style={AuthStyles.news_item_cate}>{item.Content}</Text>
          </TouchableOpacity>
        </View>
      </>
    </TouchableOpacity>
  };

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.background}>
        <HeaderAuth
          //style={HEADER} 
            titleStyle={HEADER_TITLE}
          iconStyle={TEXT}
          leftIcon={faChevronLeft}
          headerText={"Tin tức"}
          rightStyle={TEXT}
        />
        <View style={[styles.row,{paddingLeft: 12 }]}>
          <SafeAreaView style={SafeAreaViewStyle}>
            <FlatList
              data={categories}
              renderItem={_renderItem}
              keyExtractor={item => item.Id}
              numColumns={column}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingVertical: 20 }}
            />
          </SafeAreaView>
          <View style={newListStyle}>
            <FlatList
                data={lstPostDetail}
                renderItem={_renderNewsItem}
                keyExtractor={item => item.Id}
                numColumns={column}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: 20 }}
              />
          </View>
        </View>
      </Screen>
    </View>
  )
})
