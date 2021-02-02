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
          <el-col :span="8">
          <el-card class="box-card left-card">
            <userPart/>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card left-card"></el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card"></el-card>
        </el-col>
        </div>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div style="height:50%">
            <personInfo />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import refgisterNum from './refgisterNum'
import personInfo from './personInfo'
import userPart from './userPart'
export default {
  components: {
    refgisterNum,
    personInfo,
    userPart
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
</style>
