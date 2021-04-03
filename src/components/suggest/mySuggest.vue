<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>意见管理</el-breadcrumb-item>
      <el-breadcrumb-item>意见列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card>
      <div class="add-btn">
        <el-button type="primary" @click="handleAdd">添加意见</el-button>
      </div>
      <el-table
        :data="infoList"
        border
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'time', order: 'descending' }"
      >
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="content" label="内容" align="center">
          <template slot-scope="scope">
            <div :title="scope.row.content">
              {{
                scope.row.content.length > 18
                  ? scope.row.content.substr(0, 18) + '...'
                  : scope.row.content
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发布时间" align="center" sortable> </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <a type="text" @click="EditDialog(scope.row)">编辑</a>
            <el-divider direction="vertical"></el-divider>
            <a type="text" @click="deleteBox(scope.row.id)">删除</a>
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
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加、编辑用户的弹框 -->
    <mySuggestModel ref="modalForm" @ok="modalFormOk" />
  </div>
</template>
<script>
import mySuggestModel from './mySuggestModel'

export default {
  components: {
    mySuggestModel
  },
  data() {
    return {
      infoList: [],
      total: 0,
      queryInfo: {
        query: window.sessionStorage.getItem('userId'),
        pagenum: 1,
        pagesize: 4
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get('suggest/mylist', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('所有用户的信息', res)
        this.infoList = res.data.list
        this.total = res.data.total
      }
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    // 一页显示的条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    handleAdd() {
      this.$refs.modalForm.title = '添加意见'
      this.$refs.modalForm.add()
    },
    EditDialog(datasource) {
      this.$refs.modalForm.title = '编辑意见'
      this.$refs.modalForm.edit(datasource)
    },
    modalFormOk() {
      this.getList()
    },
    getTime(date) {
      this.queryInfo.time = date
    },
    // 删除消息
    async deleteBox(id) {
      const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('suggest/list?id=' + id)
        if (res.code !== '200') {
          return this.$message.error('删除失败')
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList(1)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-col {
  min-height: 1px;
}
</style>
