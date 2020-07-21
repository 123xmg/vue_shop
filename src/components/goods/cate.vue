<template>
  <div>
    <!-- 面包屑导航 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item>商品管理</el-breadcrumb-item>

      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary" @click="showAddCataDialog">添加分类</el-button></el-col>
      </el-row>
      <tree-table class="tree_table" :expand-type="false" :data="cateList" :columns="columns" show-index index-text="#" :selection-type="false" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color:green;font-size:16px"></i>
          <i v-else class="el-icon-error" style="color:red;font-size:16px"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" size="mini" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opera" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editBox(scope.row.cat_id)"> </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBox(scope.row.cat_id)"></el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 3, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCataDialogVisible" width="50%" @close="addCataDialogClose">
      <el-form :model="addCataForm" ref="addCataRef" :rules="addCataFromrules" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCataForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分级:">
          <!-- options:数据源 props:指定配置对象 -->
          <el-cascader :options="parentCataList" :props="defaultParams" v-model="selectKeys" @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCataDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCata">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="修改商品属性" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editGoodsCat" ref="editRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editGoodsCat.cat_name"></el-input>
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
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列是模板列
          type: 'template',
          // 当前模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opera'
        }
      ],
      addCataDialogVisible: false,
      addCataForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 添加分类的验证规则
      addCataFromrules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      parentCataList: [],
      // 级联选择
      defaultParams: {
        // 可以选中一级内容
        checkStrictly: true,
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
      // 修改商品属性
      editGoodsCat: {
        cat_name: ''
      },
      editDialogVisible: false,
      editFromrules: {
        cat_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }]
      },
      // 编辑的分类的id
      editId: 0
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取失败！')
      } else {
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getCateList()
    },
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getCateList()
    },
    showAddCataDialog() {
      this.getParentCataList()
      this.addCataDialogVisible = true
    },
    // 获取父类分类的列表
    async getParentCataList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('信息获取父级数据失败！')
      } else {
        this.parentCataList = res.data
      }
    },
    // 级联选择框发生变化
    parentCateChanged() {
      // selectKeys 数组的长度大于0则选中了分类
      if (this.selectKeys.length > 0) {
        // 父级父类的id
        this.addCataForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类等级赋值
        this.addCataForm.cat_level = this.selectKeys.length
      } else {
        // 父级父类的id
        this.addCataForm.cat_pid = 0
        // 为当前分类等级赋值
        this.addCataForm.cat_level = 0
      }
    },
    addCataDialogClose() {
      this.$refs.addCataRef.resetFields()
      this.selectKeys = []
      this.addCataForm = {}
    },
    async addCata() {
      const { data: res } = await this.$http.post('categories', { cat_pid: this.addCataForm.cat_pid, cat_name: this.addCataForm.cat_name, cat_level: this.addCataForm.cat_level })
      if (res.meta.status !== 201) {
        return this.$message.error('添加数据失败！')
      } else {
        this.getCateList()
        this.addCataDialogVisible = false
        this.$message.success('添加数据成功！')
      }
    },
    // 删除分类
    async deleteBox(catId) {
      const confirmresult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('categories/' + catId)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCateList()
        }
      }
    },
    // 修改商品分类按钮
    async editBox(id) {
      this.editId = id
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!')
      }
      this.editGoodsCat = res.data
      this.editDialogVisible = true
    },
    // 编辑对话框关闭
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    // 确认修改商品
    editParams() {
      this.$refs.editRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editId, { cat_name: this.editGoodsCat.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('商品分类修改失败！')
        }
        this.editDialogVisible = false
        this.getCateList()
        this.$message.success('商品分类修改成功！')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.tree_table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
