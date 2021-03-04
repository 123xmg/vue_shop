<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-table
        :data="menuList"
        border
        style="width: 100%"
        :default-sort="{ prop: 'm_uid', order: 'ascending' }"
      >
        <el-table-column align="center" type="index"> </el-table-column>
        <el-table-column align="center" prop="m_name" label="权限名称"> </el-table-column>
        <el-table-column align="center" prop="m_path" label="路径"> </el-table-column>
        <el-table-column align="center" prop="m_uid" label="权限等级">
          <template slot-scope="scope" sortable>
            <el-tag v-if="scope.row.m_uid === 5">所有用户</el-tag>
            <el-tag type="success" v-if="scope.row.m_uid === 3">管理员</el-tag>
            <el-tag type="warning" v-if="scope.row.m_uid === 2">教练</el-tag>
            <el-tag type="danger" v-if="scope.row.m_uid === 1">VIP用户</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get('users/menuList')
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      } else {
        const list = []
        res.msg.forEach(element => {
          if (element.m_path) {
            element.m_path = '/' + element.m_path
            list.push(element)
          }
        })
        console.log('dhfuerfh324', list)
        this.menuList = list
      }
    }
  }
}
</script>

<style></style>
