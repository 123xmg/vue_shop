<template>
  <div>
    <div>
      <div class="zz_slide"></div>
      <div class="zz_title">成员分布</div>
    </div>
    <div class="user_table">
      <div id="userPart" class="tubiao"></div>
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
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}：({c}%)'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '所占比例',
            type: 'pie',
            radius: ['45%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 1
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 65, name: '普通用户' },
              { value: 25, name: 'VIP用户' },
              { value: 8, name: '教练' },
              { value: 2, name: '管理员' }
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
    var myChart = echarts.init(document.getElementById('userPart'))
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
  width: 320px;
  height: 300px;
}
</style>
