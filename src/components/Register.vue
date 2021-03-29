<template>
  <div class="login_container">
    <div class="info_syt">
      <div class="login_box">
        <p class="logo_title">小鲸鱼健身房管理</p>
        <el-form ref="registerFormRef" :rules="registerFormRules" :model="register" label-width="0px" class="login_form">
          <el-form-item prop="tel">
            <el-input prefix-icon="iconfont icon-user" placeholder="请输入昵称" v-model="register.tel"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="register.pwd" type="password"></el-input>
          </el-form-item>
          <!-- 按钮区 -->
          <el-form-item>
            <el-button class="login_btn" type="primary" @click="registerFun">注 册</el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to="{ name: 'login' }" class="forge-password" style="float: right;color:#ddd;">已有账号： <span style="color:#0899d5">登 录</span></router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      register: {
        tel: '17852756592',
        pwd: '123456789'
      },
      model: {},
      registerFormRules: {
        tel: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { min: 11, max: 11, message: '输入的长度为11', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入登录密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerFun() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = Object.assign(this.model, this.register)
        console.log('表单提交数据', formData)
        const { data: res } = await this.$http.post('users/register', formData)
        debugger
        console.log('后台返回的数据', res)
        if (res.code === '200') {
          this.$notify({
            title: '系统提示',
            message: '注册成功',
            type: 'success'
          })
          this.$router.push('/login')
        } else {
          return this.$notify.error({
            title: '系统提示',
            message: res.msg
          })
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
</style>
