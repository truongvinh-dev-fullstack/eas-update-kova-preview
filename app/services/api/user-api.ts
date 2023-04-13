import { ApisauceInstance, ApiResponse } from "apisauce"
import { Platform } from "react-native"
import { Storage, StorageKey } from "../storage/index"
import { API_URL, PORT, TIMEOUT } from "@env"
// import { Auth } from "./auth"
/**
 * Manages all requests to the API.
 */
export class UserApi {
  private _apisauce: ApisauceInstance
  private _storage = new Storage()
  // private _auth = new Auth()
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(apisauce: ApisauceInstance) {
    this._apisauce = apisauce
  }


  fixAvatar(avatar: any) {
    try {
      if (Platform.OS === "ios") {
        // avatar = avatar.replaceAll("\\", "/")
        // avatar = avatar.replaceAll(/\s/g, "%20")
        avatar = avatar.split("\\").join("/")
      }
      avatar = `${API_URL}:${PORT}/${avatar}`
      return avatar
    } catch (e) {
      // console.log(e)
      return null
    }
  }
  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */


  async forgotPassword(payload: any): Promise<any> {
    const response: ApiResponse<any> = await this._apisauce.post(`/user/forgorPassword`, payload)
    return response
  }

  async getUser(payload: any): Promise<any> {
    const response: ApiResponse<any> = await this._apisauce.post(`/user/getUser`, payload)
    return response
  }

  async getUserAvatarList(payload: any): Promise<any> {
    const response: ApiResponse<any> = await this._apisauce.post(`/user/getUserAvatarList`, payload)
    return response
  }

  // kova

  async login(payload: any): Promise<any> {
    const response = await this._apisauce.post(`/Authenticate-worker`, payload)
    console.log(response);
    return response
  }

  async logout(): Promise<any> {
    await this._storage.logout()
    return
  }

  async listHouseModel(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN);
    const response = await this._apisauce.post(`/house-app/getMasterDataHouseModel`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async detailHouseModel(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN);
    const response = await this._apisauce.post(`/house-app/getDetailHouseModelById`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async signUpWorker(payload: any): Promise<any> {
    const response = await this._apisauce.post(`worker-app/signUpWorker`, payload)
    return response
  }

  async getMasterDataSignUpWorker(payload: any): Promise<any> {
    const response = await this._apisauce.post(`worker-app/getMasterDataSignUpWorker`, payload)
    return response
  }

  // Api lấy thông tin chi tiết thầu thợ
  async getMasterDataWorker(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`worker/getMasterDataWorker`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response
  }

  // Api lấy thông tin chi tiết thầu thợ
  async createOrUpdateWorker(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`worker/createOrUpdateWorker`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response
  }

  // Api lấy thông tin chi tiết thầu thợ
  async changePassword(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`user/changePassword`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response
  }

  // Danh sách vinh danh
  async ranking(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/getWorkersFollowRank`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Chi tiết thầu thợ
  async getDataWorkerDetailById(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/getDataWorkerDetailById`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Quà thầu thợ
  async getMasterDataGiftWorker(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/getMasterDataGiftWorker`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Quà thầu thợ
  async tradeGift(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/tradeGift`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // lịch sử giao dịch
  async getHistoryWorkerTrade(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/getHistoryWorkerTrade`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // quảng cáo trang home
  async getAllPromotionAdertisement(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/worker-app/getAllPromotionAdertisement`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // lấy nhóm mẫu nhà + mẫu nhà
  async getHouseModelCategory(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/getHouseModelCategory`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }


  // lấy nhóm mẫu nhà + mẫu nhà
  async getAllGroupColor(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/color-app/getAllGroupColor`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async getAllGroupWorkerColor(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/color-app/getAllGroupWorkerColor`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Lấy data màu sắc màn hình thay đổi màu sắc căn nhà
  async getMasterDataColor(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/getMasterDataColor`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  async saveColorGroup(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/color-app/saveColorGroup`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Save color vào danh sách chọn màu nhanh
  async saveColorQuicklyColor(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/color-app/saveColorQuicklyColor`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Save History Color 
  async saveHistoryColor(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/color-app/saveHistoryColor`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Lấy lịch sử sơn màu
  async getHistoryPainted(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/getHistoryPainted`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Lấy chi tiết lịch sử
  async getDetailHistoryPaintedById(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/getDetailHistoryPaintedById`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Lưu thông tin lịch sử
  async saveInformationHousePainted(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/saveInformationHousePainted`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Lấy mẫu nhà đã phối
  async getHouseModelDetailFromHistoryId(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/house-app/getHouseModelDetailFromHistoryId`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // quên mật khẩu
  async forgotPasswordWorker(payload: any): Promise<any> {
    const response = await this._apisauce.post(`/worker-app/forgotPassword`, payload)
    return response.data
  }

  // lấy mã otp
  async getOtpCode(payload: any): Promise<any> {
    const response = await this._apisauce.post(`/worker-app/getOtpCode`, payload)
    return response.data
  }

  // xác nhận otp
  async confirmOtp(payload: any): Promise<any> {
    const response = await this._apisauce.post(`/worker-app/confirmOtp`, payload)
    return response.data
  }

  // lấy list khách hàng của thầu thợ
  async getCustomerByWorkerId(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/customer/getCustomerByWorkerId`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

  // Tạo khách hàng
  async createOrUpdateCustomer(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
    const response = await this._apisauce.post(`/customer/createOrUpdateCustomer`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } })
    return response.data
  }

    // Lưu thông tin lịch sử
    async saveRealImage(payload: any): Promise<any> {
      const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN)
      const response = await this._apisauce.post(`/house-app/saveRealImage`, payload,
        { headers: { "Authorization": `Bearer ${accessToken}` } })
      return response.data
    }
}


