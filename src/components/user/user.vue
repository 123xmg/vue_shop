<template>
  <div>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>用户管理</el-breadcrumb-item>

      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button icon="el-icon-search" slot="append" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->

      <el-table :data="userList" border stripe>
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="username" label="姓名"> </el-table-column>

        <el-table-column prop="mobile" label="电话"> </el-table-column>

        <el-table-column prop="email" label="邮箱"> </el-table-column>

        <el-table-column prop="role_name" label="角色"> </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditDialog(scope.row.id)"> </el-button>

            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBox(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
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
    <!-- 添加用的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" ref="addUserRef" :rules="addFromrules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="showEditDialog" width="50%" @close="editDialogClose">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="setRoleRightDialog" width="50%" @close="setRoleDialogClose">
      <p>当前用户名：{{ setRoleInfo.username }}</p>
      <p>当前权限：{{ setRoleInfo.role_name }}</p>
      <p>
        分配新角色：
        <el-select v-model="selectRoleId" clearable placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRoleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var emailcheckAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱'))
      }
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱!'))
    }
    var phonecheckAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号!'))
      }
      const regPhone = /^1[3456789]\d{9}$/
      if (regPhone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号!'))
    }
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      roleList: [],
      setRoleInfo: {},
      // 已选中的权限id
      selectRoleId: '',
      addDialogVisible: false,
      showEditDialog: false,
      setRoleRightDialog: false,
      addFromrules: {
        username: [
          { required: true, message: '请输入用户名!', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],

        email: [{ validator: emailcheckAge, trigger: 'blur' }],
        mobile: [{ validator: phonecheckAge, trigger: 'blur' }]
      },
      editForm: {},
      editFromrules: {
        email: [{ validator: emailcheckAge, trigger: 'blur' }],
        mobile: [{ validator: phonecheckAge, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!')
      } else {
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
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更改失败')
      }
      this.$message.success('更改成功')
    },
    // 关闭对话框
    addDialogClose() {
      this.$refs.addUserRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', { username: this.addForm.username, password: this.addForm.password, email: this.addForm.email, mobile: this.addForm.mobile })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        } else {
          this.$message.success('添加成功')
          this.getUserList()
        }
      })
      this.addDialogVisible = false
    },
    // 修改用户
    async EditDialog(userId) {
      const { data: res } = await this.$http.get('users/' + userId)
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      } else {
        this.editForm = res.data
        this.showEditDialog = true
      }
    },
    editDialogClose() {
      this.$refs.editFromrules.resetFields()
    },
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { id: this.editForm.id, email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        } else {
          this.getUserList()
          this.showEditDialog = false
          return this.$message.success('修改成功')
        }
      })
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
        const { data: res } = await this.$http.delete('users/' + userId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        }
      }
    },
    // 分配角色
    async setRole(user) {
      this.setRoleInfo = user
      this.setRoleRightDialog = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败！')
      } else {
        this.roleList = res.data
      }
    },
    // 分配确定
    async setRoleOk() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.setRoleInfo.id}/role`, { id: this.setRoleInfo.id, rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.getUserList()
        this.$message.success('更新成功！')
        this.setRoleRightDialog = false
      }
    },
    setRoleDialogClose() {
      this.userInfo = {}
      this.selectRoleId = ''
    }
  }
}
</script>
<style lang="less" scope></style>
