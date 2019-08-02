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
                <el-select v-model="value" placeholder="请选择打印模板" @change="templateChange">
                  <el-option
                    v-for="item in tableData"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="h-title">模板信息</div>
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

        <div class="h-title1">模板元素</div>
        <el-card class="box-card">
          <div v-for="item in element" :key="item.id" style="margin:20px 0px 10px 0px ">
            <el-row>
              <el-col :span="5">
                <el-row>
                  <el-col :span="8">
                    <div style="margin-top:10px;font-size:14px;font-weight:600">{{ item.labelName }}</div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-if="item.fieldType === '用户输入' || item.fieldType === 'input'" v-model="item.fieldValue" :placeholder="item.placeholder" autocomplete="off" />
                    <el-input
                      v-if="item.fieldType === '固定值' || item.fieldType === '字段映射' || item.fieldType === 'mapped' || item.fieldType === 'fixed'"
                      v-model="item.fieldValue"
                      disabled
                      :placeholder="item.placeholder"
                      autocomplete="off"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col style="margin-left:40px" :span="5">
                <el-row>
                  <el-col :span="8">
                    <div style="margin-top:10px;font-size:14px;font-weight:600">映射字段</div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="item.fieldName" autocomplete="off" disabled />
                  </el-col>
                </el-row>
              </el-col>
              <el-col style="margin-left:40px" :span="5">
                <el-row>
                  <el-col :span="8">
                    <div style="margin-top:10px;font-size:14px;font-weight:600">字段类型</div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="item.fieldType" autocomplete="off" disabled />
                  </el-col>
                </el-row>
              </el-col>
              <el-col style="margin-left:40px" :span="5">
                <el-row>
                  <el-col :span="8">
                    <div style="margin-top:10px;font-size:14px;font-weight:600">画笔类型</div>
                  </el-col>
                  <el-col :span="16">
                    <el-input v-model="item.brushType" autocomplete="off" disabled />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-form ref="templateEle" :model="templateEle" class="demo-ruleForm quantity">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="number"
                label="张数"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入张数', trigger: 'blur' }]"
              >
                <el-input v-model="number" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form>
                <el-form-item
                  prop="id"
                  label="打印机"
                  :label-width="formLabelWidth"
                  :rules="[{ required: true, message: '请选择打印机', trigger: 'blur' }]"
                >
                  <el-select v-model="printer" placeholder="请选择打印机" style="width:100%">
                    <el-option
                      v-for="item in printerList"
                      :key="item.printerUrl"
                      :label="item.printerUrl"
                      :value="item.printerUrl"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn">
          <el-button type="primary">预览</el-button>
          <el-button type="primary" @click="printHandleClick">开始打印</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  getAllLabelTemplateList,
  getlabelTemplateOne,
  getAllLabelTemplate,
  getPrinterAll,
  printer
} from '@/api/label'
import { getDictionaryText, getDictionaryCode } from '@/utils/validate'
export default {
  name: 'GeneralLabel',
  data() {
    return {
      tableData: [],
      printerList: [],
      value: '',
      formLabelWidth: '120px',
      input: '',
      templateEle: {}, // 模板元素
      number: 1,
      printer: '',
      element: [] // 元素
    }
  },
  mounted() {
    // 获取所有模板
    this.getTemplateAll()
    // 获取所有打印机
    this.getPrinterAll()
  },
  methods: {
    // 打印事件
    printHandleClick() {
      this.element.forEach(v => {
        v.brushType = getDictionaryCode(v.brushType)[0].code
        v.fieldType = getDictionaryCode(v.fieldType)[0].code
      })
      const ext = {
        labelTemplate: this.templateEle,
        labelTemplateElement: this.element
      }
      const param = {
        ext: ext,
        number: this.number,
        printer: this.printer
      }
      printer(param)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: '打印成功',
              type: 'success'
            })
          }
          this.element.forEach(v => {
            v.brushType = getDictionaryText(v.brushType)[0].text
            v.fieldType = getDictionaryText(v.fieldType)[0].text
          })
        })
        .catch(() => {})
    },
    // 选中模板，获取模板及元素数据
    templateChange(e) {
      const param = {
        id: e
      }
      const params = {
        templateId: e
      }
      getlabelTemplateOne(param).then(res => {
        this.templateEle = res.result
      })
      getAllLabelTemplate(params).then(res => {
        this.element = res.result
        this.element.forEach(v => {
          v.brushType = getDictionaryText(v.brushType)[0].text
          v.fieldType = getDictionaryText(v.fieldType)[0].text
        })
      })
    },
    // 查询所有打印机
    getPrinterAll() {
      getPrinterAll().then(res => {
        this.printerList = res.result
      })
    },
    // 查询
    getTemplateAll() {
      getAllLabelTemplateList().then(res => {
        this.tableData = res.result
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  .h-title {
    padding: 10px 20px 40px;
    font-size: 16px;
  }
    .h-title1 {
    padding: 40px 10px 40px 20px;
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

