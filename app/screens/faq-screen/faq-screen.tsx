import React, { useState, useEffect } from "react"
import { View, ViewStyle, TextStyle, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { HeaderAuth, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { UnitOfWorkService } from "../../services/api/unitOfWork-service"
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

const _unitOfWork = new UnitOfWorkService()

export const FaqScreen = () => {
  const navigation = useNavigation()
  const [faqs, getFAQ] = useState([]);

  useEffect(() => {
    getFAQs().catch(err => {
      goBack();
    });
  }, [])

  const getFAQs = async () => {
    let res = await _unitOfWork.faq.getFAQs({
      Name: '',
      Code: '',
      Question: '',
      Type: "APP"
    });
    if (res.data.StatusCode == 200) {
      getFAQ(res.data.ListFaq);
    } else {

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
  
  const getTitle = (value, n) => value.length < n ? value : value.substring(0, n) + '...'

  const ItemView = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => goToAnswerDetail(item)}>
        <View style={styles.container}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>{getTitle(item.Question, 32)}</Text>
            </View>
          </View>
          <Text style={{ color: "black", fontSize: 14, marginVertical: 10 }}>{getTitle(item.Answer, 80)}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  const goToAnswerDetail = (rowData: any) => {
    navigation && navigation.navigate("FaqDetailScreen", { answer: rowData.Answer, question: rowData.Question })
  }

  return (
    <>
      <View style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.background}>
          <HeaderAuth
            titleStyle={HEADER_TITLE}
            iconStyle={TEXT} leftIcon={faChevronLeft}
            headerText={"Hỏi đáp"}
            rightStyle={TEXT_RIGHT}
            onLeftPress={navigation && navigation.goBack}
            onRightPress={() => { }}
            rightTx={"  "} />
          <View style={{ minHeight: 800 }}>
            {
              faqs && faqs.length ?
                <FlatList
                  data={faqs}
                  renderItem={ItemView}
                  keyExtractor={item => item.Id}
                  style={{
                    backgroundColor: "white",
                    paddingTop: 20
                  }} /> : null
            }
          </View>
        </Screen>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    minHeight: 60,
    backgroundColor: "white",
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: 'red',
    borderRadius: 6,
    shadowRadius: 20,
    shadowOpacity: 0.15,
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