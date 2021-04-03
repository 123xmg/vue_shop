<!-- 消息通知 -->
<template>
  <div>
    <div class="zz_header">
      <div class="zz_slide"></div>
      <div class="zz_title">课程信息</div>
      <div class="zz_more">查看更多>></div>
    </div>
    <div>
      <ul class="zz_message">
        <li><a href="#">瑜伽健身今天优惠,每门课优惠200瑜伽健身今天优惠,每门课优惠200</a></li>
        <li><a href="#">瑜伽健身今天优惠,每门课优惠200</a></li>
        <li><a href="#">瑜伽健身今天优惠,每门课优惠200</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="less" scoped>
.zz_header {
  position: relative;
}
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
.zz_more {
  position: absolute;
  top: 5px;
  right: 0px;
  font-size: 10px;
  color: #666;
  &:hover {
    color: #3498db;
  }
}
.zz_message {
  li {
    margin-top: 20px;
    width: 300px;
    padding-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  a {
    color: #333;
    &:hover {
      color: #3498db;
    }
  }
}
</style>
