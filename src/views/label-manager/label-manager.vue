<!--标签管理-->
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
                    v-model="page.id"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="物料ID"
                    size="small"
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
          <!--       <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">{{ $t('header.add') }}</el-button>
                </el-form-item> -->
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column width="150" prop="parentId" label="父级标签ID" />
            <el-table-column width="150" prop="labelDataId" label="标签数据ID" />
            <el-table-column width="150" prop="templateId" label="标签模板ID" />
            <el-table-column width="150" prop="itemId" label="物料ID" />
            <el-table-column width="150" prop="itemName" label="物料名称"/>
            <el-table-column width="150" prop="itemUnit" label="物料单位"/>
            <el-table-column width="150" prop="batchNumber" label="批次号码" />
            <el-table-column width="150" prop="quantity" label="物料数量" />
            <el-table-column width="150" prop="warehouse" label="仓库"/>
            <el-table-column width="150" prop="location" label="库位"/>
             <el-table-column prop="registered" label="是否已登记">
              <template slot-scope="scope">
                <div v-if="scope.row.registered===false" style="color:#cc0000">否</div>
                <div v-if="scope.row.registered===true" style="color:#3c763d">是</div>
              </template>
            </el-table-column>
             <el-table-column  fixed="right" prop="store" label="是否在库存中">
              <template slot-scope="scope">
                <div v-if="scope.row.store===false" style="color:#cc0000">否</div>
                <div v-if="scope.row.store===true" style="color:#3c763d">是</div>
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
import {
  getLabelList,
  getLabelAll
} from '@/api/label'
export default {
  name: 'labelManager',
  data() {
    return {
      setRemote: [],
      formLabelWidth: '100px',
      page: {
        // 查询条件
        id: '',
        total: 40,
        current: 1,
        sort:'modify_at',
        size: 10
      },
      listData: []
    }
  },
  mounted() {
    this.fetchData();
    this.getLabelAllAllFnc();
  },
  methods: {
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    fetchData() {
      getLabelList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    getLabelAllAllFnc() {
      getLabelAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.itemId }
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
