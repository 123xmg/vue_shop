<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="125px">
        <el-form-item label="课程名称：" prop="c_name">
          <el-input v-model="editForm.c_name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程类型：" prop="c_type_id">
          <el-select v-model="editForm.c_type_id" placeholder="请选择课程类型" style="width:100%">
            <el-option label="动感操" :value="'1'"></el-option>
            <el-option label="瑜伽" :value="'2'"></el-option>
            <el-option label="动感单车" :value="'3'"></el-option>
            <el-option label="汗蒸" :value="'4'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课地点：" prop="c_pid">
          <el-radio-group v-model="editForm.c_pid">
            <el-radio :label="1">动感操房</el-radio>
            <el-radio :label="2">瑜伽房</el-radio>
            <el-radio :label="3">动感单车</el-radio>
            <el-radio :label="4">汗蒸房</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程开始时间：" prop="c_start_time">
          <el-date-picker
            type="datetime"
            v-model="editForm.c_start_time"
            placeholder="请输入发送时间"
            style="width: 100%;"
            format="HH:mm"
            value-format="HH:mm"
            @change="getStartTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="课程结束时间：" prop="c_end_time">
          <el-date-picker
            type="datetime"
            v-model="editForm.c_end_time"
            placeholder="请输入发送时间"
            style="width: 100%;"
            format="HH:mm"
            value-format="HH:mm"
            @change="getEndTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="教练名称：" prop="u_name">
          <el-input
            v-model="editForm.u_name"
            placeholder="点击选择课程教练"
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
// import moment from 'moment'
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
      this.edit({})
    },
    edit(record) {
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
        if (this.editForm.c_id) {
          // 编辑用户
          console.log('编辑用户提交的数据', formData)
          const { data: res } = await this.$http.put('course/list', formData)
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
          console.log('添加用户提交的数据', formData)
          const { data: res } = await this.$http.post('course/list', formData)
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
