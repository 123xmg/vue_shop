<template>
  <div>
    <div id="main" style="width: 1000px;height:400px;"></div>
  </div>
</template>
<script>
// 1. 导入echarts
import echarts from 'echarts'
// import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '人员管理'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['普通用户', 'VIP用户', '教练', '管理员']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['一月', '二月', '三月', '四月', '五月', '六月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '普通用户',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330],
            smooth: true
          },
          {
            name: 'VIP用户',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330],
            smooth: true
          },
          {
            name: '教练',
            type: 'line',
            stack: '总量',
            data: [12, 16, 20, 40, 54, 60],
            smooth: true
          },
          {
            name: '管理员',
            type: 'line',
            stack: '总量',
            data: [5, 6, 8, 10, 20, 25],
            smooth: true
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
    var myChart = echarts.init(document.getElementById('main'))
    // // 4. 准备数据和配置项
    // const { data: res } = await this.$http.get('reports/type/1')
    // if (res.meta.status !== 200) {
    //   return this.$message.error('获取折线图数据失败！')
    // }
    // console.log(res.data)
    // const result = _.merge(res.data, this.options)
    // 5. 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.options)
  }
}
</script>
<style lang="less" scoped></style>
