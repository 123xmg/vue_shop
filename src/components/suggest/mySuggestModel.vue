<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="85px">
        <el-form-item label="意见内容:" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12 }"
            v-model="editForm.content"
            placeholder="请输入内容"
          ></el-input>
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
import moment from 'moment'
export default {
  data() {
    return {
      editVisible: false,
      title: '添加用户',
      editForm: {},
      model: {},
      editFromrules: {
        users: [{ required: true, message: '请选择接收人!', trigger: 'blur' }]
      },
      url: {
        add: '',
        edit: ''
      }
    }
  },

  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      if (record.user - 0 < 4) {
        record.users = parseInt(record.user)
      } else {
        record.users = 4
      }
      console.log('bianji', record)
      this.editForm = {}
      this.editForm = Object.assign({}, record)
      this.model = Object.assign({}, record)
      this.editVisible = true
    },
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = Object.assign({}, this.editForm)
        console.log(formData)
        if (formData.users !== 4) {
          formData.user = formData.users
        }
        if (this.editForm.id) {
          // 编辑用户
          formData.time = moment(new Date()).format('YYYY-MM-DD')
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.put('suggest/list', formData)
          if (res.code !== '200') {
            this.$message.error('修改失败')
            this.close()
          } else {
            this.$message.success('修改成功')
            this.editVisible = false
            this.$emit('ok')
          }
        } else {
          // 添加用户
          formData.name = window.sessionStorage.getItem('username')
          formData.time = moment(new Date()).format('YYYY-MM-DD')
          const { data: res } = await this.$http.post('suggest/list', formData)
          if (res.code !== '200') {
            this.$message.error('添加失败')
          } else {
            this.$message.success('添加成功')
            this.editVisible = false
            this.$emit('ok')
          }
        }
      })
    },
    close() {
      this.editForm = this.model
    },
    getTime(date) {
      this.editForm.time = date
    }
  }
}
</script>
<style lang="less" scoped></style>
