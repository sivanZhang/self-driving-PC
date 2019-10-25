<template>
  <div id="detail">
    <el-row>
      <el-col :span="10">
        <el-image
          class="mini-image"
          :src="TaskDetail.project.image?$store.state.BASE_URL+TaskDetail.project.image:''"
          fit="cover"
          style="width: 170px;height: 120px;float: left;margin-right: 10px"
        ></el-image>
      </el-col>
      <el-col :span="4">
        <div>项目名称：</div>
        <div>所属资产：</div>
      </el-col>
      <el-col :span="10">
        <div>{{TaskDetail.project.name}}</div>
        <div>{{TaskDetail.asset.name?TaskDetail.asset.name:"-"}}</div>
      </el-col>
    </el-row>
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务详情" name="first">
          <tabTaskDtail ref="taskDtail" />
        </el-tab-pane>
        <el-tab-pane label="执行记录" name="second">
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="执行任务" name="third">
          <task-form :task-record.sync="TaskRecord" @addRecord="addRecord" @cancel="cancel" />
        </el-tab-pane>
        <el-tab-pane label="提交审核" name="fourth">
          <tab-approve v-if="activeRow.task && activeRow.task.status === 2" :row="activeRow" />
          <div
            v-if="activeRow.task && activeRow.task.status === 3"
            style="display:flex;justify-content:center"
          >任务正在审核中</div>
          <div v-else style="display:flex;justify-content:center">任务状态未在进行中</div>
        </el-tab-pane>
        <el-tab-pane label="审批记录" name="fifth">
          <approve-log ref="taskApprovelog" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { addTaskRecord, queryTask } from "@/api/task";
import taskForm from "@/views/task/components/task-form";
import tabLog from "@/views/task/components/tab-log";
import tabApprove from "@/views/task/components/tab-approve";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import approveLog from "@/views/components/approve-log";
export default {
  name: "detail",
  props: ["LogList", "detailLoading", "logsLoading", "TaskRecord", "activeRow"],
  data() {
    return {
      activeName: "first",
      TaskDetail: {
        asset: {
          name: ""
        },
        project: { image: "" }
      },
      rules: {
        title: [
          {
            message: "请输入任务执行记录的标题",
            trigger: "blur"
          }
        ],
        content: [
          {
            message: "请输入任务执行记录的内容",
            trigger: "blur"
          }
        ],
        labor_hour: [{ message: "请输入任务执行的工时", trigger: "blur" }]
      },
      rules2: {
        comment: [{ message: "请输入任务完成情况说明", trigger: "blur" }]
      }
    };
  },
  components: {
    tabApprove,
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "fifth") {
          this.$refs["taskApprovelog"].getApproveLog(this.TaskDetail.id);
        }
      }
    }
  },
  methods: {
    getTaskDetail(id) {
      queryTask({
        id: id
      })
        .then(({ data }) => {
          this.TaskDetail = {
            ...data.msg
          };
          // console.log(this.TaskDetail);
        })
        .catch(() => {});
      this.$nextTick(() => {
        this.$refs["taskDtail"].getDetail(id);
      });
    },
    addRecord() {
      this.createLoading = true;

      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            // this.getMyTasks();
          } else {
            this.$message.warning(res.data.msg);
          }
          this.$emit("activename");
          this.createLoading = false;
        })
        .catch(err => {
          this.createLoading = false;
          this.$emit("activename");
        });
    },
    cancel() {
      this.isDialogShow = false;
    }
  },
  mounted() {
    document.body.style.minWidth = "auto";
  }
};
</script>

<style scoped>
</style> 