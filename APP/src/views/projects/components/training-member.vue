<!-- 实训成员 -->
<template>
  <div id="training" ref="drawer-parent">
    <el-table
      ref="trainingMenber"
      :data="trainingMenber.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :span-method="objectSpanMethod"
    >
      <el-table-column label="所属分组" prop="name">
        <template slot-scope="scope">
          <div @click="openTeam(scope)" class="links">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="实训人员">
        <template slot-scope="scope">
          <div @click="openRanking(scope.row)" class="links">{{scope.row.username}}</div>
        </template>
      </el-table-column>
      <el-table-column label="学校" prop="school"></el-table-column>
      <el-table-column label="参与任务数量" prop="task_num" align="center"></el-table-column>
      <el-table-column label="考勤" align="center">
        <el-table-column label="正常考勤" prop="normal"></el-table-column>
        <el-table-column label="迟到次数" prop="late"></el-table-column>
        <el-table-column label="早退次数" prop="leave_early"></el-table-column>
        <el-table-column label="旷课次数" prop="absentee"></el-table-column>
      </el-table-column>
      <el-table-column label="总得分" prop="total_score"></el-table-column>
      <el-table-column label="排名" prop="range"></el-table-column>
    </el-table>
    <div class="block" style="text-align: center;margin-top:10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="trainingMenber.length"
      ></el-pagination>
    </div>
    <Drawer
      closable
      draggable
      scrollable
      v-model="isRankingShow"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :title="usernameTitle"
      width="500"
    >
      <MyCharts ref="radar" chart-id="radar-chart" />
      <el-divider />
      <production :teamId="teamId" :projectId="projectId" :user_id="user_id" ref="pro_user" />
    </Drawer>

    <Drawer
      closable
      draggable
      scrollable
      v-model="teamShow"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :title="usernameTitle"
      width="750"
    >
      <div id="training-team">
        <el-row>
          <el-col :span="3">
            <h4>分组：</h4>
          </el-col>
          <el-col :span="8">
            <h4>{{teamTitle}}</h4>
          </el-col>
          <el-col :span="2"></el-col>
          <el-col :span="3">
            <h4>所属学校：</h4>
          </el-col>
          <el-col :span="8">
            <h4>{{teamSchool}}</h4>
          </el-col>
        </el-row>
        <el-divider />
        <el-row>
          <el-col :span="12">
            <label for>任务完成情况</label>
            <PieCharts ref="team-chart" chart-id="team-chart" style="width:350px" />
          </el-col>
          <template v-if="attendanceShow">
          <el-col :span="12">
            <label for>考勤情况</label>
            <PieCharts ref="checkIn-chart" chart-id="checkIn-chart" style="width:320px" />
          </el-col>
          </template>
        </el-row>
        <el-divider />
        <el-row>
          <production :teamId="teamId" :projectId="projectId"  ref="pro_team" />
        </el-row>
      </div>
    </Drawer>
  </div>
</template>  
<script>
import thumbtackMixin from "@/utils/thumbtack-mixin";
import MyCharts from "@/components/ECharts/BaseECharts";
import { trainTask, checkInAll, getRange } from "@/api/statistics";
import production from "@/views/production";
import PieCharts from "@/components/ECharts/PieChart";
export default {
  name: "training-member",
  mixins: [thumbtackMixin],
  components: { MyCharts, production, PieCharts },
  props: ["trainingMenber"],
  data() {
    return {
      projectId: this.$route.params.id,
      usernameTitle: "",
      isRankingShow: false,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      teamShow: false,
      teamTitle: "",
      teamSchool: "",
      activeName: "first",
      teamId: null,
      user_id:null,
      attendanceShow:true
    };
  },
  computed: {
    groupNum() {
      return new Set(this.trainingMenber.map(item => item.name));
    }
  },
  created() {},
  methods: {
    // 打开个人排名抽屉
    openRanking(row) {
      console.log(row)
      this.usernameTitle = row.username;
      this.teamId = row.id;
      this.user_id = row.userid;
      this.isRankingShow = true;
      getRange({
        id: this.$route.params.id,
        userid: row.userid
      }).then(({ data }) => {
        const option = {
          title: {
            text: "实训画像"
          },
          legend: {
            data: ["个人所有排名"],
            left: "center",
            bottom: "0"
          },
          tooltip: {
            trigger: "item",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          radar: {
            indicator: [
              { name: "评分", max: 100 },
              { name: "考勤", max: 100 },
              { name: "提交排名", max: 100 },
              { name: "总排名", max: 100 }
            ],
            radius: "66%",
            center: ["50%", "42%"],
            splitNumber: 5,
            splitArea: {
              areaStyle: {
                opacity: 0.3,
                shadowBlur: 45,
                shadowColor: "rgba(0,0,0,.5)",
                shadowOffsetX: 0,
                shadowOffsetY: 15
              }
            }
          },
          series: [
            {
              type: "radar",
              areaStyle: {
                normal: {
                  shadowBlur: 13,
                  shadowColor: "rgba(0,0,0,.2)",
                  shadowOffsetX: 0,
                  shadowOffsetY: 10,
                  opacity: 0.3
                }
              },
              data: [
                {
                  value: [
                    data.msg.score,
                    data.msg.attendance,
                    data.msg.submittime,
                    data.msg.total
                  ],
                  name: "个人所有排名"
                }
              ]
            }
          ],
          animationDuration: 3000
        };
        this.$nextTick(() => {
          this.$refs.radar.initChart(option);
          this.$refs.pro_user.getPersonProduction();
        });
      });
    },
    Group(name) {
      return this.trainingMenber.filter(item => item.name == name).length;
    },
    NameLen(name) {
      const tmp = Array.from(this.groupNum);
      const index = tmp.indexOf(name);
      let len = 0;
      for (let i = 0; i < index; i++) {
        len += this.Group(tmp[i]);
      }
      return len;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const len = this.Group(row.name);
        const lenName = this.NameLen(row.name);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    //打开分组
    openTeam(scope) {
      this.teamShow = true;
      if (!scope.row.id) {
        this.teamId = -1;
        // scope.row.id = -1
      } else {
        this.teamId = scope.row.id;
      }

      this.teamTitle = scope.row.name;
      this.teamSchool = scope.row.school;
      trainTask({
        project_id: this.$route.params.id,
        teamid: scope.row.id
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.$refs["team-chart"].initChart("", chartData);
      });
      checkInAll({ id: this.$route.params.id, teamid: scope.row.id?scope.row.id:-1 }).then(
        ({ data }) => {
          if(!data.msg.length){
            this.attendanceShow = false;
            return;
          }
          let keys = Object.keys(data.attendance);
          let chartData = keys.map(t => {
            switch (t) {
              case "leave_early":
                return { name: "早退", value: data.attendance[t] };
              case "come_late":
                return { name: "迟到", value: data.attendance[t] };
              case "normal":
                return { name: "正常", value: data.attendance[t] };
              case "absence":
                return { name: "旷课", value: data.attendance[t] };
            }
          });
          this.$refs["checkIn-chart"].initChart("", chartData);
        }
      );
      this.$nextTick(() => {
        this.$refs.pro_team.getProjectTeam();
      });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  }
};
</script>


<style lang='scss' scoped>
#training {
  min-height: calc(100vh - 170px);
}
#training-team {
  position: relative;
  width: 100%;
}
.links {
  color: #2d8cf0;
  cursor: pointer;
}
</style>