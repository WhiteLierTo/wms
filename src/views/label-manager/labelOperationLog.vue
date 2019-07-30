<!--标签操作日志管理-->
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
                    placeholder="标签操作日志名称"
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
                <el-form-item>
                  <el-button size="small" type="primary" @click="add = true">{{ $t('header.add') }}</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </div>
          <!--列表-->
          <el-table border :data="listData" style="width: 100%">
            <el-table-column prop="labelId" label="标签ID" />
            <el-table-column prop="operation" label="操作" />
            <el-table-column prop="content" label="操作内容" />
            <el-table-column prop="creator" label="创建者" />
            <el-table-column prop="modifyAt" label="修改时间"/>
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
  getLabelOperationLogList,
  getOperationAll
} from '@/api/label'
export default {
  name: 'labelOperationLog',
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
    this.getOperationAllFnc();
  },
  methods: {
    // 查询
    queryHandleClick() {
      this.fetchData()
    },
    fetchData() {
      getLabelOperationLogList(this.page).then(res => {
        this.listData = res.result.list
        this.page.total = res.result.total
      })
    },
    getOperationAllFnc() {
      getOperationAll().then(res => {
        this.setRemote = res.result.map(item => {
          return { value: item.id, label: item.operation }
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
