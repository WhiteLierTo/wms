<!--入库单头管理-->
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
                    v-model="page.billType"
                    clearable
                    size="small"
                    placeholder="外部单据类型"
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
          <el-table @expand-change="expandChange"  :data="listData" style="width: 100%">
            <el-table-column type="expand">
              <!--单行信息-->
              <template>
                <el-table
                  v-loading="loading"
                  border
                  :data="LineData"
                  style="width: 100%"
                >
                  <el-table-column  prop="itemName" label="物料名称" />
                  <el-table-column  prop="itemUnit" label="入库单位"></el-table-column>
                  <el-table-column  prop="batchNumber" label="物料批次" />
                  <el-table-column  prop="quantity" label="入库数量" />
                  <el-table-column  prop="quantityRegister" label="点收数量" />
                  <el-table-column  prop="quantityReceive" label="上架数量" />
                  <el-table-column  prop="producedDate" label="生产日期" />
                  <el-table-column  label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button v-show="line.status == 1" type="text" size="small" @click="editLineFnc(scope.row)">编辑</el-button>
                      <el-button v-show="line.status == 1" type="text" size="small" @click="deleteLineFnc(scope.row.id)">删除</el-button>
                      <el-button v-show="line.status == 3 || line.status == 2" type="text" size="small" @click="countingHandleClick(scope.row)">点收</el-button>
                      <el-button type="text" size="small" @click="turnToStockDetail(scope.row)">明细</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column  prop="vendorId" label="供应商ID" />
            <el-table-column  prop="vendorName" label="供应商名称" />
            <el-table-column  prop="billNumber" label="外部单据名称" />
            <!-- <el-table-column  prop="billType" label="外部单据类型"></el-table-column> -->
            <el-table-column  prop="state" label="入库单说明" />
            <el-table-column  prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1" style="color:#3c763d">create</div>
                <div v-if="scope.row.status==2" style="color:#3c763d">confirm</div>
                <div v-if="scope.row.status==3" style="color:#3c763d">register</div>
                <div v-if="scope.row.status==4" style="color:#3c763d">receive</div>
                <div v-if="scope.row.status==5" style="color:#3c763d">close</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button v-show="scope.row.completed==true" type="text" size="small" @click="closeHandleClick(scope.row)">关闭</el-button>
                <el-button v-show="scope.row.status==1" type="text" size="small" @click="LineHandleClick(scope.row)">添加单行</el-button>
                <el-button v-show="scope.row.status==1" type="text" size="small" @click="confirmHandleClick(scope.row)">确认</el-button>
                <el-button v-show="scope.row.status==1" type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button v-show="scope.row.status==1" type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
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

    <!--点收弹窗-->
    <div>
      <el-dialog title="点收" :visible.sync="counting">
        <el-form ref="countingData" :model="countingData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="quantity"
                label="入库数量"
                :label-width="formLabelWidth"
              >
                <el-input readonly v-model="countingData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="quantityRegister"
                label="总点收数量"
                :label-width="formLabelWidth"
              >
                <el-input readonly v-model="countingData.quantityRegister" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="quantityReceive"
                label="上架数量"
                :label-width="formLabelWidth"
              >
                <el-input readonly v-model="countingData.quantityReceive" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="number"
                label="点收数量"
                :label-width="formLabelWidth"
                :rules="[
                { required: true, message: '点收数量不能为空'},
            ]">
                <el-input v-model="countingData.number" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="counting = false">取 消</el-button>
          <el-button type="primary" @click="postCheckHandleClick()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  <!--点收弹窗end-->

    <!--新增单头-->
    <div>
      <el-dialog title="新增入库单头" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="vendorId"
                label="供应商ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '供应商ID不能为空'}
                ]"
              >
                <el-input v-model="addData.vendorId" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="vendorName"
                label="供应商名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '供应商名称不能为空'},
                ]"
              >
                <el-input v-model="addData.vendorName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="11">
              <el-form-item
                prop="billType"
                label="入库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '外部单据类型不能为空'}
                ]"
              >
                 <el-select
                    v-model="addData.billType"
                    clearable
                    placeholder="外部单据类型"
                  >
                    <el-option
                      v-for="item in setRemote"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="state"
                label="入库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单说明不能为空'},
                ]"
              >
                <el-input v-model="addData.state" autocomplete="off" />
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

     <!--新增单行-->
    <div>
      <el-dialog title="新增入库单行" :visible.sync="addLine">
        <el-form ref="addLineData" :model="addLineData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
            <el-form-item
                prop="itemId"
                label="物料名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料名称不能为空'}
                ]"
              >
                 <el-select
                    v-model="addLineData.itemId"
                    clearable
                    placeholder="物料名称"
                    @change="itemAddChange"
                  >
                    <el-option
                      v-for="item in item"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
           <el-form-item
                prop="itemUnit"
                label="入库单位"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单位不能为空'}
                ]"
              >
                 <el-select
                    v-model="addLineData.itemUnit"
                    clearable
                    placeholder="入库单位"
                  >
                    <el-option
                      v-for="item in unit"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="11">
              <el-form-item
                prop="batchNumber"
                label="物料批次"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料批次不能为空'}
                ]"
              >
                 <el-select
                    v-model="addLineData.batchNumber"
                    clearable
                    placeholder="物料批次"
                  >
                    <el-option
                      v-for="item in batchNumber"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="quantity"
                label="入库数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库数量不能为空'},
                ]"
              >
                <el-input v-model="addLineData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addLine = false">取 消</el-button>
          <el-button type="primary" @click="postLineHandleClick('addLineData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--新增单行END-->

      <!--编辑单行-->
    <div>
      <el-dialog title="编辑入库单行" :visible.sync="editLine">
        <el-form ref="editLineData" :model="editLineData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
            <el-form-item
                prop="itemId"
                label="物料名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料名称不能为空'}
                ]"
              >
                 <el-select
                    v-model="editLineData.itemId"
                    clearable
                    placeholder="物料名称"
                    @change="itemEditChange"
                  >
                    <el-option
                      v-for="item in item"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
           <el-form-item
                prop="itemUnit"
                label="入库单位"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单位不能为空'}
                ]"
              >
                 <el-select
                    v-model="editLineData.itemUnit"
                    clearable
                    placeholder="入库单位"
                  >
                    <el-option
                      v-for="item in unit"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="11">
              <el-form-item
                prop="batchNumber"
                label="物料批次"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料批次不能为空'}
                ]"
              >
                 <el-select
                    v-model="editLineData.batchNumber"
                    clearable
                    placeholder="物料批次"
                  >
                    <el-option
                      v-for="item in batchNumber"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="quantity"
                label="入库数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库数量不能为空'},
                ]"
              >
                <el-input v-model="editLineData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editLine = false">取 消</el-button>
          <el-button type="primary" @click="editLineHandleClick('editLineData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!---编辑单行END-->

    <!--编辑单头-->
    <div>
      <el-dialog title="编辑入库单头" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="vendorId"
                label="供应商ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '供应商ID不能为空'}
                ]"
              >
                <el-input v-model="editData.vendorId" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="vendorName"
                label="供应商名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '供应商名称不能为空'},
                ]"
              >
                <el-input v-model="editData.vendorName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="11">
              <el-form-item
                prop="billType"
                label="入库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '外部单据类型不能为空'}
                ]"
              >
                 <el-select
                    v-model="editData.billType"
                    clearable
                    placeholder="外部单据类型"
                    @change="typeChange()"
                  >
                    <el-option
                      v-for="item in setRemote"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="state"
                label="入库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单说明不能为空'},
                ]"
              >
                <el-input v-model="editData.state" autocomplete="off" />
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
  getStockInHeader,
  getTypeAllFnc,
  getStockInLine,
  postCounting,
  postHeader,
  putHeader,
  deleteHeader,
  putHeaderStatus,
  postLine,
  putLine,
  deleteLine
} from "@/api/stock";
import {getAllinvBatchList,getUnitAll,getItemAllFnc,getItemOne} from "@/api/baseData";
export default {
  name: "stockout-Header",
  data() {
    return {
      remote: [],
      loading:false,
      setRemote: [],
      add: false,
      edit: false,
      counting:false,//点收弹窗
      addLine:false, //新增单行弹窗
      editLine:false,//编辑单行弹窗
      lineData: {},//行数据
      countingData:{    //点收数据
          quantity:'',
          quantityRegister:'',
          quantityReceive:"",
          number:""
      },
      formLabelWidth: "100px",
      addData: {
        // 新增数据
        vendorId: "",
        vendorName: "",
        state:'',
        billType:''
      },
      addLineData:{   //新增单行数据
          headerId:"",
          itemId:"",
          itemName:'',
          itemUnit:'',
          batchNumber:'',
          quantity:''
      },
      editLineData:[],
      editData: {},
      page: {
        // 查询条件
        billType: '',
        total: 40,
        current: 1,
        size: 10,
        deleted: false
      },
      listData: [],
      LineData: [],
      line: {
        headerId: "",
        status:''
      },
      item:[],   //物料下拉
      unit:[],    //单位下拉
      batchNumber:[]    //批次下拉
    };
  },
  mounted() {
    this.fetchData();
    //获取全部批次
    this.getAllinvBatchList();
   //获取全部单位
   this.getUnitAll();
    //获取全部物料
   this.getItemAllFnc();
  },
  methods: {
    //删除单行数据
    deleteLineFnc(e){
      this.$confirm("此操作将永久删除该笔单行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          deleteLine(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    //编辑单行确定
    editLineHandleClick(formName){
         this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id:this.editLineData.id,
            itemName: this.editLineData.itemName,
            itemUnit: this.editLineData.itemUnit,
            batchNumber: this.editLineData.batchNumber,
            quantity: this.editLineData.quantity
          };
          putLine(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.editLine = false;
            }
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    //编辑单行弹窗
    editLineFnc(e){  
      this.editLine = true; 
      this.editLineData = e;
    },
    //单行新增选择物料下拉数据，用物料ID查询物料名称
    itemAddChange(){
      let param = {
        id:this.addLineData.itemId
      }
       getItemOne(param).then(res => {
        this.addLineData.itemName = res.result.itemName;
      });
    },
     //单行编辑选择物料下拉数据，用物料ID查询物料名称
    itemEditChange(){
      let param = {
        id:this.editLineData.itemId
      }
       getItemOne(param).then(res => {
        this.editLineData.itemName = res.result.itemName;
      });
    },
    //新增单行数据
    postLineHandleClick(formName){
        this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            headerId: this.addLineData.headerId,
            itemId:this.addLineData.itemId,
            itemUnit:this.addLineData.itemUnit,
            itemName:this.addLineData.itemName,
            batchNumber:this.addLineData.batchNumber,
            quantity:this.addLineData.quantity,
          };
         postLine(param).then(res => {
            if (res.errorCode === 0) {
              this.addLine = false;
              this.addLineData.headerId = "";
              this.addLineData.itemId = "";
              this.addLineData.itemUnit = "";
              this.addLineData.itemName = "";
              this.addLineData.batchNumber = "";
              this.addLineData.quantity = "";
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
            this.fetchData();
            this.getStockInLine();
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    //新增单行弹框
    LineHandleClick(e){
      this.addLine = true;
      this.addLineData.headerId = e.id;
    },
    //单头确认
    confirmHandleClick(e){
        let param = {
            id:e.id,
            status:2
        }
        this.$confirm("单头确认后将不可再进行修改、删除操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info "
      })
        .then(async () => {
          putHeaderStatus(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.$message({
                message: "单头确认成功",
                type: "success"
              });
            }
            this.fetchData();
          });
        })
        .catch(() => {});
    },  
     //单头确认关闭
    closeHandleClick(e){
        let param = {
            id:e.id,
            status:5,
            completed:false
        }
        this.$confirm("单头关闭后将不可再操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info "
      })
        .then(async () => {
          putHeaderStatus(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.$message({
                message: "单头关闭成功",
                type: "success"
              });
            }
            this.fetchData();
          });
        })
        .catch(() => {});
    },  
    //编辑外部单据类型改变
    typeChange(){
      let bill = {};
      bill = this.setRemote.find((item)=>{
       return item.value == this.editData.billType
      })
      let billNumber = JSON.stringify(bill.label);
      this.editData.billNumber = JSON.parse(billNumber);
    },
     //插入点收明细
    postCheckHandleClick(){
      let param = {
        batchNumber: this.lineData.batchNumber,
        itemId: this.lineData.itemId,
        itemName: this.lineData.itemName,
        itemUnit: this.lineData.itemUnit,
        lineId: this.lineData.id,
        quantity: this.countingData.number,
        warehouse: "暂无",
        location: "暂无"
      }
      if(this.countingData.number === ''){
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
         this.getStockInLine();
         this.fetchData();
      })
      this.counting = false;
      this.countingData.number = '';
    },
    //点收弹窗
    countingHandleClick(e){
      this.lineData = e;
      this.countingData.quantity = e.quantity;
      this.countingData.quantityRegister = e.quantityRegister;
      this.countingData.quantityReceive = e.quantityReceive;
      this.counting = true;
    },
    //跳转点收页面
     turnToStockDetail(e){
      sessionStorage.setItem("getStockDetail", e.id);
      this.$router.push({ name: 'stockInDetail'})
    },
    //新增取消
    addCancelHandleClick() {
      (this.add = false), (this.addData.unit = "");
      this.addData.description = " ";
    },
    // 查询
    queryHandleClick() {
      this.fetchData();
    },
    // 弹出修改页面并赋值
    editHandleClick(e) {
      this.edit = true;
      this.editData = e;
    },
    // curd
    addHandleClick(formName) {
      let bill = {};
      bill = this.setRemote.find((item)=>{
      return item.value == this.addData.billType
      })
      let billNumber = JSON.stringify(bill.label);
      let billNumberData = JSON.parse(billNumber);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            billType: this.addData.billType,
            billNumber: billNumberData,
            vendorId: this.addData.vendorId,
            vendorName: this.addData.vendorName,
            state: this.addData.state,
          };
         postHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.addData.billType = "";
              this.addData.billNumber = "";
              this.addData.vendorId = "";
              this.addData.vendorName = "";
              this.addData.state = "";
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
            this.fetchData();
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    deleteHandleClick(e) {
      this.$confirm("此操作将永久删除该入库单头, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          deleteHeader(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.$message({
                message: "删除成功",
                type: "success"
              });
            }
            this.fetchData();
          });
        })
        .catch(() => {});
    },
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id:this.editData.id,
            billType: this.editData.billType,
            billNumber: this.editData.billNumber,
            vendorId: this.editData.vendorId,
            vendorName: this.editData.vendorName,
            state: this.editData.state,
          };
          putHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.edit = false;
            }
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    //获取单头列表
    fetchData() {
      getStockInHeader(this.page).then(res => {
        this.listData = res.result.list;
        this.page.total = res.result.total;
      });
      this.getTypeAllFnc();
    },
    //对某一行展开或者关闭的时候会触发该事件
    expandChange(row, expandedRows) {
      this.loading = true;
      this.line.headerId=row.id;
      this.line.status = row.status;
      //sessionStorage.setItem("headerId", row.id);
      this.getStockInLine();
    },
    //获取行数据
    getStockInLine(){
      this.LineData = [];
      let params = {
        headerId:this.line.headerId
      };
      getStockInLine(params).then(res => {
        this.LineData = res.result.list;
        this.loading = false;
      });
      this.LineData = [];
    },
     //获取外部单据类型
    getTypeAllFnc() {
      getTypeAllFnc().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.typeName };
        });
      });
    },
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchData();
    },
        // 获取全部物料
    getItemAllFnc() {
      getItemAllFnc().then(res => {
        this.item = res.result.map(item => {
          return { value: item.id, label: item.itemName }
        })
      })
    },
        // 获取全部单位
    getUnitAll() {
      getUnitAll().then(res => {
        this.unit = res.result.map(item => {
          return { value: item.id, label: item.unit }
        })
      })
    },
    // 获取全部批次
    getAllinvBatchList() {
      getAllinvBatchList().then(res => {
        this.batchNumber = res.result.map(item => {
          return { value: item.id, label: item.batchNumber }
        })
      })
    },
  }
};
</script>

<style scoped>
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
</style>