<script>
import MyTask from "./components/MyTask";
import MyManWork from "./components/MyManWork";
import noticeDetail from "@/components/Notice/components/notice-detail";
import MyAllocation from "./components/MyAllocation";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabApprove from "@/views/task/components/tab-approve";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import { mapState } from "vuex";
import {
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList
} from "@/api/task";
export default {
  name: "home-page",
  components: {
    MyTask,
    MyManWork,
    noticeDetail,
    MyAllocation,
    //任务侧边栏相关
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    tabApprove
  },
  data() {
    return {
      MyTaskList: [],
      //任务侧边栏相关
      isDrawerShow: false,
      TaskDetail: {
        name: ""
      },
      Link: "",
      Asset: "",
      detailLoading: false,
      LogList: [],
      logsLoading: false,
      TaskRecord: [],
      createLoading: false,
      activeRow: {} //点击任务列表选中的列的数据
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"]),
    ...mapState("login", ["userInfo"]),
    unreadList() {
      if (this.Notice && this.Notice.length) {
        return this.Notice.filter(t => !t.read);
      } else {
        return [];
      }
    }
  },
  created() {
    this.getMyTasks();
  },
  methods: {
    cancel() {
      this.isDialogShow = false;
    },
    addRecord() {
      this.createLoading = true;

      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.isDialogShow = false;
          this.createLoading = false;
          this.isDrawerShow = false;
        })
        .catch(err => {
          this.createLoading = false;
        });
    },
    taskBoardRightShow(row) {
      this.isDrawerShow = true;

      this.activeRow = {
        ...row
      };
      this.TaskRecord = Object.assign(
        {},
        {
          task_id: row.task.id,
          type: 0,
          date: new Date().toLocaleDateString()
        }
      );
      this.logsLoading = true;
      this.$refs["taskApprovelog"].getApproveLog(row.task.id);
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
      this.$refs['taskDetail'].getDetail(row.task.id);
      // queryTask({
      //   id: row.task.id
      // })
      //   .then(({ data }) => {
      //     this.TaskDetail = {
      //       ...data.msg
      //     };
      //     this.Asset = this.TaskDetail.asset;
      //     this.Link = this.TaskDetail.link_dept_name;
      //     this.detailLoading = false;
      //   })
      //   .catch(() => {
      //     this.detailLoading = false;
      //   });
    },
    //修改是否已读
    updateIsRead(row) {
      console.log(row);
      if (row.read === 0) {
        row.read = 1;
      }
      HTTP.putNotice({
        method: "put",
        ids: row.id,
        read: row.read
      }).then(({ data }) => {
        if (data.status === 0) {
          //this.$message.success(data.msg);
          this.getNoticeDetail();
        }
      });
    },
    //获取我在进行中的任务
    getMyTasks() {
      getStatusTaskList({
        mytask: null,
        status: 2
      }).then(({ data }) => {
        this.MyTaskList = [...data.msg];
      });
    },
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    }
  }
};
</script>
<template>
  <div id="home-page">
    <el-row :gutter="16">
      <el-col :span="4">
        <el-card shadow="hover">
          <el-row
            slot="header"
            type="flex"
            justify="space-between"
            align="middle"
            class="card-header"
          >
            <span>我的信息</span>
          </el-row>
          <div class="card-item">
            <div class="labels">
              <el-avatar size="small">{{userInfo.username | avatarFormat}}</el-avatar>
            </div>
            <div class="content">
              {{userInfo.username}}
              <svg-icon :icon-class="userInfo.sex && userInfo.sex==='男'?'nanxing':'nvxing'" />
            </div>
          </div>
          <div class="card-item">
            <div class="labels">邮 箱</div>
            <div class="content">{{userInfo.email}}</div>
          </div>
          <div class="card-item">
            <div class="labels">角 色</div>
            <div class="content">{{userInfo.role.role}}</div>
          </div>
          <div class="card-item">
            <div class="labels">工 种</div>
            <div class="content">
              <router-link
                class="dept-link"
                v-for="(item,index) of userInfo.dept"
                :key="index"
                :to="{path:'/admin/userGroup',query:{id:item.id}}"
              >{{item.name}}</router-link>
            </div>
          </div>
          <div>
            <div class="labels">
              <el-badge :value="unreadCount" :hidden="!unreadCount" :max="99" class="item">
                <span style="padding-right:8px">消 息</span>
              </el-badge>
            </div>

            <div class="content">
              <el-table
                :data="unreadList.filter((t,i)=>i<5)"
                style="width: 100%"
                ref="multipleTable"
                tooltip-effect="dark"
                @row-click="updateIsRead"
                :show-header="false"
              >
                <el-table-column label="通知" width="256" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <svg-icon v-if="scope.row.read == 0" icon-class="notice-close" />

                    <svg-icon v-if="scope.row.read == 1" icon-class="notice-open" />
                    <router-link :to="{path:scope.row.url}">{{scope.row.title}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column label="紧急程度" align="center" width="60">
                  <template slot-scope="scope">
                    <el-tooltip
                      v-if="scope.row.urgency_level == 0"
                      class="item"
                      effect="dark"
                      content="一般"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 0" icon-class="urgency1"></svg-icon>
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 1"
                      class="item"
                      effect="dark"
                      content="紧急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 1" icon-class="urgency2"></svg-icon>
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 2"
                      class="item"
                      effect="dark"
                      content="特急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 2" icon-class="urgency3"></svg-icon>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                v-show="unreadList.length>5"
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
              >查看更多</el-button>
              <!-- <el-button
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
                style="color:#ed4014"
              >{{unreadCount}} 条未读 <el-icon class="el-icon-position"/></el-button>-->
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- <svg-icon icon-class="caitongzhi" />-->
      <el-col :span="5">
        <MyTask
          :my-task-list="MyTaskList"
          @show-drawer="taskBoardRightShow"
        />
      </el-col>
      <el-col :span="6">
        <MyManWork :my-tasks="MyTaskList" class="card" />
      </el-col>
      <el-col :span="4">
        <MyAllocation />
      </el-col>
    </el-row>
    <Drawer
      scrollable
      v-model="isDrawerShow"
      width="512px"
      inner
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情">
          <tabTaskDtail
            ref="taskDetail"
            :link="Link"
            :asset="Asset"
            :detailLoading="detailLoading"
          />
        </el-tab-pane>
        <el-tab-pane label="执行记录">
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="执行任务">
          <task-form
            :task-record.sync="TaskRecord"
            :createLoading="createLoading"
            @addRecord="addRecord"
            @cancel="cancel"
          />
        </el-tab-pane>
        <el-tab-pane label="提交审核">
          <tab-approve
            v-if="activeRow.task && activeRow.task.status === 2"
            :row="activeRow"
            @refresh="getMyTasks"
          />
          <div v-else style="display:flex;justify-content:center">任务状态不是进行中</div>
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="taskApprovelog" />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<style lang="scss">
#home-page {
  font-size: 12px;
  .card-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
  }
  .labels {
    vertical-align: middle;
    color: #909399;
    width: 60px;
    flex: 0 0 40px;
  }
  .label {
    width: 200px;
  }
  .el-button--text {
    padding: 0;
  }
  .svg-icon {
    font-size: 16px;
  }
  .dept-link {
    font-size: 12px;
    color: #2d8cf0;
    & + .dept-link {
      margin-left: 5px;
    }
  }
}
</style>