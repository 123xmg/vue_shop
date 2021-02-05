<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="xiaojingyu" title="小鲸鱼" />
        <span>小鲸鱼健身房管理系统</span>
      </div>
      <div class="icon-message">
        <i class="iconfont icon-xiaoxi"></i>
        <div class="message-num">1</div>
      </div>
      <div class="off_login" @click="handleLogout">
        <i class="el-icon-switch-button" style="margin-right: 5px;"></i>
        <span>退出登录</span>
      </div>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左边 -->
      <el-aside :width="isCollaspse ? '64px' : '200px'">
        <div class="toggle_menu" @click="toogleCollaspse">|||</div>
        <el-menu background-color="#333847" text-color="#fff" active-text-color="#409fff" :collapse="isCollaspse" unique-opened :collapse-transition="false" router :default-active="activePath">
          <!-- 菜单一 -->
          <el-submenu :index="oneItem.id + ''" v-for="oneItem in menuList" :key="oneItem.id">
            <template slot="title">
              <i :class="iconObj[oneItem.id]"></i>
              <span>{{ oneItem.authName }}</span>
            </template>
            <el-menu-item :index="'/' + twoItem.path" v-for="twoItem in oneItem.children" :key="twoItem.id" @click="savePath('/' + twoItem.path)">
              <i class="el-icon-s-grid"></i>
              <span>{{ twoItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      isCollaspse: false,
      menuList: {},
      iconObj: {
        110: 'iconfont icon-souye-copy',
        111: 'iconfont icon-user1',
        116: 'iconfont icon-lock',
        117: 'iconfont icon-danju',
        118: 'iconfont icon-changdi',
        119: 'iconfont icon-xiaoxi1',
        120: 'iconfont icon-yijian1'
      },
      activePath: '/home'
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    console.log('this.activePath', this.activePath)
  },
  methods: {
    // 退出
    handleLogout() {
      // window.sessionStorage.clear()
      // this.$router.push('/login')
      this.$confirm('真的要退出登录吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('users/menu')
      console.log('查询得到的数据', res)
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      } else {
        this.menuList = res.msg
      }
    },
    // 是否折叠菜单栏
    toogleCollaspse() {
      this.isCollaspse = !this.isCollaspse
    },
    // 保存路由
    savePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scope>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #333a3d;
  padding-left: 0px !important;
  align-items: center;
  font-size: 20px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    > img {
      cursor: pointer;
      margin-left: 10px;
      margin-right: 10px;
    }
  }
}
.el-aside {
  background-color: #333847;
}
.el-main {
  background-color: #e7ecef;
}
.iconfont {
  margin-right: 5px;
}
.el-menu {
  border-right: none !important;
}
.toggle_menu {
  height: 24px;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  background-color: #4b5769;
  cursor: pointer;
}
.off_login {
  position: absolute;
  top: 15px;
  right: 10px;
  width: 100px;
  height: 30px;
  font-size: 15px;
  cursor: pointer;
  i {
    vertical-align: middle;
  }
}
.icon-message {
  position: relative;
  width: 25px;
  margin-right: 110px;
}
.message-num {
  position: absolute;
  top: -8px;
  right: 2px;
  width: 15px;
  height: 15px;
  font-size: 15px;
  line-height: 15px;
  text-align: center;
  border-radius: 50%;
  background-color: red;
}
</style>
