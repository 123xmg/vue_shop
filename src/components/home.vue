<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="heima" title="黑马" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
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
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-lock_fill',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menuList = res.data
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
</style>
