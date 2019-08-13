<!--出库单头管理-->
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
                    filterable
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
                  <el-select
                    v-model="page.status"
                    clearable
                    filterable
                    size="small"
                    placeholder="状态"
                  >
                    <el-option
                      v-for="item in headerStatus"
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
          <el-table :data="listData" @expand-change="expandChange" style="width: 100%">
            <el-table-column type="expand">
              <!--单行信息-->
              <template>
                <el-table v-loading="loading" border :data="LineData" style="width: 100%">
                  <el-table-column prop="itemId" label="物料编号" />
                  <el-table-column prop="itemName" label="物料名称" />
                  <el-table-column prop="itemUnit" label="出库单位" />
                  <el-table-column prop="quantity" label="出库数量" />
                  <el-table-column prop="quantityPick" label="捡货数量" />
                  <el-table-column prop="quantityShipping" label="出货数量" />
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <el-button
                        v-show="line.status === 1"
                        type="text"
                        size="small"
                        @click="editLineFnc(scope.row)"
                      >编辑</el-button>
                      <el-button
                        v-show="line.status === 1"
                        type="text"
                        size="small"
                        @click="deleteLineFnc(scope.row.id)"
                      >删除</el-button>
                      <el-button
                        v-show="line.status === 3 || line.status === 2"
                        type="text"
                        size="small"
                        @click="countingHandleClick(scope.row)"
                      >捡货</el-button>
                      <el-button
                        v-show="line.status !== 1"
                        type="text"
                        size="small"
                        @click="turnToStockDetail(scope.row)"
                      >明细</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="customerId" label="客户ID" />
            <el-table-column prop="customerName" label="客户名称" />
            <el-table-column prop="billNumber" label="单据编号" />
            <!-- <el-table-column  prop="billType" label="外部单据类型"></el-table-column> -->
            <el-table-column prop="state" label="出库单说明" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status===1" style="color:#3c763d">create</div>
                <div v-if="scope.row.status===2" style="color:#2472c8">confirm</div>
                <div v-if="scope.row.status===3" style="color:#2dd671">picking</div>
                <div v-if="scope.row.status===4" style="color:#ff605b">shipping</div>
                <div v-if="scope.row.status===5" style="color:#808080">close</div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  v-show="scope.row.completed===true"
                  type="text"
                  size="small"
                  @click="closeHandleClick(scope.row)"
                >关闭</el-button>
                <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="LineHandleClick(scope.row)"
                >添加单行</el-button>
                <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="confirmHandleClick(scope.row)"
                >确认</el-button>
                <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="editHandleClick(scope.row)"
                >编辑</el-button>
                <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="deleteHandleClick(scope.row.id)"
                >删除</el-button>
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

    <!--捡货弹窗-->
    <div>
      <el-dialog title="捡货" :visible.sync="counting">
        <el-form ref="countingData" :model="countingData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="quantity" label="物料编号" :label-width="formLabelWidth">
                <el-input v-model="countingData.itemId" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                prop="warehouse"
                label="库房"
                :label-width="formLabelWidth"
               
                :rules="[
                              { required: true, message: '库房不能为空'}
                            ]"
              >
                <el-select
                  v-model="countingData.warehouse"
                  clearable
                  filterable
                  placeholder="库房"
                  @change="warehouseChange"
                  @clear="warehouseClearFnc"
                >
                  <el-option
                    v-for="item in warehouse"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="location"
                label="库位"
                :label-width="formLabelWidth"
                :rules="[
                              { required: true, message: '库位不能为空'}
                            ]"
              >
                <el-select
                  v-model="countingData.location"
                  clearable
                  filterable
                  placeholder="库位"
                  @change="locationChange"
                  @clear="locationClearFnc"
                >
                  <el-option
                    v-for="item in location"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                prop="batchNumber"
                label="批次"
                :label-width="formLabelWidth"
                :rules="[
                { required: true, message: '批次不能为空'}
              ]"
              >
                <el-select
                  v-model="countingData.batchNumber"
                  clearable
                  filterable
                  placeholder="批次"
                  @change="batchNumberChange"
                >
                  <el-option
                    v-for="item in batchNumber"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="quantity" label="出库数量" :label-width="formLabelWidth">
                <el-input v-model="countingData.quantity" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="quantityPick" label="总捡货数量" :label-width="formLabelWidth">
                <el-input v-model="countingData.quantityPick" readonly autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="可捡货数量" :label-width="formLabelWidth">
                <el-input readonly v-model="inventory.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="quantityShipping" label="已出库数量" :label-width="formLabelWidth">
                <el-input readonly v-model="countingData.quantityShipping" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                prop="number"
                label="捡货数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '捡货数量不能为空'}
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
    <!--捡货弹窗end-->

    <!--新增单头-->
    <div>
      <el-dialog title="新增出库单头" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="customerId"
                label="客户ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '客户ID不能为空'}
                ]"
              >
                <el-input v-model="addData.customerId" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="customerName"
                label="客户名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '客户名称不能为空'},
                ]"
              >
                <el-input v-model="addData.customerName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="billType"
                label="单据类型"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '外部单据类型不能为空'}
                ]"
              >
                <el-select v-model="addData.billType" clearable filterable placeholder="外部单据类型">
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
                prop="billNumber"
                label="单据编号"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单据编号不能为空'},
                ]"
              >
                <el-input v-model="addData.billNumber" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="state"
                label="出库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '出库单说明不能为空'},
                ]"
              >
                <el-input v-model="addData.state" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancelHandleClick('addData')">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--新增单行-->
    <div>
      <el-dialog title="新增出库单行" :visible.sync="addLine">
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
                prop="quantity"
                label="出库数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '出库数量不能为空'},
                ]"
              >
                <el-input v-model="addLineData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="itemName" label="出库名称" :label-width="formLabelWidth">
                <el-input v-model="addLineData.itemName" disabled />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="出库单位" :label-width="formLabelWidth">
                <el-input v-model="addLineData.itemUnit" disabled />
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
      <el-dialog title="编辑出库单行" :visible.sync="editLine">
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
                  filterable
                  placeholder="物料编号"
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
                prop="quantity"
                label="出库数量"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '出库数量不能为空'},
                ]"
              >
                <el-input v-model="editLineData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item prop="itemName" label="出库名称" :label-width="formLabelWidth">
                <el-input v-model="editLineData.itemName" disabled />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="出库单位" :label-width="formLabelWidth">
                <el-input v-model="editLineData.itemUnit" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editLineCancle()">取 消</el-button>
          <el-button type="primary" @click="editLineHandleClick('editLineData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!---编辑单行END-->

    <!--编辑单头-->
    <div>
      <el-dialog title="编辑出库单头" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="customerId"
                label="客户ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '客户ID不能为空'}
                ]"
              >
                <el-input v-model="editData.customerId" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="customerName"
                label="客户名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '客户名称不能为空'},
                ]"
              >
                <el-input v-model="editData.customerName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="billType"
                label="单据类型"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '外部单据类型不能为空'}
                ]"
              >
                <el-select v-model="editData.billType" clearable filterable placeholder="外部单据类型">
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
                prop="billNumber"
                label="单据编号"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单据编号不能为空'},
                ]"
              >
                <el-input v-model="editData.billNumber" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="state"
                label="出库单说明"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '出库单说明不能为空'},
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
  getStockOutHeaderList,
  getTypeAllFnc,
  getStockOutLineList,
  postStockOutCounting,
  postStockOutHeader,
  putStockOutHeader,
  deleteStockOutHeader,
  putStockOutHeaderStatus,
  postStockOutLine,
  putStockOutLine,
  deleteStockOutLine
} from "@/api/stock";
import {
  getAllinvBatchList,
  getUnitAll,
  getItemAllFnc,
  getItemOne,
  getBatchOne,
  getInvControl,
  getInvControlOne,
  getWarehouseAll,
  getLocationAll
} from "@/api/baseData";
import { positiveNumber } from "@/utils/validate";
export default {
  name: "stockout-Header",
  data() {
    return {
      remote: [],
      loading: false,
      setRemote: [],
      billType: [],
      billName: [],
      add: false,
      edit: false,
      counting: false, // 捡货弹窗
      addLine: false, // 新增单行弹窗
      editLine: false, // 编辑单行弹窗
      lineData: {}, // 行数据
      countingData: {
        // 捡货数据
        itemId: "",
        batchNumber: "",
        quantity: "",
        location: "",
        warehouse: "",
        quantityPick: "",
        quantityShipping: "",
        number: ""
      },
      formLabelWidth: "100px",
      addData: {
        // 新增数据
        customerId: "",
        customerName: "",
        state: "",
        billType: "",
        billNumber: ""
      },
      addLineData: {
        //新增单行数据
        headerId: "",
        itemId: "",
        itemName: "",
        itemUnit: "",
        quantity: "",
        producedDate: ""
      },
      editLineData: [],
      editData: {},
      page: {
        // 查询条件
        billType: "",
        status: "",
        total: 40,
        current: 1,
        sort: "create_at",
        size: 10,
        deleted: false
      },
      headerStatus: [
        {
          value: "1",
          label: "create"
        },
        {
          value: "2",
          label: "confirm"
        },
        {
          value: "3",
          label: "picking"
        },
        {
          value: "4",
          label: "shipping"
        },
        {
          value: "5",
          label: "close"
        }
      ],
      listData: [],
      LineData: [],
      line: {
        headerId: "",
        status: ""
      },
      item: [], //物料下拉
      unit: [], //单位下拉
      batchNumber: [], //批次下拉
      warehouse: [],
      location: [],
      inventory: {}, //单个库存
      result: [],
      locationResulit: []
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
    // 捡货取消
    countingCancle() {
      this.counting = false;
      this.countingData.warehouse = "";
      this.countingData.location = "";
      this.countingData.number = "";
    },
    //库位下拉改变
    locationChange() {
      this.getInvControlList();
    },
    //批次下拉改变
    batchNumberChange() {
      this.getInvControlOne();
    },
    // 库房下拉改变
    warehouseChange() {
      this.getInvControlList();
    },
    // 单行取消
    editLineCancle() {
      this.editLine = false;
      this.fetchData();
    },
    // 表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 库房删除，联动清除
    warehouseClearFnc(){
      this.countingData.batchNumber = '';
      this.countingData.location = '';
    },
     // 库房删除，联动清除
    locationClearFnc(){
      this.countingData.batchNumber = '';
    },
    // 物料删除，联动清除
    itemClearFnc() {
      this.addLineData.itemName = "";
      this.addLineData.itemUnit = "";
      this.addLineData.producedDate = "";
    },
    // 批次删除，联动清除
    batchClearFnc() {
      this.addLineData.producedDate = "";
    },
    // 删除单行数据
    deleteLineFnc(e) {
      this.$confirm("此操作将永久删除该笔单行, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          deleteStockOutLine(e).then(res => {
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
            quantity: this.editLineData.quantity
          };
          putStockOutLine(param).then(res => {
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

    //单行新增选择物料下拉数据，用物料ID查询物料名称
    itemAddChange() {
      if (this.addLineData.itemId) {
        const param = {
          id: this.addLineData.itemId
        };
        this.getAllinvBatchList(param);
        getItemOne(param).then(res => {
          this.addLineData.itemName = res.result.itemName;
          this.addLineData.itemUnit = res.result.itemUnit;
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
        this.getAllinvBatchList(param);
        getItemOne(param).then(res => {
          this.editLineData.itemName = res.result.itemName;
          this.editLineData.itemUnit = res.result.itemUnit;
        });
      } else {
        return;
      }
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
            headerId: this.addLineData.headerId,
            itemId: this.addLineData.itemId,
            itemUnit: this.addLineData.itemUnit,
            itemName: this.addLineData.itemName,
            quantity: this.addLineData.quantity
          };
          postStockOutLine(param).then(res => {
            if (res.errorCode === 0) {
              this.addLine = false;
              this.resetForm(formName);
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
            this.fetchData();
            this.getStockOutLineList();
          });
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    // 新增单行弹框
    LineHandleClick(e) {
      this.addLine = true;
      this.addLineData.headerId = e.id;
    },
    // 单头确认
    confirmHandleClick(e) {
      const param = {
        id: e.id,
        status: 2
      };
      this.$confirm("单头确认后将不可再进行修改、删除操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info "
      })
        .then(async () => {
          putStockOutHeaderStatus(param).then(res => {
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
    // 单头确认关闭
    closeHandleClick(e) {
      const param = {
        id: e.id,
        status: 5,
        completed: false
      };
      this.$confirm("单头关闭后将不可再操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info "
      })
        .then(async () => {
          putStockOutHeaderStatus(param).then(res => {
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
    // 插入捡货明细
    postCheckHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.countingData.number) === false) {
            this.$message({
              message: "数量应为有效正整数",
              type: "warning"
            });
            return;
          }
          if (
            this.countingData.number >
            this.countingData.quantity - this.countingData.quantityPick
          ) {
            this.$message({
              message: "捡货数量异常",
              type: "warning"
            });
            return;
          }
          let param = {
            batchNumber: this.countingData.batchNumber,
            itemId: this.lineData.itemId,
            itemName: this.lineData.itemName,
            itemUnit: this.lineData.itemUnit,
            lineId: this.lineData.id,
            quantity: this.countingData.number,
            warehouse: this.countingData.warehouse,
            location: this.countingData.location
          };
          postStockOutCounting(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.resetForm(formName);
              this.$message({
                message: "捡货成功",
                type: "success"
              });
            }
            this.getStockOutLineList();
            this.fetchData();
          });
          this.counting = false;
          this.countingData.number = "";
        } else {
          this.$message.error("请完善信息!");
          return false;
        }
      });
    },
    // 捡货弹窗
    countingHandleClick(e) {
      this.lineData = e;
      this.countingData.quantity = e.quantity;
      this.countingData.quantityPick = e.quantityPick;
      this.countingData.quantityShipping = e.quantityShipping;
      this.countingData.itemId = e.itemId;
      this.countingData.batchNumber = e.batchNumber;
      this.counting = true;
      this.getInvControlList();
    },
    // 跳转捡货页面
    turnToStockDetail(e) {
      sessionStorage.setItem("getStockDetailItemName", e.itemName);
      sessionStorage.setItem("getStockDetailItemUnit", e.itemUnit);
      sessionStorage.setItem("getStockDetailBatchNumber", e.batchNumber);
      sessionStorage.setItem("getStockDetail", e.id);
      this.$router.push({ name: "stockoutDetail" });
    },
    // 新增取消
    addCancelHandleClick(formName) {
      this.add = false, 
      this.resetForm(formName)
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            billType: this.addData.billType,
            billNumber: this.addData.billNumber,
            customerId: this.addData.customerId,
            customerName: this.addData.customerName,
            state: this.addData.state
          };
          postStockOutHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.resetForm(formName);
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
      this.$confirm("此操作将永久删除该出库单头, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          deleteStockOutHeader(e).then(res => {
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
            id: this.editData.id,
            billType: this.editData.billType,
            billNumber: this.editData.billNumber,
            customerId: this.editData.customerId,
            customerName: this.editData.customerName,
            state: this.editData.state
          };
          putStockOutHeader(param).then(res => {
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
    // 获取单头列表
    fetchData() {
      getStockOutHeaderList(this.page).then(res => {
        this.listData = res.result.list;
        this.page.total = res.result.total;
      });
      this.getTypeAllFnc();
    },
    // 获取库存
    getInvControlList() {
      const param = {
        itemId: this.countingData.itemId,
        warehouse: this.countingData.warehouse,
        location: this.countingData.location,
        batchNumber: this.countingData.batchNumber
      };
      getInvControl(param).then(res => {
        this.warehouse = res.result.list.map(item => {
          return { value: item.warehouse, label: item.warehouse };
        });
        var obj = {};
        this.warehouse = this.warehouse.reduce(function(item, next) {
          obj[next.value] ? "" : (obj[next.value] = true && item.push(next));
          return item;
        }, []);
        this.location = res.result.list.map(item => {
          return { value: item.location, label: item.location };
        });
        var obj1 = {};
        this.location = this.location.reduce(function(item, next) {
          obj1[next.value] ? "" : (obj1[next.value] = true && item.push(next));
          return item;
        }, []);
        var obj2 = {};
        this.batchNumber = res.result.list.map(item => {
          return { value: item.batchNumber, label: item.batchNumber };
        });
        this.batchNumber = this.batchNumber.reduce(function(item, next) {
          obj2[next.value] ? "" : (obj2[next.value] = true && item.push(next));
          return item;
        }, []);
      });
    },
    // 获取库存数量
    getInvControlOne() {
      const param = {
        itemId: this.countingData.itemId,
        warehouse: this.countingData.warehouse,
        location: this.countingData.location,
        batchNumber: this.countingData.batchNumber
      };
      getInvControlOne(param).then(res => {
        this.inventory = res.result;
      });
    },
    // 对某一行展开或者关闭的时候会触发该事件
    expandChange(row, expandedRows) {
      this.loading = true;
      this.line.headerId = row.id;
      this.line.status = row.status;
      //sessionStorage.setItem("headerId", row.id);
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
      if (row) {
        const params = {
          headerId: row.id
        };
        this.getStockOutLineList(params);
      }
    },
    // 获取行数据
    getStockOutLineList(e) {
      this.LineData = [];
      getStockOutLineList(e).then(res => {
        this.LineData = res.result.list;
        this.loading = false;
      });
      this.LineData = [];
    },
    // 获取外部单据类型
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
          return { value: item.id, label: item.id };
        });
      });
    },
    // 获取全部单位
    getUnitAll() {
      getUnitAll().then(res => {
        this.unit = res.result.map(item => {
          return { value: item.id, label: item.unit };
        });
      });
    },
    // 获取全部批次
    getAllinvBatchList(e) {
      getAllinvBatchList(e).then(res => {
        this.batchNumber = res.result.map(item => {
          return { value: item.batchNumber, label: item.batchNumber };
        });
      });
    }
  }
};
</script>

<style scoped>
</style>
