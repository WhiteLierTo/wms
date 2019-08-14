<!--字典管理-->
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
                    placeholder="字典代码"
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
                <el-form-item>
                  <el-upload :action="excelUrl" :on-success="handleSuccess" :show-file-list="false">
                    <el-button class="checkout" size="small" type="success">
                      导入
                      <i class="el-icon-download el-icon--right" />
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="success" @click="exportHandleClick">
                    导出
                    <i class="el-icon-upload2 el-icon--right" />
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="code" label="代码" />
            <el-table-column prop="text" label="显示文本" />
            <el-table-column prop="dictGroup" label="字典分组" />
            <el-table-column prop="state" label="字典说明" />
            <el-table-column prop="enabled" label="是否激活">
              <template slot-scope="scope">
                <div v-if="scope.row.enabled==false" style="color:#cc0000">否</div>
                <div v-if="scope.row.enabled==true" style="color:#3c763d">是</div>
              </template>
            </el-table-column>
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
      <el-dialog title="新增字典" :visible.sync="add">
        <el-form :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="code"
                label="代码"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '代码不能为空'}
                ]"
              >
                <el-input v-model="addData.code" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="text"
                label="显示文本"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '显示文本'},
                ]"
              >
                <el-input v-model="addData.text" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="dictGroup"
                label="字典分组"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字典分组不能为空'}
                ]"
              >
                <el-input v-model="addData.dictGroup" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:30px" :span="11">
              <el-form-item label="是否激活" prop="enabled">
                <el-radio v-model="addData.enabled" :label="true">开启</el-radio>
                <el-radio v-model="addData.enabled" :label="false" checked>关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item
              prop="state"
              label="字典说明"
              :label-width="formLabelWidth"
              :rules="[
                { required: true, message: '字典说明不能为空'}
              ]"
            >
              <el-input
                v-model="addData.state"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输字典说明"
              />
            </el-form-item>
          </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addHandleClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑字典" :visible.sync="edit">
        <el-form :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="code"
                label="代码"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '代码不能为空'}
                ]"
              >
                <el-input v-model="editData.code" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="text"
                label="text"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '显示文本'},
                ]"
              >
                <el-input v-model="editData.text" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="dictGroup"
                label="字典分组"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '字典分组不能为空'}
                ]"
              >
                <el-input v-model="editData.dictGroup" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:30px" :span="11">
              <el-form-item label="是否激活" prop="enabled">
                <el-radio v-model="editData.enabled" :label="true">开启</el-radio>
                <el-radio v-model="editData.enabled" :label="false" checked>关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item
              prop="state"
              label="字典说明"
              :label-width="formLabelWidth"
              :rules="[
                { required: true, message: '字典说明不能为空'}
              ]"
            >
              <el-input
                v-model="editData.state"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输字典说明"
              />
            </el-form-item>
          </div>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getDictionaryList,
  putDictionary,
  postDictionary,
  getDictionaryAll,
  deleteDictionary,
  baseURL
} from '@/api/baseData'
export default {
  name: 'Dictionary',
  data() {
    return {
      excelUrl: `${baseURL}/syDictionary/excel/import`,
      setRemote: [],
      loading: false,
      options: [
        {
          // 字典状态查询
          value: true,
          label: '开启'
        },
        {
          value: false,
          label: '关闭'
        }
      ],
      add: false,
      edit: false,
      formLabelWidth: '80px',
      addData: {
        // 新增数据
        code: '',
        text: '',
        dictGroup: '',
        state: '',
        enabled: false
      },
      editData: {},
      page: {
        // 查询条件
        id: '',
        total: 40,
        sort: 'create_at',
        current: 1,
        size: 10
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
    this.getDictionaryAll()
  },
  methods: {
    handleSuccess(res, file) {
      if (res.errorCode == 0) {
        this.$message.success('上传成功，更新数据：' + res.result + '条')
      } else {
        this.$message.error('上传失败：' + JSON.stringify(res.message))
      }
      this.fetchData()
    },
    // export
    exportHandleClick() {
      window.open(`${baseURL}/syDictionary/excel/export`)
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
    addHandleClick() {
      const param = {
        code: this.addData.code,
        text: this.addData.text,
        dictGroup: this.addData.dictGroup,
        state: this.addData.state,
        enabled: this.addData.enabled
      }
      postDictionary(param).then(res => {
        if (res.errorCode === 0) {
          this.add = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }
        this.fetchData()
      })
    },
    deleteHandleClick(e) {
      this.$confirm('此操作将永久删除该字典, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteDictionary(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    editSubmit() {
      const param = {
        id: this.editData.id,
        code: this.editData.code,
        text: this.editData.text,
        dictGroup: this.editData.dictGroup,
        state: this.editData.state,
        enabled: this.editData.enabled
      }
      putDictionary(param).then(res => {
        if (res.errorCode === 0) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.edit = false
          this.fetchData()
        }
      })
    },
    fetchData() {
      getDictionaryList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    getDictionaryAll() {
      getDictionaryAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.code }
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
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
</style>
