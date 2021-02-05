<template>
  <div>
    <div class="zz_header">
      <div class="zz_slide"></div>
      <div class="zz_title">基本信息</div>
      <div class="zz_more">
        <i class="el-icon-male el-icon-edit"></i>
      </div>
    </div>
    <div class="info">
      <div class="header_img">
        <img src="../../assets/img/shouye/user.png" alt="" />
      </div>
      <div class="header_info">
        <p class="username">
          {{ userInfo.username }}
          <i class="el-icon-female female" v-if="isMale == 1"></i>
          <i class="el-icon-male male" v-else></i>
        </p>
        <p>手机号：{{ userInfo.tel }}</p>
        <p>角色：{{ userInfo.role }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMale: 0,
      userInfo: {}
    }
  },
  mounted() {
    let role = ''
    if (window.sessionStorage.getItem('role') === '0') {
      role = '普通用户'
    }
    if (window.sessionStorage.getItem('role') === '1') {
      role = 'vip用户'
    }
    if (window.sessionStorage.getItem('role') === '2') {
      role = '教练'
    }
    if (window.sessionStorage.getItem('role') === '3') {
      role = '管理员'
    }
    this.$nextTick(() => {
      this.userInfo = {
        username: window.sessionStorage.getItem('username'),
        tel: window.sessionStorage.getItem('tel'),
        role: role
      }
    })
  }
}
</script>

<style lang="less" scoped>
.zz_header {
  position: relative;
}
.zz_slide {
  display: inline-block;
  height: 20px;
  width: 5px;
  margin-right: 5px;
  vertical-align: text-bottom;
  background-color: #3498db;
  border-radius: 5px;
}
.zz_title {
  display: inline-block;
  font-size: 18px;
}
.zz_more {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 16px;
  color: #666;
  &:hover {
    color: #3498db;
  }
}
.info {
  display: flex;
}
.header_img {
  width: 110px;
  height: 110px;
  margin-top: 15px;
  margin-right: 15px;
  background-color: pink;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}

.header_info {
  flex: 1;
  p {
    margin-bottom: 10px;
  }
  .username {
    margin-top: 20px;
    font-size: 18px;
    font-weight: 700;
    color: #333333;
  }
}
.male {
  font-weight: 700;
  color: #3498db;
}
.female {
  font-weight: 700;
  color: pink;
}
</style>
