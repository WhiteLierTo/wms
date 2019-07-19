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
                  <el-select v-model="page.warehouseLock" size="small" placeholder="所属仓库">
                    <el-option
                      v-for="item in warehouse"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="page.warehouseLock" size="small" placeholder="库位锁状态">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" style="bacground:#0076a8">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">新增</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>

          <!--列表-->
          <el-table
            :data="listData"
            style="width: 100%"
            border
          >
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
            <el-table-column prop="wid" label="所属仓库" />
            <el-table-column prop="description" label="库位描述" />
            <el-table-column prop="warehouseLock" label="库位锁">
              <template slot-scope="scope">
                <div v-if="scope.row.locationLock==0" style="color:#cc0000">关闭</div>
                <div v-if="scope.row.locationLock==1" style="color:#3c763d">开启</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            :current-page="10"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            :total="40"
            style="float: right;margin:20px 0px 20px 0px"
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
                prop="tempUpperLimit"
                label="温度上限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="tempLowerLimit"
                label="温度下限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="humidityUpperLimit"
                label="湿度上限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityLowerLimit"
                label="湿度下限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="description"
                label="仓库描述"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="maximum"
                label="最大承重"
                :label-width="formLabelWidth"
              >
                <el-input v-model="addData.maximum" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="addData.locationLock" label="1">开启</el-radio>
                <el-radio v-model="addData.locationLock" label="0">关闭</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addHandleClick">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑仓库" :visible.sync="edit">
        <el-form :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="tempUpperLimit"
                label="温度上限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="tempLowerLimit"
                label="温度下限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="humidityUpperLimit"
                label="湿度上限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityLowerLimit"
                label="湿度下限"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="description"
                label="仓库描述"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="maximum"
                label="最大承重"
                :label-width="formLabelWidth"
              >
                <el-input v-model="editData.maximum" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="editData.locationLock" label="1">开启</el-radio>
                <el-radio v-model="editData.locationLock" label="0">关闭</el-radio>
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
export default {
  data() {
    return {
      warehouse: [
        {
          // 仓库状态查询
          value: '2',
          label: '高温仓库'
        },
        {
          value: '1',
          label: '恒温仓库'
        },
        {
          value: '0',
          label: '低温仓库'
        }
      ],
      options: [
        {
          // 仓库状态查询
          value: '1',
          label: '开启'
        },
        {
          value: '0',
          label: '关闭'
        }
      ],
      add: false,
      edit: false,
      formLabelWidth: '80px',
      addData: {
        // 新增数据
        warehouseName: '',
        tempUpperLimit: '',
        tempLowerLimit: '',
        humidityUpperLimit: '',
        humidityLowerLimit: '',
        maximum: '',
        description: '',
        locationLock: '1'
      },
      editData: {},
      page: {
        // 查询条件
        warehouseLock: '',
        warehouseName: '',
        total: 0,
        page: 1
      },
      listData: [
        // 列表数据
        {
          location: 0,
          wid: '1',
          maximum: '1200',
          tempUpperLimit: '30',
          tempLowerLimit: '10',
          humidityUpperLimit: '30',
          humidityLowerLimit: '10',
          locationLock: '1',
          description: '该库位为第一库位'
        },
        {
          location: 1,
          wid: '1',
          maximum: '1200',
          tempUpperLimit: '40',
          tempLowerLimit: '15',
          humidityUpperLimit: '30',
          humidityLowerLimit: '10',
          locationLock: '1',
          description: '该库位为第二库位'
        },
        {
          location: 2,
          wid: '1',
          maximum: '1200',
          tempUpperLimit: '25',
          tempLowerLimit: '18',
          humidityUpperLimit: '20',
          humidityLowerLimit: '11',
          locationLock: '0',
          description: '该库位为第三库位'
        }
      ]
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    editHandleClick(e) {
      this.edit = true
      this.editData = e
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
    addHandleClick() {
      if (!this.addData.maximum || !this.addData.description) {
        this.$message({
          showClose: true,
          message: '请完善信息',
          type: 'warning'
        })
        return
      }
      this.add = false
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    editSubmit() {
      if (!this.editData.maximum || !this.editData.description) {
        this.$message({
          showClose: true,
          message: '请完善信息',
          type: 'warning'
        })
        return
      }
      this.edit = false
      this.$message({
        message: '编辑成功',
        type: 'success'
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
    color : #99a9bf ;
    float: none;
    display: inline-block;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
