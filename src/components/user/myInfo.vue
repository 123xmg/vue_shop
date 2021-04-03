<template>
  <div>
    <!-- myInfo -->
    <div class="my_info">
      <div class="my_center">
        <div class="my_content">
          <p class="my_detail">姓名：{{ userList.u_name }}</p>
          <p class="my_detail">性别：{{ userList.u_sex == 0 ? '男' : '女' }}</p>
          <p class="my_detail">
            手机号：<span style="letter-spacing: 0;">{{ userList.u_tel }}</span>
          </p>
          <p class="my_detail">身份：{{ userList.role }}</p>
          <p class="my_detail">状态：{{ userList.u_lock == 0 ? '正常' : '禁用' }}</p>
        </div>
        <div class="header_img">
          <img v-if="userList.u_imgurl" :src="uploadeURL + userList.u_imgurl" alt="" />
          <img v-else src="../../assets/img/shouye/user.png" alt="" />
        </div>
        <div class="my_edit">
          <el-button type="primary" @click="EditDialog(userList)">编 辑</el-button>
        </div>
      </div>
    </div>

    <!-- 添加、编辑用户的弹框 -->
    <myInfoModel ref="editUser" @ok="modalFormOk" />
  </div>
</template>
<script>
import myInfoModel from './myInfoModel'

export default {
  components: {
    myInfoModel
  },
  data() {
    return {
      userList: {},
      uploadeURL: window._CONFIG.uploade,
      imgUrl: '',
      total: 0,
      queryInfo: {
        query: window.sessionStorage.getItem('userId')
      }
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
        console.log('本用户的信息', res)
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
      }
    },
    EditDialog(datasource) {
      const editData = {
        userId: datasource.u_id,
        username: datasource.u_name,
        pwd: datasource.u_pwd,
        role: datasource.u_role,
        tel: datasource.u_tel,
        sex: datasource.u_sex,
        u_imgname: datasource.u_imgname,
        u_imgurl: this.imgUrl
      }
      this.$refs.editUser.title = '编辑用户信息'
      this.$refs.editUser.edit(editData)
    },
    modalFormOk() {
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scoped>
.my_info {
  width: 100%;
  height: 85vh;
  background: url(../../assets/myInfo.jpg) no-repeat center center;
  background-size: 100%;
}
.my_center {
  width: 60%;
  height: 100%;
  margin: 0 auto;
  background-color: #263133;
  opacity: 0.75;
}
.my_content {
  width: 50%;
  margin: 0 auto;
  padding-top: 40px;
  color: #fff;
}
.my_detail {
  margin: 15px;
  font-size: 20px;
  letter-spacing: 5px;
}
.header_img {
  width: 100%;
  height: 115px;
  padding: 10px 0 20px;
  overflow: hidden;
  img {
    display: block;
    width: 115px;
    height: 100%;
    margin: 0 auto;
    border-radius: 50%;
  }
}
.my_edit {
  width: 100%;
  height: 60px;
  padding-top: 20px;
  text-align: center;
}
</style>
