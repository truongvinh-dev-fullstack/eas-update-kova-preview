import React, { useState } from "react"
import { View, ViewStyle, TextStyle, Text, ActivityIndicator, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { styles } from '../../styles'
import { observer } from "mobx-react-lite"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const FULL: ViewStyle = { flex: 1 }

const TEXT: TextStyle = {
  color: '#FFFFFF',
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
  backgroundColor: "#E1420B",
  paddingHorizontal: spacing[0],
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

export const PromotionDetailScreen = observer(function PromotionDetailScreen(props: any) {
  const navigation = useNavigation();
  const { imageUrl, promotion } = props.route.params;
  const [isLoading,] = useState(false);
  const BannerWidth = Dimensions.get('window').width * 0.92;
  const BannerHeight = 180;

  return (
    <>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#A23232" />
        </View>
      }
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT} leftIcon={faChevronLeft}
            headerText={"Chương trình khuyến mãi"}
            rightStyle={TEXT_RIGHT}
            onLeftPress={navigation && navigation.goBack}
            onRightPress={() => { }}
            rightTx={"  "} />
          <View style={{ backgroundColor: "white", alignItems: "center" }}>
            <Text style={[{
              color: "black",
              fontSize: 18,
              marginVertical: 20,
              fontWeight: "700",
              marginHorizontal: 20
            }]} >{promotion?.PromotionName}</Text>
            <Image style={{ width: BannerWidth, height: BannerHeight, resizeMode: "contain" }}
              source={{ uri: imageUrl }} />
            <View style={{
              height: 500,
              minWidth: "100%",
              paddingVertical: 20
            }}>
              <WebView style={{ marginHorizontal: 20 }} automaticallyAdjustContentInsets={false} source={{ html: promotion?.Description }} />
            </View>
          </View>
        </Screen>
      </View>
    </>
  )
})

