import { StorageKey } from "../storage"
import { AsyncStorage } from "react-native"

export class Auth {

  constructor() {
  }

  async authHeader() {
    const accessToken = await AsyncStorage.getItem(StorageKey.JWT_TOKEN)
    if (accessToken) {
      return {
        "Content-Type": "application/json", "Origin": "http://192.168.1.119:5051",
        "Authorization": `Bearer ${accessToken}`,
      }
    }
    return { "Content-Type": "application/json", "Origin": "http://192.168.1.119:5051" }
  }

}
