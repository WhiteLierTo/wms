<template>
  <div>
    <!-- <button @click="labelHandleClick">标签打印</button> -->
    <div class="body">
      <el-card class="box-card">
        <el-row>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form>
              <el-form-item
                prop="value"
                label="库房"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择库房', trigger: 'blur' }]"
              >
                <el-select v-model="warehouseValue" placeholder="请选择库房" @change="warehouseChange">
                  <el-option
                    v-for="item in warehouse"
                    :key="item.id"
                    :label="item.warehouseName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form>
              <el-form-item
                prop="value"
                label="库位"
                :label-width="formLabelWidth"
                filterable
                :rules="[{ required: true, message: '请选择打印库位', trigger: 'blur' }]"
              >
                <el-select v-model="locationValue" multiple collapse-tags placeholder="请选择库位">
                  <el-option
                    v-for="item in location"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
                  <el-input v-model="direction" autocomplete="off" disabled />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <div v-show="elementShow">
          <div class="h-title1">模板元素</div>
          <el-card class="box-card">
            <div>
              <el-row>
                <div v-for="item in element" :key="item.id" style="margin:20px 0px 10px 0px ">
                  <el-col :span="4">
                    <div
                      style="margin:20px -5px 10px 20px;font-size:14px;font-weight:600"
                    >{{ item.labelName }}</div>
                  </el-col>
                  <el-col style="margin-top:10px" :span="4">
                    <el-input
                      v-model="item.fieldValue"
                      :disabled="item.show"
                      :placeholder="item.placeholder"
                      autocomplete="off"
                    />
                  </el-col>
                </div>
              </el-row>
            </div>
          </el-card>
        </div>

        <el-form ref="templateEle" :model="templateEle" class="demo-ruleForm quantity">
          <el-row>
            <el-col :span="7">
              <el-form-item prop="number" label="张数" :label-width="formLabelWidth">
                <el-input v-model="number" type="number" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                prop="archived"
                label="是否存档"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择是否存档', trigger: 'blur' }]"
              >
                <el-select v-model="templateEle.archived" placeholder="请选择是否存档" style="width:100%">
                  <el-option
                    v-for="item in archivedData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
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
          <el-button type="primary" @click="printerViewHandleClick">预览</el-button>
          <el-button type="primary" @click="printHandleClick">开始打印</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog title="标签预览" :visible.sync="preview">
      <el-carousel arrow="never" style="background:#f3f2f5" height="400px">
        <el-carousel-item>
          <img :src="src" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllLabelTemplateList,
  getlabelTemplateOne,
  getAllLabelTemplate,
  getPrinterAll,
  printer,
  printerView,
  baseURL
} from '@/api/label'
import axios from 'axios'
import {
  getWarehouseAll,
  getLocationAll,
  getLocationOne,
  getWarehouseOne
} from '@/api/baseData'
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
      archivedData: [
        {
          value: true,
          label: '是'
        },
        {
          value: false,
          label: '否'
        }
      ],
      location: [],
      locationValue: [],
      warehouseValue: '',
      warehouse: [], // 库房库位数据
      locationOne: {}, // 单个库位信息
      element: [], // 元素
      preview: false,
      elementShow: false,
      flowPic: '',
      src: '',
      template: {
        deleted: false,
        labelType: 3
      },
      direction: '',
      warehouseName: '',
      warehouseId: ''
    }
  },
  mounted() {
    // 获取所有模板
    this.getTemplateAll()
    // 获取所有打印机
    this.getPrinterAll()
    // 获取所有库位
    this.getLocationAll()
    // 获取所有库房
    this.getWarehouseAll()
  },
  methods: {
    // 标签预览
    printerViewHandleClick() {
      this.preview = true
      this.src = `${baseURL}print/preview?id=${this.templateEle.id}`
    },
    // 库位选择后，映射字段
    locationChange(e) {
      const param = {
        id: e
      }
      getLocationOne(param).then(res => {
        this.locationOne = res.result
        this.locationFnc()
      })
    },
    // 库位改变,映射赋值
    locationFnc() {
      const params = {
        warehouseId: this.warehouseId,
        warehouseName: this.warehouseName,
        location: this.locationOne.location
      }
      this.element.forEach(v => {
        if (v.fieldType === 'mapped') {
          v.fieldValue = `${this.locationOne[v.fieldName]}`
        }
        if (v.fieldType === 'json-location') {
          v.fieldValue = params
        }
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
        })
        .catch(() => {})
    },
    // 库房下拉获取库位
    warehouseChange(e) {
      this.getLocationAll(e)
      this.warehouseId = e
      const param = {
        id: e
      }
      getWarehouseOne(param).then(res => {
        this.warehouseName = res.result.warehouseName
      })
    },
    // 打印事件
    printHandleClick() {
      try {
        this.element.forEach(v => {
          if (v.fieldType === 'input' && v.fieldValue === '') {
            throw new Error()
          }
        })
      } catch (e) {
        this.$message({
          message: '请完善模板元素信息',
          type: 'warning'
        })
        return
      }
      if (this.printer === '' || this.number === '') {
        this.$message({
          message: '请完善打印信息',
          type: 'warning'
        })
        return
      }
      this.locationValue.forEach(v => {
        this.locationChange(v)
      })
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
        if (this.templateEle.direction === 1) {
          this.direction = '横向'
        }
        if (this.templateEle.direction === 0) {
          this.direction = '竖向'
        }
      })
      getAllLabelTemplate(params).then(res => {
        this.element = res.result
        if (res.result.length > 0) {
          this.elementShow = true
        }
        this.element.forEach(v => {
          if (v.fieldType === 'input') {
            v.show = false
          } else {
            v.show = true
          }
        })
      })
    },
    // 查询所有打印机
    getPrinterAll() {
      getPrinterAll().then(res => {
        this.printerList = res.result
      })
    },
    // 下拉查询库位列表
    getLocationAll(e) {
      const param = {
        wid: e
      }
      getLocationAll(param).then(res => {
        this.location = res.result.map(item => {
          return { value: item.id, label: item.location }
        })
      })
    },
    // 下拉查询库房列表
    getWarehouseAll() {
      getWarehouseAll().then(res => {
        this.warehouse = res.result
      })
    },
    // 查询所有模板
    getTemplateAll() {
      getAllLabelTemplateList(this.template).then(res => {
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

