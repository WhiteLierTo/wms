<!--模板控件管理-->
<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
              <el-form :inline="true" :model="page">
                <el-form-item>
                  <el-select
                    v-model="page.id"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="模板控件名称"
                    :loading="loading"
                    size="small"
                  >
                    <el-option
                      v-for="item in setRemote"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    style="bacground:#0076a8"
                    @click="queryHandleClick"
                  >{{ $t('header.query') }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">{{ $t('header.add') }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="widgetName" label="控件名称" />
            <el-table-column prop="labelName" label="标签名称" />
            <el-table-column prop="placeholder" label="占位符" />
            <el-table-column prop="fieldType" label="字段类型" />
            <el-table-column prop="validatedType" label="验证类型" />
            <el-table-column prop="fieldName" label="映射字段名" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          style="float: right;margin:20px 0px 20px 0px"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>

    <!--新增-->
    <div>
      <el-dialog title="新增模板控件" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="widgetName"
                label="控件名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '控件名称不能为空'}
                ]"
              >
                <el-input v-model="addData.widgetName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="labelName"
                label="标签名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签名称不能为空'},
                ]"
              >
                <el-input v-model="addData.labelName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="placeholder"
                label="占位符"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '占位符不能为空'}
                ]"
              >
                <el-input v-model="addData.placeholder" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="fieldType"
                label="字段类型"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字段类型不能为空'},
                ]"
              >
                <el-select
                  v-model="addData.fieldType"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="字段类型"
                  clearable
                >
                  <el-option
                    v-for="item in dictionary"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="validatedType" label="验证类型" :label-width="formLabelWidth">
                <el-select
                  v-model="addData.validatedType"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="验证类型"
                  clearable
                >
                  <el-option
                    v-for="item in dictionaryValidated"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="fieldName" label="映射字段" :label-width="formLabelWidth">
                <el-input v-model="addData.fieldName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="fieldValue" label="映射文本" :label-width="formLabelWidth">
                <el-input v-model="addData.fieldValue" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancelHandleClick('addData')">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑模板控件" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="widgetName"
                label="控件名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '控件名称不能为空'}
                ]"
              >
                <el-input v-model="editData.widgetName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="labelName"
                label="标签名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签名称不能为空'},
                ]"
              >
                <el-input v-model="editData.labelName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="placeholder"
                label="占位符"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '占位符不能为空'}
                ]"
              >
                <el-input v-model="editData.placeholder" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="labelName"
                label="字段类型"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字段类型不能为空'},
                ]"
              >
                <el-select
                  v-model="editData.fieldType"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="字段类型"
                  clearable
                >
                  <el-option
                    v-for="item in dictionary"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="labelName" label="验证类型" :label-width="formLabelWidth">
                <el-select
                  v-model="editData.validatedType"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="验证类型"
                  clearable
                >
                  <el-option
                    v-for="item in dictionaryValidated"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="fieldName" label="映射字段" :label-width="formLabelWidth">
                <el-input v-model="editData.fieldName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="fieldValue" label="映射文本" :label-width="formLabelWidth">
                <el-input v-model="editData.fieldValue" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit('editData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getTemplateWidgetList,
  postTemplateWidget,
  putTemplateWidget,
  deleteTemplateWidget,
  getTemplateWidgetAll
} from '@/api/label';
import { getDictionaryText } from '@/utils/validate';
import { getDictionaryAll } from '@/api/baseData';
export default {
  name: 'TemplateWidget',
  data() {
    return {
      setRemote: [],
      dictionary: [], // 字典数据
      dictionaryValidated: [], // 字典验证类型
      loading: false,
      add: false,
      edit: false,
      formLabelWidth: '100px',
      addData: {
        // 新增数据
        widgetName: '',
        labelName: '',
        placeholder: '',
        fieldType: '',
        validatedType: '',
        fieldName: '',
        fieldValue: ''
      },
      editData: {},
      page: {
        // 查询条件
        id: '',
        total: 40,
        current: 1,
        size: 10,
        sort:'create_at'
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
    this.getTemplateWidgetAllFnc()
    this.getDictionaryAll()
  },
  methods: {
    // 表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增取消
    addCancelHandleClick(formName) {
      this.add = false
      this.resetForm(formName)
    },
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    // 弹出修改页面并赋值
    editHandleClick(e) {
      this.edit = true
      this.editData = JSON.parse(JSON.stringify(e))
    },
    // curd
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            widgetName: this.addData.widgetName,
            labelName: this.addData.labelName,
            placeholder: this.addData.placeholder,
            fieldType: this.addData.fieldType,
            validatedType: this.addData.validatedType,
            fieldName: this.addData.fieldName,
            fieldValue: this.addData.fieldValue
          }
          postTemplateWidget(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.resetForm(formName)
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    deleteHandleClick(e) {
      this.$confirm('此操作将永久删除该模板控件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteTemplateWidget(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            // 判断是否当前页最后一条数据，如果是，删除后，返回上一页
            // 总页数
            const totalPage = Math.ceil((this.page.total - 1) / this.page.size)
            this.page.current =
              this.page.current > totalPage ? totalPage : this.page.current
            this.page.current = this.page.current < 1 ? 1 : this.page.current
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id: this.editData.id,
            widgetName: this.editData.widgetName,
            labelName: this.editData.labelName,
            placeholder: this.editData.placeholder,
            fieldType: this.editData.fieldType,
            validatedType: this.editData.validatedType,
            fieldName: this.editData.fieldName,
            fieldValue: this.editData.fieldValue
          }
          putTemplateWidget(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.edit = false
              this.fetchData()
            }
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    // 获取模板控件列表
    fetchData() {
      getTemplateWidgetList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
        this.listData.forEach(v => {
          v.fieldType = getDictionaryText(v.fieldType)[0].text
          v.validatedType = getDictionaryText(v.validatedType)[0].text
        })
      })
    },
    getTemplateWidgetAllFnc() {
      getTemplateWidgetAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.widgetName }
        })
      })
    },
    // 获取字典查询
    getDictionaryAll() {
      const param = {
        dictGroup: 'field_type'
      }
      const params = {
        dictGroup: 'validated_type'
      }
      getDictionaryAll(params).then(res => {
        this.dictionaryValidated = res.result.map(item => {
          return { value: item.code, label: item.text }
        })
      })
      getDictionaryAll(param).then(res => {
        this.dictionary = res.result.map(item => {
          if (item.code === 'fixed') {
            return { value: item.code, label: item.text, disabled: true }
          } else {
            return { value: item.code, label: item.text }
          }
        })
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
</style>
