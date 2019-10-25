<template>
  <div id="statistics" class="text-center">
    <el-row>
      <el-col :span="5" align="middle">
        <div>
          <label for>项目进度</label>
        </div>
        <div style="margin-top:80px">
          <el-progress type="circle" :percentage="projectProgress" :color="colors" :format="format"></el-progress>
        </div>
      </el-col>
      <el-col :span="8">
        <label for>镜头状态统计</label>
        <!-- 图表组件 -->
        <chart ref="asset-chart" chart-id="asset-chart" />
      </el-col>
      <el-col :span="11">
        <label for>任务状态统计</label>
        <!-- 图表组件 -->
        <chart ref="task-chart" chart-id="task-chart" />
      </el-col>
    </el-row>
    <!-- 燃尽图 -->
    <template v-if="burnShow">
      <el-divider />
      <el-row>
        <!-- <el-col :span="12"> -->
        <LineChart chart-id="line-chart1" ref="line-chart1" />
        <!-- </el-col> -->
      </el-row>
    </template>
    <!-- 提交审核次数和外包数据 -->

    <el-divider />
    <el-row>
      <el-col :span="12">
        <label for>内部工时统计图</label>
        <PieNestedChart
          chart-id="line-chart2-loopInner2"
          ref="line-chart2-loopInner2"
          v-if="inner"
        />
        <chart chart-id="line-chart2-loopInner" ref="line-chart2-loopInner" v-if="!inner" />
      </el-col>
      <el-col :span="12">
        <label for>外部工时统计图</label>
        <PieNestedChart chart-id="line-chart2-loop2" ref="line-chart2-loop2" v-if="outer" />
        <chart chart-id="line-chart2-loop" ref="line-chart2-loop" v-if="!outer" />
      </el-col>
    </el-row>
    <!-- 提交审核次数统计 -->
    <template v-if="show_inner">
      <el-row>
        <el-col :span="12">
          <label for>内审提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-inner" chart-id="commit-inner" />
        </el-col>
        <el-col :span="12">
          <label for>外审提交统计</label>
          <!-- 图表组件 -->
          <chart ref="commit-outer" chart-id="commit-outer" />
        </el-col>
      </el-row>
    </template>
    <template v-if="asssetTask">
      <el-divider />
      <div style="margin-top:40px">
        <el-row>
          <!-- 柱状图组件 -->
          <BarChart ref="task-count" chart-id="task-count" style="height:400px" />
        </el-row>
      </div>
    </template>
    <template v-if="$route.query.type == 0&&showGrade">
      <el-divider />
      <el-row>
        <!-- 柱状图组件 -->
        <BarChart ref="grade" chart-id="grade" style="height:400px" />
      </el-row>
    </template>

    <el-divider />
    <!-- 甘特图组件 -->
    <div class="gantt-header">
      <h4>项目甘特图</h4>
      <div class="query-parent">
        <el-select v-model="deptChoose" multiple placeholder="筛选工种">
          <el-option
            v-for="(item,index) of deptList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getGantt()">开始统计</el-button>
        <el-button type="primary" @click="refreshDept()">重置</el-button>
      </div>
    </div>
    <Gantt
      v-loading="ganttLoading"
      id="gantt"
      :gantt-data="ganttData"
      :customOptions="ganttTasks"
      :customHeaderOption="GanttHeader"
    />
    <!-- 甘特图组件 -->
    <el-divider />
    <div class="gantt-header">
      <h4>人员工时统计</h4>
      <div class="query-parent">
        <el-select v-model="userChoose" multiple laceholder="筛选人员">
          <el-option
            v-for="(item,index) of userList"
            :key="index"
            :label="item.username"
            :value="item.userid"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="userChange()">开始统计</el-button>
        <el-button type="primary" @click="refreshUser()">重置</el-button>
      </div>
    </div>
    <Gantt
      v-loading="ganttStatLoading"
      :gantt-data="ganttStatData"
      :customHeaderOption="customHeaderOption"
      :customOptions="customOptions"
    />
  </div>
