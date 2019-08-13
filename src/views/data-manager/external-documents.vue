<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
              <el-form :inline="true" :model="page">
                <el-form-item>
                  <el-select
                    v-model="page.typeName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="类型名称"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                    clearable
                  >
                    <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    style="bacground:#0076a8"
                    @click="referHandleClick"
                  >查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">新增</el-button>
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
          <el-table :data="listData" style="width: 100%" border>
            <el-table-column prop="typeName" label="类型名称" />
            <el-table-column prop="invokeApi" label="调用API" />
            <el-table-column prop="typeState" label="类型说明" />
            <el-table-column prop="protocol" label="请求协议">
              <template slot-scope="scope">
                <div v-if="scope.row.protocol==1">http</div>
                <div v-else-if="scope.row.protocol==2">https</div>
                <div v-else-if="scope.row.protocol==3">webservice</div>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" label="创建时间" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="float: right;margin:20px 0px 20px 0px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </section>
      </el-card>
    </div>
    <!-- 新增 -->
    <div>
      <el-dialog title="新增外部单据" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="typeName"
                label="类型名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入类型名称', trigger: 'blur' }]"
              >
                <el-input v-model="addData.typeName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="typeState"
                label="类型说明"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入类型说明', trigger: 'blur' }]"
              >
                <el-input v-model="addData.typeState" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="invokeApi"
                label="调用API"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入调用API', trigger: 'blur' }]"
              >
                <el-input v-model="addData.invokeApi" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="protocol"
                label="请求协议"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择请求协议', trigger: 'blur' }]"
              >
                <el-select v-model="addData.protocol" placeholder="请选择请求协议" style="width:100%">
                  <el-option
                    v-for="item in protocolList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改 -->
    <div>
      <el-dialog title="修改外部单据" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="typeName"
                label="类型名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入类型名称', trigger: 'blur' }]"
              >
                <el-input v-model="editData.typeName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="typeState"
                label="类型说明"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入类型说明', trigger: 'blur' }]"
              >
                <el-input v-model="editData.typeState" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="invokeApi"
                label="调用API"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入调用API', trigger: 'blur' }]"
              >
                <el-input v-model="editData.invokeApi" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="protocol"
                label="请求协议"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择请求协议', trigger: 'blur' }]"
              >
                <el-select v-model="editData.protocol" placeholder="请选择请求协议" style="width:100%">
                  <el-option
                    v-for="item in protocolList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="updateHandleClick('editData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getbdExternalBillTypeList,
  getAllbdExternalBillTypeList,
  deleteBdExternalBillTypeList,
  addBdExternalBillTypeList,
  updateBdExternalBillTypeList,
  baseURL
} from '@/api/baseData'
export default {
  name: 'ExternalDocuments',
  data() {
    return {
      excelUrl:`${baseURL}/bdExternalBillType/excel/import`,
      add: false,
      edit: false,
      formLabelWidth: '120px',
      page: {
        // 查询条件
        typeName: '',
        sort:'create_at',
        current: 1,
        size: 10
      },
      listData: [],
      total: 0, // 总数
      typeNameList: [],
      options: [],
      loading: false,
      id: '',
      addData: {
        typeState: '',
        typeName: '',
        invokeApi: '',
        protocol: ''
      },
      protocolList: [
        {
          value: 1,
          label: 'http'
        },
        {
          value: 2,
          label: 'https'
        },
        {
          value: 3,
          label: 'webservice'
        }
      ],
      editData: {}
    }
  },
  mounted() {
    // 外部单据分页列表
    this.getbdExternalBillTypeListFnc()
    // 获取所有单据列表
    this.getAllbdExternalBillTypeListFnc()
  },
  methods: {
     handleSuccess(res,file) {
       if(res.errorCode==0){
          this.$message.success('上传成功，更新数据：'+res.result+'条');
        }else{
          this.$message.error('上传失败：'+JSON.stringify(res.message));
        } 
        this.getbdExternalBillTypeListFnc();
    },
        //export
    exportHandleClick(){
      window.open(
         `${baseURL}/bdExternalBillType/excel/export`
        );
    },
    // 查询
    referHandleClick() {
      // 初始化外部单据分页列表
      this.getbdExternalBillTypeListFnc()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.typeNameList.filter(item => {
            return item.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    // 当前显示第几页
    handleSizeChange(val) {
      this.page.size = val
      // 初始化批次列表
      this.getbdExternalBillTypeListFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 初始化批次列表
      this.getbdExternalBillTypeListFnc()
    },
    // 删除外部单据
    deleteHandleClick(id) {
      this.id = id
      this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 外部单据分页列表
        this.deleteBdExternalBillTypeListFnc()
      })
    },
    // 增加外部单据
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addBdExternalBillTypeListFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 修改外部单据
    editHandleClick(row) {
      this.editData = row
      this.edit = true
    },
    updateHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateBdExternalBillTypeListFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 外部单据分页列表
    getbdExternalBillTypeListFnc() {
      getbdExternalBillTypeList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 获取所有外部单据
    getAllbdExternalBillTypeListFnc() {
      getAllbdExternalBillTypeList().then(res => {
        const AlllistData = res.result
        this.typeNameList = AlllistData.map(v => v.typeName)
      })
    },
    // 删除外部单据
    deleteBdExternalBillTypeListFnc() {
      deleteBdExternalBillTypeList(this.id).then(res => {
        // 外部单据分页列表
        this.getbdExternalBillTypeListFnc()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    },
    // 添加外部单据
    addBdExternalBillTypeListFnc() {
      addBdExternalBillTypeList(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 初始化外部单据列表
        this.getbdExternalBillTypeListFnc()
      })
    },
    // 修改外部单据
    updateBdExternalBillTypeListFnc() {
      updateBdExternalBillTypeList(this.editData).then(res => {
        this.edit = false
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
