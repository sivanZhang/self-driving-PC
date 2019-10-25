<!-- 组长任务分配 -->
<template>
  <div id="team-manager" ref="drawer-parent">
    <el-tabs v-model="activeName">
      <el-tab-pane label="未分配镜头" name="first">
        <el-table
          ref="sceneNeed"
          :data="sceneNeed"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :cell-style="{borderRight:0}"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :border="false"
          v-loading="tableLoading"
        >
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column label="项目名称" class-name="links" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link
                :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
              >{{scope.row.project.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="镜头号" prop="name" show-overflow-tooltip class-name="links">
            <template slot-scope="scope">
              <span @click="showDrawer(scope.row)">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="缩略图" prop="image">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.image"
                style="width: 55px;height: 33px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="session" label="场次" align="center"></el-table-column>
          <el-table-column prop="episode" label="集数" align="center"></el-table-column>
          <el-table-column prop="frame" label="帧数" align="left"></el-table-column>
          <el-table-column prop="frame_range" label="帧数范围" align="left" width="120px"></el-table-column>
          <el-table-column prop="reference" label="制作参考" align="left" width="120px"></el-table-column>
          <el-table-column prop="report" label="画面调整信息" align="left" width="120px"></el-table-column>
          <el-table-column prop="retime" label="变速信息" align="left"></el-table-column>
          <el-table-column prop="content" label="制作内容" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
          </el-table-column>
          <el-table-column prop="level" label="难度等级">
            <template slot-scope="scope">{{scope.row.level|Level}}</template>
          </el-table-column>
          <el-table-column label="当前环节" align="center" width="160px">
            <el-table-column prop="link" label="工种" align="left">
              <template slot-scope="scope">
                <div v-for="(todo,index) of scope.row.link" :key="index">{{todo.name}}</div>
              </template>
            </el-table-column>
            <el-table-column label="截止日期" align="left" width="95px">
              <template slot-scope="scope">
                <div
                  v-for="(todo,index) of scope.row.link"
                  :key="index"
                  style="position:top"
                >{{todo.date_end|dateFormat}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="创建日期" align="left" width="160px" prop="date">
            <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hours" label="总工时" align="left"></el-table-column>
          <el-table-column prop="remark" label="备注" align="left"></el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizeList"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :page-count="pageCount"
            :total="total"
            style="margin-top:10px"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已分配镜头" name="second">
        <el-table
          ref="sceneUnneed"
          :data="sceneUnneed"
          :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
          :cell-style="{borderRight:0}"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :border="false"
           v-loading="tableLoading"
        >
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column label="项目名称" class-name="links" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link
                :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
              >{{scope.row.project.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="镜头号" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="缩略图" prop="image">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.image"
                style="width: 55px;height: 33px;cursor: pointer; display:block;"
                :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="session" label="场次" align="center"></el-table-column>
          <el-table-column prop="episode" label="集数" align="center"></el-table-column>
          <el-table-column prop="frame" label="帧数" align="left"></el-table-column>
          <el-table-column prop="frame_range" label="帧数范围" align="left" width="120px"></el-table-column>
          <el-table-column prop="reference" label="制作参考" align="left" width="120px"></el-table-column>
          <el-table-column prop="report" label="画面调整信息" align="left" width="120px"></el-table-column>
          <el-table-column prop="retime" label="变速信息" align="left"></el-table-column>
          <el-table-column prop="content" label="制作内容" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="priority" label="优先级">
            <template slot-scope="scope">{{scope.row.priority|Priority}}</template>
          </el-table-column>
          <el-table-column prop="level" label="难度等级">
            <template slot-scope="scope">{{scope.row.level|Level}}</template>
          </el-table-column>
          <el-table-column label="执行人" prop="executor_list">
            <template slot-scope="scope">
              <el-row v-for="(item,index) of scope.row.executor_list" :key="index">
                <el-col>{{item.name}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" align="left" width="160px" prop="date">
            <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hours" label="总工时" align="left"></el-table-column>
          <el-table-column prop="remark" label="备注" align="left"></el-table-column>
        </el-table>
        <div class="block" style="text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage2"
            :page-sizes="pageSizeList2"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :page-count="pageCount2"
            :total="total2"
            style="margin-top:10px"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <Drawer
    ref="drawer"
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
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

    <!-- 添加任务 -->
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
  </div>
</template>

<script>
import { allocationScene } from "@/api/assets";
import thumbtackMixin from "@/mixins/thumbtack-mixin";
import myMixin from "@/views/projects/components/mixins";
import { getLinks } from "@/api/links";
import { getDept } from "@/api/admin";
import { addTask } from "@/api/task";
export default {
  mixins: [myMixin, thumbtackMixin],
  name: "team-manager",
  components: {},
  data() {
    return {
      activeName: "first",
      sceneNeed: [],
      sceneUnneed: [],
      multipleSelection: [],
      value1: false,
      deptUser: [],
      link: null,
      deptList: this.$store.state.login.userInfo.dept,
      DeptUsers: [],
      isCreateTaskShow: false,
      createTaskLoading: false,
      TaskForm: {},
      linkstart: null,
      linkend: null,
      assetId: null,
      assetName: null,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      currentPage2: 1,
      pageSize2: 20,
      pageSizeList2: [20, 30, 50, 100],
      total: 0,
      total2: 0,
      pageCount: 0,
      pageCount2: 0,
      tableLoading: false //表格加载状态
    };
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getScene();
        }
      }
    }
  },
  methods: {
    //展示添加任务表单
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
    //取消对话框
    cancelTask() {
      this.isCreateTaskShow = false;
      this.TaskForm = {};
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
    change() {
      this.$forceUpdate();
    },
    showDrawer(row) {
      this.value1 = true;
      this.assetId = row.id;
      this.assetName = row.name;
      getLinks({ asset: row.id }).then(({ data }) => {
        this.link = [...data.msg];
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    getScene() {
      this.sceneNeed = [];
      this.sceneUnneed =[];
      let payload = {
        pagenum: this.activeName=="first"?this.pageSize:this.pageSize2,
        page: this.activeName=="first"?this.currentPage:this.currentPage2
      };
      this.tableLoading = true;
      allocationScene(payload).then(({ data }) => {
       
        
        if (this.activeName == "first") {
           this.sceneNeed = [...data.need];
          this.total = data.need_page.count;
          this.pageCount = data.need_page.page_count;
        } else {
          this.sceneUnneed = [...data.not_need];
          this.total2 = data.not_need_page.count;
          this.pageCount2 = data.not_need_page.page_count;
        }

        this.tableLoading = false;
      });
    },
    //分页
    handleSizeChange(val) {
      if (this.activeName == "first") {
        this.pageSize = val;
      } else {
        this.pageSize2 = val;
      }

      this.getScene();
    },
    handleCurrentChange(currentPage) {
      if (this.activeName == "first") {
        this.currentPage = currentPage;
      } else {
        this.currentPage2 = currentPage;
      }
      this.getScene();
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //难度等级格式化显示
    Level: function(row, column) {
      switch (row.level) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "复杂";
          break;
        case 3:
          return "高难度";
          break;
      }
    },
    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    }
  },
  created() {
    this.getScene();
  }
};
</script>
<style lang='scss'>
#team-manager {
  min-height: calc(100vh - 199px);
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}
</style>