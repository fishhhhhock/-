<template>
  <!-- 登陆页面的整体盒子 -->
  <div class="login-container">
    <!-- 登陆的盒子 -->
    <div class="login-box">
      <!-- 标题盒子 -->
      <div class="title-box"></div>
      <!-- 登陆的表单区域 -->
      <el-form :model="logForm" :rules="logRules" ref="logRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="logForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="logForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="toLogin">登录</el-button>
          <el-link  type="info"  @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'myLogin',
  data () {
    return {
      logForm: {
        username: '',
        password: ''
      },
      logRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密碼', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '用户名必须是6-15的非空字符',
            trigger: 'blur'
          }
        ]

      }
    }
  },
  methods: {
    ...mapMutations(['updateToken']),
    toLogin () {
      // 进行表单验证
      this.$refs.logRef.validate(async valid => {
        if (!valid) return false
        // 尝试拿到用户输入的内容
        // console.log(this.logForm)
        // 引入接口并调用，使用$message方法
        // 1.调用登录接口
        const { data: res } = await loginAPI(this.logForm)
        // console.log(res)
        // 2.登录失败，提示用户
        if (res.code !== 0) return this.$message.error(res.message)
        // 3.登录成功，提示用户
        this.$message.success(res.message)
        // 将token保存到vuex
        this.updateToken(res.token)
        // 登录成功之后跳转页面
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;
}
.login-box {
  width: 400px;
  height: 270px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
}
.title-box {
  height: 60px;
  background: url("../../assets/images/login_title.png") center no-repeat;
}
.btn-login {
  width: 100%;
}

</style>
