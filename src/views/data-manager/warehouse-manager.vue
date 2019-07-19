<!--仓库管理-->
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
                  <el-input
                    v-model="page.warehouseName"
                    size="small"
                    :placeholder="$t('header.warehouseName')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-select
                    v-model="page.warehouseLock"
                    size="small"
                    :placeholder="$t('header.warehouseLockedState')"
                  >
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
                  >{{ $t('header.query') }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">{{ $t('header.add') }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="wid" label="仓库ID" />
            <el-table-column prop="warehouseName" label="仓库名称" />
            <el-table-column prop="description" label="仓库描述" />
            <el-table-column prop="warehouseLock" label="仓库锁状态">
              <template slot-scope="scope">
                <div v-if="scope.row.warehouseLock==0" style="color:#cc0000">关闭</div>
                <div v-if="scope.row.warehouseLock==1" style="color:#3c763d">开启</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editHandleClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteHandleClick(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>
        <el-pagination
          background
          :current-page.sync="current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          style="float: right;margin:20px 0px 20px 0px"
          :total="30"
        />
      </el-card>
    </div>

    <!--新增-->
    <div>
      <el-dialog title="新增仓库" :visible.sync="add">
        <el-form :model="addData" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item
                prop="wid"
                label="仓库ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库ID不能为空'}
                ]"
              >
                <el-input v-model="addData.wid" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col  style="margin-left:10px" :span="11">
              <el-form-item
                prop="warehouseName"
                label="仓库名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库名称不能为空'},
                ]"
              >
                <el-input v-model="addData.warehouseName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item
              prop="description"
              label="仓库描述"
              :label-width="formLabelWidth"
              :rules="[
                  { required: true, message: '仓库描述不能为空'}
                ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输仓库描述"
                v-model="addData.description"
              ></el-input>
            </el-form-item>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="addData.warehouseLock" label="1">开启</el-radio>
                <el-radio v-model="addData.warehouseLock" label="0" checked>关闭</el-radio>
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
           <el-col :span="11">
              <el-form-item
                prop="wid"
                label="仓库ID"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库ID不能为空'},
                ]"
              >
                <el-input disabled v-model="editData.wid" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col style="margin-left:10px" :span="11">
              <el-form-item
                prop="warehouseName"
                label="仓库名称"
                :label-width="formLabelWidth"
                :rules="[
                  { required: true, message: '仓库名称不能为空'},
                ]"
              >
                <el-input v-model="editData.warehouseName" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
            <el-form-item
              prop="description"
              label="仓库描述"
              :label-width="formLabelWidth"
              :rules="[
                  { required: true, message: '仓库描述不能为空'}
                ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输仓库描述"
                v-model="editData.description"
              ></el-input>
            </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库锁状态：" prop="region">
                <el-radio v-model="editData.warehouseLock" label="1">开启</el-radio>
                <el-radio v-model="editData.warehouseLock" label="0">关闭</el-radio>
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
  name: "warehouse",
  data() {
    return {
      current: 5,
      options: [
        {
          // 仓库状态查询
          value: "1",
          label: "开启"
        },
        {
          value: "0",
          label: "关闭"
        }
      ],
      add: false,
      edit: false,
      formLabelWidth: "80px",
      addData: {
        // 新增数据
        wid: "",
        warehouseName: "",
        description: "",
        warehouseLock: "0"
      },
      editData: {},
      page: {
        // 查询条件
        warehouseLock: "",
        warehouseName: "",
        total: 40,
        page: 1
      },
      listData: [
        // 列表数据
        {
          wid: 0,
          warehouseName: "恒温仓库",
          description: "温度为15-20摄氏度",
          warehouseLock: "1"
        },
        {
          wid: 1,
          warehouseName: "低温仓库",
          description: "温度为零下15-20摄氏度",
          warehouseLock: "1"
        },
        {
          wid: 2,
          warehouseName: "高温仓库",
          description: "温度为零下40-60摄氏度",
          warehouseLock: "0"
        }
      ]
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    editHandleClick(e) {
      this.edit = true;
      this.editData = e;
    },
    deleteHandleClick() {
      this.$confirm("此操作将永久删除该仓库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    addHandleClick() {
      if (!this.addData.warehouseName || !this.addData.description) {
        this.$message({
          showClose: true,
          message: "请完善信息",
          type: "warning"
        });
        return;
      }
      this.add = false;
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },
    editSubmit() {
      if (!this.editData.warehouseName || !this.editData.description) {
        this.$message({
          showClose: true,
          message: "请完善信息",
          type: "warning"
        });
        return;
      }
      this.edit = false;
      this.$message({
        message: "编辑成功",
        type: "success"
      });
    }
  }
};
</script>

<style>
.body {
  margin: 20px 0px 0px 2%;
}
.box-card {
  width: 98%;
}
</style>
