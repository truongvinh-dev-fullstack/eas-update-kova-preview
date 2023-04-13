import React from "react"
import { View, ImageBackground, ViewStyle, TextStyle, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft, faEnvelopeSquare, faEye } from '@fortawesome/free-solid-svg-icons'
import { AuthStyles } from '../../styles/Auth/'
import { styles } from '../../styles/'
import { Button, Divider } from '@ui-kitten/components';
import RNPickerSelect from 'react-native-picker-select';

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.background,
  paddingHorizontal: spacing[0],
}
const CONTAINER_PADDING: ViewStyle = {
  paddingHorizontal: spacing[4],
  marginTop: spacing[4],
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

export const NewsListScreen = observer(function NewsListScreen(props: any) {
  const navigation = useNavigation();
  
  const news = [
    ...props.route.params.list
  ]
  const goToNewDetail = (item) => {
    navigation && navigation.navigate('NewsDetailScreen', { detail: item })
  }
  const _renderItem = ({ item }) => {
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
          onLeftPress={() => navigation && navigation.goBack()}
          headerText={"Tin tức"}
          rightStyle={TEXT}
        />
        <View style={[CONTAINER_PADDING]}>
          <FlatList
            data={news}
            renderItem={_renderItem}
            keyExtractor={item => item.Id}
            style={{ flex: 1 }}
          />
          {/* {
            _renderItem(news)
          } */}
        </View>
      </Screen>
    </View>
  )
})
