<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>私教列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <section class="team-info section-bg">
      <div class="team-members" v-for="(itemOnce, index) in list" :key="index">
        <div class="team-member" v-for="(item, i) in itemOnce" :key="i">
          <!-- 蒙板 -->
          <div class="profile-image">
            <img v-if="item.s_imgurl" :src="uploadeImg + item.s_imgurl" alt="" />
            <img v-else src="../../assets/teacher/3.jpg" alt="" />
            <div class="profile-info">
              <h4 class="name">姓名：{{ item.u_name }}</h4>
              <p class="position">
                简介：{{
                  item.s_content
                    ? item.s_content.length > 12
                      ? item.s_content.substr(0, 12) + '...'
                      : item.s_content
                    : ' '
                }}
              </p>

              <p class="position">价格：{{ item.s_price && item.s_price.toFixed(2) }}/节</p>
              <div class="profile-edit" @click="lookView(item)">详情</div>
            </div>
            <el-button style="width: 100%; margin-top: 8px" size="small" @click="costView(item)"
              >立即购买</el-button
            >
          </div>
        </div>
      </div>
    </section>
    <cost ref="modelFormRef" @ok="modalFormOk" />
    <detail ref="detailFormRef" @ok="modalFormOk" />
  </div>
</template>

<script>
import cost from './cost'
import detail from './detail'
export default {
  components: {
    detail,
    cost
  },
  data() {
    return {
      list: [],
      page: 1,
      uploadeImg: window._CONFIG.uploade
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data: res } = await this.$http.get('teacher/list')
      if (res.code !== '200') {
        return this.$message.error('数据获取失败!')
      } else {
        console.log(res.data.list)
        this.getPage(res.data.list)
      }
    },
    // 划分页码
    getPage(list) {
      const total = list.length
      this.page = Math.ceil(total / 16)
      const row = []
      for (let i = 0; i < total; i += 4) {
        row.push(list.slice(i, i + 4))
      }
      this.list = row
    },
    lookView(item) {
      this.$refs.detailFormRef.title = '私教详情'
      this.$refs.detailFormRef.edit(item.s_content)
    },

    costView(item) {
      this.$refs.modelFormRef.title = '购买课程'
      this.$refs.modelFormRef.edit(item)
    },
    modalFormOk() {
      this.getList()
    }
  }
}
</script>

<style lang="less" scope>
/* 团队成员 */
.team-members {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 24px;
  margin-top: 20px;
}
.team-member {
  background-color: white;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
  transition: 0.4s;

  display: grid;
  justify-items: center;
}
.profile-image {
  overflow: hidden;
}
.profile-image img {
  width: 100%;
  height: 264px;
  object-fit: cover;
  object-position: top center;
}
.profile-info {
  position: relative;
}
.profile-edit {
  position: absolute;
  right: 7px;
  top: 0;
  font-size: 14px;
  color: #1890ff;
  cursor: pointer;
}

.team-member .name {
  margin: 5px;
  font-size: 16px;
  color: #727272;
}
.stail {
  margin-right: 5px;
  color: #1890ff;
  cursor: pointer;
}
.team-member .position {
  margin: 5px;
  font-size: 14px;
  color: #8b8b8b;
}
.team-member:hover {
  transform: scale(1.05);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}
</style>
