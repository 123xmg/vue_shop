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
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          data: ['一月', '二月', '三月', '四月', '五月']
        },
        radar: [
          {
            indicator: [
              { text: '一月', max: 10000 },
              { text: '二月', max: 10000 },
              { text: '三月', max: 10000 },
              { text: '四月', max: 10000 },
              { text: '五月', max: 10000 }
            ],
            radius: 80,
            center: ['50%', '40%'],
            name: {
              formatter: '{value}',
              textStyle: {
                color: '#000' // 文字颜色
              }
            },
            splitArea: {
              areaStyle: {
                // 圆环颜色
                color: ['#ddd', '#fff', '#ddd', '#fff', '#ddd'],
                shadowColor: '#ddd', // 圆颜色
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: '#666' // 分割线
              }
            }
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            areaStyle: {},
            data: [
              {
                value: [2098, 3087, 5078, 7004, 9088],
                name: '访问量'
              }
            ]
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
@media screen and (max-width: 1300px) {
  .tubiao {
    width: 250px;
    height: 300px;
  }
}
</style>
