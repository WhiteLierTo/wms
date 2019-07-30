<template>
  <div>
    <div class="body">
      <el-row :gutter="12">
        <el-col :span="4">
          <el-card shadow="never">
            <div class="title">物料名称</div>
            <div class="cotent">{{ publichData.itemName }}</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="never">
            <div class="title">入库单位</div>
            <div class="cotent">{{ publichData.itemUnit }}</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="never">
            <div class="title">物料批次</div>
            <div class="cotent">{{ publichData.batchNumber }}</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card shadow="always">
            <div class="title">入库数量</div>
            <div class="cotent">{{ lineData.quantity }}</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card shadow="hover">
            <div class="title">点收数量</div>
            <div class="cotent">{{ lineData.quantityRegister }}</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card shadow="never">
            <div class="title">上架数量</div>
            <div class="cotent">{{ lineData.quantityReceive }}</div>
          </el-card>
        </el-col>
        <el-col :span="3">
          <el-card shadow="never">
            <div class="title">当前状态</div>
            <div class="cotent">{{ headerStatus }}</div>
          </el-card>
        </el-col>
      </el-row>
      <div class="border" />
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="id" label="明细ID" />
            <!--           <el-table-column  width="150" prop="itemName" label="物料名称" />
            <el-table-column  width="150" prop="itemUnit" label="入库单位"></el-table-column>
            <el-table-column  width="150" prop="batchNumber" label="物料批次" /> -->
            <el-table-column prop="warehouse" label="上架库房" />
            <el-table-column prop="location" label="上架库位" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.type===1" style="color:#3c763d">register</div>
                <div v-if="scope.row.type===2" style="color:#dd001b">stock in</div>
              </template>
            </el-table-column>
            <el-table-column width="200" prop="inboundDate" label="入库日期" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-show="headerStatus !== 'close'">
                  <el-button v-show="scope.row.type===1" type="text" size="small" @click="putDetailHandleClick(scope.row)">取消点收</el-button>
                  <el-button v-show="scope.row.type===1" type="text" size="small" @click="shelvesHandleClick(scope.row)">上架</el-button>
                  <el-button v-show="scope.row.type===2" type="text" size="small" @click="putCheckHandleClick(scope.row)">取消上架</el-button>
                </div>
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

    <!--上架-->
    <div>
      <el-dialog title="上架" :visible.sync="shelves">
        <el-form
          ref="shelvesData"
          :model="shelvesData"
          :label-width="formLabelWidth"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="warehouse"
                label="仓库"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择仓库', trigger: 'blur' }]"
              >
                <el-select
                  v-model="shelvesData.warehouse"
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
            <el-col :span="12">
              <el-form-item
                prop="location"
                label="库位"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择库位', trigger: 'blur' }]"
              >
                <el-select v-model="shelvesData.location" placeholder="请选择库位" style="width:100%">
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
          <el-row>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input v-model="detailData.quantity" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="上架数量"
                prop="quantity"
                :rules="[
                  { required: true, message: '上架数量不能为空'},
                ]"
              >
                <el-input v-model="shelvesData.quantity" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shelvesCancleHandleClick()">取 消</el-button>
          <el-button type="primary" @click="postShelvesHandleClick('shelvesData')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStockDetailFnc, getStockInLineOne, postStockInDetail, putStockInDetail, putCounting, postCounting,
  postShelves, putShelves, getHeaderStatus } from '@/api/stock'
