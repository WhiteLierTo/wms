<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <div class="h-title">单头信息</div>
        <el-card style="margin-top:14px" class="box-card">
          <el-form ref="headerData" :model="headerData" class="demo-ruleForm">
            <el-row>
              <el-col :span="11">
                <el-form-item
                  prop="vendorId"
                  label="供应商ID"
                  :label-width="formLabelWidth"
                >
                  <el-select
                    style="width:100%"
                    v-model="headerData.vendorId"
                    clearable
                    filterable
                    placeholder="供应商"
                    @change="vendorChange"
                  >
                    <el-option
                      v-for="item in supplier"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  prop="billType"
                  label="单据类型"
                  :label-width="formLabelWidth"
                  :rules="[
                  { required: true, message: '外部单据类型不能为空'}
                ]"
                >
                  <el-select
                  style="width:100%"
                    v-model="headerData.billType"
                    clearable
                    filterable
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
              <el-col :span="11">
                <el-form-item
                  prop="billNumber"
                  label="单据编号"
                  :label-width="formLabelWidth"
                  :rules="[
                  { required: true, message: '单据编号不能为空'},
                ]"
                >
                  <el-input v-model="headerData.billNumber" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="22">
                <el-form-item
                  prop="state"
                  label="入库单说明"
                  :label-width="formLabelWidth"
                >
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="headerData.state"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item style="text-align:center">
              <el-button
                v-show="addLine === false"
                type="primary"
                @click="addHandleClick('headerData')"
              >确定</el-button>
              <el-button v-show="addLine === true" type="primary" @click="addLineHandleClick">添加单行</el-button>
              <el-button v-show="addLine === false" @click="resetForm('headerData')">重置</el-button>
              <el-button v-show="addLine === true" @click="Form">返回</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <div style="margin-top:30px">
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
           <el-table-column prop="itemId" label="物料编号" />
                  <el-table-column prop="itemName" label="物料名称" />
                  <el-table-column prop="itemUnit" label="入库单位"/>
                  <el-table-column prop="batchNumber" label="物料批次" />
                  <el-table-column prop="quantity" label="入库数量" />
                  <el-table-column prop="quantityRegister" label="点收数量" />
                  <el-table-column prop="quantityReceive" label="上架数量" />
                  <el-table-column prop="producedDate" label="生产日期" />
          </el-table>
        </div>
      </el-card>
    </div>

    <!--新增单行-->
    <div>
      <el-dialog title="新增入库单行" :visible.sync="Line">
        <el-form ref="addLineData" :model="addLineData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="itemId"
                label="物料编号"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料编号不能为空'}
                ]"
              >
                <el-select
                  v-model="addLineData.itemId"
                  clearable
                  filterable
                  placeholder="物料编号"
                  @change="itemAddChange"
                  @clear="itemClearFnc"
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
                  filterable
                  placeholder="物料批次"
                  @change="itemBatchChange"
                  @clear="batchClearFnc"
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
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="itemName" label="入库名称" :label-width="formLabelWidth">
                <el-input v-model="addLineData.itemName" disabled />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="入库单位" :label-width="formLabelWidth">
                <el-input v-model="addLineData.itemUnit" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="producedDate" label="生产日期" :label-width="formLabelWidth">
                <el-input v-model="addLineData.producedDate" disabled autocomplete="off" />
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
          <el-button @click="Line = false">取 消</el-button>
          <el-button type="primary" @click="postLineHandleClick('addLineData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--新增单行END-->
  </div>
</template>

