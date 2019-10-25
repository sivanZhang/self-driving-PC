<template>
  <el-form :model="formInline" label-position="left" label-width="100px">
    <el-form-item label="待审批成果路径:">
      <el-input v-model="formInline.path" placeholder="请输入待审核的成功文件所在路径..."></el-input>
    </el-form-item>
    <el-form-item class="text-right">
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { taskApprove } from "@/api/task";
export default {
  name: "my-task-approve",
  props: ["row"],
  data() {
    return {
      formInline: {
        dept_id: this.row.task.dept.id,
        task_id: this.row.task.id,
        path: ""
      }
    };
  },
  watch: {
    row: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          let dept=newVal.task.dept;
          let task = newVal.task;
          this.formInline = {
            dept_id: dept.id,
            task_id: task.id,
            path: ""
          };
        }
      }
    }
  },
  methods: {
    //表单提交，提交审核
    submitForm() {
      // console.log("表单");
      // console.log(this.formInline);
        taskApprove(this.formInline).then(res => {
          if (res.data.status === 0) {
            //提交审核成功
            this.$message.success(res.data.msg);
            this.$emit("refresh");
            this.formInline.path="";
            this.$emit("getRow");

          } else {
            this.$message.warning(res.data.msg);
            this.formInline.path="";
            this.$emit("getRow");
          }

        }).catch(err=>{
          
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.text-right {
  text-align: right;
}
</style>