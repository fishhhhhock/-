// 封装axios方法
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// 创建一个自定义的axios方法（比原axios多了一个基地址）
// axios函数请求的url地址前面会被拼接基地址，然后axios请求baseURL+url后台完整地址

export const baseURL = 'http://big-event-vue-api-t.itheima.net'

const myAxios = axios.create({
  baseURL: baseURL
})

// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 为请求头挂载Authorization字段
  // 判断，登陆页面和注册页面，vuex里无token，而且登录接口和注册接口也不需要携带token(其他页面需要)

  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401) {
    store.commit('updateToken', '')
    store.commit('updateUserInfo', {})
    router.push('/login')
    Message.error('身份认证已过期！请重新登录！')
  }
  return Promise.reject(error)
})

// 导出自定义方法，供外面调用传参发请求
export default myAxios
