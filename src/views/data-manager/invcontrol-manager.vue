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
                    v-model="page.id"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="物料名称"
                    size="small"
                  >
                    <el-option
                      v-for="item in item"
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
          <el-table :data="listData" @expand-change="expandChange" style="width: 100%" border>
            <el-table-column type="expand">
              <!--单行信息-->
              <template>
                <el-table v-loading="loading" border :data="InvControlData" style="width: 100%">
                  <el-table-column prop="warehouse" label="仓库" />
                  <el-table-column prop="location" label="库位" />
                  <el-table-column prop="quantity" label="数量"/>
                  <el-table-column prop="createAt" label="创建时间" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="itemId" label="物料编号" />
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="itemUnit" label="物料单位" />
            <el-table-column prop="quantity" label="库存数量" />
            <!-- <el-table-column prop="createAt" label="创建时间" /> -->
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
      <el-dialog title="新增库存" :visible.sync="add">
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
                prop="quantity"
                label="库存数量"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入库存数量', trigger: 'blur' }]"
              >
                <el-input v-model="addData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
            <el-col :span="12">
              <el-form-item
                prop="warehouse"
                label="仓库"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择仓库', trigger: 'blur' }]"
              >
                <el-select
                  v-model="addData.warehouse"
                  placeholder="请选择仓库"
                  style="width:100%"
                  @change="warehouseChange"
                >
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.warehouseName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="location"
                label="库位"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择库位', trigger: 'blur' }]"
              >
                <el-select v-model="addData.location" placeholder="请选择库位" style="width:100%">
                  <el-option
                    v-for="item in locationList"
                    :key="item.id"
                    :label="item.location"
                    :value="item.location"
                  />
                </el-select>
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
  getInvControlList,
  getAllInvControlList,
  updateInvControlList,
  addInvControlList,
  getWarehouseAll,
  getLocationAll,
  getInvControl,
  getItemAllFnc
} from '@/api/baseData'
export default {
  name: 'InvcontrolManager',
  data() {
    return {
      add: false,
      formLabelWidth: '120px',
      item: [], // 物料数据
      addData: {
        // 新增数据
        batchNumber: '',
        blocked: '',
        itemId: '',
        location: '',
        quantity: '',
        warehouse: ''
      },
      page: {
        batchNumber: '',
        current: 1,
        id: '',
        size: 10,
        deleted: false
      },
      listData: [],
      total: 0, // 总数
      batchNumberList: [],
      options: [],
      loading: false,
      updateVal: {},
      InvControlData: [],
      warehouseList: [],
      locationList: [],
      locationObj: {
        wid: ''
      }
    }
  },
  mounted() {
    // 初始化库存列表
    this.getInvControlFnc()
    // 获取所有库存列表
    this.getAllInvControlFnc()
    // 获取所有的仓库
    this.getWarehouseAllFnc()
    // 获取所有的库位
    this.getLocationAllFnc()
    // 获取所有物料
    this.getItemAllFnc()
  },
  methods: {
    // 对某一行展开或者关闭的时候会触发该事件
    expandChange(row, expandedRows) {
      this.loading = true
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
      if (row) {
        const params = {
          itemId: row.itemId
        }
        this.getInvControl(params)
      }
    },
    // 查询
    referHandleClick() {
      // 初始化库存列表
      this.getInvControlFnc()
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
        this.updateInvControlFnc()
      })
    },
    // 当前显示第几页
    handleSizeChange(val) {
      this.page.size = val
      // 初始化批次列表
      this.getInvControlFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 初始化批次列表
      this.getInvControlFnc()
    },
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addInvControlFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 根据仓库查库位
    warehouseChange(val) {
      this.addData.warehouse = this.warehouseList.find(
        v => v.id === val
      ).warehouseName
      this.locationObj.wid = val
      this.locationList = []
      this.addData.location = ''
      this.getLocationAllFnc()
    },
    // 分页获取批次列表
    getInvControlFnc() {
      getInvControlList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 分页获取批次列表
    getInvControl(e) {
      getInvControl(e).then(res => {
        this.InvControlData = res.result.list
        this.loading = false
      })
    },
    // 获取所有批次列表
    getAllInvControlFnc() {
      getAllInvControlList().then(res => {
        const AlllistData = res.result
        this.batchNumberList = AlllistData.map(v => v.batchNumber)
      })
    },
    // 获取全部物料
    getItemAllFnc() {
      getItemAllFnc().then(res => {
        this.item = res.result.map(item => {
          return { value: item.id, label: item.itemName }
        })
      })
    },
    // 更新列表（是否需要卡控）
    updateInvControlFnc() {
      updateInvControlList(this.updateVal).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    // 增加列表
    addInvControlFnc() {
      addInvControlList(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 初始化批次列表
        this.getInvControlFnc()
      })
    },
    // 获取所有的仓库
    getWarehouseAllFnc() {
      getWarehouseAll().then(res => {
        this.warehouseList = res.result
      })
    },
    // 获取所有的库位
    getLocationAllFnc() {
      getLocationAll(this.locationObj).then(res => {
        this.locationList = res.result
      })
    }
  }
}
</script>

<style scoped>

</style>
