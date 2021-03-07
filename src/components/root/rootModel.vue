<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="125px">
        <el-form-item label="权限类型：" prop="m_uid">
          <el-select v-model="editForm.m_uid" placeholder="请选择权限类型" style="width:100%">
            <el-option label="VIP用户" :value="1"></el-option>
            <el-option label="教练" :value="2"></el-option>
            <el-option label="管理员" :value="3"></el-option>
            <el-option label="所有用户" :value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
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
      title: '添加用户',
      editForm: {},
      model: {},
      editFromrules: {
        m_uid: [{ required: true, message: '请选择权限类型!', trigger: 'blur' }]
      }
    }
  },

  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.editForm = {}
      this.editForm = Object.assign({}, record)
      this.model = Object.assign({}, record)
      this.editVisible = true
    },
    editOk() {
      console.log('ok触发')
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = Object.assign({}, this.editForm)
        if (this.editForm.m_id) {
          // 编辑用户
          console.log('编辑提交的数据', formData)
          const { data: res } = await this.$http.put('users/menuList', formData)
          if (res.code !== '200') {
            this.$message.error('修改失败')
            this.close()
          } else {
            this.$message.success('修改成功')
            this.editVisible = false
            this.$emit('ok')
          }
        }
      })
    },
    close() {
      this.editForm = this.model
    },
    getStartTime(date) {
      console.log('start', date)
      this.editForm.c_start_time = date
    },
    getEndTime(date) {
      console.log('end', date)

      this.editForm.c_end_time = date
    },
    selectUser(id, name, row) {
      this.$set(this.editForm, 'c_uid', id)
      this.$set(this.editForm, 'u_name', name)
    },

    selectModel() {
      this.$refs.selectmodalForm.editVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
