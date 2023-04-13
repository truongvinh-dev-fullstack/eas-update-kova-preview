import * as React from "react"
import { TouchableOpacity, View, ViewStyle, Text } from "react-native"
import { observer } from "mobx-react-lite"

export interface TableColorProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  colors?: any
  onPress?: any
  name?: any
}

/**
 * Describe your component here
 */
export const TableColor = observer(function TableColor(props: TableColorProps) {
  const { name, colors, onPress } = props

  return (
    <View style={{ flexDirection: "column", alignItems: "center", marginRight: 8 }}>
      <Text style={{ color: "white", fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>{name}</Text>
      {
        onPress ?
          <TouchableOpacity onPress={onPress}>
            <View style={{ flexDirection: "row" }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: (colors?.length && colors[0] ? colors[0] : "white"),
                borderTopLeftRadius: 8,
                borderWidth: 1,
                borderColor: "white",
              }}/>
              <View style={{}}>
                <View style={{
                  width: 20,
                  height: 20,
                  backgroundColor: (colors?.length && colors[1] ? colors[1] : "white"),
                  borderTopRightRadius: 8,
                  borderWidth: 1,
                  borderColor: "white",
                }}/>
                <View style={{
                  width: 20, height: 20,
                  backgroundColor: (colors?.length && colors[2] ? colors[2] : "white"),
                  borderWidth: 1, borderColor: "white",
                }}/>
              </View>
            </View>
            <View style={{
              width: 60,
              height: 20,
              backgroundColor: (colors?.length && colors[3] ? colors[3] : "white"),
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderWidth: 1,
              borderColor: "white",
            }}/>
          </TouchableOpacity> :
          <View>
            <View style={{ flexDirection: "row" }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: (colors?.length && colors[0] ? colors[0] : "white"),
                borderTopLeftRadius: 8,
                borderWidth: 1,
                borderColor: "white",
              }}/>
              <View style={{}}>
                <View style={{
                  width: 20,
                  height: 20,
                  backgroundColor: (colors?.length && colors[1] ? colors[1] : "white"),
                  borderTopRightRadius: 8,
                  borderWidth: 1,
                  borderColor: "white",
                }}/>
                <View style={{
                  width: 20, height: 20,
                  backgroundColor: (colors?.length && colors[2] ? colors[2] : "white"),
                  borderWidth: 1, borderColor: "white",
                }}/>
              </View>
            </View>
            <View style={{
              width: 60,
              height: 20,
              backgroundColor: (colors?.length && colors[3] ? colors[3] : "white"),
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderWidth: 1,
              borderColor: "white",
            }}/>
          </View>
      }

    </View>
  )
})
