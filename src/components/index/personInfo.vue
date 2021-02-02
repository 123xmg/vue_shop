<template>
  <div>
    <div>
      <div class="zz_slide"></div>
      <div class="zz_title">基本信息</div>
    </div>
    <div class="info">
      <div class="header_img">
        <img src="../../assets/img/shouye/user.png" alt="" />
      </div>
      <div class="header_info">
        <p class="username">许三多
          <i class="el-icon-female female" v-if="isMale == 1"></i>
          <i class="el-icon-male male" v-else></i>
        </p>
        <p>手机号：17859656536</p>
        <p>角色：管理员</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMale: 1
    }
  }
}
</script>

<style lang="less" scoped>
.zz_slide {
  display: inline-block;
  height: 20px;
  width: 5px;
  margin-right: 5px;
  vertical-align: text-bottom;
  background-color: #3498db;
  border-radius: 5px;
}
.zz_title {
  display: inline-block;
  font-size: 18px;
}
.info {
  display: flex;
}
.header_img {
  width: 110px;
  height: 110px;
  margin-top: 15px;
  margin-right: 15px;
  background-color: pink;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.header_info {
  flex: 1;
  p {
    margin-bottom: 10px;
  }
  .username {
    margin-top: 20px;
    font-size: 20px;
    font-weight: 900;
    color: #333333;
  }
}
.male {
  font-weight: 700;
  color: #3498db;
}
.female {
  font-weight: 700;
  color: pink;
}
</style>
