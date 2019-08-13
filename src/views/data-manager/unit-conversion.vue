<!--单位转换-->
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
                    v-model="page.unit"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="原单位名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                  >
                    <el-option
                      v-for="item in remote"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="page.unitTo"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="目标单位名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                  >
                    <el-option
                      v-for="item in remote"
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
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="itemId" label="物料名称" />
            <el-table-column prop="unit" label="单位名称" />
            <el-table-column prop="coefficient" label="系数" />
            <el-table-column prop="unitTo" label="换算单位" />
            <el-table-column prop="description" label="单位描述" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
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

    <!--新增-->
    <div>
      <el-dialog title="新增单位转换" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="itemId"
                label="物料"
                :label-width="formLabelWidth"
                
              >
                <el-select filterable
                    clearable v-model="addData.itemId" style="width:100%" placeholder="请选择物料">
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
                prop="unit"
                label="单位名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位名称不能为空'},
                ]"
              >
                <el-select v-model="addData.unit" style="width:100%" placeholder="请选择单位">
                  <el-option
                    v-for="item in setRemote"
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
                prop="coefficient"
                label="换算系数"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '换算系数不能为空'}
                ]"
              >
                <el-input type="number" v-model="addData.coefficient" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="unitTo"
                label="换算单位"
                :label-width="formLabelWidth"
                  :rules="[
                  { required: true, message: '换算单位不能为空'},
                ]"
              >
                <el-select v-model="addData.unitTo" style="width:100%" placeholder="请选择换算单位">
                  <el-option
                    v-for="item in setRemote"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :rules="[
                  { required: true, message: '换算单位不能为空'},
                ]"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            prop="description"
            label="描述"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="addData.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入描述"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancelHandleClick('addData')">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑单位转换" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="itemId"
                label="物料"
                :label-width="formLabelWidth"
              >
                <el-select disabled v-model="editData.itemId" style="width:100%" placeholder="请选择物料">
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
                prop="unit"
                label="单位名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '单位名称不能为空'},
                ]"
              >
                <el-select disabled v-model="editData.unit" style="width:100%" placeholder="请选择单位">
                  <el-option
                    v-for="item in setRemote"
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
                prop="coefficient"
                label="换算系数"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '换算系数不能为空'}
                ]"
              >
                <el-input type="number" v-model="editData.coefficient" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="unitTo"
                label="换算单位"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '换算单位不能为空'},
                ]"
              >
                <el-select disabled v-model="editData.unitTo" style="width:100%" placeholder="请选择换算单位">
                  <el-option
                    v-for="item in setRemote"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            prop="description"
            label="描述"
            :label-width="formLabelWidth"
           
          >
            <el-input
              v-model="editData.description"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入描述"
              autocomplete="off"
            />
          </el-form-item>
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
  getUnitConversion,
  getItemAllFnc,
  postUnitConversion,
  putUnitConversion,
  deleteUnitConversion,
  getUnitAll,
    baseURL
} from '@/api/baseData'
import { positiveNumber } from '@/utils/validate';
export default {
  name: 'UnitConversion',
  data() {
    return {
       excelUrl:`${baseURL}/bdUnitConverter/excel/import`,
      remote: [],
      item: [], // 物料
      setRemote: [],
      loading: false,
      add: false,
      edit: false,
      formLabelWidth: '80px',
      addData: {
        // 新增数据
        unit: '',
        unitTo: '',
        itemId: '',
        coefficient: '',
        description: ''
      },
      editData: {},
      page: {
        // 查询条件
        unit: '',
        unitTo: '',
        total: 40,
        current: 1,
        size: 10,
        sort:'create_at'
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
     handleSuccess(res,file) {
       if(res.errorCode==0){
          this.$message.success('上传成功，更新数据：'+res.result+'条');
        }else{
          this.$message.error('上传失败：'+JSON.stringify(res.message));
        } 
        this.fetchData();
    },
        //export
    exportHandleClick(){
      window.open(
         `${baseURL}/bdUnitConverter/excel/export`
        );
    },
    //表单清空
       resetForm(formName) {
        this.$refs[formName].resetFields();
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
    // 查询单位名称
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.remote = this.setRemote.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.remote = []
      }
    },
    // curd
    addHandleClick(formName) {
       if (positiveNumber(this.addData.coefficient) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return;
          }
      if( this.addData.unit === this.addData.unitTo){
        this.$message({
                message: '原单位和目标单位不可一致',
                type: 'warning'
              })
              return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            coefficient: this.addData.coefficient,
            unitTo: this.addData.unitTo,
            itemId: this.addData.itemId,
            description: this.addData.description,
            unit: this.addData.unit
          }
          postUnitConversion(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false
              this.addData.unit = ''
              this.addData.description = ''
              this.addData.unitTo = ''
              this.addData.itemId = ''
              this.addData.coefficient = ''
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
            this.fetchData();
            this.resetForm(formName)
          })
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      })
    },
    deleteHandleClick(e) {
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          deleteUnitConversion(e).then(res => {
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
        if (positiveNumber(this.editData.coefficient) === false) {
            this.$message({
              message: '数量应为有效正整数',
              type: 'warning'
            })
            return;
          }
          const param = {
            id: this.editData.id,
            coefficient: this.editData.coefficient,
            unitTo: this.editData.unitTo,
            itemId: this.editData.itemId,
            description: this.editData.description,
            unit: this.editData.unit
          }
          putUnitConversion(param).then(res => {
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
    fetchData() {
      getUnitConversion(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
      this.getUnitAllFnc()
      this.getItemAllFnc()
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
    getUnitAllFnc() {
      getUnitAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.unit, label: item.unit }
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
