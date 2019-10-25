<template>
  <div style="width:100%;height:100%;min-width:526px;padding:10px">
    <div id="notice-header" style="border-bottom:1px soild #999999">
      <el-row>
        <el-col :span="4">
          <svg-icon icon-class="people2" style="width:50px;height:50px;"></svg-icon>
        </el-col>
        <el-col :span="20">
          <el-row style="font-size:20px">{{loginMessage.msg}}</el-row>
          <el-row style="padding-top:10px">
            <el-col :span="3" align="left">邮箱：</el-col>
            <el-col :span="21">{{loginMessage.email}}</el-col>
          </el-row>
          <el-row style="padding-top:10px">
            <el-col :span="3" align="left">工种：</el-col>
            <el-col :span="21">
              <el-col
                :span="5"
                v-for="(item,index) of loginMessage.dept"
                :key="index"
                align="left"
              >{{item.name}}</el-col>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的任务" name="first">
        <el-table
          ref="assetTable"
          :data="MyTask"
          border
          :stripe="true"
          :row-style="{'font-size':'13px'}"
          :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
          highlight-current-row
          row-class-name="hover"
          style="width: 100%;"
        >
          <el-table-column prop="project.name" label="项目" align="center"></el-table-column>
          <el-table-column prop="task.name" label="任务" align="left"></el-table-column>
          <el-table-column label="起止日期" align="center">
            <el-table-column label="开始日期" align="left" width="90px">
              <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
            </el-table-column>
            <el-table-column label="结束日期" align="left" width="90px">
              <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="asset.name" label="资产" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-tooltip content="打开任务" placement="top">
                <el-button
                  @click="openTaskDetail(scope.row)"
                  icon="el-icon-top-right"
                  type="text"
                  style="color:blue"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="任务详情" name="second" disabled lazy>
        <detail
          ref="Detail"
          :LogList="LogList"
          :detailLoading="detailLoading"
          :logsLoading="logsLoading"
          :TaskRecord="TaskRecord"
          :activeRow="activeRow"
          @activename="activename"
        />
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="handelClick">触发</el-button>
  </div>
</template>

<script>
import QWebChannel from "./plugin/qwebchannel.js";
import {
  queryMyTask,
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList
} from "@/api/task";
import detail from "./components/detail";
import approveLog from "@/views/components/approve-log";
export default {
  name: "myTaskPlug",
  data() {
    return {
      value1: false,
      id: this.$store.state.login.userInfo.id,
      activeName: "first",
      loginMessage: this.$store.state.login.userInfo,
      MyTask: null,
      asset: {},
      project: {},
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      TaskDetail: {
        asset:{
          name: "",
        },
        project:{
          image:""
        }
      },
      LogList: [],
      detailLoading: false,
      logsLoading: false,
      TaskRecord: [],
      activeRow: {}
    };
  },
  created() {
    queryMyTask({
      inplugin: null
    }).then(({ data }) => {
      this.MyTask = [...data.msg];
      //console.log(this.MyTask);
    });
  },

  methods: {
    handelClick() {
      new QWebChannel(qt.webChannelTransport, function(channel) {
        window.app_manager = channel.objects.app_manager;
        console.log(app_manager);
        app_manager.text = "33333333";
        app_manager.textChanged.connect(function(message) {
          document.getElementById("output").innerHTML =
            "Received message: " + message;
        });
      });
    },
    activename() {
      this.activeName = "first";
    },
    handleClick(tab, event) {
      console.log(tab, event);
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
    },
    openTaskDetail(row) {
      this.activeRow = { ...row };
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0
        }
      );
      this.logsLoading = true;

      queryTaskRecord({
        task_id: row.task.id
      })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.detailLoading = true;
      this.$nextTick(()=>{
         this.$refs['Detail'].getTaskDetail(row.task.id);
      })
     
      // queryTask({
      //   id: row.task.id
      // })
      //   .then(({ data }) => {
      //     this.TaskDetail = {
      //       ...data.msg
      //     };
      //     this.detailLoading = false;
      //   })
      //   .catch(() => {
      //     this.detailLoading = false;
      //   });
      this.activeName = "second";
    }
  },
  components: {
    detail,
    approveLog
  },
  mounted() {
    document.body.style.minWidth = "auto";
  }
};
</script>

<style scoped>
</style> 



