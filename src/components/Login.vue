<template>
  <div class="login_container">
    <div class="info_syt">
      <div class="login_box">
        <p class="logo_title">小鲸鱼健身房管理</p>
        <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
          <el-form-item prop="tel">
            <el-input placeholder="请输入用户手机号" prefix-icon="iconfont icon-user" v-model="loginForm.tel"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="loginForm.pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input class="loginInput" type="code" placeholder="请输入验证码" v-model="loginForm.verifyCode" />
            <div id="v_container" class="yamImg"></div>
          </el-form-item>
          <!-- 按钮区 -->
          <el-form-item>
            <el-button class="login_btn" type="primary" @click="login">登录</el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to="{ name: 'register' }" class="forge-password" style="float: right;color:#f6f6f6;">忘记密码</router-link>
            <router-link :to="{ name: 'register' }" class="forge-password" style="float: right;margin-right: 10px;color:#0899d5;">注册账户</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { GVerify } from '../../static/js/vertifyCode'
export default {
  data() {
    return {
      loginForm: {
        tel: '17852756592',
        pwd: '123456789',
        verifyCode: ''
      },
      model: {},
      loginFormRules: {
        tel: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { min: 11, max: 11, message: '输入的长度为11', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.verifyCode = new GVerify('v_container')
  },
  methods: {
    // 重置表单
    // resetLoginForm() {
    //   this.loginForm.username = ''
    //   this.loginForm.password = ''
    //   this.$refs.loginFormRef.resetFields()
    // },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const verifyCode = this.loginForm.verifyCode
        console.log('输入的验证码', verifyCode)
        const verifyFlag = this.verifyCode.validate(verifyCode)
        console.log('验证的结果', verifyFlag)

        if (!verifyFlag) {
          this.$notify.info({
            title: '系统提示',
            message: '验证码输入错误'
          })
          this.loginForm.verifyCode = ''
          this.verifyCode.refresh()
          return
        }
        const formData = Object.assign(this.model, this.loginForm)
        const { data: res } = await this.$http.post('users/userLogin', formData)
        console.log('返回的数据', res)
        if (res.code !== '200') {
          return this.$notify.error({
            title: '系统提示',
            message: '登录失败'
          })
        } else {
          this.$notify({
            title: '系统提示',
            message: res.msg,
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          window.sessionStorage.setItem('username', res.data.username)
          window.sessionStorage.setItem('tel', res.data.tel)
          window.sessionStorage.setItem('sex', res.data.sex)
          window.sessionStorage.setItem('role', res.data.role)
          window.sessionStorage.setItem('userId', res.data.userId)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  // background: #2b4b6b;
  background: url(../assets/img/login/logo.png) no-repeat center center;
  background-size: 100%;
  height: 100%;
}
.info_syt {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  width: 40vw;
  height: 100%;
  float: right;
  flex-direction: column;
  justify-content: center;
}
.login_box {
  width: 22vw;
  height: 50vh;
}
.logo_title {
  margin-bottom: 15px;
  font-family: SourceHanSansCN-Heavy;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 5px;
  color: #ffff;
}
.login_form {
  width: 100%;
  box-sizing: border-box;
}
/deep/ .el-input__inner {
  background-color: transparent;
  color: #ffff;
}
.login_btn {
  width: 100%;
}
.loginInput {
  width: calc(100% - 125px);
}
.yamImg {
  display: inline-block;
  height: 40px;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
