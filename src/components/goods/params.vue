<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>

      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为三级分类设置相关参数！" type="warning" show-icon :closable="false" />
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择文本分类：</span>
          <el-cascader v-model="selectKeys" :options="paramsList" :props="paramsParams" @change="paramsChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态表格 -->
          <el-table :data="manyTableData" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag :key="index" v-for="(item, index) in scope.row.attr_vals" closable @close="handTagClose(index, scope.row)"> {{ item }}</el-tag>
                <!-- 点击添加的标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" border stripe style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag :key="index" v-for="(item, index) in scope.row.attr_vals" closable @close="handTagClose(index, scope.row)"> {{ item }}</el-tag>
                <!-- 点击添加的标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" ref="addRef" :rules="addFromrules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 -->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" ref="editRef" :rules="editFromrules" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 参数的所有信息
      paramsList: [],
      // 多级列表指定参数
      paramsParams: {
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
      // 选中的级联的id
      selectKeys: [],
      // 记录选中的界面
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加的参数
      addForm: {
        attr_name: ''
      },
      // 参数的验证
      addFromrules: {
        attr_name: [{ required: true, message: '请输入添加参数!', trigger: 'blur' }]
      },
      // 修改参数对话框的显示与隐藏
      editDialogVisible: false,
      editForm: {},
      // 参数的验证
      editFromrules: {
        attr_name: [{ required: true, message: '请输入添加参数!', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getParamsList()
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取失败！')
      } else {
        this.paramsList = res.data
      }
    },
    // 级联选择框变化
    paramsChange() {
      this.getParamsData()
    },
    // 切换
    handleTabClick() {
      this.getParamsData()
    },
    // 抽离函数，多级选框变化，切换动静态 都会触发
    async getParamsData() {
      if (this.selectKeys.length !== 3) {
        this.paramsList = []
        this.manyTableData = []
        this.onlyTableData = []
      }
      const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取失败！')
      } else {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框输入的值
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }
    },
    // 添加对话框关闭
    addDialogClose() {
      this.$refs.addRef.resetFields()
    },
    // 添加参数
    addParams() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cataId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('参数添加失败！')
        } else {
          this.addDialogVisible = false
          this.getParamsData()
          this.$message.success('参数添加成功！')
        }
      })
    },
    // 修改对话框关闭
    editDialogClose() {},
    // 修改对话框展开时获取数据
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes/${attrId}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('参数获取失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改参数
    editParams() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cataId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('参数修改失败！')
        }
        this.editDialogVisible = false
        this.getParamsData()
        this.$message.success('参数修改成功！')
      })
    },
    // 删除参数按钮
    async showDeleteDialog(attrid) {
      const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cataId}/attributes/${attrid}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message.success('删除成功!')
          this.getParamsData()
        }
      }
    },
    // 文本框失去焦点或者失去焦点时触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setAttrVals(row)
    },
    // 点击按钮，显示输入框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // $nextTick当页面的元素重新备选然后，才会指定会点函数的代码获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数tag
    async handTagClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.setAttrVals(row)
    },
    // 抽离函数，用来提示讲参数下的选项修改成功
    // 将对attr_vals的操作保存到数据库
    async setAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cataId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败！')
      }
      this.$message.success('修改参数成功！')
    }
  },
  computed: {
    // 如果按钮被禁用，则为true
    isBtnDisable() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cataId() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      }
      return null
    },
    // 当前的添加框显示的值
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 150px;
}
</style>