</template>

<script>
import * as Ajax from "@/api/statistics";
import Chart from "@/components/ECharts/PieChart";
import Gantt from "@/components/Gantt";
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
import PieNestedChart from "@/components/ECharts/PieNestedChart";
import dayjs from "dayjs";
export default {
  name: "all-statistics",
  components: { Chart, Gantt, LineChart, BarChart, PieNestedChart },
  props: ["click_id"],
  data() {
    return {
      showGrade: true,
      asssetTask: true,
      burnShow: true,
      inner: null,
      outer: null,
      deptList: [],
      deptChoose: [],
      userList: [],
      userChoose: [],
      user: [],
      ganttStatLoading: false,
      ganttLoading: false,
      ganttData: [], // 传给甘特图1的数据
      ganttStatData: [], // 传给甘特图2的数据
      projectProgress: 0,
      HttpParams: {
        // http传参对象
      },
      colors: [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#6f7ad3", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 }
      ],
      show_inner: true,
      show_detail: true,
      //甘特图1的header配置,
      GanttHeader: {
        title: {
          label: ""
        }
      },
      //甘特图2 的header配置,
      customHeaderOption: {
        title: {
          label: ""
        }
      },
      //甘特图2的配置
      customOptions: {
        taskList: {
          //甘特图中的表格配置
          columns: [
            {
              id: 1,
              label: "人员名称",
              value: task => {
                if (task.parentId) {
                  return "";
                } else {
                  return task.name;
                }
              },
              width: 130,
              expander: true // 显示 "+" 拓展图标
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "计划工时",
              value: "preinstall",
              width: 80
            },
            {
              id: 5,
              label: "实际工时",
              value: "actual",
              width: 80
            },
            {
              id: 6,
              label: "进度",
              value: task => `${task.progress}%`,
              width: 80,
              html: true
            }
          ]
        }
      },
      //甘特图1的配置
      ganttTasks: {
        taskList: {
          columns: [
            {
              id: 1,
              label: "工种名称",
              value: "label",
              width: 150
            },
            {
              id: 2,
              label: "开始时间",
              value: task => dayjs(task.start).format("YYYY-MM-DD"),
              width: 100,
              html: true
            },
            {
              id: 3,
              label: "结束时间",
              value: task => dayjs(task.end).format("YYYY-MM-DD"),
              width: 100
            },
            {
              id: 4,
              label: "总工时",
              value: "manhour",
              width: 80
            }
          ]
        }
      }
    };
  },
  methods: {
    //指定进度条文字内容。
    format(percentage) {
      return percentage === 100 ? "完成" : `${percentage}%`;
    },
    //获取项目进度
    getProjectProgress() {
      Ajax.getProjectStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        this.projectProgress = data.msg.replace("%", "") - 0;
      });
    },
    //获取镜头状态统计  并传参调用图表组件的初始化方法
    getAssetStatistics() {
      this.$refs["asset-chart"].openLoading();
      Ajax.getAssetStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.$refs["asset-chart"].initChart("", chartData);
      });
    },
    //获取任务状态统计  并传参调用图表组件的初始化方法
    getTaskStatistics() {
      this.$refs["task-chart"].openLoading();
      Ajax.getTaskStatistic({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        let keys = Object.keys(data.msg);
        let chartData = keys.map(t => {
          return { name: t, value: data.msg[t] };
        });
        this.$refs["task-chart"].initChart("", chartData);
      });
    },
    //获取项目参与人员
    getUser() {
      Ajax.getProjectMember({ id: this.$route.params.id, members: "" }).then(
        ({ data }) => {
          this.userList = [...data.msg];
        }
      );
    },
    userChange() {
      this.user = [];
      this.userList.forEach(item => {
        this.userChoose.forEach(t => {
          if (t === item.userid) {
            this.user.push({ name: item.username });
          }
        });
      });
      // console.log(this.user);
      // this.user =Array.from(this.user);
      // console.log(this.user)
      this.getganttStat();
    },
    //重置人员甘特图
    refreshUser() {
      this.userChoose = [];
      this.user = [];
      this.getganttStat();
    },
    //获取甘特图2数据--人员
    getganttStat() {
      this.ganttStatLoading = true;
      this.ganttStatData = [];
      Ajax.getingExecutorChart({
        id: this.click_id ? this.click_id : this.$route.params.id,
        executors: ""
      })
        .then(({ data }) => {
          let arr = [...data.msg];
          if (this.user.length) {
            // this.ganttStatData = [];
            arr.map((t, i) => {
              this.user.forEach(item => {
                if (t[1] === item.name) {
                  let obj = {
                    id: t[0], // *
                    type: "task", // * 甘特图内图形显示类型
                    start: t[2] * 1000, // *任务开始时间
                    end: t[3] * 1000,
                    progress: t[5] || 0, // *进度
                    duration: t[4] * 60 * 60 * 1000, // *工时
                    label: `${t[1]} (${t[5] || 0}%)`, // *
                    collapsed: false, // * 有子节点默认是否收缩
                    name: t[1],
                    preinstall: t[4],
                    actual: t[6]
                  };
                  if (t[7]) {
                    obj.parentId = t[7];
                  }
                  this.ganttStatData.push(obj);
                }
              });
            });
          } else {
            this.ganttStatData = [];
            this.ganttStatData = arr.map((t, i) => {
              let obj = {
                id: t[0], // *
                type: "task", // * 甘特图内图形显示类型
                start: t[2] * 1000, // *任务开始时间
                end: t[3] * 1000,
                progress: t[5] || 0, // *进度
                duration: t[4] * 60 * 60 * 1000, // *工时
                label: `${t[1]} (${t[5] || 0}%)`, // *
                collapsed: false, // * 有子节点默认是否收缩
                name: t[1],
                preinstall: t[4],
                actual: t[6]
              };
              if (t[7]) {
                obj.parentId = t[7];
              }
              return obj;
            });
          }
          // console.log(this.ganttStatData);
        })
        .finally(() => {
          this.ganttStatLoading = false;
        });
    },

    //重置部门甘特图
    refreshDept() {
      this.deptChoose = [];
      this.getGantt();
    },
    //获取甘特图1数据
    getGantt() {
      this.ganttData = [];
      this.ganttLoading = true;
      Ajax.getGanttData({
        id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        const arr = [...data.msg];
        //获取项目的部门信息
        this.deptList = arr.map(t => {
          return {
            id: t.deptid,
            name: t.deptname
          };
        });
        this.ganttLoading = false;

        if (this.deptChoose.length) {
          // this.ganttData = [];
          arr.map((t, i, Arr) => {
            this.deptChoose.forEach(item => {
              if (t.deptid === item) {
                // console.log(t)
                this.ganttData.push({
                  id: t.deptid,
                  label: t.deptname,
                  type: "task", //线条样式
                  start: t.start * 1000, //开始时间
                  end: t.end * 1000, //结束时间
                  duration: t.last * 60 * 60 * 1000,
                  manhour: t.last
                });
              }
            });
          });
        } else {
          this.ganttData = [];
          arr.map((t, i, Arr) => {
            // console.log(t)
            this.ganttData.push({
              id: t.deptid,
              label: t.deptname,
              type: "task", //线条样式
              start: t.start * 1000, //开始时间
              end: t.end * 1000, //结束时间
              duration: t.last * 60 * 60 * 1000, //工时
              manhour: t.last
            });
          });
        }

        // console.log(this.ganttData);
      });
    },
    //获取燃尽图数据
    getBurnOut() {
      // this.$refs["line-chart1"].openLoading();
      Ajax.burnOut({
        id: this.click_id ? this.click_id : this.$route.params.id,
        bourout: ""
      }).then(({ data }) => {
        if (data.status === 0) {
          if (!data.dates.length) {
            this.burnShow = false;
            return;
          }
          let customOption = {
            title: {
              top: 20,
              text: "项目燃尽图",
              textStyle: {
                fontWeight: 600,
                fontSize: 16
              },
              left: "left",
              top: 0
            },
            tooltip: {
              trigger: "axis"
            },
            legend: {
              //图例
              data: ["计划工作时长", "实际工作时长"], // 名字
              tooltip: {
                show: true
              }
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                data: data.dates
              }
            ],
            yAxis: [
              {
                type: "value"
                /* name: "(%)", */
              }
            ],
            series: [
              // 线数据
              {
                name: "计划工作时长",
                type: "line",
                smooth: true,
                showSymbol: true,
                data: data.plan_worktimes
              },
              {
                name: "实际工作时长",
                type: "line",
                smooth: true, // 是否曲线
                showSymbol: true, // 是否显示点
                data: data.real_worktimes
              }
            ]
          };
          this.$refs["line-chart1"].initChart(customOption);
        }
      });
    },
    //外包数据
    exportData() {
      Ajax.exportTask({
        id: this.click_id ? this.click_id : this.$route.params.id,
        worktime: ""
      }).then(({ data }) => {
        // console.log(data.msg);
        let keys = Object.keys(data.msg);

        if (
          data.msg.plan_inner == 0 &&
          data.msg.plan_outsource == 0 &&
          data.msg.real_inner == 0 &&
          data.msg.real_outsource == 0
        ) {
          //两个饼图
          this.inner = false;
          this.outer = false;
          let chartData_loop = keys.map(t => {
            switch (t) {
              case "plan_outsource":
                return { name: "外包总计划", value: data.msg[t] };

              case "real_outsource":
                return { name: "外包总实际", value: data.msg[t] };
            }
          });
          let chartData_loopInner = keys.map(t => {
            switch (t) {
              case "plan_inner":
                return { name: "内部总计划", value: data.msg[t] };

              case "real_inner":
                return { name: "内部总实际", value: data.msg[t] };
            }
          });
          this.$nextTick(() => {
            this.$refs["line-chart2-loop"].initChart("", chartData_loop);
            this.$refs["line-chart2-loopInner"].initChart(
              "",
              chartData_loopInner
            );
          });
          return;
        } else if (
          (data.msg.plan_inner !== 0 || data.msg.real_inner !== 0) &&
          (data.msg.plan_outsource !== 0 || data.msg.real_outsource !== 0)
        ) {
          //两个环形图
          this.inner = true;
          this.outer = true;
          let obj = [
            ...Object.keys(data.msg.outsource_plan_depts),
            ...Object.keys(data.msg.outsource_real_depts)
          ];
          let objInner = [
            ...Object.keys(data.msg.plan_depts),
            ...Object.keys(data.msg.real_depts)
          ];
          let values = [
            ...Object.values(data.msg.outsource_plan_depts),
            ...Object.values(data.msg.outsource_real_depts)
          ];
          let valuesInner = [
            ...Object.values(data.msg.plan_depts),
            ...Object.values(data.msg.real_depts)
          ];
          let chartData = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: obj
            },
            series: [
              {
                name: "工时",
                type: "pie",
                selectedMode: "single",
                radius: [0, "30%"],

                label: {
                  normal: {
                    position: "inner"
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: keys.map(t => {
                  switch (t) {
                    case "plan_outsource":
                      return { name: "外包总计划", value: data.msg[t] };
                    case "real_outsource":
                      return { name: "外包总实际", value: data.msg[t] };
                  }
                })
              },
              {
                name: "工时",
                type: "pie",
                radius: ["40%", "55%"],
                data: obj.map((t, index) => {
                  return { name: t, value: values[index] };
                })
              }
            ]
          };
          let chartData_inner = {
            tooltip: {
              trigger: "item",
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: "vertical",
              x: "left",
              data: objInner
            },
            series: [
              {
                name: "工时",
                type: "pie",
                selectedMode: "single",
                radius: [0, "30%"],

                label: {
                  normal: {
                    position: "inner"
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: keys.map(t => {
                  switch (t) {
                    case "plan_inner":
                      return { name: "内部总计划", value: data.msg[t] };
                    case "real_inner":
                      return { name: "内部总实际", value: data.msg[t] };
                  }
                })
              },
              {
                name: "工时",
                type: "pie",
                radius: ["40%", "55%"],
                data: objInner.map((t, index) => {
                  return { name: t, value: valuesInner[index] };
                })
              }
            ]
          };
          this.$nextTick(() => {
            this.$refs["line-chart2-loopInner2"].initChart(chartData_inner);
            this.$refs["line-chart2-loop2"].initChart(chartData);
          });
        } else {
          if (
            data.msg.plan_inner == 0 &&
            data.msg.real_inner == 0 &&
            (data.msg.plan_outsource !== 0 || data.msg.real_outsource !== 0)
          ) {
            //内部为饼图，外部为环形图
            this.inner = false;
            this.outer = true;
            let obj = [
              ...Object.keys(data.msg.outsource_plan_depts),
              ...Object.keys(data.msg.outsource_real_depts)
            ];
            let values = [
              ...Object.values(data.msg.outsource_plan_depts),
              ...Object.values(data.msg.outsource_real_depts)
            ];
            let chartData_loopInner = keys.map(t => {
              switch (t) {
                case "plan_inner":
                  return { name: "内部总计划", value: data.msg[t] };

                case "real_inner":
                  return { name: "内部总实际", value: data.msg[t] };
              }
            });
            let chartData = {
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                x: "left",
                data: obj
              },
              series: [
                {
                  name: "工时",
                  type: "pie",
                  selectedMode: "single",
                  radius: [0, "30%"],

                  label: {
                    normal: {
                      position: "inner"
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: keys.map(t => {
                    switch (t) {
                      case "plan_outsource":
                        return { name: "外包总计划", value: data.msg[t] };
                      case "real_outsource":
                        return { name: "外包总实际", value: data.msg[t] };
                    }
                  })
                },
                {
                  name: "工时",
                  type: "pie",
                  radius: ["40%", "55%"],
                  data: obj.map((t, index) => {
                    return { name: t, value: values[index] };
                  })
                }
              ]
            };
            this.$nextTick(() => {
              this.$refs["line-chart2-loopInner"].initChart(
                "",
                chartData_loopInner
              );
              this.$refs["line-chart2-loop2"].initChart(chartData);
            });
          } else {
            //内部为环形图，外部为饼图
            this.inner = true;
            this.outer = false;
            let objInner = [
              ...Object.keys(data.msg.plan_depts),
              ...Object.keys(data.msg.real_depts)
            ];

            let valuesInner = [
              ...Object.values(data.msg.plan_depts),
              ...Object.values(data.msg.real_depts)
            ];
            let chartData_inner = {
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                orient: "vertical",
                x: "left",
                data: objInner
              },
              series: [
                {
                  name: "工时",
                  type: "pie",
                  selectedMode: "single",
                  radius: [0, "30%"],

                  label: {
                    normal: {
                      position: "inner"
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: keys.map(t => {
                    switch (t) {
                      case "plan_inner":
                        return { name: "内部总计划", value: data.msg[t] };
                      case "real_inner":
                        return { name: "内部总实际", value: data.msg[t] };
                    }
                  })
                },
                {
                  name: "工时",
                  type: "pie",
                  radius: ["40%", "55%"],
                  data: objInner.map((t, index) => {
                    return { name: t, value: valuesInner[index] };
                  })
                }
              ]
            };
            let chartData_loop = keys.map(t => {
              switch (t) {
                case "plan_outsource":
                  return { name: "外包总计划", value: data.msg[t] };

                case "real_outsource":
                  return { name: "外包总实际", value: data.msg[t] };
              }
            });
            this.$nextTick(() => {
              this.$refs["line-chart2-loopInner2"].initChart(chartData_inner);
              this.$refs["line-chart2-loop"].initChart("", chartData_loop);
            });
          }
        }
      });
    },
    //获取项目提交次数统计数据
    getCommitCount() {
      Ajax.proCommitCount({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        if (!data.inner_num.length) {
          this.show_inner = false;
        }
        let chartData = data.inner_num.map(t => {
          return { name: t.submit_name, value: t.num };
        });
        let chartData2 = data.out_num.map(t => {
          return { name: t.submit_name, value: t.num };
        });
        this.$refs["commit-inner"].initChart("", chartData);
        this.$refs["commit-outer"].initChart("", chartData2);
      });
    },
    //统计项目成员的资产和任务信息
    getAssetTask() {
      Ajax.statisticMemberDetail({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        if (!data.user_id_list.length) {
          this.asssetTask = false;
          return;
        }
        let keys = Object.keys(data.task);
        let keys2 = Object.keys(data.user_asset);
        let customOption = {
          title: {
            text: "镜头和任务分布",
            textStyle: {
              //---主标题内容样式
              color: "#000"
              // height:"50px"
            },
            padding: [3, 0, 100, 100] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["镜头个数", "任务个数"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: keys,
              axisLabel: {
                //---坐标轴 标签
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 0,
                margin: 5 //---刻度标签与轴线之间的距离
                //color:'red',				//---默认取轴线的颜色
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "镜头个数",
              type: "bar",
              barWidth: 30,
              data: keys2.map(t => {
                return data.user_asset[t];
              })
            },
            {
              name: "任务个数",
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              data: keys.map(t => {
                return data.task[t];
              })
            }
          ]
        };
        // let chartData2 =
        this.$refs["task-count"].initChart(customOption);
        // this.$refs["asset-count"].initChart("", chartData2);
      });
    },
    //成绩变化
    getGradeChange() {
      Ajax.MemberSort({
        project_id: this.click_id ? this.click_id : this.$route.params.id
      }).then(({ data }) => {
        if (!data.sorted_grade.length) {
          this.showGrade = false;
          return;
        }
        let keys = Object.keys(data.sum_grade);
        // console.log("2222");
        // console.log(keys)
        let customOption = {
          title: {
            text: "总成绩排名",
            textStyle: {
              //---主标题内容样式
              color: "#000"
            },
            padding: [0, 0, 100, 100] //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["总成绩"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: keys,
              axisLabel: {
                //---坐标轴 标签
                show: true, //---是否显示
                inside: false, //---是否朝内
                interval: 0,
                rotate: 0,
                margin: 5 //---刻度标签与轴线之间的距离
                //color:'red',				//---默认取轴线的颜色
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "成绩",
              type: "bar",
              barWidth: 30,
              barMaxWidth: 50,
              data: keys.map(t => {
                return data.sum_grade[t];
              })
            }
          ]
        };
        // let chartData2 =
        this.$refs["grade"].initChart(customOption);
      });
    }
  },
  created() {
    this.getUser();
  },
  mounted() {
    this.getProjectProgress();
    this.getGantt();
    this.getganttStat();
    this.getAssetStatistics();
    this.getTaskStatistics();
    this.getBurnOut();
    this.exportData();
    this.getCommitCount();
    this.getAssetTask();
    this.getGradeChange();
  }
};
</script>
<style lang="scss" scoped>
#statistics {
  position: relative;
  width: 100%;
}
.el-select {
  width: 180px;
}

.gantt-header {
  position: relative;
  .query-parent {
    position: absolute;
    bottom: -40px;
    text-align: left;
  }
}
</style>