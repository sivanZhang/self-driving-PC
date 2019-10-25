<!-- 提交外网审批 -->
<template>
  <div id="extra-audit" ref="drawer-parent">
    <el-table
      v-loading="tableLoading"
      :data="extraList"
      style="margin-top:20px;width:100%"
      highlight-current-row
      @row-click="taskBoardRightShow"
    >
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="task.id" label="任务ID" align="center" />
      <el-table-column prop="task.name" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属项目" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="asset.name" label="所属资产" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user.username" label="提交人"></el-table-column>
      <el-table-column prop="task.dept.name" label="工种"></el-table-column>
      <el-table-column label="提交日期">
        <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.content" label="任务内容" show-overflow-tooltip></el-table-column>
      <el-table-column label="任务状态">
        <template slot-scope="scope">{{scope.row.task.status|taskStatus}}</template>
      </el-table-column>

      <el-table-column prop="task.executor" label="任务执行人"></el-table-column>
      <el-table-column label="优先级">
        <template slot-scope="scope">{{scope.row.task.priority|Priority}}</template>
      </el-table-column>
      <!-- 、工种、 -->

      <el-table-column label="开始日期">
        <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="end_date" label="截止日期">
        <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="task.total_hour" label="预设时间（小时）"></el-table-column>
    </el-table>

    <Drawer
      scrollable
      v-model="isDrawerShow"
      width="512px"
      :inner="isInner"
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      draggable
    >
      <el-tabs>
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail ref="taskDetail" :detailLoading="detailLoading" :path="path" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="客户审批" lazy>
          <el-divider>提交外网审批</el-divider>
          <template v-if="pro_type === 0">
            <el-row type="flex" align="middle">
              <el-col :span="5">审核评分</el-col>
              <el-col :span="19" align="left">
                <el-input-number v-model="form_obj.score" :min="0" :max="100" :step="10"></el-input-number>
              </el-col>
            </el-row>
          </template>
          <el-row style="margin-top:10px">
            <el-col :span="5">审批说明</el-col>
            <el-col :span="19">
              <el-input
                type="textarea"
                v-model="out_suggestion"
                ref="outer-input"
                placeholder="请输入提交客户审批的说明"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px">
            <el-col :span="5">审批路径</el-col>
            <el-col :span="19">
              <el-input v-model="path" ref="outer-path" placeholder="请输入审批路径"></el-input>
            </el-col>
          </el-row>
          <div style="margin-top:10px">
            <el-button type="primary" :loading="submitLoading" @click="submitApprove">提交</el-button>
          </div>
          <!-- {{form_obj}} -->
        </el-tab-pane>
        <el-tab-pane label="执行记录" lazy>
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<script>
import {
  queryMyTask,
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask
} from "@/api/task";
import {
  getExtraApproveList,
  submitExtra,
  getApprove,
  postApprove,
  getApproveDetail
} from "@/api/video";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
import thumbtackMixin from "@/mixins/thumbtack-mixin";
export default {
  mixins: [thumbtackMixin],
  components: {
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog
  },
  name: "extra-audit",
  data() {
    return {
      extraList: [],
      out_suggestion: "",
      submitLoading: false,
      isDrawerShow: false,
      TaskRecord: {},
      detailLoading: false,
      logsLoading: false,
      createLoading: false,
      LogList: [],
      TaskDetail: {},
      SelectionList: [],
      path: null,
      pro_type: null,
      tableLoading: false,
      form_obj: {}
    };
  },
  watch: {},
  methods: {
    async getApproveList() {
      this.tableLoading = true;
      await getExtraApproveList()
        .then(({ data }) => {
          this.extraList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //是否显示任务板右侧
    taskBoardRightShow(row) {
      this.isDrawerShow = true;
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
      this.$refs['taskDetail'].getDetail(row.task.id);
      queryTask({
        id: row.task.id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          };
          this.pro_type = data.msg.project.pro_type;
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    //是否显示任务板右侧
    // taskBoardRightShow(row) {
    //   this.isDrawerShow = true;
    //   this.TaskRecord = Object.assign(
    //     {},
    //     {
    //       task_id: row.task.id,
    //       type: 0
    //     }
    //   );
    //   this.logsLoading = true;
    //   queryTaskRecord({
    //     task_id: row.task.id
    //   })
    //     .then(({ data }) => {
    //       this.LogList = [...data.msg];
    //       this.logsLoading = false;
    //     })
    //     .catch(() => {
    //       this.logsLoading = false;
    //     });
    //   this.detailLoading = true;
    //   queryTask({
    //     id: row.task.id
    //   })
    //     .then(({ data }) => {
    //       this.TaskDetail = {
    //         ...data.msg
    //       };
    //       this.pro_type = data.msg.project.pro_type;
    //       this.detailLoading = false;
    //     })
    //     .catch(() => {
    //       this.detailLoading = false;
    //     });
    //   this.form_obj = Object.assign(
    //     {},
    //     {
    //       approve_id: row.approve_id
    //     }
    //   );
    //   this.$refs["approvelogs"].getApproveLog(row.task.id);
    // },
    submitApprove() {
      this.submitLoading = true;

      //添加提交外网审核字段
      this.form_obj = {
        ...this.form_obj,
        suggestion: this.out_suggestion,
        path: this.path
      };
      // console.log(this.form_obj);
      submitExtra(this.form_obj)
        .then(res => {
          if (res.data.status === 0) {
            this.extraList = [];
            this.getApproveList();
            this.isDrawerShow = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    }
  },
  created() {
    this.getApproveList();
  }
};
</script>
<style lang='scss' scoped>
</style>