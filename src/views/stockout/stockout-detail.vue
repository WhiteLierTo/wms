<template>
  <div>
    <div class="body">
      <div style="margin-left:20px">
          <el-form :inline="true" :model="lineData" class="demo-form-inline">
             <el-form-item label="入库数量">
              <el-input size="medium " readonly style="width:150px"  v-model="lineData.quantity" placeholder="上架数量"></el-input>
            </el-form-item>
            <el-form-item label="点收数量">
              <el-input size="medium " readonly style="width:150px"  v-model="lineData.quantityRegister" placeholder="点收数量"></el-input>
            </el-form-item>
            <el-form-item label="上架数量">
              <el-input size="medium " readonly style="width:150px"  v-model="lineData.quantityReceive" placeholder="上架数量"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input size="medium " readonly style="width:150px"  v-model="headerStatus" placeholder="状态"></el-input>
            </el-form-item>
        <!--     <el-form-item>
                  <el-button size="medium" type="primary"  @click="InventoryCheck = true">点收</el-button>
            </el-form-item> -->
          </el-form>
      </div>
      <div class="border">
      </div>
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column  width="150" prop="id" label="明细ID" />
            <el-table-column  width="150" prop="itemName" label="物料名称" />
            <el-table-column  width="150" prop="itemUnit" label="入库单位"></el-table-column>
            <el-table-column  width="150" prop="batchNumber" label="物料批次" />
            <el-table-column  width="150" prop="warehouse" label="上架库房" />
            <el-table-column  width="150" prop="location" label="上架库位" />
            <el-table-column  width="150" prop="quantity" label="数量" />
            <el-table-column  width="150" prop="type" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.type==1" style="color:#3c763d">register</div>
                <div v-if="scope.row.type==2" style="color:#dd001b">stock in</div>
              </template>
            </el-table-column>
            <el-table-column  width="200" prop="inboundDate" label="入库日期" />
            <el-table-column  fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <div v-show="headerStatus != 'close'">
                <el-button  v-show="scope.row.type==1" type="text" size="small" @click="putDetailHandleClick(scope.row)">取消点收</el-button>
                <el-button  v-show="scope.row.type==1" type="text" size="small"  @click="shelvesHandleClick(scope.row)" >上架</el-button>
                <el-button  v-show="scope.row.type==2" type="text" size="small"  @click="putCheckHandleClick(scope.row)" >取消上架</el-button>
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


    <!--点收-->
    <div>
      <el-dialog title="点收" :visible.sync="InventoryCheck" width="30%">
        <el-form
          :model="InventoryCheckEdit"
          ref="ruleForm"
          :label-width="formLabelWidth"
          class="demo-ruleForm"
        >
          <el-form-item label="点收数量" prop="number"
           :rules="[
                  { required: true, message: '点收数量不能为空'},
            ]">
            <el-input v-model="InventoryCheckEdit.number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="InventoryCheck = false">取 消</el-button>
          <el-button type="primary" @click="postCheckHandleClick()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!--上架-->
      <div>
      <el-dialog title="上架" :visible.sync="shelves">
        <el-form
          :model="shelvesData"
          ref="ruleForm"
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
          <el-form-item label="上架数量" prop="quantity"
           :rules="[
                  { required: true, message: '上架数量不能为空'},
            ]">
            <el-input v-model="shelvesData.quantity"></el-input>
          </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="shelvesCancleHandleClick()">取 消</el-button>
          <el-button type="primary" @click="postShelvesHandleClick()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStockDetailFnc, getStockInLineOne,postStockInDetail,putStockInDetail,putCounting,postCounting,
