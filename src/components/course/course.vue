<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card class="box-card">
      <el-row :span="24">
        <el-form label-width="82px" label-position="center">
          <el-col :span="7">
            <el-form-item label="课程名称：">
              <el-input
                placeholder="请输入课程名称"
                v-model="queryInfo.title"
                clearable
                @clear="getList"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left:10px">
            <el-button type="primary" icon="el-icon-search" @click="getList">查 询</el-button>
          </el-col>
        </el-form>
      </el-row>

      <!-- 表格区 -->
      <div class="add-btn">
        <el-button type="primary" @click="handleAdd">添加课程</el-button>
      </div>
      <el-table
        :data="userList"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'state', order: 'descending' }"
      >
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="c_name" label="课程名称" align="center"> </el-table-column>
        <el-table-column prop="ct_name" label="课程类型" align="center"> </el-table-column>
        <el-table-column prop="p_name" label="上课地点" align="center"> </el-table-column>
        <el-table-column prop="c_start_time" label="课程开始时间" align="center" sortable>
        </el-table-column>
        <el-table-column prop="c_end_time" label="课程结束时间" align="center" sortable>
        </el-table-column>
        <el-table-column prop="u_name" label="教练名称" align="center"> </el-table-column>

        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="EditDialog(scope.row)"
            >
            </el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteBox(scope.row.c_id)"
            ></el-button>
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
    <courseModal ref="modelFormRef" @ok="modalFormOk" />
  </div>
</template>
<script>
import courseModal from './courseModal'

export default {
  components: {
    courseModal
  },
  data() {
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      }
    }
  },
  created() {
    this.getList(1)
  },
  methods: {
    async getList(age) {
      if (age) {
        this.queryInfo.pagenum = 1
      }
      const { data: res } = await this.$http.get('course/list', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('所有课程的信息', res)
        this.userList = res.data.list
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
    // 删除用户
    async deleteBox(id) {
      const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmresult !== 'confirm') {
        this.$message('已取消删除')
      } else {
        const { data: res } = await this.$http.delete('course/list?id=' + id)
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
    },
    EditDialog(datasource) {
      this.$refs.modelFormRef.title = '编辑课程信息'
      this.$refs.modelFormRef.edit(datasource)
    },
    handleAdd() {
      this.$refs.modelFormRef.title = '添加课程信息'
      this.$refs.modelFormRef.add()
    },
    modalFormOk() {
      this.getList()
    }
  }
}
</script>
<style lang="less" scope>
.el-col {
  min-height: 1px;
}
</style>
