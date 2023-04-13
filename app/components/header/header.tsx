import React from "react"
import { View, ViewStyle, TextStyle,Image, ImageStyle} from "react-native"
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
  paddingVertical : 15,
  justifyContent: "flex-start",
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center",alignItems: "center"}
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }
const ICON: TextStyle = {
  color: "white",
}
const CENTER_IMG: ImageStyle = {
  width: 60,
  height: 30,
  resizeMode: 'contain'
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
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
    rightIconStyle,
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  return (
    <View style={{ ...ROOT, ...style }}>
      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress}>
          {/* <Icon icon={leftIcon} /> */}
          <FontAwesomeIcon icon={leftIcon} style={{ ...ICON, ...iconStyle }} />
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      {centerIcon ? (
        <View style={TITLE_MIDDLE}>
          <Image source={centerIcon} style={CENTER_IMG}></Image>
        </View>
      ) : (
        <View style={TITLE_MIDDLE}>
          <Text style={{ ...TITLE, ...titleStyle }} text={header} />
        </View>
      )}
      {rightIcon ? (
        <Button preset="link" onPress={onRightPress} style={rightIconStyle}>
          {/* <Icon icon={rightIcon} /> */}
          <FontAwesomeIcon icon={rightIcon} style={{ ...ICON, ...iconStyle }} />
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
