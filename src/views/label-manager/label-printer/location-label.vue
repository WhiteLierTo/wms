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
                <el-select v-model="locationValue" placeholder="请选择库位" @change="locationChange">
                  <el-option
                    v-for="item in location"
                    :key="item.id"
                    :label="item.location"
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

      <div v-show="elementShow">
        <div class="h-title1">模板元素</div>
             <el-card class="box-card">
          <div>
                <el-row >
                  <div  v-for="item in element" :key="item.id" style="margin:20px 0px 10px 0px ">
                  <el-col :span="4">
                    <div style="margin:20px -5px 10px 20px;font-size:14px;font-weight:600">{{ item.labelName }}</div>
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
          <el-button type="primary" @click="printerViewHandleClick">预览</el-button>
          <el-button type="primary" @click="printHandleClick">开始打印</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog
    title="标签预览"
    :visible.sync="preview"
  >
    <el-carousel arrow="never" style="background:#f3f2f5"  height="400px">
      <el-carousel-item>
        <img :src="src" style="max-width: 100%;max-height: 100%;display: block; margin: 0 auto;"/>
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
  printerView
} from "@/api/label";
import axios from "axios";
import {
  getWarehouseAll,
  getLocationAll,
  getLocationOne
} from "@/api/baseData";
import { getDictionaryText, getDictionaryCode } from "@/utils/validate";
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
      location: [],
      locationValue: "",
      warehouseValue: "",
      warehouse: [], //库房库位数据
      locationOne: {}, //单个库位信息
      element: [], //元素
      preview: false,
      elementShow:false,
      flowPic: "",
      src:'',
      template:{
          deleted:false,
          labelType:3
      },
    };
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
    //标签预览
    printerViewHandleClick() {
      this.preview = true;
      this.src = `http://116.62.212.169:8101/wms-label/print/preview?id=${this.templateEle.id}`
    },
    // 库位选择后，映射字段
    locationChange(e) {
      const param = {
        id: e
      }
      getLocationOne(param).then(res => {
        this.locationOne = res.result;
        this.locationFnc();
      });
    },
    //库位改变,映射赋值
    locationFnc() {
      this.element.forEach(v => {
        if (v.fieldType === "mapped") {
          v.fieldValue = this.locationOne.location;
        }
      })
    },
    // 库房下拉获取库位
    warehouseChange(e) {
      this.getLocationAll(e)
    },
    // 打印事件
    printHandleClick() {
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
        this.element = res.result;
        if(res.result.length>0){
          this.elementShow = true;
        }
         this.element.forEach(v => {
          if (v.fieldType === "input") {
            v.show = false;
          } else {
            v.show = true;
          }
        });
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
        this.location = res.result
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

