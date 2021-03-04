<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="40%" @close="close">
      <el-row :span="24">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
          </el-input>
        </el-col>
        <el-col :span="2" style="margin-left:10px">
          <el-button type="primary" icon="el-icon-search" @click="getUserList">查 询</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="userList"
        ref="singleTable"
        :row-key="getRowKeys"
        border
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :default-sort="{ prop: 'state', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
        <el-table-column type="index" align="center"> </el-table-column>

        <el-table-column prop="header" label="头像" align="center">
          <template slot-scope="scope">
            <!-- {{ scope.row.sex }} -->
            <div class="block">
              <el-avatar shape="square" :size="40" :src="scope.row.headerImg"></el-avatar>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center"> </el-table-column>

        <el-table-column prop="tel" label="手机号" align="center"> </el-table-column>
        <el-table-column label="性别" align="center" prop="sex" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '0'">男</span>
            <span v-if="scope.row.sex == '1'">女</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" align="center" prop="role" sortable>
          <template slot-scope="scope">
            <span v-if="scope.row.role == '0'">普通用户</span>
            <span v-if="scope.row.role == '1'">VIP用户</span>
            <span v-if="scope.row.role == '2'">教练</span>
            <span v-if="scope.row.role == '3'">管理员</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="state" sortable>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state"> </el-switch>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    role: {
      type: Number,
      required: false
    }
  },
  watch: {
    role: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        this.queryInfo.role = val
        this.getUserList()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      userList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      editVisible: false,
      title: '选择用户',
      editForm: {},
      model: {},
      editFromrules: {},
      multipleSelection: [],
      userNames: '',
      userIds: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users/allUser', { params: this.queryInfo })
      if (res.code !== '200') {
        console.log('用户筛选', res.data)
        return this.$message.error('数据获取失败!')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 一页显示的条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    close() {
      this.editVisible = false
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @getRowKeys 设置回显的函数
     * @parmas row 当前行的数据，需要一个唯一的标识来标记是哪一个被选中了
     */
    getRowKeys(row) {
      return row.userId
    },
    editOk() {
      const list = this.multipleSelection
      if (!list) {
        this.userNames = ''
        this.userIds = ''
      } else {
        let tempName = ''
        let tempId = ''
        for (const item of list) {
          tempName += ',' + item.username
          tempId += ',' + item.userId
        }
        this.userNames = tempName.substring(1)
        this.userIds = tempId.substring(1)
      }
      this.$emit('change', this.userIds, this.userNames, list)
      this.close()
    }
  }
}
</script>
<style lang="less" scope>
.el-col {
  min-height: 1px;
}
</style>
