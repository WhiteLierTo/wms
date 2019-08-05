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
                <el-select v-model="templateName" placeholder="请选择打印模板" @change="templateChange">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="itemId" placeholder="请输入物料" />
              </el-form-item>
              <el-form-item>
                <el-button
                  size="small"
                  type="primary"
                  style="bacground:#0076a8"
                  @click="referHandleClick"
                >物料查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div class="h-title">模板内容</div>
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
                <el-row >
                  <div  v-for="item in tableData" :key="item.id" style="margin:20px 0px 10px 0px ">
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
            <el-col :span="7">
              <el-form-item
                prop="number"
                label="张数"
                :label-width="formLabelWidth"
              >
                <el-input type="number" v-model="number" autocomplete="off" />
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
                  <el-select v-model="printerVal" placeholder="请选择打印机" style="width:100%">
                    <el-option
                      v-for="item in printerList"
                      :key="item.id"
                      :label="item.printerName"
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
    <el-carousel  arrow="never"  style="background:#f3f2f5"  height="400px">
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
  getPrinterAll,
  getlabelTemplateOne,
  getAllLabelTemplate,
  printer,
  baseURL
} from '@/api/label';
import { getOneItemList } from '@/api/baseData';
import {
  getDictionaryText,
  getDictionaryCode,
  getValFnc
} from '@/utils/validate';
export default {
  name: 'MaterialLabel',
  data() {
    return {
      options: [],
      templateName: '',
      itemId: '',
      id: '', // 通过id去查找对应模板
      itemInfo: {},
      number: '1',
      printerVal: '',
      printerList: [],
      value: '',
      formLabelWidth: '120px',
      input: '',
      templateEle: {},
      params: {},
      templateId: '',
      preview: false,
      elementShow:false,
      flowPic: "",
      src:'',
       archivedData: [{
          value: true,
          label: '是'
        }, {
          value: false,
          label: '否'
        }],
      template:{
          deleted:false,
          labelType:2
      },
      tableData: [],
      direction:''
    }
  },
  mounted() {
    // 获取所有模板列表
    this.getAllLabelTemplateListFnc()
    // 获取所有打印机
    this.getPrinterAllFnc();
  },
  methods: {
        //标签预览
    printerViewHandleClick() {
      this.preview = true;
      this.src = `${baseURL}print/preview?id=${this.templateEle.id}`
    },
    // 选择打印模板
    templateChange(val) {
      this.params.id = val
      this.templateId = val
      this.getlabelTemplateOneFnc()
      this.getAllLabelTemplateFnc()
    },
    // 物料查询
    referHandleClick() {
      this.getOneItemListFnc()
    },
    // 打印事件
    printHandleClick() {
       if(this.printer === '' || this.number === ''){
         this.$message({
              message: '请完善打印信息',
              type: 'warning'
            })
          return
      }
      this.tableData.forEach(v => {
        v.brushType = getDictionaryCode(v.brushType)[0].code
        v.fieldType = getDictionaryCode(v.fieldType)[0].code
      })
      const ext = {
        labelTemplate: this.templateEle,
        labelTemplateElement: this.tableData
      }
      const param = {
        ext: ext,
        number: this.number,
        printer: this.printerVal
      }
      printer(param)
        .then(res => {
          if (res.errorCode === 0) {
            this.$message({
              message: '打印成功',
              type: 'success'
            })
          }
          this.tableData.forEach(v => {
            v.brushType = getDictionaryText(v.brushType)[0].text
            v.fieldType = getDictionaryText(v.fieldType)[0].text
          })
        })
        .catch(() => {})
    },
    // 获取所有模板列表
    getAllLabelTemplateListFnc() {
      getAllLabelTemplateList(this.template).then(res => {
        this.options = res.result;
      })
    },
    // 获取单个模板
    getlabelTemplateOneFnc() {
      getlabelTemplateOne(this.params).then(res => {
        this.templateEle = res.result
        if(this.templateEle.direction === 1){
          this.direction = '横向'
        }
        if(this.templateEle.direction === 0){
          this.direction = '竖向'
        }
      })
    },
    // 获取单个物料
    getOneItemListFnc() {
      const params = {
        id: this.itemId
      }
      getOneItemList(params).then(res => {
        res.result.length === null
          ? this.$message.error('未查到该物料')
          : (this.itemInfo = res.result)
        this.tableData.forEach(v => {
          v.fieldValue = getValFnc(this.itemInfo, v.fieldName)
        })
      })
    },
    // 获取所有打印机
    getPrinterAllFnc() {
      getPrinterAll().then(res => {
        this.printerList = res.result
      })
    },
    // 根据选择模板来查看对应元素
    getAllLabelTemplateFnc() {
      const params = {
        templateId: this.templateId
      }
      getAllLabelTemplate(params).then(res => {
        this.tableData = res.result;
        if(res.result.length>0){
          this.elementShow = true;
        }
        console.log('tableData:' + JSON.stringify(this.tableData))
        this.tableData.forEach(v => {
          v.brushType = getDictionaryText(v.brushType)[0].text
          v.fieldType = getDictionaryText(v.fieldType)[0].text
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
    .h-title1 {
    padding: 40px 10px 40px 20px;
    font-size: 16px;
  }
  .h-title {
    padding: 25px 20px;
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