postShelves,putShelves,getHeaderStatus } from "@/api/stock";
import { getWarehouseAll,getLocationAll} from '@/api/baseData'
export default {
  name:"stockout-detail",
  data() {
    return {
        headerId:'',
        formLabelWidth: '80px',
        locationList:[],  //库位数据
        warehouseList:[], //库房数据
        detailId:'',
        locationObj: {   //库房Id
        wid: ''
      },
      InventoryCheck: false, //点收弹窗
      shelves:false,//上架弹窗
      shelvesData:{   //上架数据
        quantity:"",
        warehouse:"",
        location:''
      },
      InventoryCheckEdit: {
        //点收修改
        number: ""
      },
      line: {
        id: ""
      },
      lineData: {},
      headerStatus:'create',
      page: {
        lineId: "",
        total: 10,
        current: 1,
        size: 10,
        deleted: false
      },
      listData: []
    };
  },
  methods: {
    //上架取消，数据清除
    shelvesCancleHandleClick(){
      this.shelves = false;
      this.shelvesData.quantity = "";
      this.shelvesData.warehouse = "";
      this.shelvesData.location = "";
    },
    //打开上架弹窗
    shelvesHandleClick(e){
      this.shelves = true;
      this.detailId = e.id;  //明细ID
    },
     //插入上架明细
    postShelvesHandleClick(){
      let param = {
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
        this.shelvesData.quantity = '';
        this.shelvesData.warehouse='';
        this.shelvesData.location='';
         this.getLine();
         this.fetchData();
      })
      this.InventoryCheck = false;
      this.InventoryCheckEdit.number = '';
    },
     //取消上架
     putCheckHandleClick(e) {
       let param = {
         id:e.id
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
            this.fetchData();
             this.getLine();
          })
        })
        .catch(() => {})
    },
    //插入点收明细
    postCheckHandleClick(){
      let param = {
        batchNumber: this.lineData.batchNumber,
        itemId: this.lineData.itemId,
        itemName: this.lineData.itemName,
        itemUnit: this.lineData.itemUnit,
        lineId: this.lineData.id,
        quantity: this.InventoryCheckEdit.number,
        warehouse: "暂无",
        location: "暂无"
      }
      if(this.InventoryCheckEdit.number === ''){
        this.$message({
            message: '点收数量不能为空',
            type: 'error'
          })
          return
      }
      postCounting(param).then(res => {
        if (res.errorCode === 0) {
          this.add = false
          this.$message({
            message: '点收成功',
            type: 'success'
          })
        }
         this.getLine();
         this.fetchData();
      })
      this.InventoryCheck = false;
      this.InventoryCheckEdit.number = '';
    },
    //获取入库单行
    getLine() {
      getStockInLineOne(this.line).then(res => {
        this.lineData = res.result;
        this.getHeaderStatus(res.result);
      });
     
    },
    //获取单头状态
    getHeaderStatus(e){
      this.headerId = e.headerId;
      let param = {
        id :e.headerId,
      }
      getHeaderStatus(param).then(res => {
         if(res.result.status == 1){
          this.headerStatus = 'create'
        }
         if(res.result.status == 2){
          this.headerStatus = 'confirm'
        }
         if(res.result.status == 3){
          this.headerStatus = 'register'
        }
         if(res.result.status == 4){
           this.headerStatus = 'receive'
        }
        if(res.result.status == 5){
           this.headerStatus = 'close'
        }
      });
    },
    //取消点收
     putDetailHandleClick(e) {
       let param = {
         id:e.id
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
            this.fetchData();
             this.getLine();
          })
        })
        .catch(() => {})
    },
    //获取入库明细
    fetchData() {
      getStockDetailFnc(this.page).then(res => {
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
  },
  mounted() {
    this.page.lineId = sessionStorage.getItem("getStockDetail");
    this.line.id = sessionStorage.getItem("getStockDetail");
    // 获取所有的仓库
    this.getWarehouseAllFnc()
    // 获取所有的库位
    this.getLocationAllFnc()
    this.fetchData();
     // 获取单行信息
    this.getLine();
  }
};
</script>

<style scoped>
.border{
width:100%;
margin:0 auto;
border: 0;
height: 0;
border-top: 1px solid rgba(0, 0, 0, 0.1);
border-bottom: 1px solid rgba(255, 255, 255, 0.3);
margin-bottom: 30px;
}
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
</style>



