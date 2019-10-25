<template>
  <div id="approve-extra">
    <el-table :data="ApproveOverTime" v-loading="tableLoading">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="overtime_creator.username" label="申请人"></el-table-column>
      <el-table-column prop="task.name" label="加班任务"></el-table-column>
      <el-table-column prop="reason" label="加班原因"></el-table-column>
      <el-table-column prop="overtime_hour" label="加班工时"></el-table-column>
      <el-table-column prop="level" label="审批等级"></el-table-column>
      <el-table-column prop="approver.username" label="审批人"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row.id)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="加班申请" :visible.sync="dialogVisible" width="512px">
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
  </div>
</template>

<script>
import { postApprove } from "@/api/checkingIn";
import { mapState } from "vuex";
export default {
  name: "approve-extra-work",
  data() {
    return {
      ApproveForm: {},
      tableLoading: false,
      submitLoading: false,
      dialogVisible: false,
      rules: {
        approve_result: [
          { required: true, message: "审批结果为必选", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState("approve", ["ApproveOverTime"])
  },
  methods: {
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
    openDialog(id) {
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
    getApproves() {
      this.tableLoading = true;
      this.$store.dispatch("approve/get_ApproveOverTime")
        .finally(() => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.getApproves();
  }
};
</script>

<style>
</style>