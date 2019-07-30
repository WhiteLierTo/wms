<!--标签打印数据管理-->
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
                    placeholder="标签打印数据名称"
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
            <el-table-column prop="number" label="标签张数" />
            <el-table-column prop="ext" label="标签数据" />
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
      <el-dialog title="新增标签打印数据" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="number"
                label="标签张数"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签张数不能为空'}
                ]"
              >
                <el-input type="number" v-model="addData.number" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="ext"
                label="标签数据"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签数据不能为空'},
                ]"
              >
                <el-input v-model="addData.ext" autocomplete="off" />
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
      <el-dialog title="编辑标签打印数据" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="number"
                label="标签张数"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签张数不能为空'}
                ]"
              >
                <el-input v-model="editData.number" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="ext"
                label="标签数据"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '标签数据不能为空'},
                ]"
              >
                <el-input v-model="editData.ext" autocomplete="off" />
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
  getLabelDataList,
  postLabelData,
  putLabelData,
  deleteLabelData,
  getLabelDataAll
} from '@/api/label'
export default {
  name: 'LabelDataManager',
  data() {
    return {
      setRemote: [],
      loading: false,
      add: false,
      edit: false,
      formLabelWidth: '100px',
      addData: {
        // 新增数据
        number: '',
        ext:''
      },
      editData: {},
      page: {
        // 查询条件
        id: '',
        total: 40,
        current: 1,
        size: 10
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData();
    this.getLabelDataAllFnc();
  },
  methods: {
      //表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      },
    // 新增取消
    addCancelHandleClick(formName) {
      this.add = false;
      this.resetForm(formName)
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
    // curd
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            number:this.addData.number,
            ext: JSON.stringify(this.addData.ext)
          }
          postLabelData(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.resetForm(formName);
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
      this.$confirm('此操作将永久删除该标签打印数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteLabelData(e).then(res => {
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
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id: this.editData.id,
            number:this.editData.number,
            ext: JSON.stringify(this.editData.ext)
          }
          putLabelData(param).then(res => {
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
      getLabelDataList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    getLabelDataAllFnc() {
      getLabelDataAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.ext }
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
