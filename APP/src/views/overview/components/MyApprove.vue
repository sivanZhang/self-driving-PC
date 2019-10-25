<template>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <span>我的审核</span>
      <!-- <el-button type="text" @click="isDialogShow = true">填报工时</el-button> -->
    </el-row>

    <el-divider content-position="left">
      任务
      <el-button type="text" @click="$router.push({name:'approve'})">查看</el-button>
    </el-divider>
    <el-table :data="AuditList" v-loading="tableLoading" @row-click="taskBoardRightShow">
      <el-table-column prop="task.name" label="任务" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user.username" label="提交人"></el-table-column>
      <el-table-column prop="task.dept.name" label="工种"></el-table-column>
    </el-table>

    <el-divider content-position="left">
      加班
      <el-button type="text" @click="$router.push({name:'approve-extra-work'})">查看</el-button>
    </el-divider>
    <el-table :data="ApproveOverTime" v-loading="tableLoading1" @row-click="openDialog">
      <el-table-column prop="overtime_creator.username" label="申请人"></el-table-column>
      <el-table-column prop="task.name" label="加班任务"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时"></el-table-column>
    </el-table>

    <el-dialog title="加班申请审批" :visible.sync="dialogVisible" width="512px">
      <el-form :model="ApproveForm" :rules="rules" ref="approve-form" label-width="100px">
        <el-form-item label="审批意见" prop="suggestion">
          <el-input type="textarea" v-model="ApproveForm.suggestion" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="审批决定" prop="approve_result">
          <el-radio-group v-model="ApproveForm.approve_result">
            <el-radio-button :label="1">同意</el-radio-button>
            <el-radio-button :label="0">拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button :loading="submitLoading" type="primary" @click="submitForm('approve-form')">提交</el-button>
          <el-button @click="resetForm('approve-form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
        <el-tab-pane label="任务详情" lazy>
          <tabTaskDtail ref="taskDetail" :detailLoading="detailLoading" :path="path" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="快捷审批" lazy>
          <el-divider>提交内网审批</el-divider>
          <el-row type="flex">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              placeholder="请输入审批意见"
              v-model="form_obj.suggestion"
              clearable
            ></el-input>
          </el-row>
          <el-radio-group v-model.number="form_obj.approve_result" style="margin: 15px 0">
            <el-radio :label="0">拒绝</el-radio>
            <el-radio :label="1">同意</el-radio>
          </el-radio-group>
          <template v-if="pro_type === 0">
            <el-row type="flex" align="middle">
              <el-col :span="5">审核评分</el-col>
              <el-col :span="19" align="left">
                <el-input-number v-model="form_obj.score" :min="0" :max="100" :step="10"></el-input-number>
              </el-col>
            </el-row>
          </template>
          <div>
            <el-checkbox v-model="checked">是否提交客户审批</el-checkbox>
          </div>
          <el-input
            v-if="checked"
            type="textarea"
            v-model="out_suggestion"
            ref="outer-input"
            placeholder="提交客户审批的说明"
            style="margin-top:10px"
          ></el-input>
          <el-input
            v-if="checked"
            v-model="out_path"
            ref="outer-path"
            placeholder="请输入提交客户审批的路径"
            style="margin-top:5px"
          ></el-input>
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
  </el-card>
</template>

<script>
import { mapState } from "vuex";
import { postApprove } from "@/api/checkingIn";
import approveLog from "@/views/components/approve-log";
import tabLog from "@/views/task/components/tab-log";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import { queryTaskRecord, queryTask } from "@/api/task";
import { postApprove as postTaskApprove, getApproveDetail } from "@/api/video";
export default {
  components: {
    approveLog,
    tabTaskDtail,
    tabLog
  },
  data() {
    return {
      tableLoading: false,
      tableLoading1: false,
      dialogVisible: false,
      ApproveForm: {},
      submitLoading: false,
      rules: {
        approve_result: [
          { required: true, message: "审批结果为必选", trigger: "blur" }
        ]
      },
      //任务审核
      isDrawerShow: false,
      TaskDetail: {},
      detailLoading: false,
      path: null,
      form_obj: {},
      pro_type: null,
      checked: false,
      LogList: [],
      logsLoading: false
    };
  },
  computed: {
    ...mapState("approve", ["AuditList", "ApproveOverTime"])
  },
  created() {
    if (!this.AuditList || !this.ApproveOverTime) {
      this.getMyApproves();
    }
  },
  methods: {
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
      this.$refs["taskDetail"].getDetail(row.task.id);
      queryTask({
        id: row.task.id
      })
        .then(({ data }) => {
          // this.TaskDetail = {
          //   ...data.msg
          // };
          this.pro_type = data.msg.project.pro_type;
          this.detailLoading = false;
        })
        .catch(() => {
          this.detailLoading = false;
        });

      getApproveDetail({ task_id: [row.task.id] }).then(({ data }) => {
        this.path = [...data.msg].filter(item => {
          if (item.task.id === row.task.id) return item;
        })[0].path;
        if (!this.path) {
          this.path = "-";
        }
      });
      this.form_obj = Object.assign(
        {},
        {
          suggestion: "",
          approve_result: 0,
          task_id: row.task.id
        }
      );
      this.$refs["approvelogs"].getApproveLog(row.task.id);
    },
    submitApprove() {
      this.submitLoading = true;
      if (this.checked) {
        //添加提交外网审核字段
        this.form_obj = {
          ...this.form_obj,
          click: "",
          out_suggestion: this.out_suggestion,
          path: this.out_path
        };
      }
      postTaskApprove(this.form_obj)
        .then(res => {
          if (res.data.status === 0) {
            this.tableLoading = true;
            this.$store.dispatch("approve/get_Approve").finally(() => {
              this.tableLoading = false;
            });
            this.isDrawerShow = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    //加班申请的审核
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          postApprove(this.ApproveForm)
            .then(({ data }) => {
              this.$message.success(data.msg);
              this.dialogVisible = false;
              this.getApproves();
            })
            .finally(() => {
              this.submitLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    openDialog({ id }) {
      this.dialogVisible = true;
      this.ApproveForm = Object.assign(
        {},
        {
          id,
          approve_result: "",
          suggestion: ""
        }
      );
    },
    //获取任务审核列表
    getMyApproves() {
      this.tableLoading1 = true;
      this.tableLoading = true;
      this.$store.dispatch("approve/get_Approve").finally(() => {
        this.tableLoading = false;
      });
      this.$store.dispatch("approve/get_ApproveOverTime").finally(() => {
        this.tableLoading1 = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>