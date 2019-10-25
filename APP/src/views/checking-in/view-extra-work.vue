<template>
  <div id="extra-work">
    <el-row>
      <el-col align="right">
        <el-row type="flex" justify="end">
          <el-select
            v-model="colSel"
            placeholder="请选择"
            style="width:100px;margin-left:600px"
            filterable
            size="mini"
          >
            <el-option
              v-for="item of columnSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-if="colShow"
            placeholder="输入用户名"
            v-model="keyword"
            size="mini"
            @keyup.enter.native="getExtrworks()"
            style="width:360px"
          ></el-input>
          <el-date-picker
            style="width:360px"
            v-if="timeSel"
            v-model="timeSelection"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-button
            @click="getExtrworks()"
            icon="el-icon-search"
            style="height:27.99px"
            type="primary"
          />
          <el-button
            @click="getExtrworks2()"
            style="margin-left: 15px;height:27.99px"
            type="primary"
          >重置</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-table
      :data="ExtraworkList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      @selection-change="handleSelectionChange"
      v-loading="tableLoading"
      :row-key="row=>row.overtime_id"
    >
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column prop="creator.username" label="申请人"></el-table-column>
      <el-table-column prop="creator.depts" label="部门">
        <template slot-scope="scope">
          <div v-for="(todo,index) of scope.row.creator.depts" :key="index">{{todo}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="taskname" label="加班任务"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时(小时)"></el-table-column>
      <el-table-column label="申请日期">
        <template slot-scope="scope">{{scope.row.creator_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="审批状态" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.overtime_status===null && currentSelect===1"
            type="text"
            @click="sunbmitApprove(scope.row.overtime_id)"
          >提交审批</el-button>
          <span v-else-if="scope.row.overtime_status===null && currentSelect===0">待提交</span>
          <span v-else-if="scope.row.overtime_status===3">已提交</span>
          <span v-else-if="scope.row.overtime_status===2">审批中</span>
          <span v-else-if="scope.row.overtime_status===1" style="color:#19be6b">同意</span>
          <span v-else-if="scope.row.overtime_status===0" style="color:#ed4014">拒绝</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ExtraworkList.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getOvertime,
  postOvertime,
  postApply,
  deleteApply,
  putApply
} from "@/api/checkingIn";
import { getStatusTaskList } from "@/api/task";
import dayjs from "dayjs";
export default {
  name: "extra-work",
  data() {
    return {
      colSel: "name",
      colShow: true,
      keyword: "",
      timeSel: false,
      timeSelection: "",
      columnSelect: [
        {
          value: "name",
          label: "用户名"
        },
        {
          value: "date",
          label: "申请日期"
        }
      ],
      startDay: null,
      value1: "",
      filterText: "",
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      multipleSelection: [],
      ApplyForm: {},
      tableLoading: false,
      ExtraworkList: [],
      currentSelect: 1
    };
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        if (newVal == "date") {
          this.colShow = false;
          this.timeSel = true;
          this.timeSelection = "";
        } else {
          this.colShow = true;
          this.timeSel = false;
        }
      }
    }
  },

  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //监听下拉框改变
    handleSelectLChange() {
      this.getExtrworks();
    },
    //获取加班申请列表
    getExtrworks() {
      let data = {};
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      if (this.colSel == "name" && this.keyword) {
        data = {
          ...data,
          allovertime: "",
          username: this.keyword
        };
      }
      if (this.colSel == "date") {
        data = {
          ...data,
          allovertime: "",
          start: DateFormat(this.timeSelection[0]),
          end: DateFormat(this.timeSelection[1])
        };
      }

      getOvertime(data).then(({ data }) => {
        this.ExtraworkList = [...data.msg];
        this.currentPage = 1;
      });
    },
    getExtrworks2() {
      let params = {};
      // this.tableLoading = true;
      getOvertime({ allovertime: "" }).then(({ data }) => {
        this.ExtraworkList = [...data.msg];
        this.currentPage = 1;
      });
    }
  },
  created() {
    this.getExtrworks2();
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 15px;
}
</style>