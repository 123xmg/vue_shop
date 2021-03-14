<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card class="box-card">
      <el-row :span="24">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button icon="el-icon-search" slot="append" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" style="margin-left:10px">
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->

      <el-table
        :data="userList"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'state', order: 'descending' }"
      >
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="header" label="头像" align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.sex }} -->
            <div class="block">
              <el-avatar
                shape="square"
                :size="40"
                v-if="scope.row.u_imgurl"
                :src="uploadeURL + scope.row.u_imgurl"
              ></el-avatar>
              <el-avatar
                shape="square"
                :size="40"
                v-else
                src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
              ></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center"> </el-table-column>

        <el-table-column prop="tel" label="手机号" align="center"> </el-table-column>
        <el-table-column label="性别" align="center" prop="sex" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '0'">男</span>
            <span v-if="scope.row.sex == '1'">女</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" prop="role" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.role == '1'">VIP用户</span>
            <span v-if="scope.row.role == '2'">教练</span>
            <span v-if="scope.row.role == '3'">管理员</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="state" sortable>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <a type="text" @click="EditDialog(scope.row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a type="text" @click="deleteBox(scope.row.userId)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 4, 6, 8, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加、编辑用户的弹框 -->
    <editUser ref="editUser" @ok="modalFormOk" />
  </div>
</template>
<script>
import editUser from './editUser'

export default {
  components: {
    editUser
  },
  data() {
    return {
      userList: [],
      imgUrl: '',
      total: 0,
      uploadeURL: window._CONFIG.uploade,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      }
    }
  },
  created() {
    this.getUserList(1)
  },
  methods: {
    async getUserList(age) {
      if (age) {
        this.queryInfo.pagenum = 1
      }
      const { data: res } = await this.$http.get('users/allUser', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('所有用户的信息', res)
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 一页显示的条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 开关的设置的管理
    async userStateChange(userInfo) {
      console.log('该用户所有的信息', userInfo)
      const { data: res } = await this.$http.put(
        `users/userStatus?id=${userInfo.userId}&lock=${userInfo.state}`
      )
      if (res.code !== '200') {
        this.getUserList()
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success('用户状态修改成功')
    },
    // 删除用户
    async deleteBox(userId) {
      const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('users/allUser/?id=' + userId)
        if (res.code !== '200') {
          return this.$message.error('删除失败')
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList(1)
        }
      }
    },
    EditDialog(datasource) {
      this.$refs.editUser.title = '编辑用户信息'
      this.$refs.editUser.edit(datasource)
    },
    handleAdd() {
      this.$refs.editUser.title = '添加用户信息'
      this.$refs.editUser.add()
    },
    modalFormOk() {
      this.getUserList()
    }
  }
}
</script>
<style lang="less" scope>
.el-col {
  min-height: 1px;
}
</style>
