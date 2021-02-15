<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog title="编辑用户信息" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="editForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="editForm.role"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editVisible: false,
      editForm: {},
      editFromrules: {
        // email: [{ validator: emailcheckAge, trigger: 'blur' }],
        // mobile: [{ validator: phonecheckAge, trigger: 'blur' }]
      }
    }
  },

  methods: {
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
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        } else {
          this.getUserList()
          this.showEditDialog = false
          return this.$message.success('修改成功')
        }
      })
    },
    close() {
      this.$refs.editFromrules.resetFields()
    }
  }
}
</script>
<style lang="less" scoped></style>
