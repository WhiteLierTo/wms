<template>
  <div>
    <div class="body">
      <el-card class="box-card">
        <section>
          <div style="float:right">
            <!--工具条-->
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="itemName" label="物料名称" />
            <el-table-column prop="itemUnit" label="入库单位"/>
            <el-table-column prop="batchNumber" label="物料批次" />
            <el-table-column prop="quantity" label="入库数量" />
            <el-table-column prop="quantityRegister" label="点收数量" />
            <el-table-column prop="quantityReceive" label="上架数量" />
            <el-table-column prop="producedDate" label="生产日期" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status===1" style="color:#3c763d">create</div>
                <div v-if="scope.row.status===2" style="color:#3c763d">confirm</div>
                <div v-if="scope.row.status===3" style="color:#3c763d">register</div>
                <div v-if="scope.row.status===4" style="color:#3c763d">receive</div>
                <div v-if="scope.row.status===5" style="color:#3c763d">close</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="turnToStockDetail(scope.row)">点收</el-button>
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
  </div>
</template>

<script>
import { getStockInLine, getStockInHeaderOne } from '@/api/stock';
export default {
  name: 'stockIn-Line',
  data() {
    return {
      header: {},
      headerData: {
        id: ''
      },
      page: {
        headerId: '',
        total: 10,
        current: 1,
        size: 10,
        deleted: false
      },
      listData: []
    }
  },
  mounted() {
    this.headerData.id =  sessionStorage.getItem("getStockLine");
    this.page.headerId =  sessionStorage.getItem("getStockLine");
    this.fetchData();
    this.getHeader();
  },
  methods: {
    turnToStockDetail(e){
      sessionStorage.setItem("getStockDetail", e.id);
      this.$router.push({ name: 'stockInDetail'})
    },
    getHeader() {
      getStockInHeaderOne(this.headerData).then(res => {
        this.header = res.result;
      });
    },
    fetchData() {
      getStockInLine(this.page).then(res => {
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
  }
}
</script>

<style scoped>

</style>

