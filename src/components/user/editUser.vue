<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="上传头像：" prop="username">
          <el-upload
            class="upload-demo"
            :action="uploadeURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pwd">
          <el-input v-model="editForm.pwd" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="tel">
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
        <el-button @click="editVisible = false">取 消</el-button>
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
      title: '添加用户',
      editForm: {},
      model: {},
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
      },
      // uploadeURL: 'http://127.0.0.1:8081/api/private/v1/upload',
      uploadeURL: 'http:////127.0.0.1:8081',
      headersObje: {
        Authorization: window.sessionStorage.getItem('token')
      },
      fileList: [
        {
          name: '营业资格证.jpeg',
          url: 'blob:http://localhost:8080/92de8c33-5187-458c-9856-642e7365b37f'
        }
        // {
        //   name: 'food2.jpeg',
        //   url:
        //     'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ]
    }
  },

  methods: {
    add() {
      this.fileList = []
      this.edit({})
    },
    edit(record) {
      console.log('编辑', record)
      record.role = parseInt(record.role) || record.role
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
        if (this.editForm.userId) {
          // 编辑用户
          const { data: res } = await this.$http.put('users/allUser', formData)
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
          const { data: res } = await this.$http.post('users/allUser', formData)
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
    handleRemove(file, fileList) {
      console.log('handleRemove', file, fileList)
    },
    handlePreview(file) {
      console.log('handlePreview', file)
    },
    handleSuccess(res, file, fileList) {
      console.log('////')
      console.log('res', res)
      console.log('file', file)
      console.log('fileList', fileList)
      this.fileList.url = file.url
    }
  }
}
</script>
<style lang="less" scoped></style>
