<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" style="margin:0 10px">
    <el-tab-pane label="系统通知(3)" name="1">
      <ul class="nav">
        <li style="padding-top:0">
          <p class="nav-title">
            <el-tag type="danger" size="mini">NEW</el-tag>欢迎用户登录小鲸鱼健身房管理系统！
          </p>
          <p class="nav-time">2021-1-21 12:25</p>
        </li>
        <li>
          <p class="nav-title">审批通过</p>
          <p class="nav-time">2021-1-21 12:25</p>
        </li>
        <li>
          <p class="nav-title">审批通过</p>
          <p class="nav-time">2021-1-21 12:25</p>
        </li>
      </ul>
      <el-button style="width: 100%; margin-top: 8px" size="small">查看更多</el-button>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="less" scoped>
.nav li {
  padding: 10px 0 5px;
  color: #666;
  border-bottom: 1px solid #ddd;
  &:hover {
    color: #1890ff;
  }
}
.nav-title {
  width: 200px;
  margin-bottom: 5px;
  color: #1890ff;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nav-time {
  font-size: 12px;
}
</style>
