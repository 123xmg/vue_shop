<template>
  <div>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>权限管理</el-breadcrumb-item>

      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button></el-col>
      </el-row>
      <el-table :data="rolesList" stripe border style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="24" v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="[i1 === 0 ? 'bdtop' : '', 'bdbottom', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag type="primary" closable @close="deleteRight(scope.row, item1.id)">{{ item1.authName }} </el-tag><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <el-row :gutter="24" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6"
                    ><el-tag type="success" closable @close="deleteRight(scope.row, item2.id)">{{ item2.authName }} </el-tag><i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18"
                    ><el-tag type="warning" closable v-for="item3 in item2.children" :key="item3.id" @close="deleteRight(scope.row, item3.id)">{{ item3.authName }} </el-tag></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="eidtEditSetting(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="SetRightVisible" width="50%" @close="SetRightClose">
      <!-- 树形结构 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加用户" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClose">
      <el-form :model="addRoleForm" ref="addUserRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息 -->
    <el-dialog title="修改角色信息" :visible.sync="showRoleEditDialog" width="50%" @close="editRoleDialogClose">
      <el-form :model="editRoleInfo" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRoleEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      SetRightVisible: false,
      rightList: [],
      // 树形控件能看到的属性
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 已经选中的默认项
      defkeys: [],
      // 要给分配的权限对象的id
      roleId: '',
      addRoleDialogVisible: false,
      // 添加角色
      addRoleForm: {},
      // 修改角色
      editRoleInfo: [],
      showRoleEditDialog: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      } else {
        this.rolesList = res.data
      }
    },
    // 删除权限
    async deleteRight(role, rightId) {
      var confirmresult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          role.children = res.data
          this.$message.success('删除成功!')
        }
      }
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败！')
      } else {
        this.rightList = res.data
        this.getLeftKeys(role, this.defkeys)
      }
      this.SetRightVisible = true
    },
    // 通过递归将所有的选中的权限id筛选出来

    getLeftKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeftKeys(item, arr)
      })
    },
    // 关闭对话框
    SetRightClose() {
      this.defkeys = []
    },
    // 角色授权
    async allotRight() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keys })
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败！')
      } else {
        this.$message.success('权限分配成功！')
        this.getRolesList()
        this.SetRightVisible = false
      }
    },
    addRoleDialogClose() {
      this.addRoleForm = {}
    },
    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post('roles', { roleName: this.addRoleForm.roleName, roleDesc: this.addRoleForm.roleDesc })
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      } else {
        this.getRolesList()
        this.addRoleDialogVisible = false
        this.$message.success('添加成功')
      }
    },
    // 删除角色
    async deleteRole(roleId) {
      const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('roles/' + roleId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功!')
          this.getRolesList()
        }
      }
    },
    // 编辑角色信息
    editRoleDialogClose() {
      this.editRoleInfo = {}
    },
    async eidtEditSetting(roleId) {
      const { data: res } = await this.$http.get('roles/' + roleId)
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取失败！')
      } else {
        this.editRoleInfo = res.data
        this.showRoleEditDialog = true
      }
    },
    async editRoleOk() {
      console.log(this.editRoleInfo.roleName)
      const { data: res } = await this.$http.put('roles/' + this.editRoleInfo.roleId, { roleName: this.editRoleInfo.roleName, roleDesc: this.editRoleInfo.roleDesc })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失败！')
      } else {
        this.getRolesList()
        this.$message.success('修改成功！')
      }
    }
  }
}
</script>
<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  align-items: center;
}
</style>
