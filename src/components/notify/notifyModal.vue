<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="85px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="editForm.content"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="发送时间：" prop="time">
          <el-date-picker
            type="date"
            v-model="editForm.time"
            placeholder="请输入发送时间"
            style="width: 100%;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="接收人：" prop="users">
          <!-- <el-input v-model="editForm.user" placeholder="请输入接收人"></el-input> -->
          <el-radio-group v-model="editForm.users">
            <el-radio :label="5">所有用户</el-radio>
            <el-radio :label="3">管理员</el-radio>
            <el-radio :label="2">教练</el-radio>
            <el-radio :label="1">VIP用户</el-radio>
            <el-radio :label="0">普通用户</el-radio>
            <el-radio :label="4">指定用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接收人：" prop="user" v-if="editForm.users == '4'">
          <el-input
            v-model="editForm.user"
            placeholder="请输入接收人"
            @click.native="selectModel"
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
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.put('notify/list', formData)
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
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.post('notify/list', formData)
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
    },
    selectUser(id, name, row) {
      this.$set(this.editForm, 'userId', id)
      this.$set(this.editForm, 'user', name)
    },

    selectModel() {
      this.$refs.selectmodalForm.editVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
