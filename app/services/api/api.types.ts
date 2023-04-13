import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}
export interface Response {
  success: boolean
  message: string,
  statusCode: number,
  data?: Object
}


export type ResponseInterface = Response | GeneralApiProblem
