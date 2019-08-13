<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <div>
          <el-row>
        <el-col :span="12"><div class="h-title">单头信息</div></el-col>
        <el-col :span="12">
        <div style="float:right;margin-right:50px">
           <el-button v-show="headerData.status === 1" type="primary" icon="el-icon-edit" @click="editHandleClick('headerData')">单头</el-button>
          <el-button v-show="headerData.status === 1" type="primary" icon="el-icon-circle-plus-outline" @click="addLineHandleClick">单行</el-button>
        </div>
        </el-col>
        </el-row>
      </div>

        <el-card style="margin-top:14px" class="box-card">
          <el-form ref="headerData" :model="headerData" class="demo-ruleForm">
            <el-row>
              <el-col :span="11">
                <el-form-item
                  prop="vendorId"
                  label="供应商ID"
                  :label-width="formLabelWidth"
                >
                  <el-input v-model="headerData.vendorId" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item
                  prop="vendorName"
                  label="供应商名称"
                  :label-width="formLabelWidth"
                >
                  <el-input v-model="headerData.vendorName" autocomplete="off" />
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
              <el-col :span="24">
                <el-form-item prop="state" label="入库单说明" :label-width="formLabelWidth">
                  <el-input
                    v-model="headerData.state"
                    type="textarea"
                    :rows="2"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>

        <div style="margin-top:30px">
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="itemId" label="物料编号" />
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="itemUnit" label="入库单位" />
            <el-table-column prop="batchNumber" label="物料批次" />
            <el-table-column prop="quantity" label="入库数量" />
            <el-table-column prop="quantityRegister" label="点收数量" />
            <el-table-column prop="quantityReceive" label="上架数量" />
            <el-table-column prop="producedDate" label="生产日期" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button v-show="headerData.status === 1" type="text" size="small" @click="editLineFnc(scope.row)">编辑</el-button>
                <el-button v-show="headerData.status === 1" type="text" size="small" @click="deleteLineFnc(scope.row.id)">删除</el-button>
                <el-button v-show="headerData.status === 3 || headerData.status === 2 " type="text" size="small" @click="countingHandleClick(scope.row)">点收</el-button>
                <el-button v-show="headerData.status !== 1" type="text" size="small" @click="turnToStockDetail(scope.row)">明细</el-button>
              </template>
            </el-table-column>
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

    <!--编辑入库单行-->
    <div>
      <el-dialog title="编辑入库单行" :visible.sync="editLine">
        <el-form ref="editLineData" :model="editLineData" class="demo-ruleForm">
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
                  v-model="editLineData.itemId"
                  clearable
                  filterable
                  placeholder="物料编号"
                  @change="itemEditChange"
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
                  v-model="editLineData.batchNumber"
                  clearable
                  filterable
                  placeholder="物料批次"
                  @change="itemEditBatchChange"
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
                <el-input v-model="editLineData.itemName" disabled />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="入库单位" :label-width="formLabelWidth">
                <el-input v-model="editLineData.itemUnit" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="producedDate" label="生产日期" :label-width="formLabelWidth">
                <el-input v-model="editLineData.producedDate" disabled autocomplete="off" />
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
    <!--新增单行END-->

      <!--点收弹窗-->
    <div>
      <el-dialog title="点收" :visible.sync="counting">
        <el-form ref="countingData" :model="countingData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="quantity" label="入库数量" :label-width="formLabelWidth">
                <el-input v-model="countingData.quantity" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="quantityRegister" label="总点收数量" :label-width="formLabelWidth">
                <el-input v-model="countingData.quantityRegister" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="quantityReceive" label="上架数量" :label-width="formLabelWidth">
                <el-input v-model="countingData.quantityReceive" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="number"
                label="点收数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '点收数量不能为空'}
                ]"
              >
                <el-input v-model="countingData.number" type="number" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="countingCancle()">取 消</el-button>
          <el-button type="primary" @click="postCheckHandleClick('countingData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--点收弹窗end-->
  </div>
</template>

