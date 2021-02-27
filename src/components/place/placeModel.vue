<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="40%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="场地名称：" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="场地管理人:" prop="content">
          <el-input
            @click.native="selectModel"
            v-model="editForm.username"
            placeholder="点击场地管理人"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
    <JuserModel @change="selectUser" ref="selectmodalForm"></JuserModel>
  </div>
</template>

<script>
import moment from 'moment'
import JuserModel from '../common/JuserModel'
export default {
  components: {
    JuserModel
  },
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
      this.edit({
        time: moment(new Date()).format('YYYY-MM-DD')
      })
    },
    edit(record) {
      if (record.user - 0 < 4 || record.user - 0 === 5) {
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
        if (this.editForm.id) {
          // 编辑用户
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.put('place/list', formData)
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
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.post('place/list', formData)
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
    selectUser(id, name, row) {
      this.$set(this.editForm, 'userId', id)
      this.$set(this.editForm, 'username', name)
    },

    selectModel() {
      this.$refs.selectmodalForm.editVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
