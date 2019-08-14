<!--单位管理-->
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
                    v-model="page.unit"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="单位名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                  >
                    <el-option
                      v-for="item in remote"
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
            <el-table-column prop="id" label="单位ID" />
            <el-table-column prop="unit" label="单位名称" />
            <el-table-column prop="description" label="单位描述" />
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
      <el-dialog title="新增单位" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="unit"
                label="单位名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位名称不能为空'}
                ]"
              >
                <el-input v-model="addData.unit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="description"
                label="单位描述"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位描述不能为空'},
                ]"
              >
                <el-input v-model="addData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancelHandleClick()">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑单位" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="unit"
                label="单位名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位名称不能为空'},
                ]"
              >
                <el-input v-model="editData.unit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="description"
                label="单位描述"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位描述不能为空'},
                ]"
              >
                <el-input v-model="editData.description" autocomplete="off" />
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
  getUnit,
  postUnit,
  putUnit,
  deleteUnit,
  getUnitAll,
  baseURL
} from '@/api/baseData'
export default {
  name: 'UnitManager',
  data() {
    return {
      excelUrl: `${baseURL}/bdUnit/excel/import`,
      remote: [],
      setRemote: [],
      loading: false,
      add: false,
      edit: false,
      formLabelWidth: '80px',
      addData: {
        // 新增数据
        unit: '',
        description: ''
      },
      editData: {},
      page: {
        // 查询条件
        unit: null,
        total: 40,
        current: 1,
        sort:'create_at',
        size: 10
      },
      listData: []
    }
  },
  watch: {
    // 监听路由
    $route(to, from) {
      console.log('to:' + to.path)
      console.log('from:' + from.path)
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleSuccess(res, file) {
      if (res.errorCode === 0) {
        this.$message.success('上传成功，更新数据：' + res.result + '条')
      } else {
        this.$message.error('上传失败：' + JSON.stringify(res.message))
      }
      this.fetchData()
    },
    // export
    exportHandleClick() {
      window.open(`${baseURL}/bdUnit/excel/export`)
    },
    // 新增取消
    addCancelHandleClick() {
      this.add = false
      this.addData.unit = ''
      this.addData.description = ''
    },
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    // 弹出修改页面并赋值
    editHandleClick(e) {
      this.edit = true
      this.editData = e
    },
    // 查询单位名称
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.remote = this.setRemote.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remote = []
      }
    },
    // curd
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            description: this.addData.description,
            unit: this.addData.unit
          }
          postUnit(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.addData.unit = ''
              this.addData.description = ''
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
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteUnit(e).then(res => {
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
            unit: this.editData.unit,
            description: this.editData.description
          }
          putUnit(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.edit = false
            }
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    fetchData() {
      getUnit(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
      this.getUnitAllFnc()
    },
    getUnitAllFnc() {
      getUnitAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.unit, label: item.unit }
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
