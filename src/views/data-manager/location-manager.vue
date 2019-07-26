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
                    v-model="page.location"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="库位编号"
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
                    v-model="page.wid"
                    filterable
                    clearable
                    size="small"
                    placeholder="所属仓库"
                  >
                    <el-option
                      v-for="item in warehouse"
                      :key="item.id"
                      :label="item.warehouseName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="page.locationLock" clearable size="small" placeholder="库位锁状态">
                    <el-option
                      v-for="item in options"
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
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="最大承重">
                    <span>{{ props.row.maximum }}kg</span>
                  </el-form-item>
                  <el-form-item label="温度上限">
                    <span>{{ props.row.tempUpperLimit }}度</span>
                  </el-form-item>
                  <el-form-item label="温度下限">
                    <span>{{ props.row.tempLowerLimit }}度</span>
                  </el-form-item>
                  <el-form-item label="湿度上限">
                    <span>{{ props.row.humidityUpperLimit }}度</span>
                  </el-form-item>
                  <el-form-item label="湿度下限">
                    <span>{{ props.row.humidityUpperLimit }}度</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="location" label="库位编号" />
            <el-table-column prop="warehouseName" label="所属仓库" />
            <el-table-column prop="description" label="库位描述" />
            <el-table-column prop="locationLock" label="库位锁">
              <template slot-scope="scope">
                <div v-if="scope.row.locationLock==false" style="color:#cc0000">关闭</div>
                <div v-if="scope.row.locationLock==true" style="color:#3c763d">开启</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <!-- <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
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
        </section>
      </el-card>
    </div>

    <!--新增-->
    <div>
      <el-dialog title="新增仓库" :visible.sync="add">
        <el-form :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="location"
                label="库位编号"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '库位编号不能为空'}
                ]"
              >
                <el-input v-model="addData.location" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="wid"
                label="所属仓库"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '请选择所属仓库',trigger: 'change'}
                ]">
                  <el-select style="width:100%" v-model="addData.wid" clearable placeholder="请选择">
                    <el-option
                      v-for="item in warehouse"
                      :key="item.id"
                      :label="item.warehouseName"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="tempUpperLimit" label="温度上限" :label-width="formLabelWidth">
                <el-input v-model="addData.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="tempLowerLimit" label="温度下限" :label-width="formLabelWidth">
                <el-input v-model="addData.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="humidityUpperLimit" label="湿度上限" :label-width="formLabelWidth">
                <el-input v-model="addData.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="humidityLowerLimit" label="湿度下限" :label-width="formLabelWidth">
                <el-input v-model="addData.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="description" label="仓库描述" :label-width="formLabelWidth">
                <el-input v-model="addData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="maximum" label="最大承重" :label-width="formLabelWidth">
                <el-input v-model="addData.maximum" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="addData.locationLock" :label="true">开启</el-radio>
                <el-radio v-model="addData.locationLock" :label="false">关闭</el-radio>
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

    <!--编辑-->
    <div>
      <el-dialog title="编辑仓库" :visible.sync="edit">
        <el-form :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="tempUpperLimit" label="库位编号" :label-width="formLabelWidth">
                <el-input v-model="editData.location" disabled autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="tempLowerLimit" label="所属仓库" :label-width="formLabelWidth">
                <el-input v-model="editData.warehouseName" disabled autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="tempUpperLimit" label="温度上限" :label-width="formLabelWidth">
                <el-input v-model="editData.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="tempLowerLimit" label="温度下限" :label-width="formLabelWidth">
                <el-input v-model="editData.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="humidityUpperLimit" label="湿度上限" :label-width="formLabelWidth">
                <el-input v-model="editData.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="humidityLowerLimit" label="湿度下限" :label-width="formLabelWidth">
                <el-input v-model="editData.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="description" label="仓库描述" :label-width="formLabelWidth">
                <el-input v-model="editData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="maximum" label="最大承重" :label-width="formLabelWidth">
                <el-input v-model="editData.maximum" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="editData.locationLock" :label="true">开启</el-radio>
                <el-radio v-model="editData.locationLock" :label="false">关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getLocationList,
  putLocation,
  postLocation,
  getWarehouseAll,
  getLocationAll
} from '@/api/baseData'
export default {
  name: 'LocationManager',
  data() {
    return {
      remote: [], // 远程查询库位编号
      setRemote: [],
      loading: false,
      warehouse: [], // 库房下拉
      options: [
        {
          // 仓库状态查询
          value: true,
          label: '开启'
        },
        {
          value: false,
          label: '关闭'
        }
      ],
      add: false,
      edit: false,
      formLabelWidth: '80px',
      addData: {
        // 新增数据
        location: '',
        wid: '',
        warehouseName: '',
        tempUpperLimit: '',
        tempLowerLimit: '',
        humidityUpperLimit: '',
        humidityLowerLimit: '',
        maximum: '',
        description: '',
        locationLock: false
      },
      editData: {},
      page: {
        // 查询条件
        location: '',
        locationLock: '',
        wid: '',
        total: 40,
        current: 1,
        size: 10
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData()
    this.getWarehouseList()
  },
  methods: {
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    // 弹出修改页面并赋值
    editHandleClick(e) {
      this.edit = true
      this.editData = e
    },
    // 查询库位编号
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
    //curd
    addHandleClick(formName) {
      if (!this.addData.wid || !this.addData.location) {
        this.$message({
          showClose: true,
          message: "请完善信息",
          type: "warning"
        });
        return;
      } 
       this.postLocationFnc();
    /*   this.$refs[formName].validate(valid => {
        if (valid) {       
          this.postLocationFnc();
        } else {
          this.$message.error('请完善信息!')
          return false
        }
      }) */

    },
    postLocationFnc(){
      let param = {
        wid:this.addData.wid,
        location:this.addData.location,
        warehouseName: this.addData.warehouseName,
        tempUpperLimit: this.addData.tempUpperLimit,
        tempLowerLimit: this.addData.tempLowerLimit,
        humidityUpperLimit: this.addData.humidityUpperLimit,
        humidityLowerLimit: this.addData.humidityLowerLimit,
        maximum: this.addData.maximum,
        description: this.addData.description,
        locationLock: this.addData.locationLock
      }
      postLocation(param).then(res => {
        if (res.errorCode == 0) {
          this.add = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          });
    },
    deleteHandleClick() {
      this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    editSubmit() {
      if (!this.editData.warehouseName || !this.editData.description) {
        this.$message({
          showClose: true,
          message: '请完善信息',
          type: 'warning'
        })
        return
      }
      let param = {
        wid:this.editData.wid,
        tempUpperLimit: this.editData.tempUpperLimit,
        tempLowerLimit: this.editData.tempLowerLimit,
        humidityUpperLimit: this.editData.humidityUpperLimit,
        humidityLowerLimit: this.editData.humidityLowerLimit,
        maximum: this.editData.maximum,
        description: this.editData.description,
        locationLock: this.editData.locationLock
      }
      putLocation(param).then(res => {
        if (res.errorCode === 0) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.edit = false
        }
      })
    },
    // 查询库位列表
    fetchData() {
      getLocationList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
      this.getWarehouseList()
      this.getLocationAll()
    },
    getLocationAll() {
      getLocationAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.location, label: item.location }
        })
      })
    },
    // 下拉查询库房列表
    getWarehouseList() {
      getWarehouseAll().then(res => {
        this.warehouse = res.result
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
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
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
