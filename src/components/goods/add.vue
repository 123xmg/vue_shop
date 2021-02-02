<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-alert title="添加商品属性" center type="info" show-icon :close="false"> </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form包裹tabs标签 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 竖向tab -->
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="paramsList" :props="paramsProps" @change="paramsChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" :prop="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :prop="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传的api  handlePreview 点击图片名称浏览图片  handleRemove 移除图片 list-type 上传图片的渲染效果 -->
            <el-upload class="upload-demo" :action="uploadeURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObje" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 父文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picdialogVisible" width="50%">
      <img :src="previewPath" alt="预览图" class="privewImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      // 添加商品
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 新建一个属性，存放选中的分类id
        goods_cat: [],
        // 上传后的图片数组
        pics: [],
        // 商品的详情介绍
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称!', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格!', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量!', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量!', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类!', trigger: 'blur' }]
      },
      // 参数列表信息
      paramsList: [],
      // 多级列表指定参数
      paramsProps: {
        // 可以选中一级内容
        checkStrictly: false,
        // 指定触发方式
        expandTrigger: 'hover',
        // 数据源parantList中的cat_id做数据绑定
        value: 'cat_id',
        // 数据源parantList的cat_name渲染出来的内容
        label: 'cat_name',
        // 数据源parantList的children做嵌套
        children: 'children'
      },
      // 当前选中的分类的动态参数
      manyTableData: [],
      // 当前选中的分类的静态属性
      onlyTableData: [],
      // 图片上传的地址
      uploadeURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片时添加请求头
      headersObje: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览的存放路径
      previewPath: '',
      // 图片预览对话框的显示与隐藏
      picdialogVisible: false
    }
  },
  methods: {
    // 获取多级选框的数据
    async getParamsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取失败！')
      } else {
        this.paramsList = res.data
      }
    },
    // 联动框发生变化
    paramsChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 离开当前页，走向下一页的时候会触发
    // activeName 前往的页 oldActiveName 当前页
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 切换tab栏时触发
    async tabClicked() {
      if (this.activeIndex === '1') {
        // 访问的是动态参数面板
        const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('信息获取失败！')
        } else {
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
          this.manyTableData = res.data
        }
      }
      if (this.activeIndex === '2') {
        // 访问的是静态属性面板
        const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('信息获取失败！')
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    // 处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.picdialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      // 1. 获取删除的图片的临时路径，从数组中找到索引值，进行删除splice
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功
    handleSuccess(response) {
      // 1. 拼接的得到的图片信息对象
      // 2. 将图片信息对象拼接到pics数组中
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 添加属性
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的信息！')
        }
        // 执行添加
        const deepAddform = _.cloneDeep(this.addForm)
        deepAddform.goods_cat = deepAddform.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        deepAddform.attrs = this.addForm.attrs
        // 发起请求，进行添加
        const { data: res } = await this.$http.post('goods/', deepAddform)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        } else {
          this.$message.success('添加成功！')
          this.$router.push('/goods')
        }
      })
    }
  },
  created() {
    this.getParamsList()
  },
  computed: {
    cataId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scope>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.privewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px !important;
}
</style>
