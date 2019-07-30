<template>
  <div>
    <div class="body">
           <el-row :gutter="12">
              <el-col :span="4">
                <el-card  shadow="never">
                  <div class="title">物料名称</div>
                  <div class="cotent">{{publichData.itemName}}</div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="never">
                  <div class="title">捡货单位</div>
                  <div class="cotent">{{publichData.itemUnit}}</div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card  shadow="always">
                  <div class="title">出库数量</div>
                  <div class="cotent">{{lineData.quantity}}</div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card shadow="hover">
                   <div class="title">捡货数量</div>
                  <div class="cotent">{{lineData.quantityPick}}</div>
                </el-card>
              </el-col>
              <el-col :span="4">
                <el-card  shadow="never">
                  <div class="title">已出库数量</div>
                  <div class="cotent">{{lineData.quantityShipping}}</div>
                </el-card>
              </el-col>
               <el-col :span="4">
                <el-card shadow="never">
                  <div class="title">当前状态</div>
                  <div class="cotent">{{headerStatus}}</div>
                </el-card>
              </el-col>
            </el-row>
      <div class="border">
      </div>
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column  prop="id" label="明细ID" />
            <el-table-column   prop="warehouse" label="出库库房" />
            <el-table-column   prop="location" label="出库库位" />
            <el-table-column   prop="quantity" label="数量" />
            <el-table-column   prop="batchNumber" label="批次" />
            <el-table-column   prop="type" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.type===1" style="color:#3c763d">picking</div>
                <div v-if="scope.row.type===2" style="color:#dd001b">stock out</div>
              </template>
            </el-table-column>
            <el-table-column width="200" prop="outboundDate" label="捡货日期" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div v-show="headerStatus !== 'close'">
                  <el-button v-show="scope.row.type===1" type="text" size="small" @click="putDetailHandleClick(scope.row)">取消捡货</el-button>
                  <el-button v-show="scope.row.type===1" type="text" size="small" @click="shelvesHandleClick(scope.row)">出库</el-button>
                  <el-button v-show="scope.row.type===2" type="text" size="small" @click="putCheckHandleClick(scope.row)">取消出库</el-button>
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

    <!--出库-->
    <div>
      <el-dialog title="出库" :visible.sync="shelves">
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
              >
                <el-input v-model="detailData.warehouse"  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="location"
                label="库位"
                :label-width="formLabelWidth"
              >
                <el-input v-model="detailData.location" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input v-model="detailData.quantity"  disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
label="出库数量"
prop="quantity"
                            :rules="[
                              { required: true, message: '出库数量不能为空'},
                            ]"
>
                <el-input v-model="shelvesData.quantity" type="number"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shelvesCancleHandleClick()">取 消</el-button>
          <el-button type="primary" @click="postStockoutHandleClick('shelvesData')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStockOutDetail, getStockOutLineOne, postStockInDetail, putStockInDetail, putStockOutCounting,
  postStockout, putStockout, getStockOutHeaderStatus } from '@/api/stock';
import { getWarehouseAll, getLocationAll } from '@/api/baseData'
import { positiveNumber } from '@/utils/validate';
export default {
  name: 'stockout-detail',
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
      InventoryCheck: false, // 捡货弹窗
      shelves: false, // 出库弹窗
      shelvesData: { // 出库数据
        quantity: '',
        warehouse: '',
        location: ''
      },
      InventoryCheckEdit: {
        // 捡货修改
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
      batchNumber:'',
      publichData:{
        itemName:'',
        itemUnit:'',
        batchNumber:''
      },
    };
  },
  mounted(){
     this.publichData.itemName =  sessionStorage.getItem("getStockDetailItemName");
    this.publichData.itemUnit =  sessionStorage.getItem("getStockDetailItemUnit");
    this.publichData.batchNumber =  sessionStorage.getItem("getStockDetailBatchNumber");
    this.page.lineId = sessionStorage.getItem("getStockDetail");
    this.line.id = sessionStorage.getItem("getStockDetail");
    // 获取所有的仓库
    this.getWarehouseAllFnc()
    // 获取所有的库位
    this.getLocationAllFnc()
    this.fetchData();
     // 获取单行信息
    this.getLine();
  },
  methods: {
    //出库取消，数据清除
    shelvesCancleHandleClick(){
      this.shelves = false;
      this.shelvesData.quantity = "";
      this.shelvesData.warehouse = "";
      this.shelvesData.location = "";
    },
    //打开出库弹窗
    shelvesHandleClick(e){
      this.shelves = true;
      this.detailId = e.id;  //明细ID
      this.batchNumber =  e.batchNumber;
      this.detailData = e;
    },
     //插入出库明细
    postStockoutHandleClick(formName){
        this.$refs[formName].validate(valid => {
        if (valid) {
        if (positiveNumber(this.shelvesData.quantity) === false) {
            this.$message({
              message: "数量应为有效正整数",
              type: "warning"
            });
            return;
          }
          if(this.shelvesData.quantity>this.detailData.quantity){
             this.$message({
              message: "出库数量异常",
              type: "warning"
            });
            return;
          }
          let param = {
          id: this.detailId,
          quantity: this.shelvesData.quantity,
          warehouse: this.detailData.warehouse,
          location: this.detailData.location,
          batchNumber:this.batchNumber
        }
      postStockout(param).then(res => {
        if (res.errorCode === 0) {
          this.shelves = false
          this.$message({
            message: '出库成功',
            type: 'success'
          })
        }
        this.shelvesData.quantity = '';
        this.shelvesData.warehouse='';
        this.shelvesData.location='';
        this.getLine();
        this.fetchData();
      })
      this.InventoryCheck = false;
      this.InventoryCheckEdit.number = '';
       } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
     //取消出库
     putCheckHandleClick(e) {
       let param = {
         id:e.id
       }
      this.$confirm('此操作将取消该笔出库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          putStockout(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '取消成功',
                type: 'success'
              })
            }
            this.fetchData();
             this.getLine();
          })
        })
        .catch(() => {})
    },
  
    //获取捡货单行
    getLine() {
      getStockOutLineOne(this.line).then(res => {
        this.lineData = res.result;
        this.getStockOutHeaderStatus(res.result);
      });
     
    },
    //获取单头状态
    getStockOutHeaderStatus(e){
      this.headerId = e.headerId;
      let param = {
        id :e.headerId,
      }
      getStockOutHeaderStatus(param).then(res => {
         if(res.result.status === 1){
          this.headerStatus = 'create'
        }
         if(res.result.status === 2){
          this.headerStatus = 'confirm'
        }
         if(res.result.status === 3){
          this.headerStatus = 'picking'
        }
         if(res.result.status === 4){
           this.headerStatus = 'shipping'
        }
        if(res.result.status == 5){
           this.headerStatus = 'close'
        }
      });
    },
    //取消捡货
     putDetailHandleClick(e) {
       let param = {
         id:e.id
       }
      this.$confirm('此操作将取消该笔捡货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          putStockOutCounting(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '取消成功',
                type: 'success'
              })
            }
            this.fetchData();
             this.getLine();
          })
        })
        .catch(() => {})
    },
    //获取捡货明细
    fetchData() {
      getStockOutDetail(this.page).then(res => {
        this.listData = res.result.list;
        this.page.total = res.result.total;
      });
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
      this.page.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchData();
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
.body {
  margin: 20px 1% 0px 1%;
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

