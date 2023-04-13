import { ApisauceInstance, create } from "apisauce"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { UserApi } from "./user-api"
import { NotificationApi } from "./notification-api"
import { FAQApi } from "./faq-api"
import { Storage } from '../storage/index'
/**
 * Manages all requests to the API.
 */
export class UnitOfWorkService {
  private _userApi: UserApi
  private _notification: NotificationApi
  private _faq: FAQApi
  private apisauce: ApisauceInstance
  private _storage: Storage;
  /**
   * Configurable options.
   */
  private config: ApiConfig = DEFAULT_API_CONFIG

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor() {
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
      //headers: {
      //  "Content-Type": "application/json",
      //  "Origin": "http://192.168.1.32:5051",
      //},
    })
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  get storage(): Storage {
    if (this._storage == null) {
      return (this._storage = new Storage())
    }
    return this._storage
  }
  get user(): UserApi {
    if (this._userApi == null) {
      return (this._userApi = new UserApi(this.apisauce))
    }
    return this._userApi
  }

  get notification(): NotificationApi {
    if (this._notification == null) {
      return (this._notification = new NotificationApi(this.apisauce))
    }
    return this._notification
  }

  get faq(): FAQApi {
    if (this._faq == null) {
      return (this._faq = new FAQApi(this.apisauce))
    }
    return this._faq
  }
}
