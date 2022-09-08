<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="regForm" :rules="regRules" ref="regRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="regForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="regForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="regForm.repassword"
            type="password"
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="regNewUser">注册</el-button>
          <el-link type="info"  @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
// 前端绑定数据对象“属性名”，可以直接给要调用的功能接口的“参数名”一致
export default {
  name: 'myRegister',
  data () {
    const samePwd = (rule, value, callback) => {
      if (value !== this.regForm.password) {
        // 验证失败则调用回调函数时，指定一个error对象
        callback(new Error('两次输入的密码不一致'))
      } else {
        // 验证成功则直接调用callback回调函数即可
        callback()
      }
    }
    return {
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      regRules: {
        // 表单规则校验
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
        ],
        repassword: [
          { required: true, message: '请再次輸入密碼', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '用户名必须是6-15的非空字符',
            trigger: 'blur'
          },
          { validator: samePwd, trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    // 注册新用户
    regNewUser () {
      // 进行表单验证
      this.$refs.regRef.validate(async valid => {
        if (!valid) return false
        // 尝试拿到用户输入的内容
        // console.log(this.regForm)
        // 引入接口并调用，使用$message方法
        // 1.调用注册接口
        const { data: res } = await registerAPI(this.regForm)
        console.log(res)
        // 2.注册失败，提示用户
        if (res.code !== 0) return this.$message.error(res.message)
        // 3.注册成功，提示用户
        this.$message.success(res.message)
        // 4.跳转到登录页面
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url("../../assets/images/login_bg.jpg") center;
  background-size: cover;
  height: 100%;
}
.reg-box {
  width: 400px;
  height: 335px;
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
.btn-reg {
  width: 100%;
}
</style>
