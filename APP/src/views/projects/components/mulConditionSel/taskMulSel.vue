<!-- 任务多条件筛选 -->
<template>
  <el-tooltip class="item" effect="dark" content="多条件筛选" placement="top">
    <el-popover v-model="visible2" placement="bottom" width="600" trigger="click">
      <el-form ref="sortSelForm" :model="sortSelForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务" prop="name">
              <el-input v-model="sortSelForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="制作环节" prop="dept">
              <el-input v-model="sortSelForm.dept"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="制作内容" prop="content">
              <el-input v-model="sortSelForm.content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人" prop="user">
              <el-input v-model="sortSelForm.user"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="sortSelForm.priority" multiple placeholder="请选择">
                <el-option label="低级" :value="0"></el-option>
                <el-option label="中级" :value="1"></el-option>
                <el-option label="高级" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务难度" prop="grade">
              <el-select v-model="sortSelForm.grade" multiple placeholder="请选择">
                <el-option label="简单" :value="0"></el-option>
                <el-option label="标准" :value="1"></el-option>
                <el-option label="困难" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="sortSelForm.status" multiple placeholder="请选择">
                <el-option label="暂停" :value="0"></el-option>
                <el-option label="未开始" :value="1"></el-option>
                <el-option label="进行中" :value="2"></el-option>
                <el-option label="审核中" :value="3"></el-option>
                <el-option label="完成" :value="4"></el-option>
                <el-option label="超时" :value="5"></el-option>
                <el-option label="审核通过" :value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总工时" prop="total_hour">
              <el-input v-model="sortSelForm.total_hour"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="开始日期" prop="start">
            <div style="display:flex">
              <el-col :span="11">
                <el-date-picker v-model="sortSelForm.start" type="date"></el-date-picker>
              </el-col>
              <el-col :span="2" align="center">
                <span style="padding-top:3px">至</span>
              </el-col>
              <el-col :span="11" align="right">
                <el-date-picker v-model="sortSelForm.start2" type="date"></el-date-picker>
              </el-col>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="结束日期" prop="end">
            <div style="display:flex">
              <el-col :span="11">
                <el-date-picker v-model="sortSelForm.end" type="date"></el-date-picker>
              </el-col>
              <el-col :span="2" align="center">
                <span style="padding-top:3px">至</span>
              </el-col>
              <el-col :span="11" align="right">
                <el-date-picker v-model="sortSelForm.end2" type="date"></el-date-picker>
              </el-col>
            </div>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col align="right">
            <el-button type="primary" @click="MulSel()">筛选</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        slot="reference"
        type="primary"
        style="margin-left: 15px"
        size="mini"
        @click="showMul()"
      >筛选</el-button>
    </el-popover>
  </el-tooltip>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "taskMulSel",
  components: {},
  data() {
    return {
      visible2: false,
      sortSelForm: {},
      showMulChoose: [],
     
    };
  },
  watch: {},
  methods: {
    MulSel() {
      this.mulChoose = true;
      this.visible2 = false;
      function dateFormat(dateVal) {
        return new dayjs(dateVal).format("YYYY/MM/DD");
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.sortSelForm.name) {
        this.showMulChoose.name = this.sortSelForm.name;
      }
      if (this.sortSelForm.dept) {
        this.showMulChoose.dept = this.sortSelForm.dept;
      }
      if (this.sortSelForm.content) {
        this.showMulChoose.content = this.sortSelForm.content;
      }
      if (this.sortSelForm.user) {
        this.showMulChoose.user = this.sortSelForm.user;
      }
      if (this.sortSelForm.total_hour) {
        this.showMulChoose.total_hour = this.sortSelForm.total_hour;
      }
      if (this.sortSelForm.grade) {
        if (this.sortSelForm.grade.length === 0) {
          delete this.sortSelForm.grade;
        } else {
          this.showMulChoose.grade = this.sortSelForm.grade;
          this.sortSelForm.grade = "[" + String(this.sortSelForm.grade) + "]";
        }
      }
      if (this.sortSelForm.priority) {
        if (this.sortSelForm.priority.length === 0) {
          delete this.sortSelForm.priority;
        } else {
          this.showMulChoose.priority = this.sortSelForm.priority;
          this.sortSelForm.priority =
            "[" + String(this.sortSelForm.priority) + "]";
        }
      }
      if (this.sortSelForm.status) {
        if (this.sortSelForm.status.length === 0) {
          delete this.sortSelForm.status;
        } else {
          this.showMulChoose.status = this.sortSelForm.status;
          this.sortSelForm.status = "[" + String(this.sortSelForm.status) + "]";
        }
      }
      if (this.sortSelForm.start || this.sortSelForm.start2) {
        if (this.sortSelForm.start && !this.sortSelForm.start2) {
          this.showMulChoose.start = dateFormat(this.sortSelForm.start);
          this.sortSelForm.start =
            dateFormat(this.sortSelForm.start) + "," + "";
        } else if (!this.sortSelForm.start && this.sortSelForm.start2) {
          this.showMulChoose.start = dateFormat(this.sortSelForm.start2);
          this.sortSelForm.start =
            "" + "," + dateFormat(this.sortSelForm.start2);
        } else {
          this.showMulChoose.start =
            dateFormat(this.sortSelForm.start) +
            "至" +
            dateFormat(this.sortSelForm.start2);
          this.sortSelForm.start =
            dateFormat(this.sortSelForm.start) +
            "," +
            dateFormat(this.sortSelForm.start2);
        }
        delete this.sortSelForm.start2;
      }
      if (this.sortSelForm.end || this.sortSelForm.end2) {
        if (this.sortSelForm.end && !this.sortSelForm.end2) {
          this.showMulChoose.end = dateFormat(this.sortSelForm.end);
          this.sortSelForm.end = dateFormat(this.sortSelForm.end) + "," + "";
        } else if (!this.sortSelForm.end && this.sortSelForm.end2) {
          this.showMulChoose.end = dateFormat(this.sortSelForm.end2);
          this.sortSelForm.end = "" + "," + dateFormat(this.sortSelForm.end2);
        } else {
          this.showMulChoose.end =
            dateFormat(this.sortSelForm.end) +
            "至" +
            dateFormat(this.sortSelForm.end2);
          this.sortSelForm.end =
            dateFormat(this.sortSelForm.end) +
            "," +
            dateFormat(this.sortSelForm.end2);
        }
        delete this.sortSelForm.end2;
      }
      this.$emit("refresh_sortMul", this.sortSelForm, 1);
      this.$emit("filterCondition", this.showMulChoose, this.sortSelForm);
    },
    showMul() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
      this.$emit("selRefresh")
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>