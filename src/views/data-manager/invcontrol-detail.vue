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
                    <el-input clearable placeholder="仓库名称"  size="small" v-model="page.warehouse"></el-input>
                </el-form-item>
                 <el-form-item>
                    <el-input clearable placeholder="库位名称"  size="small" v-model="page.location"></el-input>
                </el-form-item>
                 <el-form-item>
                    <el-input clearable placeholder="批次号"  size="small" v-model="page.batchNumber"></el-input>
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
                </el-form-item>
              </el-form>
            </el-col>
          </div>

          <!--列表-->
          <el-table :data="listData" @expand-change="expandChange" style="width: 100%" border>
            <el-table-column prop="warehouse" label="仓库" />
                  <el-table-column prop="location" label="库位" />
                  <el-table-column prop="batchNumber" label="批次" />
                  <el-table-column prop="quantity" label="数量"></el-table-column>
                  <el-table-column prop="modifyAt" label="创建时间" />
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
  name: 'invcontrolDetail',
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
        warehouse:'',
        location:'',
        sort:'create_at',
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
        let params = {
          itemId: row.itemId,
          sort:'modify_at'
        };
        this.getInvControl(params);
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
      getInvControl(this.page).then(res => {
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
