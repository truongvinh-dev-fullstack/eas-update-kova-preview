import { ApisauceInstance, ApiResponse } from "apisauce"
import { Storage, StorageKey } from "../storage/index"
/**
 * Manages all requests to the API.
 */
export class NotificationApi {
  private _apisauce: ApisauceInstance
  private _storage = new Storage()
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(apisauce: ApisauceInstance) {
    this._apisauce = apisauce
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  async getAllNotifiacations(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response: ApiResponse<any> = await this._apisauce.post(
      `/notification/searchNotification`,
      payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }
    )
    return response
  }

  async createExpoToken(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response: ApiResponse<any> = await this._apisauce.post(
      `/notification/createExpoToken`,
      payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }
    )
    return response
  }

  async getNotificationByWorkerId(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response: ApiResponse<any> = await this._apisauce.post(
      `/notification/getNotificationByWorkerId`,
      payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }
    )
    return response
  }

  async updateStatusNotification(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response: ApiResponse<any> = await this._apisauce.post(
      `/notification/updateStatusNotification`,
      payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }
    )
    return response
  }
}
