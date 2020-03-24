<template>
  <div id="coinInfo">
    <el-table
      :data="coinList"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
      <el-table-column prop="user_name" label="用户名" align="center"></el-table-column>
      <el-table-column prop="sum" label="总积分数" align="center">
        <template slot-scope="scope">
          <router-link
            style="cursor: pointer;"
            :to="{name:'coinDetail',params:{id:scope.row.user_id},query:{type:scope.row.pro_type}}"
          >{{scope.row.sum}}</router-link>
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
      coinList: [],
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
      this.getCoinList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case -1:
          this.getCoinList();//正常查看
          break;
        case 1:
          this.getCoinList(); //筛选分页查看
          break;
      }
    },
    getCoinList() {
      let data = {
        page:this.currentPage,
        pagenum:this.pageSize,
        num:"",
        all:""
      }
      getCoin(data).then(({ data }) => {
        this.coinList = [...data.msg];
        this.total = data.count
      });
    }
  },
  created() {
    this.getCoinList();
  }
};
</script>
<style lang='scss' scoped>
</style>