/**
 * 
 * @file 封装axios请求的配置
 *  
 */

import axios from 'axios'
import qs from 'qs'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
const baseURL = process.env.VUE_APP_BASE_API
const AXIOS = axios.create({
  baseURL,
  timeout: 0,
  transformRequest: [data => {
    return qs.stringify(data)
  }]
})
AXIOS.defaults.headers['Access-Control-Allow-Origin'] = '*'
AXIOS.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.common['Authorization'] = `JWT ${getToken()}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
AXIOS.interceptors.response.use(
  response => {
    const res = response
    if (res.status !== 200) {
      Message({
        message: res.message || 'Response error',
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Response error'))
    } else {
      return res
    }
  },
  error => {
    console.log('error返回的状态码', error.response.status);
    Message({
      message: `错误内容：${error.response.statusText}  状态码：${error.response.status}`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default AXIOS
