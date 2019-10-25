<template>
  <div id="time-management">
    <el-row>
      <el-col :span="12">
        <el-switch
          style="margin-right:10px"
          v-model="searchType"
          active-color="#2d8cf0"
          inactive-color="#2d8cf0"
          active-text="起止日期"
          inactive-text="年份"
        ></el-switch>
        <el-date-picker
          v-show="searchType"
          v-model="rangeDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-date-picker v-show="!searchType" v-model="yearDate" type="year" placeholder="选择年"></el-date-picker>
        <el-button type="primary" @click="getDates" :loading="searchLoading">查询</el-button>
      </el-col>
      <el-col :span="12">
        <el-row type="flex" justify="end">
          <el-button
            type="success"
            @click="skipImpory"
            v-show="authDate"
          >Excel导入节假日</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-calendar v-model="value" :first-day-of-week="7">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{date, data}">
        <div style="padding:8px;">{{data.day.split('-')[2]}}</div>
        <div style="background:#3F51B5;margin-top:8px;color:#fff;padding:0 8px;">{{ isFestival(date)}}</div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { getDates } from "@/api/admin";
export default {
  name: "time-management",
  data() {
    return {
      rangeDate: "",
      yearDate:new Date(),
      searchType: false, // 按哪种形式搜索
      searchLoading: false,
      value: new Date(), //控制日期当前显示时间
      UploadData: [], // 导入后的数据
      DateList: [],
      authDate:null
    };
  },
  methods: {
    isFestival(date) {
      let obj = this.DateList.find(t => {
        return (
          dayjs(t.date * 1000).format("YYYYMMDD") ==
          dayjs(date).format("YYYYMMDD")
        );
      });
      return obj ? obj.name : "";
    },
    //获取节假日
    getDates() {
      let params = {};
      if (this.searchType) {
        if (!this.rangeDate || this.rangeDate.length < 2) {
          this.$message.error("请选择日期");
          return false;
        }
        params = {
          start: dayjs(this.rangeDate[0]).format("YYYY/MM/DD"),
          end: dayjs(this.rangeDate[1]).format("YYYY/MM/DD")
        };
        this.value = this.rangeDate[0];
      } else {
        if (!this.yearDate) {
          this.$message.error("请选择年份");
          return false;
        }
        params = {
          year: dayjs(this.yearDate).format("YYYY")
        };
        this.value = params.year;
      }
      this.searchLoading = true;
      getDates(params)
        .then(({ data }) => {
          this.DateList = [...data.msg];
        })
        .finally(() => {
          this.searchLoading = false;
        });
    },
    //打开excel文件
    skipImpory() {
      this.$router.push({ name: "date-import" });
    }
  },
  created() {
    this.searchLoading = true;
    getDates({
      year: dayjs(this.yearDate).format("YYYY")
    })
      .then(({ data }) => {
        this.DateList = [...data.msg];
        this.authDate = data.auth.can_manage_wktime_state
      })
      .finally(() => {
        this.searchLoading = false;
      });
  }
};
</script>

<style lang="scss">
.el-calendar{
  margin-top: 30px;
}
.el-calendar-day{
  padding: 0px!important;
}
</style>