import { getWarehouseAll, getLocationAll } from '@/api/baseData'
import { positiveNumber } from '@/utils/validate'
export default {
  name: 'StockInDetail',
  data() {
    return {
      detailData: {},
      headerId: '',
      formLabelWidth: '80px',
      locationList: [], // 库位数据
      warehouseList: [], // 库房数据
      detailId: '',
      locationObj: { // 库房Id
        wid: ''
      },
      InventoryCheck: false, // 点收弹窗
      shelves: false, // 上架弹窗
      shelvesData: { // 上架数据
        quantity: '',
        warehouse: '',
        location: ''
      },
      InventoryCheckEdit: {
        // 点收修改
        number: ''
      },
      line: {
        id: ''
      },
      lineData: {},
      headerStatus: 'create',
      page: {
        lineId: '',
        total: 10,
        current: 1,
        size: 10,
        deleted: false
      },
      listData: [],
      publichData: {
        itemName: '',
        itemUnit: '',
        batchNumber: ''
      }
    }
  },
  mounted() {
    this.publichData.itemName = sessionStorage.getItem('getStockDetailItemName')
    this.publichData.itemUnit = sessionStorage.getItem('getStockDetailItemUnit')
    this.publichData.batchNumber = sessionStorage.getItem('getStockDetailBatchNumber')
    this.page.lineId = sessionStorage.getItem('getStockDetail')
    this.line.id = sessionStorage.getItem('getStockDetail')
    // 获取所有的仓库
    this.getWarehouseAllFnc()
    // 获取所有的库位
    this.getLocationAllFnc()
    this.fetchData()
    // 获取单行信息
    this.getLine()
  },
  methods: {
    // 上架取消，数据清除
    shelvesCancleHandleClick() {
      this.shelves = false
      this.shelvesData.quantity = ''
      this.shelvesData.warehouse = ''
      this.shelvesData.location = ''
    },
    // 打开上架弹窗
    shelvesHandleClick(e) {
      this.shelves = true
      this.detailId = e.id // 明细ID
      this.detailData = e
    },
    // 插入上架明细
    postShelvesHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.shelvesData.quantity) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return
          }
          if (this.shelvesData.quantity > this.detailData.quantity) {
            this.$message({
              message: '上架数量异常',
              type: 'warning'
            })
            return
          }
          const param = {
            id: this.detailId,
            quantity: this.shelvesData.quantity,
            warehouse: this.shelvesData.warehouse,
            location: this.shelvesData.location
          }
          postShelves(param).then(res => {
            if (res.errorCode === 0) {
              this.shelves = false
              this.$message({
                message: '上架成功',
                type: 'success'
              })
            }
            this.shelvesData.quantity = ''
            this.shelvesData.warehouse = ''
            this.shelvesData.location = ''
            this.getLine()
            this.fetchData()
          })
          this.InventoryCheck = false
          this.InventoryCheckEdit.number = ''
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    // 取消上架
    putCheckHandleClick(e) {
      const param = {
        id: e.id
      }
      this.$confirm('此操作将取消该笔上架, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          putShelves(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '取消成功',
                type: 'success'
              })
            }
            this.fetchData()
            this.getLine()
          })
        })
        .catch(() => {})
    },

    // 获取入库单行
    getLine() {
      getStockInLineOne(this.line).then(res => {
        this.lineData = res.result
        this.getHeaderStatus(res.result)
      })
    },
    // 获取单头状态
    getHeaderStatus(e) {
      this.headerId = e.headerId
      const param = {
        id: e.headerId
      }
      getHeaderStatus(param).then(res => {
        if (res.result.status === 1) {
          this.headerStatus = 'create'
        }
        if (res.result.status === 2) {
          this.headerStatus = 'confirm'
        }
        if (res.result.status === 3) {
          this.headerStatus = 'register'
        }
        if (res.result.status === 4) {
          this.headerStatus = 'receive'
        }
        if (res.result.status === 5) {
          this.headerStatus = 'close'
        }
      })
    },
    // 取消点收
    putDetailHandleClick(e) {
      const param = {
        id: e.id
      }
      this.$confirm('此操作将取消该笔点收, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          putCounting(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '取消成功',
                type: 'success'
              })
            }
            this.fetchData()
            this.getLine()
          })
        })
        .catch(() => {})
    },
    // 获取入库明细
    fetchData() {
      getStockDetailFnc(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
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
    },
    // 根据仓库查库位
    warehouseChange(val) {
      this.shelvesData.warehouse = this.warehouseList.find(
        v => v.id === val
      ).warehouseName
      this.locationObj.wid = val
      this.locationList = []
      this.shelvesData.location = ''
      this.getLocationAllFnc()
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
.border{
width:100%;
margin:0 auto;
border: 0;
height: 0;

margin-bottom: 30px;
}

.title{
  color:#b5b5b5;
  font-size:12px;
  text-align: center
}
.cotent{
  text-align: center;
  padding-top: 4px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>

