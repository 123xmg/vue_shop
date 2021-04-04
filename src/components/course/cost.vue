<!-- 编辑用户 -->
<template>
  <div>
    <el-dialog :title="title" :visible.sync="editVisible" width="50%" @close="close">
      <el-form :model="editForm" ref="editUserRef" :rules="editFromrules" label-width="125px">
        <el-form-item label="课节数：" required>
          <el-input-number
            v-model="num"
            @change="handleChange"
            :min="1"
            placeholder="请输入购买课节数"
            style="width:100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="金额：">
          <el-input v-model="price" disabled></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      editVisible: false,
      title: '添加用户',
      editForm: {},
      model: {},
      num: 1,
      price: 0,
      editFromrules: {
        price: [{ required: true, message: '请输入购买课节数：!', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleChange(num) {
      this.num = num
      this.price = (parseInt(this.editForm.s_price) * parseInt(num)).toFixed(2)
    },
    add() {
      this.edit({})
    },
    edit(record) {
      console.log('shijian', new Date())
      this.editForm = {}
      this.editForm = Object.assign({}, record)
      this.model = Object.assign({}, record)
      this.editVisible = true
      this.price = this.editForm.s_price.toFixed(2)
    },
    editOk() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) {
          return
        }
        const formData = {
          money: this.price,
          time: moment(new Date()).format('YYYY-MM-DD'),
          subject: '私教课程'
        }
        // 编辑用户
        console.log('编辑用户提交的数据', formData)
        const { data: res } = await this.$http.post('alipay/pay', formData)
        if (res.code !== '200') {
          this.$message.error('修改失败')
          this.close()
        } else {
          this.$message.success('修改成功')
          this.editVisible = false
          this.$emit('ok')
        }
      })
    },
    close() {
      this.editForm = this.model
    }
  }
}
</script>
<style lang="less" scoped></style>