<script>
import {
  getStockInHeaderOne,
  getTypeAllFnc,
  getStockInLineAll,
  putHeader,
  putLine,
  deleteLine,
  postLine,
  postCounting,
} from "@/api/stock";
import {
  getAllinvBatchList,
  getUnitAll,
  getItemAllFnc,
  getItemOne,
  getBatchOne
} from "@/api/baseData";
import { positiveNumber } from "@/utils/validate";
export default {
  mounted(option) {
    this.headerId = this.$route.params.headerId;
    if (!this.headerId) {
      this.$router.push({ name: "stockInHeader" });
      return;
    }
    this.getOneHeader();
    this.getTypeAllFnc();
    //获取全部物料
    this.getItemAllFnc();
    //获取行数据
    this.getStockInLineAll();
  },
  data() {
    return {
      editLine: false,
      Line: false,
      editLineData: {},
      headerId: "",
      headerData: {},
      lineData:{},
     countingData: {
        // 点收数据
        quantity: '',
        quantityRegister: '',
        quantityReceive: '',
        number: ''
      },
      addLineData: {
        // 新增单行数据
        headerId: "",
        itemId: "",
        itemName: "",
        itemUnit: "",
        batchNumber: "",
        quantity: "",
        producedDate: ""
      },
      formLabelWidth: "120px",
      setRemote: [],
      listData: [],
      item: [], //物料下拉
      unit: [], //单位下拉
      batchNumber: [], //批次下拉
      counting: false, // 点收弹窗
    };
  },
  methods: {
          // 跳转点收页面
    turnToStockDetail(e) {
      sessionStorage.setItem('getStockDetailItemName', e.itemName)
      sessionStorage.setItem('getStockDetailItemUnit', e.itemUnit)
      sessionStorage.setItem('getStockDetailBatchNumber', e.batchNumber)
      sessionStorage.setItem('getStockDetail', e.id)
      this.$router.push({ name: 'stockInDetail' })
    },
       // 插入点收明细
    postCheckHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.countingData.number) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return;
          }
          if (this.countingData.number >  this.countingData.quantity - this.countingData.quantityRegister) {
            this.$message({
              message: '点收数量异常',
              type: 'warning'
            })
            return;
          }
          const param = {
            batchNumber: this.lineData.batchNumber,
            itemId: this.lineData.itemId,
            itemName: this.lineData.itemName,
            itemUnit: this.lineData.itemUnit,
            lineId: this.lineData.id,
            quantity: this.countingData.number,
            warehouse: '暂无',
            location: '暂无'
          }
          postCounting(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '点收成功',
                type: 'success'
              })
            }
            this.getStockInLine()
            this.fetchData()
          })
          this.counting = false
          this.countingData.number = '';
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
         // 点收取消清除数据
    countingCancle() {
      this.counting = false
      this.countingData.number = ''
    },
          // 点收弹窗
    countingHandleClick(e) {
      this.lineData = e
      this.countingData.quantity = e.quantity
      this.countingData.quantityRegister = e.quantityRegister
      this.countingData.quantityReceive = e.quantityReceive
      this.counting = true
    },
    // 新增单行弹框
    addLineHandleClick() {
      this.Line = true;
      this.addLineData.headerId = this.headerId;
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
    // 删除单行数据
    deleteLineFnc(e) {
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
            this.getStockInLineAll();
          });
        })
        .catch(() => {});
    },
    // 编辑单行确定
    editLineHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.editLineData.quantity) === false) {
            this.$message({
              message: "数量应为有效正整数",
              type: "warning"
            });
            return;
          }
          const param = {
            id: this.editLineData.id,
            itemId: this.editLineData.itemId,
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
    // 编辑单行弹窗
    editLineFnc(e) {
      this.editLine = true;
      this.editLineData = e;
    },
    //编辑单头
    editHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id: this.headerData.id,
            billType: this.headerData.billType,
            billNumber: this.headerData.billNumber,
            vendorId: this.headerData.vendorId,
            vendorName: this.headerData.vendorName,
            state: this.headerData.state
          };
          putHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.getOneHeader();
            }
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    // 表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
              this.getStockInLineAll();
              this.Line = false;
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
    // 获取行数据
    getStockInLineAll() {
      let parma = {
        headerId: this.headerId
      };
      getStockInLineAll(parma).then(res => {
        this.listData = res.result;
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
    // 编辑选择批次后查询生产日期
    itemEditBatchChange() {
      if (this.editLineData.batchNumber) {
        const param = {
          itemId: this.editLineData.itemId,
          batchNumber: this.editLineData.batchNumber
        };
        getBatchOne(param).then(res => {
          this.editLineData.producedDate = res.result.producedDate;
        });
      } else {
        return;
      }
    },
    // 单行编辑选择物料下拉数据，用物料ID查询物料名称
    itemEditChange() {
      this.editLineData.batchNumber = "";
      this.editLineData.producedDate = "";
      if (this.editLineData.itemId) {
        const param = {
          id: this.editLineData.itemId
        };
        let params = {
          itemId: this.editLineData.itemId
        };
        this.getAllinvBatchList(params);
        getItemOne(param).then(res => {
          this.editLineData.itemName = res.result.itemName;
          this.editLineData.itemUnit = res.result.itemUnit;
        });
      } else {
        return;
      }
    },
    //获取单个单头信息
    getOneHeader() {
      let params = {
        id: this.headerId
      };
      getStockInHeaderOne(params).then(res => {
        this.headerData = res.result;
      });
      this.LineList();
    },
    //获取行数据
    LineList() {},
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
      getTypeAllFnc().then(res => {
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