<template>
  <div>
    <div class="body">
      <div>
        <el-card class="box-card">
          <el-form :inline="true" :model="lineData" class="demo-form-inline">
            <el-form-item label="点收数量">
              <el-input disabled v-model="lineData.quantityRegister" placeholder="点收数量"></el-input>
            </el-form-item>
            <el-form-item label="上架数量">
              <el-input disabled v-model="lineData.quantityReceive" placeholder="上架数量"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input disabled v-model="lineData.status" placeholder="状态"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="itemUnit" label="入库单位"></el-table-column>
            <el-table-column prop="batchNumber" label="物料批次" />
            <el-table-column prop="warehouse" label="上架库房" />
            <el-table-column prop="location" label="上架库位" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <div v-if="scope.row.type==1" style="color:#3c763d">create</div>
                <div v-if="scope.row.type==2" style="color:#3c763d">confirm</div>
              </template>
            </el-table-column>
            <el-table-column prop="inboundDate" label="入库日期" />
            <el-table-column label="操作" width="150">
              <template>
                <el-button type="text" size="small" @click="InventoryCheck = true">点收</el-button>
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
    <div>
      <el-dialog title="点收" :visible.sync="InventoryCheck" width="30%" :before-close="handleClose">
        <el-form
          :model="InventoryCheckEdit"
          :rules="rules"
          ref="ruleForm"
          :label-width="formLabelWidth"
          class="demo-ruleForm"
        >
          <el-form-item label="点收数量" prop="number"
           :rules="[
                  { required: true, message: '点收数量不能为空'},
            ]">
            <el-input v-model="InventoryCheckEdit.number"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="InventoryCheck = false">取 消</el-button>
          <el-button type="primary" @click="InventoryCheck = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStockDetailFnc, getStockInLineOne } from "@/api/stock";
export default {
  data() {
    return {
        formLabelWidth: '80px',
      InventoryCheck: false, //点收弹窗
      InventoryCheckEdit: {
        //点收修改
        number: ""
      },
      line: {
        id: ""
      },
      lineData: {},
      page: {
        lineId: "",
        total: 10,
        current: 1,
        size: 10,
        delete: false
      },
      listData: []
    };
  },
  methods: {
    //获取入库单行
    getLine() {
      getStockInLineOne(this.line).then(res => {
        if (res.result.status == 1) {
          res.result.status = "create";
        }
        if (res.result.status == 2) {
          res.result.status = "confirm";
        }
        if (res.result.status == 3) {
          res.result.status = "register";
        }
        if (res.result.status == 4) {
          res.result.status = "receive";
        }
        if (res.result.status == 5) {
          res.result.status = "close";
        }
        this.lineData = res.result;
      });
    },
    //获取入库明细
    fetchData() {
      getStockDetailFnc(this.page).then(res => {
        this.listData = res.result.list;
        this.page.total = res.result.total;
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
  },
  mounted() {
    this.page.lineId = sessionStorage.getItem("getStockDetail");
    this.line.id = sessionStorage.getItem("getStockDetail");
    this.fetchData();
    this.getLine();
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



