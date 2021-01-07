import Vue from "vue"
import axios from "axios"
import { getToken } from "@/utils/cookie"
// 创建 axios 实例
const instance = axios.create({
  timeout: 6000 // 请求超时时间
})
axios.defaults.baseURL = ""
const errDeal = error => {
  if (error.response) {
    Vue.prototype.$message.destroy()
    const data = error.response.data
    if (data.status === 403) {
      Vue.prototype.$message.error(data.message)
    }
    if (data.status === 401) {
      console.log("登录已失效")
    } else {
      Vue.prototype.$message.error(
        data.msg || data.message || "服务端异常，请联系技术支持"
      )
    }
  }
  return Promise.reject(error)
}

instance.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers["Authorization"] = token
  }
  return config
})

instance.interceptors.response.use(response => {
  const data = response.data || {}
  const code = data.code || data.code === 0 ? data.code : 9999
  if (code !== 0 && code !== 406) {
    switch (code) {
      case 401:
        console.log("登录已失效")
        break
      default:
        Vue.prototype.$message.destroy()
        Vue.prototype.$message.error(data.msg || "服务端异常，请联系技术支持")
    }
  }
  if (data.code === 0 || data.code === 406) {
    return data
  }
  return Promise.reject()
}, errDeal)

export default instance
