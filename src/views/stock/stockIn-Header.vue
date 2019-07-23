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
                    v-model="page.warehouseLock"
                    clearable
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
          <el-table border :data="listData"  style="width: 100%">
            <el-table-column prop="billNumber" label="外部单据名称" />
            <el-table-column prop="billType" label="外部单据类型"></el-table-column>
            <el-table-column prop="vendorId" label="供应商ID" />
            <el-table-column prop="vendorName" label="供应商名称" />
            <el-table-column prop="state" label="入库单说明" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status==1" style="color:#3c763d">create</div>
                <div v-if="scope.row.status==2" style="color:#3c763d">confirm</div>
                <div v-if="scope.row.status==3" style="color:#3c763d">register</div>
                <div v-if="scope.row.status==4" style="color:#3c763d">receive</div>
                <div v-if="scope.row.status==5" style="color:#3c763d">close</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row.id)">删除</el-button>
                <el-button type="text" size="small" @click="trunToStockInLine(scope.row)">单行</el-button>
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
      <el-dialog title="新增入库单头" :visible.sync="add">
        <el-form ref="addData" :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="unit"
                label="入库单头名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单头名称不能为空'}
                ]"
              >
                <el-input v-model="addData.unit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="description"
                label="入库单头描述"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单头描述不能为空'},
                ]"
              >
                <el-input v-model="addData.description" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancelHandleClick()">取 消</el-button>
          <el-button type="primary" @click="addHandleClick('addData')">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--编辑-->
    <div>
      <el-dialog title="编辑入库单头" :visible.sync="edit">
        <el-form ref="editData" :model="editData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="unit"
                label="入库单头名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单头名称不能为空'},
                ]"
              >
                <el-input v-model="editData.unit" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="description"
                label="入库单头描述"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '入库单头描述不能为空'},
                ]"
              >
                <el-input v-model="editData.description" autocomplete="off" />
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
  putUnit,
  deleteUnit,
  getTypeAllFnc
} from "@/api/stock";
export default {
  name: "unit-manager",
  data() {
    return {
      remote: [],
      setRemote: [],
      loading: false,
      add: false,
      edit: false,
      formLabelWidth: "80px",
      addData: {
        // 新增数据
        unit: "",
        description: ""
      },
      editData: {},
      page: {
        // 查询条件
        unit: null,
        total: 40,
        current: 1,
        size: 10,
        delete: false
      },
      listData: [],
      LineData: [],
      line: {
        headerId: ""
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    //跳转单行页面
    trunToStockInLine(e) {
      this.$store.dispatch('stock/getStockLine', e.id)
      sessionStorage.setItem("getStockLine", e.id);
      this.$router.push({ name: 'stockInLine'})
    },
    //新增取消
    addCancelHandleClick() {
      (this.add = false), (this.addData.unit = "");
      this.addData.description = " ";
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
          let param = {
            description: this.addData.description,
            unit: this.addData.unit
          };
          postUnit(param).then(res => {
            if (res.errorCode === 0) {
              this.add = false;
              this.addData.unit = "";
              this.addData.description = "";
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
      this.$confirm("此操作将永久删除该入库单头, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          deleteUnit(e).then(res => {
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
            unit: this.editData.unit,
            description: this.editData.description
          };
          putUnit(param).then(res => {
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
    fetchData() {
      getStockInHeader(this.page).then(res => {
        this.listData = res.result.list;
        this.page.total = res.result.total;
      });
     this.getTypeAllFnc();
    },
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
    }
  }
};
</script>

<style scoped>
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
</style>