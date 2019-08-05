<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <div class="t-ele">添加标签元素</div>
        <el-row>
          <el-col :span="8">
            <el-form>
              <el-form-item
                prop="brushType"
                label="画笔类型"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择画笔类型', trigger: 'blur' }]"
              >
                <el-select v-model="eleObj.brushType" placeholder="请选择画笔类型" style="width:50%">
                  <el-option
                    v-for="item in brushTypeList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form>
              <el-form-item
                prop="fieldType"
                label="字段类型"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择字段类型', trigger: 'blur' }]"
              >
                <el-select
                  v-model="eleObj.fieldType"
                  placeholder="请选择字段类型"
                  style="width:50%"
                  @change="fieldChange"
                >
                  <el-option
                    v-for="item in fieldTypeList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-button v-show="show" type="primary" size="mini" @click="checkoutHandleClick">选择控件</el-button>
          </el-col>
        </el-row>
        <el-form ref="eleObj" :model="eleObj" class="demo-ruleForm">
          <el-row>
            <el-col :span="6">
              <el-form-item
                prop="fieldName"
                label="字段名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字段名称不能为空'}
                ]"
              >
                <el-input v-model="eleObj.fieldName" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="fieldValue" label="字段值" :label-width="formLabelWidth">
                <el-input
                  v-model="eleObj.fieldValue"
                  autocomplete="off"
                  style="width:80%"
                  :disabled="show"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="labelName"
                label="标签名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签名称不能为空'}
                ]"
              >
                <el-input v-model="eleObj.labelName" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="placeholder"
                label="占位符"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '占位符不能为空'}
                ]"
              >
                <el-input v-model="eleObj.placeholder" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="fontName"
                label="字体名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择字体名称', trigger: 'blur' }]"
              >
                <el-select v-model="eleObj.fontName" placeholder="请选择字体名称" style="width:80%">
                  <el-option
                    v-for="item in fontNameList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="fontSize"
                label="字体大小"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字体大小不能为空'}
                ]"
              >
                <el-input v-model="eleObj.fontSize" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="fontStyle"
                label="字体样式"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择字体样式', trigger: 'blur' }]"
              >
                <el-select v-model="eleObj.fontStyle" placeholder="请选择字体样式" style="width:80%">
                  <el-option
                    v-for="item in fontStyleList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item
                prop="width"
                label="宽度"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '宽度不能为空'}
                ]"
              >
                <el-input v-model="eleObj.width" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="height"
                label="高度"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '高度不能为空'}
                ]"
              >
                <el-input v-model="eleObj.height" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="x"
                label="x轴"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: 'x轴不能为空'}
                ]"
              >
                <el-input v-model="eleObj.x" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                prop="y"
                label="y轴"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: 'y轴不能为空'}
                ]"
              >
                <el-input v-model="eleObj.y" autocomplete="off" style="width:80%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="ele">
          <el-button type="primary" @click="eleHandleClick">生成元素</el-button>
          <el-button type="danger" @click="clearHandleClick('eleObj')">清空</el-button>
        </div>
      </el-card>
    </div>
    <!-- 选择控件 -->
    <div>
      <el-dialog title="选择控件" :visible.sync="add">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="widgetName" label="控件名称" />
          <el-table-column prop="fieldName" label="映射字段名称" />
          <el-table-column prop="fieldType" label="字段类型" />
          <el-table-column prop="fieldValue" label="文本值" />
          <el-table-column prop="labelName" label="标签名称" />
          <el-table-column prop="placeholder" label="占位符" />
          <el-table-column prop="validatedType" label="验证类型" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getDictionary } from '@/utils/validate';
import { addlabelTemplateEle, getTemplateWidgetAll } from '@/api/label';
export default {
  name: 'AddElement',
  data() {
    return {
      formLabelWidth: '80px',
      show: false,
      add: false,
      eleObj: {
        brushType: '',
        fieldName: '',
        labelName: '',
        fieldType: '',
        fieldValue: '',
        fontName: '',
        fontSize: '',
        fontStyle: '',
        height: '',
        width: '',
        x: '',
        y: '',
        templateId: '',
        placeholder: ''
      },
      brushTypeList: [],
      fieldTypeList: [],
      fontNameList: [],
      fontStyleList: [],
      tableData: [],
      multipleSelection: []
    }
  },
  mounted() {
    // 通用字典赋值(画笔类型)
    this.brushTypeList = getDictionary('brush_type')
    // 通用字典赋值(字段类型)
    this.fieldTypeList = getDictionary('field_type')
    // 通用字典赋值(字体类型)
    this.fontNameList = getDictionary('font_name')
    // 通用字典赋值(字体样式)
    this.fontStyleList = getDictionary('font_style')

    sessionStorage.setItem('templateId', this.$route.params.id)
    // 初始化所有控件
    this.getTemplateWidgetAllFnc()
  },
  methods: {
    // 根据字段类型 显示是否需要控件
    fieldChange(val) {
      val === 'mapped' || val === 'label-qr'? (this.show = true) : (this.show = false)
    },
    // map映射 选择控件
    checkoutHandleClick() {
      this.add = true
    },
    // 点击选择
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('选择:' + JSON.stringify(this.multipleSelection))
    },
    // 确定选择控件
    addSubmit() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择控件')
      } else if (this.multipleSelection.length > 1) {
        this.$message.error('有且只有一个控件')
      }
      this.eleObj = this.multipleSelection[0]
      this.add = false
    },
    // 清空
    clearHandleClick(formName) {
      this.$refs[formName].resetFields();
      this.eleObj.brushType = '';
      this.eleObj.fieldType = '';
      //Object.keys(this.eleObj).forEach(key => (this.eleObj[key] = ''))
    },
    // 生成元素
    eleHandleClick() {
      this.eleObj.templateId = sessionStorage.getItem('templateId')
      this.addlabelTemplateEleFnc('eleObj')
    },
    // 添加元素
    addlabelTemplateEleFnc(formName) {
      addlabelTemplateEle(this.eleObj).then(res => {
        // 置空
        this.$refs[formName].resetFields();
        this.eleObj.brushType = '';
        this.eleObj.fieldType = '';
        //Object.keys(this.eleObj).forEach(key => (this.eleObj[key] = ''))
        this.$message({
          message: '新建成功',
          type: 'success'
        })
      })
    },
    // 初始化所有控件
    getTemplateWidgetAllFnc() {
      getTemplateWidgetAll().then(res => {
        this.tableData = res.result
      })
    }
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
  .ele {
    width: 18%;
    display: block;
    margin: 25px auto;
  }
}
</style>

