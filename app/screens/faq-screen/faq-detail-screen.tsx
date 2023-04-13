import React from "react"
import { View, TextStyle, StyleSheet, Dimensions, ViewStyle } from "react-native"
import { HeaderAuth, Screen, Text } from "../../components"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { color, spacing, typography } from "../../theme"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

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


export const FaqDetailScreen = observer(function NotificationDetailScreen(props: any) {
  const { answer, question } = props.route.params;
  const navigation = useNavigation();

  return (
    <>
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT} leftIcon={faChevronLeft}
            headerText={"Chi tết câu hỏi"}
            rightStyle={TEXT_RIGHT}
            onLeftPress={navigation && navigation.goBack}
            onRightPress={() => { }}
            rightTx={"  "} />
          <View style={{ backgroundColor: "white", minHeight: Dimensions.get('window').height }}>
            <View style={styles.container_title}>
              <Text style={{
                color: "black",
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 20,
                marginHorizontal: 10,
                lineHeight: 20,
                flexWrap: "wrap"
              }}>{question}</Text>
            </View>
            <View style={styles.container}>
              <Text style={{
                color: "black",
                fontSize: 15,
                marginVertical: 10,
                lineHeight: 17.5,
                flexWrap: "wrap"
              }}>{answer}</Text>
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
    shadowOpacity: 0.1,
    marginHorizontal: 10,
    borderColor: "#FFDADA",
    borderWidth: 1
  },
  container_title: {
    backgroundColor: "white",
    minHeight: 60,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    shadowColor: 'red',
    marginTop: 10,
    borderRadius: 10,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#FFDADA"
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 21.09,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
})