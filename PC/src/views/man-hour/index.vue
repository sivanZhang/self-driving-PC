<style lang="scss" scoped>
</style>
<template>
  <div ref="drawer-parent">
    <el-card>
      <template slot="header">
        <el-select v-model="value" placeholder="请选择" style="width:110px" @change="getStatistics()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
      <template slot="header" v-if="this.value == 5">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:200px;"
          @change="getStatistics()"
        ></el-date-picker>
      </template>
      <template v-if="authDaysOff">
        
          <el-row>
            <el-col :span="12">
               <chart ref="man-hour" chart-id="man-hour" v-if="!noneDate"/>
               <label for v-if="noneDate">暂无数据</label>
            </el-col>
            <el-col :span="12">
              <chart ref="dayoff-hour" chart-id="dayoff-hour" v-if="!noneDate2"/>
              <label for v-if="noneDate2">暂无数据</label>
            </el-col>
          </el-row>  
        
      </template>
      <template v-else>
        <chart  ref="man-hour" chart-id="man-hour" v-if="!noneDate"/>
        <label for v-if="noneDate">暂无数据</label>
      </template>
      <el-table :data="projectCount">
        <!-- <el-table-column type="selection" width="55px"></el-table-column> -->
        <el-table-column label="缩略图" align="center" width="80px;" v-if="show_image">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 40px;height: 27px;cursor: pointer;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              v-if="!editing||clickId !== scope.row.id"
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
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="creator_name" label="创建者"></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.date_start|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束日期">
          <template slot-scope="scope">{{scope.row.date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="task_count" label="任务工时"></el-table-column>
        <el-table-column prop="overtime_count" label="加班工时"></el-table-column>
        <el-table-column prop="project_count" label="总工时"></el-table-column>
        <el-table-column label="工时详情" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="font-size:15px"
              icon="el-icon-time"
              @click="showDetail(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <Drawer
      :title="currentPName"
      scrollable
      closable
      v-model="showdrawer"
      width="526"
      :inner="isInner"
      :transfer="false"
      :mask="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="每日工时" name="first">
          <el-table :data="dayManWork" v-loading="detailLoading" border highlight-current-row>
            <el-table-column label="日期">
              <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="work_hours" label="工时"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="任务明细" name="second">
          <div style="overflow-x:auto">
            <el-table :data="taskList" border highlight-current-row>
              <el-table-column label="任务名称" prop="name" show-overflow-tooltip></el-table-column>
              <el-table-column label="制作内容" prop="content" show-overflow-tooltip></el-table-column>
              <el-table-column label="制作环节" prop="dept.name"></el-table-column>
              <!-- <el-table-column label="任务主管" prop="manager.name"></el-table-column> -->
              <el-table-column label="记录工时" prop="record_hour"></el-table-column>
              <el-table-column label="创建时间" prop="create_time" width="90px">
                <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="开始时间" prop="start_date" width="90px">
                <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="结束时间" prop="end_date" width="90px">
                <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="加班明细" name="third">
          <div style="overflow-x:auto">
            <el-table :data="overtime_list" :border="false" highlight-current-row>
              <el-table-column label="申请人" prop="creator.username"></el-table-column>
              <el-table-column label="加班工时" prop="overtime_hour"></el-table-column>
              <el-table-column label="加班原因" prop="reason" show-overflow-tooltip></el-table-column>
              <el-table-column label="相关任务" prop="task" align="center">
                <el-table-column label="任务名称" prop="task.name" show-overflow-tooltip></el-table-column>
                <el-table-column label="制作内容" prop="task.content" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属项目" prop="task.project.name" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属镜头" prop="task.asset.name" show-overflow-tooltip></el-table-column>
              </el-table-column>
              <el-table-column label="创建时间" prop="creator_date" width="90px">
                <template slot-scope="scope">{{scope.row.creator_date|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="开始时间" prop="start_time" width="90px">
                <template slot-scope="scope">{{scope.row.start_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="结束时间" prop="end_time" width="90px">
                <template slot-scope="scope">{{scope.row.end_time|dateFormat}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<script>
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import * as Ajax from "@/api/manHour";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { getDayOffList } from "@/api/checkingIn";
export default {
  name: "my-man-hour",
  mixins: [thumbtackMixin],
  components: { Chart, Gantt },
  data() {
    return {
      detailLoading: false,
      dayManWork: [],
      currentPName: "", //点击详情选中的项目名作为抽屉Title
      showdrawer: false,
      projectCount: [], //我的每个标准项目工时，
      activeName: "first",
      taskList: [], //任务明细
      overtime_list: [], //加班明细
      authDaysOff: null,
      show_image: true,
      editing: false,
      clickId: null,
      startTime: "",
      endTime: "",
      options: [
        {
          value: "1",
          label: "本周工时"
        },
        {
          value: "2",
          label: "本月工时"
        },
        {
          value: "3",
          label: "最近30天"
        },
        {
          value: "4",
          label: "最近90天"
        },
        {
          value: "5",
          label: "自定义时间"
        }
      ],
      value: "1",
      value1: "",
      noneDate:false,
      noneDate2:false
    };
  },
  methods: {
    showDetail(row) {
      this.currentPName = `${row.name} 工时详情`;
      this.showdrawer = true;
      this.detailLoading = true;
      let data = { project_day_id: row.id };
      let data2 = { project_id: row.id };

      Ajax.getManHour(data)
        .then(({ data }) => {
          this.dayManWork = [...data.msg.date_list];
        })
        .finally(() => {
          this.detailLoading = false;
        });
      Ajax.getManHour(data2).then(({ data }) => {
        if (data.status === 0) {
          this.taskList = [...data.msg.task_list];
          this.overtime_list = [...data.msg.overtime_list];
        }
      });
    },

    getStatistics(value) {
      var now = new Date(); //当前日期
      var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getFullYear(); //当前年
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/卖萌/dd hh:mm:ss'
      }
      let data = {};
      if (this.value == 1) {
         data = {
          total_count: "",
          start: (this.startTime = new Date(
            nowYear,
            nowMonth,
            nowDay - nowDayOfWeek
          ).toLocaleDateString()),
          end: (this.endTime = now.toLocaleDateString())
        };
      } else if (this.value == 2) {
         data = {
          total_count: "",
          start: (this.startTime = new Date(
            nowYear,
            nowMonth,
            1
          ).toLocaleDateString()),
          end: (this.endTime = new Date().toLocaleDateString())
        };
      } else if (this.value == 3) {
         data = {
          total_count: "",
          start: (this.startTime = new Date(
            nowYear,
            nowMonth - 1,
            nowDay
          ).toLocaleDateString()),
          end: (this.endTime = new Date().toLocaleDateString())
        };
      } else if (this.value == 4) {
        data = {
          total_count: "",
          start: (this.startTime = new Date(
            nowYear,
            nowMonth - 3,
            nowDay
          ).toLocaleDateString()),
          end: (this.endTime = new Date().toLocaleDateString())
        };
      } else {
         data = {
          total_count: "",
          start: (this.startTime = dataFormat(this.value1[0])),
          end: (this.endTime = dataFormat(this.value1[1]))
        };
      }
       Ajax.getMyManHour(data).then(({ data }) => {
          this.projectCount = [...data.project_info];
          if (data.overtime_count === 0 && data.task_count === 0) {
            console.log("nonn")
            this.noneDate = true;
            return;
          } else {
            this.noneDate=false
            let chartData = [
              {
                name: "任务工时",
                value: data.task_count
              },
              {
                name: "加班工时",
                value: data.overtime_count
              }
            ];
            this.$nextTick(()=>{
              this.$refs["man-hour"].initChart("工时统计", chartData);
            })
          }
        });
      
    },
    getDayOff() {
      let payload = { my_daysoff: "" };
      //this.$refs["dayoff-hour"].openLoading();
      getDayOffList(payload).then(({ data }) => {
        this.authDaysOff = data.auth.daysoff_operate;
        if (Object.keys(data.msg).length && data.auth.daysoff_operate) {
          this.noneDate2 = false;
          let Data = data.msg[0].off_count;
          let chartData = [
            {
              name: "已调休时长",
              value: Data.have_off_hour
            },
            {
              name: "可调休时长",
              value: Data.allow_off_hour
            }
          ];
          this.$nextTick(()=>{
            this.$refs["dayoff-hour"].initChart("调休统计", chartData);
          })
          
        } else {
          this.noneDate2 = true;
          return;
        }

        //console.log(data.msg)
      });
    }

    //   getProjectsHour() {
    //     let data = { project_count: "" };
    //     Ajax.getManHour(data).then(({ data }) => {

    //     });
    //   }
  },
  created() {
    this.getStatistics(1);
    this.getDayOff();
  },
  mounted() {
    // getDayOffList({ my_daysoff: "" }).then(({ data }) => {
    //   // console.log(this.authDaysOff);
    // });
  }
};
</script>
