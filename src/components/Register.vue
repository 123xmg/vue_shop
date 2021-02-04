<template>
  <div>
    <div class="login_box">
      <p class="logo_title">小鲸鱼健身房管理</p>
      <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" placeholder="请输入昵称" v-model="loginForm.username" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item>
          <el-button class="login_btn" type="primary" @click="register">注 册</el-button>
        </el-form-item>
        <el-form-item>
          <div @click="loginFun" class="forge-password" style="float: right;color:#ddd;">已有账号： <span style="color:#0899d5">登 录</span></div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { min: 11, max: 11, message: '输入的长度为11', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 重置表单
    // resetLoginForm() {
    //   this.loginForm.username = ''
    //   this.loginForm.password = ''
    //   this.$refs.loginFormRef.resetFields()
    // },
    // 注册
    register() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$notify.error({
            title: '系统提示',
            message: '注册失败'
          })
        } else {
          this.$notify({
            title: '系统提示',
            message: '注册成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          window.location.reload()
        }
      })
    },
    loginFun() {
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
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
