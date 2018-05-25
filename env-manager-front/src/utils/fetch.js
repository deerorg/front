import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Config from '@/config'

import qs from 'qs'
// 创建axios实例
const service = axios.create({
  baseURL: Config.BASE_API, // api的base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true
//   transformRequest: [function (data, headers) {
//     return qs.stringify(data);
//   }],
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['Authorization'] = store.getters.token;
    config.headers['E-User-Token'] = localStorage.token
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (response && response.data != null) {
      const { success, msg, data } = response.data

      if (!success) {
        Message({
          message: msg || '未知错误',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (success && data == 'REPEAT_LOGIN') {
        Message({
          message: '异地登录,请重登录 ',
          type: 'error',
          duration: 5 * 1000
        })
        localStorage.clear()
        window.router.push('/login')
      } else {
        console.log("success :", success)
      }
    }
    return response
  },
  error => {
    console.log('err' + error)// for debug
    if (error.message && error.message == 'Network Error') {
      error.message = "网络异常, 请稍后重试"
      // 用户已退出
    } else if (error.response && error.response.status == 500 &&
      (error.response.data.message == 'LOGOUT' || error.response.data.message == 'TOKEN_ERROR')) {
      Message({
        message: "用户已退出, 请重登录 ",
        type: "error",
        duration: 5 * 1000
      })
      localStorage.clear()
      window.router.push('/login')
    }
    // api 接口 或返回 ReLogin的处理 用户强制退出
    else if (error.response && error.response.status == 200 && error.response.data == 'FORCE_LOGIN') {
      localStorage.clear()
      window.router.push('/login')
    } else if (error.message) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
