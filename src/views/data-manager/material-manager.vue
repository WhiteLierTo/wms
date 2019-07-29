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
                    v-model="page.id"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="物料编号"
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
              </el-form>
            </el-col>
          </div>

          <!--列表-->
          <el-table :data="listData" style="width: 100%" border>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="温度上限">
                    <span>{{ props.row.tempUpperLimit }}℃</span>
                  </el-form-item>
                  <el-form-item label="温度下限">
                    <span>{{ props.row.tempLowerLimit }}℃</span>
                  </el-form-item>
                  <el-form-item label="湿度上限">
                    <span>{{ props.row.humidityUpperLimit }}℃</span>
                  </el-form-item>
                  <el-form-item label="湿度下限">
                    <span>{{ props.row.humidityLowerLimit }}℃</span>
                  </el-form-item>
                  <el-form-item label="描述">
                    <span>{{ props.row.description }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="物料编号" />
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="itemUnit" label="物料单位" />
            <el-table-column prop="shelfLife" label="物料保质期（天）" />
            <el-table-column label="温度控制" width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.tempStrategy==true">开启</div>
                <div v-else-if="scope.row.tempStrategy==false">关闭</div>
              </template>
            </el-table-column>
            <el-table-column label="湿度控制" width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.humidityStrategy==true">开启</div>
                <div v-else-if="scope.row.humidityStrategy==false">关闭</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
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
      <el-dialog title="新增物料" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="id"
                label="物料编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料编号', trigger: 'blur' }]"
              >
                <el-input v-model="addData.id" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="itemName"
                label="物料名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料名称', trigger: 'blur' }]"
              >
                <el-input v-model="addData.itemName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="itemUnit"
                label="物料单位"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择物料单位', trigger: 'blur' }]"
              >
                <el-select v-model="addData.itemUnit" placeholder="请选择物料单位" style="width:100%">
                  <el-option
                    v-for="item in itemUnitList"
                    :key="item.id"
                    :label="item.unit"
                    :value="item.unit"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="shelfLife"
                label="物料保质期(天)"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料保质期', trigger: 'blur' }]"
              >
                <el-input v-model="addData.shelfLife" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="tempStrategy"
                label="温度控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择温度控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="addData.tempStrategy"
                  placeholder="请选择温度控制"
                  style="width:100%"
                  @change="tempChange"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityStrategy"
                label="湿度控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择湿度控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="addData.humidityStrategy"
                  placeholder="请选择湿度控制"
                  style="width:100%"
                  @change="humidityChange"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="tempShow">
            <el-col :span="12">
              <el-form-item
                prop="tempUpperLimit"
                label="温度上限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入温度上限', trigger: 'blur' }]"
              >
                <el-input v-model="addData.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="tempLowerLimit"
                label="温度下限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入温度下限', trigger: 'blur' }]"
              >
                <el-input v-model="addData.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="humidityShow">
            <el-col :span="12">
              <el-form-item
                prop="humidityUpperLimit"
                label="湿度上限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入湿度上限', trigger: 'blur' }]"
              >
                <el-input v-model="addData.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityLowerLimit"
                label="湿度下限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入湿度下限', trigger: 'blur' }]"
              >
                <el-input v-model="addData.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="labelStrategy"
                label="标签控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择标签控制', trigger: 'blur' }]"
              >
                <el-select v-model="addData.labelStrategy" placeholder="请选择标签控制" style="width:100%">
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="batchStrategy"
                label="批次控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择批次控制', trigger: 'blur' }]"
              >
                <el-select v-model="addData.batchStrategy" placeholder="请选择批次控制" style="width:100%">
                  <el-option
                    v-for="item in tempList"
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
                prop="qualityStrategy"
                label="质检控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择质检控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="addData.qualityStrategy"
                  placeholder="请选择质检控制"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              prop="description"
              label="描述"
              :label-width="formLabelWidth"
              :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]"
            >
              <el-input
                v-model="addData.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入描述"
                autocomplete="off"
              />
            </el-form-item>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑 -->
    <div>
      <el-dialog title="修改物料" :visible.sync="edit">
        <el-form ref="updateItem" :model="updateItem" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="id"
                label="物料编号"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料编号', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.id" autocomplete="off" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="itemName"
                label="物料名称"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料名称', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.itemName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="itemUnit"
                label="物料单位"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择物料单位', trigger: 'blur' }]"
              >
                <el-select v-model="updateItem.itemUnit" placeholder="请选择物料单位" style="width:100%">
                  <el-option
                    v-for="item in itemUnitList"
                    :key="item.id"
                    :label="item.unit"
                    :value="item.unit"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="shelfLife"
                label="物料保质期(天)"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入物料保质期', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.shelfLife" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="tempStrategy"
                label="温度控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择温度控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="updateItem.tempStrategy"
                  placeholder="请选择温度控制"
                  style="width:100%"
                  @change="tempChange"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityStrategy"
                label="湿度控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择湿度控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="updateItem.humidityStrategy"
                  placeholder="请选择湿度控制"
                  style="width:100%"
                  @change="humidityChange"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="tempShow">
            <el-col :span="12">
              <el-form-item
                prop="tempUpperLimit"
                label="温度上限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入温度上限', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.tempUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="tempLowerLimit"
                label="温度下限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入温度下限', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.tempLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="humidityShow">
            <el-col :span="12">
              <el-form-item
                prop="humidityUpperLimit"
                label="湿度上限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入湿度上限', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.humidityUpperLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="humidityLowerLimit"
                label="湿度下限"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请输入湿度下限', trigger: 'blur' }]"
              >
                <el-input v-model="updateItem.humidityLowerLimit" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                prop="labelStrategy"
                label="标签控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择标签控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="updateItem.labelStrategy"
                  placeholder="请选择标签控制"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                prop="batchStrategy"
                label="批次控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择批次控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="updateItem.batchStrategy"
                  placeholder="请选择批次控制"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in tempList"
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
                prop="qualityStrategy"
                label="质检控制"
                :label-width="formLabelWidth"
                :rules="[{ required: true, message: '请选择质检控制', trigger: 'blur' }]"
              >
                <el-select
                  v-model="updateItem.qualityStrategy"
                  placeholder="请选择质检控制"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in tempList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              prop="description"
              label="描述"
              :label-width="formLabelWidth"
              :rules="[{ required: true, message: '请输入描述', trigger: 'blur' }]"
            >
              <el-input
                v-model="updateItem.description"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入描述"
                autocomplete="off"
              />
            </el-form-item>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="add = false">取 消</el-button>
          <el-button type="primary" @click="editSureHandleClick('updateItem')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getItemList,
  getAllItemList,
  getUnitAll,
  addBdItemList,
  updateItemList
} from '@/api/baseData'
export default {
  name: 'MaterialManager',
  data() {
    return {
      page: {
        id: null,
        current: 1,
        size: 10
      },
      listData: [],
      total: 0, // 总数
      loading: false,
      options: [],
      itemIdList: [],
      add: false,
      edit: false,
      addData: {
        id: '',
        itemName: '',
        itemUnit: '',
        shelfLife: '',
        tempStrategy: '',
        tempUpperLimit: '',
        tempLowerLimit: '',
        humidityStrategy: '',
        humidityUpperLimit: '',
        humidityLowerLimit: '',
        batchStrategy: '', // 批次控制
        labelStrategy: '', // 标签控制
        qualityStrategy: '', // 质检控制
        description: ''
      },
      tempShow: false, // 控制温度上下限
      humidityShow: false, // 控制湿度上下限
      tempList: [
        // 温度控制
        {
          value: false,
          label: '关闭'
        },
        {
          value: true,
          label: '开启'
        }
      ],
      itemUnitList: [],
      formLabelWidth: '120px',
      updateItem: {}
    }
  },
  mounted() {
    // 分页获取物料列表
    this.getItemListFnc()
    // 获取所有物料列表
    this.getAllItemListFnc()
    // 获取所有单位
    this.getUnitAllFnc()
  },
  methods: {
    // 查询
    referHandleClick() {
      // 初始化物料列表
      this.getItemListFnc()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.itemIdList.filter(item => {
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
      // 初始物料列表
      this.getItemListFnc()
    },
    // 当前页显示多少条
    handleCurrentChange(val) {
      this.page.current = val
      // 初始化物料列表
      this.getItemListFnc()
    },
    // 控制温度
    tempChange(val) {
      this.tempShow = val
    },
    // 控制湿度
    humidityChange(val) {
      this.humidityShow = val
    },
    // 添加
    addHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addBdItemListFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 编辑
    editHandleClick(row) {
      if (row.tempStrategy) {
        this.tempShow = true
      } else {
        this.tempShow = false
      }
      if (row.humidityStrategy) {
        this.humidityShow = true
      } else {
        this.humidityShow = false
      }
      this.updateItem = row
      this.edit = true
    },
    // 确定编辑
    editSureHandleClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateItemListFnc()
        } else {
          this.$message.error('请填写完整!')
          return false
        }
      })
    },
    // 分页获物料列表
    getItemListFnc() {
      getItemList(this.page).then(res => {
        this.listData = res.result.list
        this.total = res.result.total
      })
    },
    // 获取所有物料列表
    getAllItemListFnc() {
      getAllItemList().then(res => {
        const itemListData = res.result
        this.itemIdList = itemListData.map(v => v.id)
      })
    },
    // 获取所有单位列表
    getUnitAllFnc() {
      getUnitAll().then(res => {
        this.itemUnitList = res.result
      })
    },
    // 添加物料
    addBdItemListFnc() {
      addBdItemList(this.addData).then(res => {
        this.add = false
        this.addData = {}
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // 初始化批次列表
        this.getItemListFnc()
      })
    },
    // 编辑物料
    updateItemListFnc() {
      updateItemList(this.updateItem).then(res => {
        this.edit = false
        // this.addData = {}
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        // 初始化批次列表
        this.getItemListFnc()
      })
    }
  }
}
</script>

<style scoped>

</style>
