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
                  <el-button size="small" type="primary" @click="addOrder">新增入库单</el-button>
                </el-form-item>
                 <el-form-item>
                   <el-upload
                    :action="excelUrl"
                    :on-success="handleSuccess"
                    :show-file-list="false">
                    <el-button class="checkout" size="small" type="success" >
                    导入<i class="el-icon-download el-icon--right"></i>
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="success" @click="exportHandleClick">导出<i class="el-icon-upload2 el-icon--right"></i></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" @expand-change="expandChange" style="width: 100%">
            <!-- <el-table-column type="expand">
              <template>
                <el-table v-loading="loading" border :data="LineData" style="width: 100%">
                  <el-table-column prop="itemId" label="物料编号" />
                  <el-table-column prop="itemName" label="物料名称" />
                  <el-table-column prop="itemUnit" label="入库单位"/>
                  <el-table-column prop="batchNumber" label="物料批次" />
                  <el-table-column prop="quantity" label="入库数量" />
                  <el-table-column prop="quantityRegister" label="点收数量" />
                  <el-table-column prop="quantityReceive" label="上架数量" />
                  <el-table-column prop="producedDate" label="生产日期" />
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
                      >点收</el-button>
                      <el-button
                        v-show="line.status !== 1"
                        type="text"
                        size="small"
                        @click="turnToEditHeader(scope.row)"
                      >单行</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column> -->
            <el-table-column prop="vendorId" label="供应商ID" />
            <el-table-column prop="vendorName" label="供应商名称" />
            <el-table-column  prop="typeName" label="外部单据类型"/>
            <el-table-column prop="billNumber" label="外部单据编号" />
            <el-table-column prop="state" label="入库单说明" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status===1" style="color:#3c763d">create</div>
                <div v-if="scope.row.status===2" style="color:#2472c8">confirm</div>
                <div v-if="scope.row.status===3" style="color:#2dd671">register</div>
                <div v-if="scope.row.status===4" style="color:#ff605b">receive</div>
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
                <!-- <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="LineHandleClick(scope.row)"
                >添加单行</el-button> -->
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
                  @click="editOrder(scope.row)"
                >编辑</el-button>
                <el-button
                  v-show="scope.row.status===1"
                  type="text"
                  size="small"
                  @click="deleteHandleClick(scope.row.id)"
                >删除</el-button>
                 <el-button
                  v-show="scope.row.status !== 1"
                  type="text"
                  size="small"
                  @click="turnToEditHeader(scope.row)"
                >明细</el-button>
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
          <el-button @click="addCancelHandleClick('addData')">取 消</el-button>
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
                <el-input v-model="addLineData.itemName" disabled/>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="入库单位" :label-width="formLabelWidth">
                <el-input v-model="addLineData.itemUnit" disabled/>
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
                prop="batchNumber"
                label="物料批次"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '物料批次不能为空'}
                ]"
              >
                <el-select
                  v-model="editLineData.batchNumber"
                  filterable
                  placeholder="物料批次"
                  @change="itemEditBatchChange"
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
                <el-input v-model="editLineData.itemName" disabled/>
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item prop="itemUnit" label="入库单位" :label-width="formLabelWidth">
                <el-input v-model="editLineData.itemUnit" disabled/>
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
          <el-button @click="editLineCancle()">取 消</el-button>
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
} from '@/api/stock';
import {
  getAllinvBatchList,
  getUnitAll,
  getItemAllFnc,
  getItemOne,
  getBatchOne,
  baseURL
} from '@/api/baseData';
import { positiveNumber } from '@/utils/validate';
export default {
  name: 'stockIn-Header',
  data() {
    return {
      excelUrl:`${baseURL}/invStockInHeader/excel/import`,
      remote: [],
      loading: false,
      setRemote: [],
      billType: [],
      billName: [],
      add: false,
      edit: false,
      counting: false, // 点收弹窗
      addLine: false, // 新增单行弹窗
      editLine: false, // 编辑单行弹窗
      lineData: {}, // 行数据
      countingData: {
        // 点收数据
        quantity: '',
        quantityRegister: '',
        quantityReceive: '',
        number: ''
      },
      formLabelWidth: '100px',
      addData: {
        // 新增数据
        vendorId: '',
        vendorName: '',
        state: '',
        billType: '',
        billNumber: ''
      },
      addLineData: {
        // 新增单行数据
        headerId: '',
        itemId: '',
        itemName: '',
        itemUnit: '',
        batchNumber: '',
        quantity: '',
        producedDate: ''
      },
      editLineData: [],
      editData: {},
      page: {
        // 查询条件
        billType: '',
        status: '',
        total: 40,
        current: 1,
        sort: 'create_at',
        size: 10,
        deleted: false
      },
      headerStatus: [
        {
          value: '1',
          label: 'create'
        }, {
          value: '2',
          label: 'confirm'
        }, {
          value: '3',
          label: 'register'
        }, {
          value: '4',
          label: 'receive'
        }, {
          value: '5',
          label: 'close'
        }
      ],
      listData: [],
      LineData: [],
      line: {
        headerId: '',
        status: ''
      },
      item: [], //物料下拉
      unit: [], //单位下拉
      batchNumber: [], //批次下拉
      linkage:{
        itemId:''
      }
    };
  },
  mounted() {
    this.fetchData();
    //获取全部单位
    this.getUnitAll()
    //获取全部物料
    this.getItemAllFnc()
  },
  methods: {
    //跳转新增入库单
    addOrder(){
       this.$router.push({ name: 'addInHeader'})
    },
    turnToEditHeader(e){
       this.$router.push({ name: 'editInHeader',params:{headerId:e.id}})
    },
     //跳转编辑入库单
    editOrder(e){
       this.$router.push({ name: 'editInHeader',params:{headerId:e.id}})
    },
     handleSuccess(res,file) {
       if(res.errorCode==0){
          this.$message.success('上传成功，更新数据：'+res.result+'条');
        }else{
          this.$message.error('上传失败：'+JSON.stringify(res.errorCode));
        } 
        this.fetchData();
    },
        //export
    exportHandleClick(){
      window.open(
         `${baseURL}/invStockInHeader/excel/export`
        );
    },
    // 单行取消
    editLineCancle() {
      this.editLine = false
      this.fetchData()
    },
    // 表单置空
    resetForm(formName) {
      this.$refs[formName].resetFields()
      },
    // 点收取消清除数据
    countingCancle() {
      this.counting = false
      this.countingData.number = ''
    },
    // 物料删除，联动清除
    itemClearFnc() {
      this.addLineData.itemName = '';
      this.addLineData.itemUnit = '';
      this.addLineData.batchNumber = '';
      this.addLineData.producedDate = '';
    },
    // 批次删除，联动清除
    batchClearFnc() {
      this.addLineData.producedDate = '';
    },
    // 删除单行数据
    deleteLineFnc(e) {
      this.$confirm('此操作将永久删除该笔单行, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteLine(e).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    // 编辑单行确定
    editLineHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.editLineData.quantity) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return;
          }
          const param = {
            id: this.editLineData.id,
            itemId: this.editLineData.itemId,
            itemName: this.editLineData.itemName,
            itemUnit: this.editLineData.itemUnit,
            batchNumber: this.editLineData.batchNumber,
            quantity: this.editLineData.quantity
          }
          putLine(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.editLine = false
            }
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    // 编辑单行弹窗
    editLineFnc(e) {
      this.editLine = true
      this.editLineData = e
    },
    // 新增选择批次后查询生产日期
    itemBatchChange() {
      if (this.addLineData.batchNumber) {
        const param = {
          batchNumber: this.addLineData.batchNumber,
          itemId:this.addLineData.itemId
        }
        getBatchOne(param).then(res => {
          this.addLineData.producedDate = res.result.producedDate
        })
      } else {
        return
      }
    },
    // 编辑选择批次后查询生产日期
    itemEditBatchChange() {
      if (this.editLineData.batchNumber) {
        const param = {
          batchNumber: this.editLineData.batchNumber
        }
        getBatchOne(param).then(res => {
          this.editLineData.producedDate = res.result.producedDate
        })
      } else {
        return
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
          this.addLineData.itemName = res.result.itemName
          this.addLineData.itemUnit = res.result.itemUnit
        })
      } else {
        return
      }
    },
    // 单行编辑选择物料下拉数据，用物料ID查询物料名称
    itemEditChange() {
      this.editLineData.batchNumber = ''
      this.editLineData.producedDate = ''
       if (this.editLineData.itemId) {
        const param = {
          id: this.editLineData.itemId
        };
        let params = {
          itemId: this.editLineData.itemId
        };
        this.getAllinvBatchList(params);
        getItemOne(param).then(res => {
          this.editLineData.itemName = res.result.itemName
          this.editLineData.itemUnit = res.result.itemUnit
        })
      } else {
        return
      }
    },
    // 新增单行数据
    postLineHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (positiveNumber(this.addLineData.quantity) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return;
          }
          const param = {
            headerId: this.addLineData.headerId,
            itemId: this.addLineData.itemId,
            itemUnit: this.addLineData.itemUnit,
            itemName: this.addLineData.itemName,
            batchNumber: this.addLineData.batchNumber,
            quantity: this.addLineData.quantity
          }
          postLine(param).then(res => {
            if (res.errorCode === 0) {
              this.resetForm(formName)
              this.addLine = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.fetchData()
            this.getStockInLine()
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    // 新增单行弹框
    LineHandleClick(e) {
      this.addLine = true
      this.addLineData.headerId = e.id
    },
    // 单头确认
    confirmHandleClick(e) {
      const param = {
        id: e.id,
        status: 2
      }
      this.$confirm('单头确认后将不可再进行修改、删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info '
      })
        .then(async() => {
          putHeaderStatus(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '单头确认成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    // 单头确认关闭
    closeHandleClick(e) {
      const param = {
        id: e.id,
        status: 5,
        completed: false
      }
      this.$confirm('单头关闭后将不可再操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info '
      })
        .then(async() => {
          putHeaderStatus(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '单头关闭成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        })
        .catch(() => {})
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
    // 点收弹窗
    countingHandleClick(e) {
      this.lineData = e
      this.countingData.quantity = e.quantity
      this.countingData.quantityRegister = e.quantityRegister
      this.countingData.quantityReceive = e.quantityReceive
      this.counting = true
    },
    // 跳转点收页面
    turnToStockDetail(e) {
      sessionStorage.setItem('getStockDetailItemName', e.itemName)
      sessionStorage.setItem('getStockDetailItemUnit', e.itemUnit)
      sessionStorage.setItem('getStockDetailBatchNumber', e.batchNumber)
      sessionStorage.setItem('getStockDetail', e.id)
      this.$router.push({ name: 'stockInDetail' })
    },
    // 新增取消
    addCancelHandleClick(formName) {
      this.add = false;
      this.resetForm(formName)
    },
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    // 弹出修改页面并赋值
    editHandleClick(e) {
      this.edit = true
      this.editData = e
    },
    // curd
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            billType: this.addData.billType,
            billNumber: this.addData.billNumber,
            vendorId: this.addData.vendorId,
            vendorName: this.addData.vendorName,
            state: this.addData.state
          }
          postHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
             this.resetForm(formName)
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    deleteHandleClick(e) {
      let param = {
          id : e
      }
      this.$confirm('此操作将永久删除该入库单头, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            id: this.editData.id,
            billType: this.editData.billType,
            billNumber: this.editData.billNumber,
            vendorId: this.editData.vendorId,
            vendorName: this.editData.vendorName,
            state: this.editData.state
          }
          putHeader(param).then(res => {
            if (res.errorCode === 0) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.edit = false
            }
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    // 获取单头列表
    fetchData() {
      getStockInHeader(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
      this.getTypeAllFnc()
    },
    // 对某一行展开或者关闭的时候会触发该事件
    expandChange(row, expandedRows) {
      this.loading = true
      this.line.headerId = row.id
      this.line.status = row.status
      //sessionStorage.setItem("headerId", row.id);
      if (expandedRows.length > 1) {
        expandedRows.shift()
      }
      if (row) {
        const params = {
          headerId: row.id
        }
        this.getStockInLine(params)
      }
    },
    // 获取行数据
    getStockInLine(e) {
      this.LineData = []
      getStockInLine(e).then(res => {
        this.LineData = res.result.list
        this.loading = false
      })
      this.LineData = []
    },
    // 获取外部单据类型
    getTypeAllFnc() {
      getTypeAllFnc().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.typeName }
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
    },
    // 获取全部物料
    getItemAllFnc() {
      getItemAllFnc().then(res => {
        this.item = res.result.map(item => {
          return { value: item.id, label: item.id }
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
    getAllinvBatchList(e) {
      getAllinvBatchList(e).then(res => {
        this.batchNumber = res.result.map(item => {
          return { value: item.id, label: item.batchNumber }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
