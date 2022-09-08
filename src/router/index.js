import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', // 默认打开网页显示的布局
    component: () => import('@/views/layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar', // 必须用这个值
        component: () => import('@/views/user/userAvatar.vue')
      },
      {
        path: 'user-pwd', // 必须用这个值
        component: () => import('@/views/user/userpwd.vue')
      },
      {
        path: 'art-cate', // 必须用这个值
        component: () => import('@/views/article/artcate.vue')
      },
      {
        path: 'art-list', // 必须用这个值
        component: () => import('@/views/article/artlist.vue')
      }

    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }

]

const router = new VueRouter({
  routes
})

// router.beforeEach((to, from, next) => {
// const token = store.state.token
// 有token但没有userInfo数据时获取用户信息
// if (token && !store.state.userInfo.username) {
// store.dispatch('initUserInfo')
// }
// next()
// })

const whiteList = ['/login', '/reg']

// 有token但是没有用户信息, 才去请求用户信息保存到vuex里
// 调用actions里方法请求数据
// 下次切换页面vuex里有用户信息数据就不会重复请求用户信息

router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
  // 登陆了
    if (!store.state.userInfo.username) {
      store.dispatch('initUerInfo')
    }
    next() // 路由放行
  } else {
    // 判断白名单是否存在该路径
    if (whiteList.includes(to.path)) {
      // 未登录，可以直接访问的地址
      next()
    } else {
      // next强制切换到登陆路径
      next('/login')
    }
  }
})
export default router
