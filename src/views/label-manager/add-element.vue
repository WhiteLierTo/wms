<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <div class="t-ele">添加标签元素</div>
        <el-row>
          <el-col :span="12">
            <el-form>
              <el-form-item
                prop="brushType"
                label="画笔类型"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择画笔类型', trigger: 'blur' }]"
                style="margin-left:30px"
              >
                <el-select v-model="eleObj.brushType" placeholder="请选择画笔类型">
                  <el-option
                    v-for="item in brushTypeList"
                    :key="item.code"
                    :label="item.label"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getDictionary } from '@/utils/validate'
import { log } from 'util'
export default {
  name: 'AddElement',
  data() {
    return {
      eleObj: {
        brushType: ''
      },
      brushTypeList: [
        {
          code: 'string',
          label: '字符串'
        },
        {
          code: 'line',
          label: '直线'
        },
        {
          code: 'rect',
          label: '矩形'
        },
        {
          code: 'oval',
          label: '椭圆'
        }
      ]
    }
  },
  mounted() {
    console.log('lee:' + JSON.stringify(getDictionary('brush_type')))
  }
}
</script>
<style lang="scss" scoped>
.body {
  .t-ele {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 30px;
  }
}
</style>

