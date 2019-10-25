<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="$router.push({name:'clockin-import'})">打卡记录上传</el-button>
      </el-col>
      <el-col :span="12" align="right">
        <el-row type="flex" justify="end">
          <el-select v-model="colSel" placeholder="请选择" style="width:100px" filterable>
            <el-option
              v-for="item of columnSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-if="colShow"
            placeholder="请输入用户名"
            v-model="keyword"
            @keyup.enter.native="clockRecord()"
            style="width:360px"
          ></el-input>
          <el-select
            @keyup.enter.native="clockRecord()"
            v-show="chooseSel"
            v-model="colSel2"
            placeholder="请选择部门"
            style="width:360px"
          >
            <el-option
              v-for="item in columnSelect2"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
            @click="clockRecord()"
            icon="el-icon-search"
            style="height:27.99px"
            type="primary"
          />
          <el-button
            @click="clockRecord2()"
            style="margin-left: 15px;height:27.99px"
            type="primary"
          >重置</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-card style="margin-top: 10px">
      <el-table :data="clockRed">
        <el-table-column prop="user_name" label="用户名"></el-table-column>
        <el-table-column prop="user_depts" label="部门">
          <template slot-scope="scope">
            <div v-for="(todo,index) of scope.row.user_depts" :key="index">{{todo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="打卡日期">
          <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="come" label="上班时间">
          <template slot-scope="scope">{{scope.row.come|dateHMSFormat}}</template>
        </el-table-column>
        <el-table-column prop="leave" label="下班时间">
          <template slot-scope="scope">{{scope.row.leave|dateHMSFormat}}</template>
        </el-table-column>
        <el-table-column prop="late_come" label="迟到">
          <template slot-scope="scope">{{scope.row.late_come|lateStatus}}</template>
        </el-table-column>
        <el-table-column prop="early_leave" label="早退">
          <template slot-scope="scope">{{scope.row.early_leave|earlyStatus}}</template>
        </el-table-column>

        <!-- </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getClockRecord } from "@/api/notice";
// import { mapState } from "vuex";
import { getDept } from "@/api/admin";
import dayjs from "dayjs";
export default {
  data() {
    return {
      colSel: "name",
      colShow: true,
      keyword: "",
      chooseSel: false,
      columnSelect2: [],
      colSel2: [],
      timeSel: false,
      timeSelection: "",
      columnSelect: [
        {
          value: "name",
          label: "用户名"
        },
        {
          value: "dept",
          label: "部门"
        },
        {
          value: "date",
          label: "打卡日期"
        }
      ],
      clockRed: null,
      deptList: [],
      value1: "",
      value2: "",
      startTime: null,
      endTime: null
    };
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        if (newVal == "dept") {
          this.colShow = false;
          this.timeSel = false;
          this.chooseSel = true;
          this.columnSelect2 = this.deptList;
        } else if (newVal == "date") {
          this.colShow = false;
          this.chooseSel = false;
          this.timeSel = true;
          this.timeSelection = "";
        } else {
          this.colShow = true;
          this.timeSel = false;
          this.chooseSel = false;
          //  this.colSel2 = [];
          //   this.columnSelect2 = [];
        }
      }
    }
  },

  created() {
    this.getDeptList();
    this.clockRecord2();
  },
  methods: {
    getDeptList() {
      getDept().then(({ data }) => {
        this.deptList = [...data.msg];
      });
    },
    //点击筛选任务
    clockRecord() {
      let data = {};
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      if (this.colSel == "name" && this.keyword) {
        data = {
          ...data,
          name: this.keyword
        };
      }
      if (this.colSel == "dept") {
        //  console.log(this.colSel2)
        data = {
          ...data,
          dept: this.colSel2
        };
      }
      if (this.colSel == "date") {
        data = {
          ...data,
          start: DateFormat(this.timeSelection[0]),
          end: DateFormat(this.timeSelection[1])
        };
      }

      getClockRecord(data).then(({ data }) => {
        this.clockRed = [...data.msg];
      });
    },
    clockRecord2() {
      getClockRecord().then(({ data }) => {
        this.clockRed = [...data.msg];
      });
    }
  }
};
</script>

<style>
</style>