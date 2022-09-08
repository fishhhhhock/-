<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="user_pic" alt="" class="avatar"  v-if="user_pic"/>
            <img src="../../assets/images/logo.png" alt="" class="avatar" v-else/>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click.native="exitLayout"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="user-box">
          <img src=" user_pic" alt="" v-if="user_pic">
          <img src="../../assets/images/logo.png" alt="" v-else>
          <span>欢迎 {{nickname ||username }}</span>
        </div>
        <!-- 左侧导航栏 -->
        <el-menu
      :default-active="$route.path"
      unique-opened
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#23262e"
      text-color="#fff"
      router
      active-text-color="#409EFF">

      <template v-for="items in menus">
        <el-menu-item :index="items.indexPath"
        :key="items.indexPath" v-if="!items.children">
          <i :class="items.icon"></i>
          <span slot="title">{{items.title}}</span>
        </el-menu-item>
        <el-submenu :index="items.indexPath" v-else :key="items.indexPath">
          <template slot="title">
            <i :class="items.icon"></i>
            <span>{{items.title}}</span>
          </template>
            <el-menu-item v-for="obj in items.children" :key="obj.indexPath" :index="obj.indexPath">
              <i :class="obj.icon"></i>
              {{obj.title}}
              </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主题区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部footer区域 -->
        <el-footer>@fishhhhock</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getAsideInfoAPI } from '@/api'
import { mapGetters } from 'vuex'
export default {
  name: 'myLayout',
  data () {
    return {
      menus: []
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'user_pic'])
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    exitLayout () {
      this.$confirm('确认要退出账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空token
        this.$store.commit('updateToken', '')
        // 清空用户信息
        this.$store.commit('updateUserInfo', {})
        // 强制退出到登陆界面
        this.$router.push('/login')
      }).catch(() => {})
    },
    async getAsideList () {
      const { data: res } = await getAsideInfoAPI()
      // console.log(res)
      this.menus = res.data
    }
  },
  created () {
    this.getAsideList()
  }
}
</script>

<style lang="less" scoped>
// 在组件标签上绑定的所有事件（包括原生事件的名字click、input等）
// 都是自定义事件，需要组件内$emit触发
// 万一组件内不支持原生事件名字，使用：@事件名.native="methods里的方法名"
// .native给组件内根标签，绑定这个原生事件
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
}
.el-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
}
.el-main {
  overflow-y: scroll;
  height: 0;
  background-color: #f2f2f2;
}
.el-footer {
  background-color: #eee;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 侧边栏
.user-box{
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span{
    color: white;
    font-size: 12px;
  }
}
// 侧边栏菜单
.el-aside{
  .el-submenu,
  .el-menu-item{
    width: 200px;
    user-select: none;
  }
}
</style>
