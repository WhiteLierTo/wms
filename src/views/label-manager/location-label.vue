<template>
  <div>
    <!-- <button @click="labelHandleClick">标签打印</button> -->
    <div class="body">
      <el-card class="box-card">
        <el-row>
          <el-col :span="12">
            <el-form>
              <el-form-item
                prop="value"
                label="打印模板"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择打印模板', trigger: 'blur' }]"
              >
                <el-select v-model="value" placeholder="请选择打印模板">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="toolbar" style="padding-bottom: 0px;">
            <el-form>
              <el-form-item
                prop="value"
                label="仓库"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择仓库', trigger: 'blur' }]"
              >
                <el-select v-model="value" placeholder="请选择仓库">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="toolbar" style="padding-bottom: 0px;">
            <el-transfer v-model="value1" :data="data" />
          </el-col>
        </el-row>
        <div class="h-title">模板元素</div>
        <el-card class="box-card">
          <el-form ref="templateEle" :model="templateEle" class="demo-ruleForm">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="x" label="起始坐标x" :label-width="formLabelWidth">
                  <el-input v-model="templateEle.x" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="y" label="起始坐标y" :label-width="formLabelWidth">
                  <el-input v-model="templateEle.y" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="width" label="标签宽度" :label-width="formLabelWidth">
                  <el-input v-model="templateEle.width" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="height" label="标签高度" :label-width="formLabelWidth">
                  <el-input v-model="templateEle.height" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="direction" label="打印方向" :label-width="formLabelWidth">
                  <el-input v-model="templateEle.direction" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-form ref="templateEle" :model="templateEle" class="demo-ruleForm quantity">
          <el-row>
            <el-col :span="9">
              <el-form-item
                prop="quantity"
                label="物料数量"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料数量', trigger: 'blur' }]"
              >
                <el-input v-model="templateEle.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item
                prop="number"
                label="张数"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入张数', trigger: 'blur' }]"
              >
                <el-input v-model="templateEle.number" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form>
                <el-form-item
                  prop="id"
                  label="打印机"
                  :label-width="formLabelWidth"
                  :rules="[{ required: true, message: '请选择打印机', trigger: 'blur' }]"
                >
                  <el-select
                    v-model="templateEle.printerVal"
                    placeholder="请选择打印机"
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in printerList"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn">
          <el-button type="primary">预览</el-button>
          <el-button type="primary">开始打印</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaterialLabel',
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 4; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`
        })
      }
      return data
    }
    return {
      data: generateData(),
      value1: [1, 4],
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      printerList: [
        {
          id: '1',
          label: '打印机1'
        }
      ],
      value: '',
      formLabelWidth: '120px',
      input: '',
      templateEle: {
        x: '0',
        y: '0',
        width: '500',
        height: '400',
        direction: '横向',
        quantity: '',
        number: '1',
        printerVal: ''
      }
    }
  },
  methods: {
    // 查询
    referHandleClick() {}
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  .h-title {
    padding: 10px 20px 40px;
    font-size: 16px;
  }
  .quantity {
    padding-top: 50px;
  }
  .btn {
    width: 18%;
    margin: 30px auto;
  }
}
</style>

