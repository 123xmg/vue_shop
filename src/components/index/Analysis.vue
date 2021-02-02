<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><i class="iconfont icon-souye-copy"></i>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-card class="box-card" class="left"> </el-card>
    <el-card class="box-card" class="right"> </el-card> -->
    <el-row>
      <el-col :span="16">
        <el-card class="box-card left-card">
          <refgisterNum></refgisterNum>
        </el-card>
        <div class="bottom-left">
          <el-col :span="12">
            <el-card class="box-card left-card">
              <userClick />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card left-card">
              <userPart />
            </el-card>
          </el-col>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <personInfo />
        </el-card>
        <el-card class="box-card message-card">
          <messageInfo />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import refgisterNum from './refgisterNum'
import personInfo from './personInfo'
import userPart from './userPart'
import userClick from './userClick'
import messageInfo from './messageInfo'
export default {
  components: {
    refgisterNum,
    personInfo,
    userPart,
    userClick,
    messageInfo
  }
}
</script>
<style lang="less" scoped>
.left-card {
  margin-right: 10px;
}
.bottom-left {
  margin-top: 20px;
}
.message-card {
  margin-top: 20px;
}
</style>
