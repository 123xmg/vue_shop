<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="上传头像：">
          <el-upload
            class="upload-demo"
            :action="uploadeURL"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :file-list="fileList"
            list-type="picture"
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
      fileName: '',
      fileUrl: '',
      editFromrules: {
        username: [
          { required: true, message: '请输入用户名!', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        pwd: [{ required: true, message: '请输入密码!', trigger: 'blur' }],
        tel: [{ validator: phonecheckAge, trigger: 'blur' }]
      },
      uploadeURL: window._CONFIG.uploade + '/users/upload',
      imgUrl: '',
      fileList: []
    }
  },
  methods: {
    add() {
      this.fileList = []
      this.edit({})
    },
    edit(record) {
      console.log('编辑', record)
      record.roorm = {}
      this.editFle = parseInt(record.role) || record.role
      this.editForm = Object.assign({}, record)
      this.model = Object.assign({}, record)
      this.editVisible = true
      this.fileList = [
        {
          name: this.editForm.u_imgname,
          url: this.editForm.u_imgurl
        }
      ]
    },
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = Object.assign({}, this.editForm)
        console.log(this.fileName, this.fileUrl)
        formData.u_imgname = this.fileName
        formData.u_imgurl = this.fileUrl
        if (this.editForm.userId) {
          // 编辑用户
          console.log('编辑提交的信息', formData)
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
    // 图片上传成功
    uploadSuccess(res, file) {
      this.fileList = [
        {
          name: file.name,
          url: file.url
        }
      ]
      this.fileName = file.response.fileList.fileName
      this.fileUrl = file.response.fileList.fileUrl
    },
    // 图片上传之前
    uploadBefore(file) {
      const limitMax = 5000 * 1024
      if (file.size > limitMax) {
        this.$message.error('大小超出限制!')
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
