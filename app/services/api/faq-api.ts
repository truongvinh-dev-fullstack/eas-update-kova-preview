import { ApisauceInstance, ApiResponse } from "apisauce"
import { Storage, StorageKey } from "../storage/index"
/**
 * Manages all requests to the API.
 */
export class FAQApi {
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
  async getFAQs(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response: ApiResponse<any> = await this._apisauce.post(
      `/faq/searchFaq`,
      payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }
    )
    return response
  }
}
