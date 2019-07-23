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
                    v-model="page.batchNumber"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="批次编号"
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
                  <el-button size="small" type="primary" @click="add = true">新增</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>

          <!--列表-->
          <el-table :data="listData" style="width: 100%" border>
            <el-table-column prop="batchNumber" label="批次编号" />
            <el-table-column prop="itemId" label="物料编号" />
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="producedDate" label="生产日期" />
            <el-table-column prop="expiredDate" label="过期时间" />
          </el-table>
          <el-pagination
            background
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="float: right;margin:20px 0px 20px 0px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </section>
      </el-card>
    </div>

    <!--新增-->
    <div>
      <el-dialog title="新增批次" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="batchNumber"
                label="批次编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入批次编号', trigger: 'blur' }]"
              >
                <el-input v-model="addData.batchNumber" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="itemId"
                label="物料编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料编号', trigger: 'blur' }]"
              >
                <el-input v-model="addData.itemId" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="itemName"
                label="物料名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料名称', trigger: 'blur' }]"
              >
                <el-input v-model="addData.itemName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="producedDate"
                label="生产日期"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入生产日期', trigger: 'blur' }]"
              >
                <el-date-picker
                  v-model="addData.producedDate"
                  type="date"
                  placeholder="选择生产日期"
                  style="width:100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="expiredDate"
                label="过期日期"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入过期日期', trigger: 'blur' }]"
              >
                <el-date-picker
                  v-model="addData.expiredDate"
                  type="date"
                  placeholder="选择过期日期"
                  style="width:100%"
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
  </div>
</template>

<script>
import {
  getinvBatchList,
  updateinvBatchList,
  addinvBatchList,
  getAllinvBatchList
} from '@/api/baseData'
import { dateFnc } from '@/utils/validate'
export default {
  name: 'ProductionBatch',
  data() {
    return {
      add: false,
      formLabelWidth: '120px',
      addData: {
        // 新增数据
        batchNumber: '',
        expiredDate: '',
        itemId: '',
        itemName: '',
        producedDate: ''
      },
      page: {
        // 查询条件
        batchNumber: '',
        current: 1,
        size: 10
      },
      listData: [],
      total: 0, // 总数
      batchNumberList: [],
      options: [],
      loading: false,
      value: true,
      updateVal: {}
    }
  },
  mounted() {
    // 初始化批次列表
    this.getinvBatchFnc()
    // 初始化所有批次列表
    this.getAllinvBatchFnc()
  },
  methods: {
    // 查询
    referHandleClick() {
      // 初始化批次列表
      this.getinvBatchFnc()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.batchNumberList.filter(item => {
            return item.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    changeHandleClick(val) {
      this.updateVal = val
      this.$confirm('是否继续操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateBatchFnc()
      })
    },
    // 当前显示第几页
    handleSizeChange(val) {
      this.page.size = val
      // 初始化批次列表
      this.getinvBatchFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 初始化批次列表
      this.getinvBatchFnc()
    },
    addHandleClick(formName) {
      this.addData.producedDate = dateFnc(this.addData.producedDate).slice(0, 10)
      this.addData.expiredDate = dateFnc(this.addData.expiredDate).slice(0, 10)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addBatchFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 分页获取批次列表
    getinvBatchFnc() {
      getinvBatchList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 获取所有批次列表
    getAllinvBatchFnc() {
      getAllinvBatchList().then(res => {
        const AlllistData = res.result
        this.batchNumberList = AlllistData.map(v => v.batchNumber)
      })
    },
    // 更新列表（是否需要质检）
    updateBatchFnc() {
      updateinvBatchList(this.updateVal).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    // 增加列表
    addBatchFnc() {
      addinvBatchList(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 初始化批次列表
        this.getinvBatchFnc()
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
