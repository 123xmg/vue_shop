<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>私教信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <section class="team-info section-bg">
      <div class="team-member1">
        <div class="team-member">
          <!-- 蒙板 -->
          <div class="profile-image">
            <!-- <img src="../../assets/teacher/3.jpg" alt="" /> -->
            <img v-if="teaInfo.s_imgurl" :src="uploadeImg + teaInfo.s_imgurl" alt="" />
            <img v-else src="../../assets/teacher/3.jpg" alt="" />
            <div class="profile-info">
              <h4 class="name">姓名：{{ teaInfo.u_name }}</h4>
              <p class="position">
                简介：{{
                  teaInfo.s_content
                    ? teaInfo.s_content.length > 12
                      ? teaInfo.s_content.substr(0, 12) + '...'
                      : teaInfo.s_content
                    : ' '
                }}
              </p>

              <p class="position">价格：{{ teaInfo.s_price }}/节</p>
            </div>
            <el-button style="width: 100%; margin-top: 8px" size="small">立即购买</el-button>
          </div>
        </div>
        <div class="team-msg">
          <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="200px">
            <el-form-item label="展示图片：">
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
            <el-form-item label="个人简介：" prop="s_content">
              <el-input
                type="textarea"
                :rows="4"
                v-model="editForm.s_content"
                placeholder="请输入个人简介："
                style="width:80%"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格(/节)：" prop="s_price">
              <el-input
                v-model="editForm.s_price"
                placeholder="请输入价格"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="my_edit">
            <el-button type="primary" @click="editOk">编 辑</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teaInfo: {},
      editForm: {},
      editFromrules: {
        s_content: [{ required: true, message: '请输入个人简介!', trigger: 'blur' }],
        s_price: [{ required: true, message: '请输入价格!', trigger: 'blur' }]
      },
      page: 1,
      queryInfo: {
        query: window.sessionStorage.getItem('userId')
      },
      uploadeURL: window._CONFIG.uploade + '/teacher/uploadImg',
      imgUrl: '',
      fileList: [],
      fileName: '',
      fileUrl: '',
      uploadeImg: window._CONFIG.uploade
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get('teacher/listById', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('获取到的信息', res.data.list)
        this.teaInfo = res.data.list
        this.editForm = res.data.list
        this.fileList = [
          {
            name: this.editForm.s_imgname,
            url: this.uploadeImg + this.editForm.s_imgurl
          }
        ]
      }
    },
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = Object.assign({}, this.editForm)
        formData.s_imgname = this.fileName
        formData.s_imgurl = this.fileUrl
        // 编辑
        console.log('编辑提交的信息', formData)
        const { data: res } = await this.$http.put('teacher/listById', formData)
        if (res.code !== '200') {
          this.$message.error('修改失败')
          this.close()
        } else {
          this.$message.success('修改成功')
          this.getList()
        }
      })
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

<style lang="less" scoped>
/* 团队成员 */
.team-member1 {
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 20px;
  margin-top: 20px;
}
.team-member {
  height: 395px;
  background-color: white;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
  transition: 0.4s;

  display: grid;
  justify-items: center;
}
.team-msg {
  padding-top: 50px;
  background: url(../../assets/teabg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.profile-image {
  overflow: hidden;
}
.profile-image img {
  width: 100%;
  height: 264px;
  object-fit: cover;
  object-position: top center;
}
.profile-info {
  position: relative;
}
.profile-edit {
  position: absolute;
  right: 7px;
  top: 0;
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
}

.team-member .name {
  margin: 5px;
  font-size: 16px;
  color: #727272;
}
.stail {
  margin-right: 5px;
  color: #1890ff;
  cursor: pointer;
}
.team-member .position {
  margin: 5px;
  font-size: 14px;
  color: #8b8b8b;
}
.team-member:hover {
  transform: scale(1.05);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}
.my_edit {
  width: 100%;
  height: 60px;
  padding-top: 20px;
  text-align: center;
}
</style>
