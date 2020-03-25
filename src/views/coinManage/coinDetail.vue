<template>
  <div id="coinDetail">
    <el-table
      :data="coinDetail"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
      <el-table-column prop="action" label="变动数量" width="150" align="center"></el-table-column>
      <el-table-column prop="reason" label="变动原因" align="center"></el-table-column>
      <el-table-column label="变动时间" align="center">
        <template slot-scope="scope">
          {{scope.row.modify_date|dateTimeFormat}}
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizeList"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin-top:10px"
        ></el-pagination>
      </div>
  </div>
</template>
<script>
import {
  getCoin
} from "@/api/coinManage";
import dayjs from "dayjs";
export default {
  data() {
    return {
      coinDetail: [],
      currentPage: 1,
      total: 0,
      pageSize: 20,
      pageSizeList: [10, 20, 30, 50],
      cutType: -1, //分页类型
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCoinDetail();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.getCoinDetail();//正常查看
          break;
        case 1:
          this.getCoinDetail(); //筛选分页查看
          break;
      }
    },
    getCoinDetail() {
      let data = {
        page:this.currentPage,
        pagenum:this.pageSize,
        id:this.$route.params.id,
        num:'',
        tag:0
      }
      getCoin(data).then(({ data }) => {
        this.coinDetail = [...data.msg];
        this.total = data.count
      });
    }
  },
  created() {
    this.getCoinDetail();
  }
};
</script>
<style lang='scss' scoped>
</style>