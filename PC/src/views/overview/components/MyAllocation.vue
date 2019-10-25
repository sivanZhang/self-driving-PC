<template>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="sceneNeed.length" :hidden="!sceneNeed.length" :max="99" class="item">
        <span style="padding-right: 10px;">待分配镜头</span>
      </el-badge>
      <el-button @click="$router.push({path:'/team-manager/team-manager'})" type="text">查看更多</el-button>
    </el-row>
    <el-table :data="sceneNeed">
        <el-table-column label="镜头号" prop="name" show-overflow-tooltip class-name="links">
        <template slot-scope="scope">
          <span @click="showDrawer(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" class-name="links" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link
            :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
          >{{scope.row.project.name}}</router-link>
        </template>
      </el-table-column>
      
    </el-table>
    <Drawer
    ref="drawer"
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      inner
      title="制作环节"
    >
      <div style="display:flex;overflow:auto">
        <el-steps
          direction="vertical"
          :active="1"
          style="width:250px;display:flex；justify-content:flex-start"
          v-for="(todo,Index) of link"
          :key="Index"
        >
          <el-step v-for="item of todo" :key="item.link_id" status="process" style="width:250px">
            <div slot="title" style="font-size:14px;display:flex;justify-content:flex-start">
              {{item.dept.name}}
              <template
                v-if="deptList.filter(todo=>{  return todo.id === item.dept.id}).length"
              >
                <el-tooltip effect="dark" content="添加任务" placement="top">
                  <span style="padding-left:5px">
                    <i
                      class="el-icon-plus"
                      style="color:blue"
                      @click="showTaskForm(item.link_id,item.dept.id,item.content,item.date_and_user)"
                    ></i>
                  </span>
                </el-tooltip>
              </template>
            </div>
            <ul slot="description" style="width:250px;">
              <li>制作要求: {{item.content}}</li>
              <template>
                <li>开始日期: {{item.date_and_user.date_start|dateFormat}}</li>
                <li>截止日期: {{item.date_and_user.date_end|dateFormat}}</li>
              </template>
            </ul>
          </el-step>
        </el-steps>
      </div>
    </Drawer>
    <el-dialog title="添加任务" :visible.sync="isCreateTaskShow" width="512px" center :modal="false">
      <el-form :model="TaskForm" :rules="rules" ref="TaskForm" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环节时间">
          <el-row style="padding-left:10px;font-size: 12px;">
            <el-col :span="6">{{linkstart|dateFormat}}</el-col>
            <el-col :span="3">
              <span>至</span>
            </el-col>
            <el-col :span="15">{{linkend|dateFormat}}</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            @change="changeTime()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancelTask">取消</el-button>
          <el-button :loading="createTaskLoading" type="primary" @click="addTasks">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { allocationScene } from "@/api/assets";
import { getLinks } from "@/api/links";
import { getDept } from "@/api/admin";
import { addTask } from "@/api/task";
import myMixin from "@/views/projects/components/mixins";
export default {
  mixins:[myMixin],
  data() {
    return {
      sceneNeed: [],
      value1:false,
      assetId: null,
      assetName: null,
      link:[],
      deptList: this.$store.state.login.userInfo.dept,
      isCreateTaskShow:false,
      TaskForm: {},
      rules: {
                name: [{
                    required: true,
                    message: "请输入任务名称",
                    trigger: "blur"
                }],
                priority: [{
                    required: true,
                    message: "请输入优先等级",
                    trigger: "blur"
                }],
                content: [{
                    required: true,
                    message: "请输入任务内容",
                    trigger: "blur"
                }],
                executorlist: [{
                    required: true,
                    message: "请输入任务执行人",
                    trigger: "blur"
                }],
                total_hour: [{
                    required: true,
                    message: "请输入总工时",
                    trigger: "blur"
                }],
                datetime: [{
                    required: true,
                    message: "请输入任务时间",
                    trigger: "blur"
                }]
            },
            DeptUsers: [],
            linkstart: null,
            linkend: null,
            createTaskLoading:false,
    };
  },
  created() {
    this.getScene();
  },
  methods: {
    change() {
      this.$forceUpdate();
    },
    //总工时默认值
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24);
      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour
      };
    },
    //给某一环节添加任务
    addTasks() {
      this.$refs["TaskForm"].validate(valid => {
        if (valid) {
          this.createTaskLoading = true;
          function dataFormat(params) {
            return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
          }
          let data = {
            ...this.TaskForm,
            start_date: dataFormat(this.TaskForm.datetime[0]),
            end_date: dataFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          addTask(data)
            .then(({ data }) => {
              this.createTaskLoading = false;
              this.$message.success(data.msg);
              if (data.status === 0) {
                this.cancelTask();
                this.isDialogShow = false;
                this.value1 = false;
                this.getScene();
              }
            })
            .catch(err => {
              this.createTaskLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    //取消对话框
    cancelTask() {
      this.isCreateTaskShow = false;
      this.TaskForm = {};
    },
    showTaskForm(link_id, dept_id, content, date_and_user) {
      getDept({
        id: dept_id
      }).then(res => {
        this.DeptUsers = [...res.data.users];
        //console.log(this.DeptUsers);
      });
      this.isCreateTaskShow = true;
      this.TaskForm = Object.assign(
        {},
        {
          priority: 0,
          grade: 0,
          asset: this.assetId,
          project: this.$route.params.id,
          link_id,
          content
        }
      );
      const linkdatastart = date_and_user.date_start;
      const linkdataend = date_and_user.date_end;
      this.linkstart = linkdatastart;
      this.linkend = linkdataend;
      // const data = this.assetTaskList.filter(item => {
      //   return item.asset.id === this.TaskForm.asset;
      // });
      this.TaskForm.name = this.assetName;
    },
    showDrawer(row) {
      this.value1 = true;
      this.assetId = row.id;
      this.assetName = row.name;
      
      getLinks({ asset: row.id }).then(({ data }) => {
        this.link = [...data.msg];
      });
    },
    getScene() {
      allocationScene().then(({ data }) => {
        this.sceneNeed = [...data.need];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>