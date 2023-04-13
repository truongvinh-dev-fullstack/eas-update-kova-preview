import { ViewStyle, TextStyle,ImageSourcePropType} from "react-native"
// import { IconTypes } from "../icon/icons"
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

export interface HeaderProps {
  /**
   * Main header, e.g. POWERED BY BOWSER
   */
  headerTx?: string

  /**
   * header non-i18n
   */
  headerText?: string

  /**
   * Icon that should appear on the left
   */
  leftIcon?: IconDefinition

  centerIcon?: ImageSourcePropType

  /**
   * What happens when you press the left icon
   */
  onLeftPress?(): void

  /**
   * Icon that should appear on the right
   */
  rightIcon?: IconDefinition

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
  rightIconStyle?: ViewStyle
}
