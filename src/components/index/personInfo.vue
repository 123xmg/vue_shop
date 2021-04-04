<template>
  <div>
    <div class="zz_header">
      <div class="zz_slide"></div>
      <div class="zz_title">基本信息</div>
      <div class="zz_more" @click="EditDialog">
        <i class="el-icon-male el-icon-edit"></i>
      </div>
    </div>
    <div class="info">
      <div class="header_img">
        <img v-if="userList.u_imgurl" :src="uploadeImg + userList.u_imgurl" alt="" />
        <img v-else src="../../assets/img/shouye/user.png" alt="" />
      </div>
      <div class="header_info">
        <p class="username">
          {{ userList.u_name }}
          <i class="el-icon-female female" v-if="userList.u_sex == 1"></i>
          <i class="el-icon-male male" v-else></i>
        </p>
        <p>手机号：{{ userList.u_tel }}</p>
        <p>角色：{{ userList.role }}</p>
      </div>
    </div>
    <!-- 添加、编辑用户的弹框 -->
    <myInfoModel ref="editUser" @ok="modalFormOk" />
  </div>
</template>

<script>
import myInfoModel from '../user/myInfoModel'

export default {
  components: {
    myInfoModel
  },
  data() {
    return {
      userList: {},
      userInfo: {},
      queryInfo: {
        query: window.sessionStorage.getItem('userId')
      },

      uploadeImg: window._CONFIG.uploade
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users/oneUsers', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        this.userList = res.data.users
        if (this.userList.u_role === 1) {
          this.userList.role = 'VIP用户'
        }
        if (this.userList.u_role === 2) {
          this.userList.role = '教练'
        }
        if (this.userList.u_role === 3) {
          this.userList.role = '管理员'
        }

        console.log('本用户的信息lalallal', this.userList)
      }
    },
    EditDialog() {
      this.$refs.editUser.title = '编辑用户信息'
      const data = {
        userId: this.userList.u_id,
        username: this.userList.u_name,
        pwd: this.userList.u_pwd,
        role: this.userList.u_role,
        tel: this.userList.u_tel,
        sex: this.userList.u_sex,
        u_imgname: this.userList.u_imgname,
        u_imgurl: this.uploadeImg + this.userList.u_imgurl
      }
      this.$refs.editUser.edit(data)
    },
    modalFormOk() {
      this.getUserList()
    }
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
  cursor: pointer;
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
    margin-top: 30px;
    margin-bottom: 20px;
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
  color: #FF69B4;
  font-weight: 700;
}
</style>
