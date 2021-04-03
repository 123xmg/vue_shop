<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>意见管理</el-breadcrumb-item>
      <el-breadcrumb-item>意见列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->

    <el-card>
      <el-row :span="24">
        <el-form label-width="82px" label-position="center">
          <el-col :span="7">
            <el-form-item label="发布时间：">
              <el-date-picker
                type="date"
                v-model="queryInfo.time"
                placeholder="请输入发送时间"
                style="width: 100%;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="getTime"
                @clear="getList"
              ></el-date-picker>
              <!-- <el-input
                placeholder="请输入发布时间"
                v-model="queryInfo.time"
                clearable
                @clear="getList"
              >
              </el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="发布人：">
              <el-input
                placeholder="请输入标题"
                v-model="queryInfo.name"
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
      <!-- id: text.s_id,
            name: text.u_name,
            title: text.s_title,
            content: text.s_content,
            time: text.s_time -->
      <el-table
        :data="infoList"
        border
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'time', order: 'descending' }"
      >
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="content" label="意见内容" align="center">
          <template slot-scope="scope">
            <div :title="scope.row.content">
              {{
                scope.row.content.length > 20
                  ? scope.row.content.substr(0, 20) + '...'
                  : scope.row.content
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发布时间" align="center" sortable>
          <template slot-scope="scope">
            {{ scope.row.time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="发布人" align="center"> </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template slot-scope="scope">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      infoList: [],
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
      const { data: res } = await this.$http.get('suggest/list', { params: this.queryInfo })
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log('所有的信息', res)
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
    },
    getTime(date) {
      this.queryInfo.time = date
    }
  }
}
</script>
<style lang="less" scoped>
.el-col {
  min-height: 1px;
}
</style>
