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
                    v-model="page.batchNumber"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="批次编号"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small"
                    clearable
                  >
                    <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="page.blocked"
                    size="small"
                    clearable
                    filterable
                    placeholder="是否被卡控"
                  >
                    <el-option
                      v-for="item in blockedList"
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
                    @click="referHandleClick"
                  >查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">新增</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>

          <!--列表-->
          <el-table :data="listData" style="width: 100%" border>
            <el-table-column prop="batchNumber" label="批次编号" />
            <el-table-column prop="itemId" label="物料编号" />
            <el-table-column prop="warehouse" label="仓库" />
            <el-table-column prop="location" label="库位" />
            <el-table-column prop="quantity" label="库存数量" />
            <!-- <el-table-column prop="blocked" label="是否已被卡控">
              <template slot-scope="scope">
                <div v-if="scope.row.blocked==false" style="color:#ffcd6b">否</div>
                <div v-else-if="scope.row.blocked==true" style="color:#3c763d">是</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="createAt" label="创建时间" />
            <el-table-column label="是否被卡控" width="150">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.blocked"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changeHandleClick(scope.row)"
                />
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
    <!--新增-->
    <div>
      <el-dialog title="新增库存" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="batchNumber"
                label="批次编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入批次编号', trigger: 'blur' }]"
              >
                <el-input v-model="addData.batchNumber" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="quantity"
                label="库存数量"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入库存数量', trigger: 'blur' }]"
              >
                <el-input v-model="addData.quantity" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="itemId"
                label="物料编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料编号', trigger: 'blur' }]"
              >
                <el-input v-model="addData.itemId" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="blocked"
                label="是否被卡控"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择是否需要被卡控', trigger: 'blur' }]"
              >
                <el-select
                  v-model="addData.blocked"
                  clearable
                  filterable
                  size="small"
                  placeholder="是否被卡控"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in blockedList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="warehouse"
                label="仓库"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入仓库', trigger: 'blur' }]"
              >
                <el-input v-model="addData.warehouse" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="location"
                label="库位"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入库位', trigger: 'blur' }]"
              >
                <el-input v-model="addData.location" autocomplete="off" />
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
  </div>
</template>
<script>
import {
  getInvControlList,
  getAllInvControlList,
  updateInvControlList,
  addInvControlList
} from '@/api/baseData'
export default {
  name: 'InvcontrolManager',
  data() {
    return {
      add: false,
      formLabelWidth: '120px',
      addData: {
        // 新增数据
        batchNumber: '',
        blocked: '',
        itemId: '',
        location: '',
        quantity: '',
        warehouse: ''
      },
      blockedList: [
        {
          // 是否卡控
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      page: {
        batchNumber: null,
        blocked: '',
        current: 1,
        size: 10
      },
      listData: [],
      pages: 0, // 总页码
      total: 0, // 总数
      batchNumberList: [],
      options: [],
      loading: false,
      updateVal: {}
    }
  },
  mounted() {
    // 初始化库存列表
    this.getInvControlFnc()
    // 获取所有库存列表
    this.getAllInvControlFnc()
  },
  methods: {
    // 查询
    referHandleClick() {
      // 初始化库存列表
      this.getInvControlFnc()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.batchNumberList.filter(item => {
            return item.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    changeHandleClick(val) {
      this.updateVal = val
      console.error(this.updateVal)
      this.$confirm('是否继续操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateInvControlFnc()
      })
    },
    // 当前显示第几页
    handleSizeChange(val) {
      this.page.size = val
      // 初始化批次列表
      this.getInvControlFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 初始化批次列表
      this.getInvControlFnc()
    },
    addHandleClick(formName) {
      this.addData.blocked = 1 ? 'true' : 'false'
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addInvControlFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 分页获取批次列表
    getInvControlFnc() {
      getInvControlList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 获取所有批次列表
    getAllInvControlFnc() {
      getAllInvControlList().then(res => {
        const AlllistData = res.result
        this.batchNumberList = AlllistData.map(v => v.batchNumber)
      })
    },
    // 更新列表（是否需要卡控）
    updateInvControlFnc() {
      updateInvControlList(this.updateVal).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
      })
    },
    // 增加列表
    addInvControlFnc() {
      addInvControlList(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 初始化批次列表
        this.getInvControlFnc()
      })
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
}
.el-form--inline .el-form-item__label {
  color: #99a9bf;
  float: none;
  display: inline-block;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
