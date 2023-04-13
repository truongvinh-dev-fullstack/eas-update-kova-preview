import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
// import { Icon } from "../icon/icon"
import { spacing } from "../../theme"
import { translate } from "../../i18n/"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 15,
  backgroundColor: "transparent",
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  alignItems: "center",
  minWidth: "100%",
  position: "absolute",
  left: 0,
  right: 0,
}
const LEFT: ViewStyle = { width: 30, alignItems: "flex-start" }
const RIGHT: ViewStyle = { width: 100, alignItems: "flex-end" }
const ICON: TextStyle = {
  color: "white",
}
// const CENTER_IMG: ImageStyle = {
//   width: 120,
//   height: 66,
//   resizeMode: "contain",
// }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function HeaderAuth(props: HeaderProps) {
  const {
    onCenterPress,
    onLeftPress,
    onRightPress,
    centerIcon,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    iconStyle,
    rightTx,
    rightStyle,
    centerIconStyle,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...ROOT, ...style }}>
      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress} style={{ zIndex: 1, width: 60 }}>
          <FontAwesomeIcon icon={leftIcon} style={{ ...ICON, ...iconStyle }} />
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      {centerIcon ? (
        <View style={TITLE_MIDDLE}>
          {
            onCenterPress ?
              <TouchableOpacity onPress={onCenterPress}>
                <FontAwesomeIcon icon={centerIcon} style={{ ...ICON, ...centerIconStyle }} />
              </TouchableOpacity> :
              <FontAwesomeIcon icon={centerIcon} style={{ ...ICON, ...centerIconStyle }} />
          }
          {/*<Image source={centerIcon} style={CENTER_IMG}/>*/}
        </View>
      ) : (
        <View style={TITLE_MIDDLE}>
          <Text style={{ ...TITLE, ...titleStyle }} text={header} />
        </View>
      )}
      {rightIcon != null ? (
        <Button preset="link" onPress={onRightPress} style={{ position: "absolute", right: 20 }}>
          {/* <Icon icon={rightIcon} /> */}
          <FontAwesomeIcon icon={rightIcon} style={{ ...ICON, ...iconStyle }} />
        </Button>
      ) : (
        <TouchableOpacity style={RIGHT} onPress={onRightPress}>
          <Text style={{ ...rightStyle }} text={rightTx} />
        </TouchableOpacity>
      )}
    </View>
  )
}
