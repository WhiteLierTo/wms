<!--出入库管理-->
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
                  <el-input v-model="page.batchNumber" clearable placeholder="批次" size="small" />
                  <!--  <el-select
                    v-model="page.batchNumber"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="批次"
                    size="small"
                  >
                    <el-option
                      v-for="item in batch"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>-->
                </el-form-item>
                <el-form-item>
                  <el-input v-model="page.itemId" clearable placeholder="物料编号" size="small" />
                  <!--  <el-select
                    v-model="page.itemId"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="物料编号"
                    size="small"
                  >
                    <el-option
                      v-for="item in item"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>-->
                </el-form-item>
                <el-form-item>
                  <el-input v-model="page.warehouse" clearable placeholder="库房" size="small" />
                  <!--  <el-select
                    v-model="page.warehouse"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="库房"
                    size="small"
                  >
                    <el-option
                      v-for="item in warehouse"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>-->
                </el-form-item>
                <el-form-item>
                  <el-input v-model="page.location" clearable placeholder="库位" size="small" />
                  <!-- <el-select
                    v-model="page.location"
                    filterable
                    clearable
                    reserve-keyword
                    placeholder="库位"
                    size="small"
                  >
                    <el-option
                      v-for="item in location"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>-->
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    style="bacground:#0076a8"
                    @click="queryHandleClick"
                  >{{ $t('header.query') }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="itemId" label="物料ID" />
            <el-table-column prop="unit" label="单位名称" />
            <el-table-column prop="batchNumber" label="批次号码" />
            <el-table-column prop="warehouse" label="库房" />
            <el-table-column prop="location" label="库位" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="direction" label="方向">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">
                      <div v-if="scope.row.direction==false" style="color:#ec2126">出</div>
                      <div v-if="scope.row.direction==true" style="color:#005b00">入</div>
                    </el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <!--  <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>-->
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
  </div>
</template>

<script>
import {
  getHistoricalRecordList,
  deleteHistoricalRecord,
  getAllItemList,
  getAllinvBatchList,
  getWarehouseAll,
  getLocationAll
} from '@/api/baseData'
export default {
  name: 'HistoricalRecord',
  data() {
    return {
      item: [],
      batch: [],
      warehouse: [],
      location: [],
      setRemote: [],
      formLabelWidth: '80px',
      page: {
        // 查询条件
        itemId: '',
        total: 40,
        current: 1,
        size: 10,
        sort: 'create_at',
        batchNumber: ''
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
    this.getItem()
    this.getBatch()
    this.getWarehouse()
    this.getLocation()
  },
  methods: {
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    // curd
    deleteHandleClick(e) {
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteHistoricalRecord(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            const totalPage = Math.ceil((this.page.total - 1) / this.page.size)
            this.page.current =
              this.page.current > totalPage ? totalPage : this.page.current
            this.page.current = this.page.current < 1 ? 1 : this.page.current
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    fetchData() {
      getHistoricalRecordList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    // 获取所有物料
    getItem() {
      getAllItemList().then(res => {
        this.item = res.result.map(item => {
          return { value: item.id, label: item.id }
        })
      })
    },
    // 获取所有批次
    getBatch() {
      getAllinvBatchList().then(res => {
        this.batch = res.result.map(item => {
          return { value: item.id, label: item.batchNumber }
        })
      })
    },
    // 获取所有库房
    getWarehouse() {
      getWarehouseAll().then(res => {
        this.warehouse = res.result.map(item => {
          return { value: item.id, label: item.warehouseName }
        })
      })
    },
    // 获取所有库位
    getLocation() {
      getLocationAll().then(res => {
        this.location = res.result.map(item => {
          return { value: item.id, label: item.location }
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
