<!-- 消息通知 -->
<template>
  <div>
    <div class="zz_header">
      <div class="zz_slide"></div>
      <div class="zz_title">消息通知</div>
      <div class="zz_more">查看更多>></div>
    </div>
    <div>
      <ul class="zz_message">
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200瑜伽健身今天优惠,每门课优惠200</a>
          <span>2020-12-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-03-15</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-04-08</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
        <li>
          <a href="#">瑜伽健身今天优惠,每门课优惠200</a>
          <span>2021-09-05</span>
        </li>
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
  margin-bottom: 35px;
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
    position: relative;
    margin-top: 12px;
  }
  span {
    position: absolute;
    top: 1px;
    right: 0px;
    font-size: 13px;
    color: #666;
  }
  a {
    display: block;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #666;
    &:hover {
      color: #3498db;
    }
  }
}
</style>
