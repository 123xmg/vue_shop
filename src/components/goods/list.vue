<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区 -->
        <el-col :span="8">
          <el-input placeholder="请输入用户名" clearable v-model="queryInfo.query" @clear="getGoodsList" @keyup.enter.native="getGoodsList">
            <el-button icon="el-icon-search" slot="append" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品区 -->
        <el-col :span="4"><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"> </el-table-column>

        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>

        <el-table-column prop="goods_price" label="商品价格(元)" width="95px"> </el-table-column>

        <el-table-column prop="goods_weight" label="商品重量" width="70px"> </el-table-column>

        <el-table-column label="创建时间" width="140px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editBox(scope.row.goods_id)"> </el-button>

            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBox(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 4, 6, 8, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="修改商品属性" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editGoodsList" ref="editRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsList.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editGoodsList.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsList.goods_weight"></el-input>
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
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      editDialogVisible: false,
      editId: 0,
      editGoodsList: {},
      editFromrules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!')
      } else {
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 一页显示的条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 删除商品
    async deleteBox(goodsId) {
      const confirmresult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('goods//' + goodsId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getGoodsList()
        }
      }
    },
    // 添加商品
    goAddPage() {
      this.$router.push('/goods/add')
    },
    // 修改商品按钮
    async editBox(id) {
      this.editId = id
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!')
      }
      this.editGoodsList = res.data
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
        const { data: res } = await this.$http.put('goods/' + this.editId, this.editGoodsList)
        if (res.meta.status !== 200) {
          return this.$message.error('商品属性修改失败！')
        }
        this.editDialogVisible = false
        this.getGoodsList()
        this.$message.success('商品属性修改成功！')
      })
    }
  }
}
</script>
<style lang="less" scope></style>
