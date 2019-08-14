<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="page">
                <el-form-item>
                  <el-select
                    v-model="page.templateName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="模板名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                    clearable
                  >
                    <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    style="bacground:#0076a8"
                    @click="referHandleClick"
                  >查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">创建模板</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%" @expand-change="expandSelect">
            <el-table-column prop="templateName" label="模板名称" />
            <el-table-column prop="width" label="标签宽度" />
            <el-table-column prop="height" label="标签高度" />
            <el-table-column prop="x" label="起始坐标x" />
            <el-table-column prop="y" label="起始坐标y" />
            <el-table-column prop="direction" label="打印方向">
              <template slot-scope="scope">
                <div v-if="scope.row.direction==false" style="color:#cc0000">竖向</div>
                <div v-else-if="scope.row.direction==true" style="color:#3c763d">横向</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEleHandleClick(scope.row.id)">添加/查看元素</el-button>
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
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>
    <!--新增-->
    <div>
      <el-dialog title="新增标签" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="templateName"
                label="模板名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入模板名称', trigger: 'blur' }]"
              >
                <el-input v-model="addData.templateName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="direction"
                label="打印方向"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择打印方向', trigger: 'blur' }]"
              >
                <el-select v-model="addData.direction" placeholder="请选择打印方向" style="width:100%">
                  <el-option
                    v-for="item in directionList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="width"
                label="标签宽度"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入标签宽度', trigger: 'blur' }]"
              >
                <el-input v-model="addData.width" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="height"
                label="标签高度"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入标签高度', trigger: 'blur' }]"
              >
                <el-input v-model="addData.height" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="x"
                label="起始坐标x"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入起始坐标x', trigger: 'blur' }]"
              >
                <el-input v-model="addData.x" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="y"
                label="起始坐标y"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入起始坐标y', trigger: 'blur' }]"
              >
                <el-input v-model="addData.y" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="labelType"
                label="标签类型"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择标签类型', trigger: 'blur' }]"
              >
                <el-select v-model="addData.labelType" placeholder="请选择标签类型" style="width:100%">
                  <el-option
                    v-for="item in labelType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item
                prop="description"
                label="模板描述"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入模板描述', trigger: 'blur' }]"
              >
                <el-input
                  v-model="addData.description"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入描述"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑-->
    <div>
      <el-dialog title="编辑标签" :visible.sync="edit">
        <el-form ref="updateItem" :model="updateItem" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="templateName"
                label="模板名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入模板名称', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.templateName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="direction"
                label="打印方向"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择打印方向', trigger: 'blur' }]"
              >
                <el-select v-model="updateItem.direction" placeholder="请选择打印方向" style="width:100%">
                  <el-option
                    v-for="item in directionList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="width"
                label="标签宽度"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入标签宽度', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.width" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="height"
                label="标签高度"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入标签高度', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.height" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="x"
                label="起始坐标x"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入起始坐标x', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.x" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="y"
                label="起始坐标y"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入起始坐标y', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.y" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row />
          <el-row>
            <el-col>
              <el-form-item
                prop="description"
                label="模板描述"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入模板描述', trigger: 'blur' }]"
              >
                <el-input
                  v-model="updateItem.description"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入描述"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="editSureHandleClick('updateItem')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getLabelTemplateList,
  getAllLabelTemplateList,
  addTemplate,
  updateTemplate,
  getAllLabelTemplate
} from '@/api/label'
import { getDictionaryAll } from '@/api/baseData'
export default {
  name: 'LabelTemplate',
  data() {
    return {
      page: {
        current: 1,
        size: 10,
        templateName: '',
        sort: 'create_at',
        deleted: false
      },
      listData: [],
      total: 0, // 总数
      loading: false,
      options: [],
      templateList: [],
      id: '',
      add: false,
      edit: false,
      addEle: false,
      formLabelWidth: '120px',
      addData: {
        templateName: '',
        width: '',
        height: '',
        x: '',
        y: '',
        direction: '',
        labelType: '',
        description: ''
      },
      directionList: [
        {
          id: 1,
          label: '横向'
        },
        {
          id: 0,
          label: '竖向'
        }
      ],
      updateItem: {},
      tableData: [],
      labelType: [],
      templateId: '',
      eleId: ''
    }
  },
  mounted() {
    // 初始化标签列表
    this.getLabelFnc()
    // 初始化所有标签列表
    this.getAllLabelTemplateListFnc()
    // 初始化所有元素
    this.getAllLabelTemplateFnc()
    // 获取所有模板类型（字典）
    this.getDictionaryAll()
  },
  methods: {
    // 查询
    referHandleClick() {
      // 查询标签列表
      this.getLabelFnc()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.templateList.filter(item => {
            return item.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    handleSizeChange(val) {
      this.page.size = val
      // 分页获取标签列表
      this.getLabelFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 分页获取标签列表
      this.getLabelFnc()
    },
    // 添加
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addTemplateFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 添加元素
    addEleHandleClick(id) {
      // 路由跳转
      this.$router.push({
        name: 'AddElement',
        params: { id: id }
      })
    },
    // 展开或关闭
    expandSelect(row, expandedRows) {
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
      this.loading = true
      this.tableData.length = 0
      this.templateId = row.id
      // 初始化所有元素
      this.getAllLabelTemplateFnc()
    },
    // 编辑
    editHandleClick(row) {
      this.updateItem = row
      this.edit = true
    },
    // 确认编辑
    editSureHandleClick() {
      this.updateTemplateFnc()
    },
    deleteHandleClick(id) {
      this.id = id
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTemplateFnc()
      })
    },
    // 分页获取标签列表
    getLabelFnc() {
      getLabelTemplateList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 获取所有标签列表
    getAllLabelTemplateListFnc() {
      getAllLabelTemplateList().then(res => {
        const templateData = res.result
        this.templateList = templateData.map(v => v.templateName)
      })
    },
    // 删除标签列表
    deleteTemplateFnc() {
      const params = {
        id: this.id,
        deleted: true
      }
      updateTemplate(params).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        // 判断是否当前页最后一条数据，如果是，删除后，返回上一页
        // 总页数
        const totalPage = Math.ceil((this.total - 1) / this.page.size)
        this.page.current =
          this.page.current > totalPage ? totalPage : this.page.current
        this.page.current = this.page.current < 1 ? 1 : this.page.current
        // 分页获取标签列表
        this.getLabelFnc()
      })
    },
    // 增加标签列表
    addTemplateFnc() {
      addTemplate(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 分页获取标签列表
        this.getLabelFnc()
      })
    },
    // 编辑物料
    updateTemplateFnc() {
      updateTemplate(this.updateItem).then(res => {
        this.edit = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        // 分页获取标签列表
        this.getLabelFnc()
      })
    },
    // 获取所有标签类型（字典）
    getDictionaryAll() {
      const param = {
        dictGroup: 'label_type'
      }
      getDictionaryAll(param).then(res => {
        this.labelType = res.result.map(item => {
          return { value: item.code, label: item.text }
        })
      })
    },
    // 获取所有元素
    getAllLabelTemplateFnc() {
      const params = {
        templateId: this.templateId
      }
      getAllLabelTemplate(params).then(res => {
        this.tableData = res.result
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
}
.el-form--inline .el-form-item__label {
  color: #99a9bf;
  float: none;
  display: inline-block;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