<script>
import {
  getTypeAllFnc,
  postHeader,
  getStockInLine,
  postLine
} from "@/api/stock";
import {
  getAllinvBatchList,
  getUnitAll,
  getItemAllFnc,
  getItemOne,
  getBatchOne,
  getSupplier,
  getSupplierOne
} from "@/api/baseData";
import { positiveNumber } from "@/utils/validate";
export default {
  mounted() {
    this.getTypeAllFnc();
    //获取全部物料
    this.getItemAllFnc();
    //获取所有供应商
     this.getSupplier();
  },
  destroyed(){
    this.listData = [];
    this.resetForm('headerData');
    this.resetForm('addLineData');
  },
  data() {
    return {
      formLabelWidth: "120px",
      addLine: false,
      Line: false,
      headerData: {},
      setRemote: [],
      listData: [],
      item: [], //物料下拉
      unit: [], //单位下拉
      batchNumber: [], //批次下拉
      supplier:[], //供应商下拉
      addLineData: {
        // 新增单行数据
        headerId: "",
        itemId: "",
        itemName: "",
        itemUnit: "",
        batchNumber: "",
        quantity: "",
        producedDate: "",
      }
    };
  },
  methods: {
    //供应商改变
    vendorChange(){
      let param = {
        id:this.headerData.vendorId
      }
      getSupplierOne(param).then(res=>{
          this.headerData.vendorName = res.result.supplierName
        })
    },
     //获取所有供应商
     getSupplier(){
        getSupplier().then(res => {
        this.supplier = res.result.map(item => {
          return { value: item.id, label: item.supplierName };
        });
      });
     },
    //返回入库单页面
    Form(){
        this.listData = [];
        this.resetForm('headerData');
         //跳转入库单页面
        this.$router.push({ name: 'stockInHeader'})
    },
    //查询单行列表
    getLineData() {
      let param = {
        headerId: this.headerData.id
      };
      getStockInLine(param).then(res => {
        this.listData = res.result.list;
      });
    },
    // 新增单行数据
    postLineHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.addLineData.quantity) === false) {
            this.$message({
              message: "数量应为有效正整数",
              type: "warning"
            });
            return;
          }
          const param = {
            headerId: this.headerData.id,
            itemId: this.addLineData.itemId,
            itemUnit: this.addLineData.itemUnit,
            itemName: this.addLineData.itemName,
            batchNumber: this.addLineData.batchNumber,
            quantity: this.addLineData.quantity
          };
          postLine(param).then(res => {
            if (res.errorCode === 0) {
              this.resetForm(formName);
              this.getLineData();
              this.Line =false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
            this.getLineData();
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    // 批次删除，联动清除
    batchClearFnc() {
      this.addLineData.producedDate = "";
    },
    // 物料删除，联动清除
    itemClearFnc() {
      this.addLineData.itemName = "";
      this.addLineData.itemUnit = "";
      this.addLineData.batchNumber = "";
      this.addLineData.producedDate = "";
    },
    // 新增选择批次后查询生产日期
    itemBatchChange() {
      if (this.addLineData.batchNumber) {
        const param = {
          itemId: this.addLineData.itemId,
          batchNumber: this.addLineData.batchNumber
        };
        getBatchOne(param).then(res => {
          this.addLineData.producedDate = res.result.producedDate;
        });
      } else {
        return;
      }
    },
    // 单行新增选择物料下拉数据，用物料ID查询物料名称
    itemAddChange() {
      if (this.addLineData.itemId) {
        const param = {
          id: this.addLineData.itemId
        };
        let params = {
          itemId: this.addLineData.itemId
        };
        this.getAllinvBatchList(params);
        getItemOne(param).then(res => {
          this.addLineData.itemName = res.result.itemName;
          this.addLineData.itemUnit = res.result.itemUnit;
        });
      } else {
        return;
      }
    },
    // c单头
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          postHeader(this.headerData).then(res => {
            this.headerData = res.result;
            if (res.errorCode === 0) {
              this.addLine = true;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    // 新增单行弹框
    addLineHandleClick(e) {
      this.Line = true;
      this.addLineData.headerId = e.id;
    },
    // 表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取全部物料
    getItemAllFnc() {
      getItemAllFnc().then(res => {
        this.item = res.result.map(item => {
          return { value: item.id, label: item.id };
        });
      });
    },
    // 获取全部批次
    getAllinvBatchList(e) {
      getAllinvBatchList(e).then(res => {
        this.batchNumber = res.result.map(item => {
          return { value: item.id, label: item.batchNumber };
        });
      });
    },
    // 获取外部单据类型
    getTypeAllFnc() {
      let param = {
        direction:1
      }
      getTypeAllFnc(param).then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.typeName };
        });
      });
    }
  }
};
</script>

<style scoped>
</style>