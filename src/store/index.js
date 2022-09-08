import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)
// vuex默认保存在内存中，所以刷新后所有的值会回归初始化9无法做到持久存储）
// 使用插件包保证数据持久化
export default new Vuex.Store({
  state: {
    // 用来存储登录成功之后得到的token
    token: '',
    userInfo: {}
  },
  getters: {
    // 第一种写法
    // username (state) {
    // return state.userInfo.username
    // }
    // 第二种写法
    // username: state => {
    // return state.userInfo.username
    // }
    // 简写方法
    username: state => state.userInfo.username,
    nickname: state => state.userInfo.nickname,
    user_pic: state => state.userInfo.user_pic
  },
  mutations: {
    // 更新token的函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户信息的函数
    updateUserInfo (state, info) {
      // console.log('info', info)
      state.userInfo = info
    }
  },
  actions: {
    // 定义初始化用户基本信息的action函数
    // 调用接口方法获取用户基本信息
    async initUerInfo (store) {
      const { data: res } = await getUserInfoAPI()
      // console.log(res)
      // if (res.code === 0) {
      store.commit('updateUserInfo', res.data)
      // }
    }
  },
  modules: {
  },
  // 配置为 vuex 的插件
  plugins: [createPersistedState()]
})
