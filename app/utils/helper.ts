/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
import { Dimensions } from "react-native"

const { width, height } = Dimensions.get('window');
// export class Helper {
//   static windowWidth = width;
//   static windowHeight = height;
//   static getWindowHeight = () => { return height }
//   public static isTablet = (): Boolean => { return width > 800 }
// }
export const Helper = {
  windowWidth: width,
  windowHeight: height,
  getWindowHeight: () => { return height },
  isTablet: (): Boolean => { return width > 800 }
}