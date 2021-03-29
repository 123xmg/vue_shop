<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的教练</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card>
      <el-row :span="24">
        <el-form label-width="82px" label-position="center">
          <el-col :span="7">
            <el-form-item label="教练名称：">
              <el-input
                placeholder="请输入教练名称"
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
      <el-table
        :data="infoList"
        border
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'time', order: 'descending' }"
      >
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="u_name" label="学员名称" align="center"> </el-table-column>
        <el-table-column prop="u_tel" label="学员手机号" align="center"> </el-table-column>

        <el-table-column prop="m_num" label="购买课节数" align="center"> </el-table-column>
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
  </div>
</template>
<script>
export default {
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
      console.log('简练id', this.queryInfo.query)
      const { data: res } = await this.$http.get('teacher/stuList', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('所有学员的信息', res)
        this.infoList = res.data.users
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
    }
  }
}
</script>
<style lang="less" scope>
.el-col {
  min-height: 1px;
}
</style>
