<!-- Dailies -->
<template>
  <div id="Dailies">
    <el-table
      :data="dailies"
      style="margin-top:15px;width:100%"
      highlight-current-row
      :stripe="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="cellStyle"
      border
      v-loading="tableLoading"
    >
      <el-table-column label="任务ID" prop="id" width="100px"></el-table-column>
      <el-table-column label="缩略图">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset.image"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
            style="width: 48px;height: 27px;"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="任务" show-overflow-tooltip></el-table-column>
      <el-table-column label="制作环节" prop="dept" show-overflow-tooltip width="100px">
        <template slot-scope="scope">{{scope.row.link_dept_name}}</template>
      </el-table-column>
      <el-table-column label="制作内容" prop="content" show-overflow-tooltip></el-table-column>

      <el-table-column label="镜头号" show-overflow-tooltip prop="asset" width="90pxs">
        <template slot-scope="scope">{{scope.row.asset.name}}</template>
      </el-table-column>
      <el-table-column
        prop="priority"
        label="优先级"
     
        width="120px"
        sortable="custom"
        align="center"
      >
        <template slot-scope="scope">
          <div
            style="backgroundColor:#C64b2b;color:#FFF"
            v-if="scope.row.priority === 2"
          >{{scope.row.priority|taskPriority}}</div>
          <div style="backgroundColor:'transparent'" v-else>{{scope.row.priority|taskPriority}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="难度等级"  width="120px" align="center">
        <template slot-scope="scope">
          <div
            style="backgroundColor:#C64b2b;color:#FFF"
            v-if="scope.row.grade === 2"
          >{{scope.row.grade|taskgrade}}</div>
          <div style="backgroundColor:'transparent'" v-else>{{scope.row.grade|taskgrade}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="90px" align="left">
        <template slot-scope="scope">{{scope.row.status|taskStatus}}</template>
      </el-table-column>
      <el-table-column label="创建者" prop="user" >
        <template slot-scope="scope">{{scope.row.creator.name}}</template>
      </el-table-column>
      <el-table-column label="执行人" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
      </el-table-column>
      <el-table-column label="任务进度" width="100px" align="center" prop="schedule">
        <template slot-scope="scope">{{scope.row.schedule}}%</template>
      </el-table-column>
      <el-table-column label="创建日期" width="100px" prop="date">
        <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="开始日期" width="100px" prop="start_date">
        <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="截止日期" width="100px" prop="end_date">
        <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="total_hour" align="center" label="预设时间（小时）" width="130px"></el-table-column>
    </el-table>
    <div class="block" style="text-align: right;margin-top:10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dailies.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getTaskDailies } from "@/api/task";
export default {
  name: "Dailies",
  components: {},
  data() {
    return {
      dailies: [],
      tableLoading: false,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
    };
  },
  watch: {},
   filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    categoryFilter(obj) {
      if ("name" in obj) {
        return obj["name"];
      } else {
        return "";
      }
    }
  },
  methods: {
    //获取dailies列表
    getDailies() {
      this.tableLoading = true;
      getTaskDailies()
        .then(({ data }) => {
          this.dailies = [...data.msg];
          this.tableLoading = false;
          this.currentPage = 1;
        })
        .catch(res => {
          this.tableLoading = false;
        });
    },
    //状态
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  },
  created() {
    this.getDailies();
  }
};
</script>
<style lang='scss' scoped>
</style>