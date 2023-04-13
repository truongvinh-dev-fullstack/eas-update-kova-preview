import React from "react"
import { View, Text, StyleSheet, Dimensions, TextStyle, ViewStyle, TouchableOpacity, Linking } from "react-native"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { color, spacing, typography } from "../../theme";
import { HeaderAuth, Screen } from "../../components";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const TEXT: TextStyle = {
  color: "white",
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const CONTAINER: ViewStyle = {
  backgroundColor: "#E1420B",
  paddingHorizontal: spacing[0],
}
const FULL: ViewStyle = {
  flex: 1,
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

export const NotificationDetailScreen = observer(function NotificationDetailScreen(props: any) {
  const { content, name, link } = props.route.params;
  const navigation = useNavigation();

  return (
    <>
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT}
            leftIcon={faChevronLeft}
            headerText={"Thông báo"}
            rightStyle={TEXT_RIGHT}
            onLeftPress={navigation && navigation.goBack}
            onRightPress={() => { }}
            rightTx={"  "} />
          <View style={{
            minHeight: Dimensions.get('window').height,
            backgroundColor: "white",
          }}>
            <View style={{ marginHorizontal: 10 }}>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.content}>{content}</Text>
              {
                link ?
                  <TouchableOpacity onPress={()=>{
                    Linking.openURL(`${link}`)
                  }}>
                    <Text style={styles.link}>{`Link gắn kèm`}</Text>
                  </TouchableOpacity> : null
              }
            </View>

          </View>
        </Screen>
      </View>
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: 160,
    paddingHorizontal: 10,
    shadowColor: 'red',
    marginTop: 10,
    borderRadius: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    marginHorizontal: 10
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginHorizontal: 10,
    lineHeight: 22,
    flexWrap: "wrap"
  },
  content: {
    color: "#737373",
    fontSize: 15,
    marginVertical: 10,
    lineHeight: 18,
    flexWrap: "wrap",
    marginHorizontal: 15
  },
  link: {
    color: "blue",
    fontSize: 15,
    lineHeight: 18,
    flexWrap: "wrap",
    marginHorizontal: 15,
    textDecorationLine: 'underline',
    fontStyle: 'italic'
  }
})
