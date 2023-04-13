import { ViewStyle, TextStyle } from "react-native"
// import { IconTypes } from "../icon/icons"
import { IconDefinition } from "@fortawesome/fontawesome-common-types"

export interface HeaderProps {
  /**
   * Main header, e.g. POWERED BY BOWSER
   */
  headerTx?: string
  rightTx?: string

  /**
   * header non-i18n
   */
  headerText?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: IconDefinition

  centerIcon?: any

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  onCenterPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: IconDefinition
  centerIconStyle?: any

  /**
   * What happens when you press the right icon
   */
  onRightPress?(): void

  /**
   * Container style overrides.
   */
  style?: ViewStyle

  /**
   * Title style overrides.
   */
  titleStyle?: TextStyle

  iconStyle?: TextStyle
  rightStyle?: TextStyle
}
