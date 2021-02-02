<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOrderList" @keyup.enter.native="getOrderList">
            <el-button icon="el-icon-search" slot="append" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="95px"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === 0">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="70px">
          <template slot-scope="scope">
            <i v-if="scope.row.is_send === '是'" class="el-icon-success" style="color:green;font-size:16px"></i>
            <i v-else class="el-icon-error" style="color:red;font-size:16px"></i>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="185px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialogVisible = true"> </el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox(scope.row.order_id)"></el-button>
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
    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editFrom" ref="editRef" :rules="editFromrules" label-width="100px">
        <el-form-item label="省市区/县" prop="addres1">
          <el-cascader v-model="editFrom.addres1" :options="cityDate"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addres2">
          <el-input v-model="editFrom.addres2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="showProgressDialogVisible" width="50%" @close="editDialogClose">
      <!-- timeline时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from './citydata.js'
export default {
  data() {
    return {
      ordersList: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      editDialogVisible: false,
      editFrom: {
        addres1: [],
        addres2: ''
      },
      editFromrules: {
        addres1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        addres2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityDate,
      // 是否展示物流进度对话框
      showProgressDialogVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败!')
      } else {
        this.ordersList = res.data.goods
        this.total = res.data.total
      }
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 一页显示的条数发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 修改弹出框关闭
    editDialogClose() {
      this.$refs.editRef.resetFields()
    },
    // 点击显示物流进度
    async showProgressBox(orderId) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败!')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.showProgressDialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item(1).css';
</style>
