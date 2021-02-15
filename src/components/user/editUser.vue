<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog title="编辑用户信息" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="85px">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="tel" required>
          <el-input v-model="editForm.tel" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="editForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择用户角色" style="width:100%">
            <el-option label="普通用户" :value="0"></el-option>
            <el-option label="VIP用户" :value="1"></el-option>
            <el-option label="教练" :value="2"></el-option>
            <el-option label="管理员" :value="3"></el-option>
          </el-select>
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
      editVisible: false,
      editForm: {},
      editFromrules: {
        username: [
          { required: true, message: '请输入用户名!', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        tel: [{ validator: phonecheckAge, trigger: 'blur' }]
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
