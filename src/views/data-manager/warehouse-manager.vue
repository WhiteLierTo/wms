<!--仓库管理-->
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
                  <el-input
                    v-model="page.warehouseName"
                    clearable
                    placeholder="请输入库房名称"
                    size="small"
                  />
                  <!-- <el-select
                    v-model="page.warehouseName"
                    clearable
                    remote
                    reserve-keyword
                    :placeholder="$t('header.warehouseName')"
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
                  </el-select>-->
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="page.warehouseLock"
                    clearable
                    size="small"
                    :placeholder="$t('header.warehouseLockedState')"
                  >
                    <el-option
                      v-for="item in options"
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
                  <el-upload
                    :action="excelUrl"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :show-file-list="false"
                  >
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
            <el-table-column prop="id" label="仓库ID" />
            <el-table-column prop="warehouseName" label="仓库名称" />
            <el-table-column prop="description" label="仓库描述" />
            <el-table-column prop="warehouseLock" label="仓库锁状态">
              <template slot-scope="scope">
                <div v-if="scope.row.warehouseLock==false" style="color:#cc0000">关闭</div>
                <div v-if="scope.row.warehouseLock==true" style="color:#3c763d">开启</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <!--  <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button> -->
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
      <el-dialog title="新增仓库" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="id"
                label="仓库ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库ID不能为空'}
                ]"
              >
                <el-input v-model="addData.id" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="warehouseName"
                label="仓库名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库名称不能为空'},
                ]"
              >
                <el-input v-model="addData.warehouseName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item
              prop="description"
              label="仓库描述"
              :label-width="formLabelWidth"
              :rules="[
                { required: true, message: '仓库描述不能为空'}
              ]"
            >
              <el-input
                v-model="addData.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输仓库描述"
              />
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="warehouseLock">
                <el-radio v-model="addData.warehouseLock" :label="true">开启</el-radio>
                <el-radio v-model="addData.warehouseLock" :label="false" checked>关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancle('addData')">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑仓库" :visible.sync="edit">
        <el-form :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="id"
                label="仓库ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库ID不能为空'},
                ]"
              >
                <el-input v-model="editData.id" disabled autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="warehouseName"
                label="仓库名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库名称不能为空'},
                ]"
              >
                <el-input v-model="editData.warehouseName" disabled autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            prop="description"
            label="仓库描述"
            :label-width="formLabelWidth"
            :rules="[
              { required: true, message: '仓库描述不能为空'}
            ]"
          >
            <el-input
              v-model="editData.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输仓库描述"
            />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="warehouseLock">
                <el-radio v-model="editData.warehouseLock" :label="true">开启</el-radio>
                <el-radio v-model="editData.warehouseLock" :label="false">关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
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
  getWarehouseList,
  putWarehouse,
  postWarehouse,
  getWarehouseAll,
  baseURL
} from '@/api/baseData'
export default {
  name: 'WarehouseManager',
  data() {
    return {
      excelUrl: `${baseURL}/bdWarehouse/excel/import`,
      remote: [],
      setRemote: [],
      loading: false,
      options: [
        {
          // 仓库状态查询
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
        id: '',
        warehouseName: '',
        description: '',
        warehouseLock: false
      },
      editData: {},
      page: {
        // 查询条件
        warehouseLock: '',
        warehouseName: '',
        sort: 'create_at',
        current: 1,
        size: 10
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
    this.getWarehouseAll()
  },
  methods: {
    beforeUpload(file) {},

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
      window.open(`${baseURL}/bdWarehouse/excel/export`)
    },
    // 取消清空数据
    cancle(formName) {
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
    // 查询库位编号
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
        const param = {
          id: this.addData.id,
          description: this.addData.description,
          warehouseName: this.addData.warehouseName,
          warehouseLock: this.addData.warehouseLock
        }
        postWarehouse(param).then(res => {
          if (res.errorCode === 0) {
            this.add = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
          this.fetchData()
          this.resetForm(formName)
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    deleteHandleClick() {
      this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    editSubmit() {
      if (!this.editData.warehouseName || !this.editData.description) {
        this.$message({
          showClose: true,
          message: '请完善信息',
          type: 'warning'
        })
        return
      }
      const param = {
        id: this.editData.id,
        warehouseName: this.editData.warehouseName,
        warehouseLock: this.editData.warehouseLock,
        description: this.editData.description
      }
      putWarehouse(param).then(res => {
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
      getWarehouseList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    getWarehouseAll() {
      getWarehouseAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.warehouseName, label: item.warehouseName }
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
