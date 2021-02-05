<template>
  <div>
    <div>
      <div class="zz_slide"></div>
      <div class="zz_title">访问量</div>
    </div>
    <div class="user_table">
      <div id="userClick" class="tubiao"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
// import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的对象
      option: {
        xAxis: {
          type: 'category',
          data: ['2/5', '2/6', '2/7', '2/8', '2/9', '2/10', '2/11']
        },
        grid: {
          top: '5% ',
          left: '15%'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [2411, 2556, 2698, 2456, 3125, 3210, 2564],
            type: 'bar',
            barWidth: '50%'
          }
        ]
      }
    }
  },
  methods: {},
  created() {},
  // 此时界面中的元素已经初始化完毕
  async mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('userClick'))
    // // 4. 准备数据和配置项
    // const { data: res } = await this.$http.get('reports/type/1')
    // if (res.meta.status !== 200) {
    //   return this.$message.error('获取折线图数据失败！')
    // }
    // console.log(res.data)
    // const result = _.merge(res.data, this.options)
    // 5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.option)
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
.user_table {
  margin-top: 20px;
}
.tubiao {
  width: 300px;
  height: 300px;
}
</style>
