import {
  addTaskRecord,
  putTaskRecord,
  queryTaskRecord,
  queryTask,
  getStatusTaskList
} from "@/api/task";
import {
  getHistoryVersion
} from "@/api/assets";
import draggable from "vuedraggable"
import taskForm from './components/task-form'
import tabLog from "./components/tab-log"
import tabApprove from "./components/tab-approve"
import tabTaskDtail from "./components/tab-task-detail"
import history from "@/views/task/components/tab-history"
import approveLog from "@/views/components/approve-log";
import thumbtackMixin from "@/mixins/thumbtack-mixin";
import dayjs from "dayjs";
export default {
  mixins: [thumbtackMixin],
  components: {
    draggable,
    tabApprove,
    taskForm,
    tabLog,
    tabTaskDtail,
    approveLog,
    history
  },
  data() {
    return {
      activeTab: "second",
      TaskDetail: {
        name: ''
      },
      detailLoading: false,
      show_project_image: true,
      logsLoading: false,
      LogList: [],
      isDrag: false,
      isDrawerShow: false,
      StatusList: [{
        label: '暂停',
        value: 0
      }, {
        label: '未开始',
        value: 1
      }, {
        label: '进行中',
        value: 2
      }],
      createLoading: false,
      TaskRecord: [],
      isDialogShow: false,
      MyTaskList: [],
      MyTaskList1: [],
      DraftArr: [],
      InProgressArr: [],
      TimeOutArr: [],
      FinishedArr: [],
      PauseArr: [],
      // PassArr : [],
      ApproveingArr: [],
      taskList: [{
        value: "1",
        label: "任何项目"
      }],
      taskProgress: [{
          value: "1",
          label: "任何备注"
        },
        {
          value: "2",
          label: "已完成"
        },
        {
          value: "3",
          label: "未完成"
        }
      ],
      typeList: [{
          value: "1",
          label: "任何类型"
        },
        {
          value: "2",
          label: "备注"
        },
        {
          value: "3",
          label: "资产上传"
        },
        {
          value: "4",
          label: "状态更改"
        },
        {
          value: "5",
          label: "任务分配"
        }
      ],
      taskTime: [{
          value: "1",
          label: "昨天"
        },
        {
          value: "2",
          label: "上星期"
        },
        {
          value: "3",
          label: "最近一个月"
        }
      ],
      options: [{
          value: "1",
          label: "截止时间"
        },
        {
          value: "2",
          label: "项目"
        },
        {
          value: "3",
          label: "状态"
        },
        {
          value: "4",
          label: "父级"
        },
        {
          value: "5",
          label: "优先级"
        }
      ],
      value1: [],
      value2: [],
      value3: [],
      value4: [],
      taskAvailableSel: [],
      notStartedSel: [],
      inProgressSel: [],
      doneSel: [],
      taskListSortSel: [],
      taskListProgramSel: [],
      taskListProgressSel: [],
      checked: false,
      Asset: '',
      Link: '',
      changecolor: 1,
      activeRow: {}, //点击任务列表选中的列的数据
      keyword: "",
      colSel: "name",
      columnSelect: [{
          value: "name",
          label: "任务名称"
        },
        {
          value: "priority",
          label: "优先等级"
        },
        {
          value: "start_date",
          label: "开始日期"
        },
        {
          value: "end_date",
          label: "截止日期"
        },
        {
          value: "grade",
          label: "难度等级"
        },
      ],
      columnSelect2: [{
          value: 0,
          label: "低级"
        },
        {
          value: 1,
          label: "中级"
        },
        {
          value: 2,
          label: "高级"
        }
      ],
      colSel2: [],
      timeSelection: "",
      timeSelection2: "",
      historyVersion: [],
      project: null,
      assetId: null,
      currentGrade: null,
      GradeList: [{
          label: '简单',
          value: 0
        },
        {
          label: '标准',
          value: 1
        },
        {
          label: '困难',
          value: 2
        },
      ]
    };
  },
  methods: {
       //表内单元格样式（状态、优先级改变背景色）
       cellStyle({ row, column, rowIndex, columnIndex }) {
        if (column.property == "task.priority") {
          switch (row.task.priority) {
            case 2:
              return {
                background: "#C64b2b",
                color: "#FFFFFF"
              };
          }
        } else if (column.property == "task.grade") {
          switch (row.task.grade) {
            case 2:
              return {
                background: "#C64b2b",
                color: "#FFFFFF"
              };
          }
        }
        return { borderRight: 0 };
      },
    //点击筛选任务
    task(status) {
      this.changecolor = status;
      let data = {
        mytask: null,
        status: status
      };

      function DateFormat(dateVal) {
        return dayjs(dateVal).format("YYYY/MM/DD")
      }
      switch (this.colSel) {
        case 'name':
          this.keyword && (data = {
            ...data,
            name: this.keyword
          })
          break;
        case 'grade':
          data = {
            ...data,
            grade: JSON.stringify(this.currentGrade)
          }
          break;
        case 'start_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              start: "" + "," + DateFormat(this.timeSelection2)
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) + "," + ""
            };
          } else {
            data = {
              ...data,
              start: DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2)
            };
          }
          break;
        case 'end_date':
          if (!this.timeSelection && this.timeSelection2) {
            data = {
              ...data,
              end: "" + "," + DateFormat(this.timeSelection2)
            };
          } else if (this.timeSelection && !this.timeSelection2) {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) + "," + ""
            };
          } else {
            data = {
              ...data,
              end: DateFormat(this.timeSelection) +
                "," +
                DateFormat(this.timeSelection2)
            };
          }
          break;
        case 'priority':
          if (this.colSel2.length) {
            data = {
              ...data,
              priority: JSON.stringify(this.colSel2)
            };
            this.name = {
              priority: JSON.stringify(this.colSel2)
            };
          }
          break
      }




      getStatusTaskList(data).then(({
        data
      }) => {
        this.MyTaskList1 = [...data.msg];
      })

    },
    //筛选重置
    reTask(status) {
      this.keyword = "";
      this.colSel = "name";
      this.colSel2 = [];
      this.timeSelection = "";
      this.timeSelection2 = "";
      let data = {
        /*  */
        mytask: null,
        status: status
      };

      getStatusTaskList(data).then(({
        data
      }) => {
        this.MyTaskList1 = [...data.msg];

      })
    },
    //表格中的快捷下拉切换任务状态
    statusChange(status, row) {
      let loading = this.$loading({
        fullscreen: true
      });
      putTaskRecord({
        method: 'put',
        id: row.task.id,
        status
      }).then(({
        data
      }) => {
        loading.close()
        if (data.status === 0) {
          row.task.status = status
          if (status === 0) {
            status = "暂停";
          }
          if (status === 1) {
            status = "未开始";
          }
          if (status === 2) {
            status = "进行中";
          }

          this.$message.success("任务" + row.task.id + "状态已更改为：" + status);
          this.resetTasks()
        } else {
          this.$message.warning(data.msg)
        }
      }).catch(err => {
        loading.close()
      })
    },
    checkMove() {
      return false
    },
    handelChanged(e) {
      const self = this
      if (e.to.dataset.arr === e.from.dataset.arr) {
        return false
      }
      let status = -1
      switch (e.to.dataset.arr) {
        case 'PauseArr':
          status = 0
          break;
        case 'DraftArr':
          status = 1
          break;
        case 'InProgressArr':
          status = 2
          break;
        case 'ApproveingArr':
          status = 3
          break;
        case 'FinishedArr':
          status = 4
          break;
        case 'TimeOutArr':
          status = 5
          break;
      }
      let loading = this.$loading({
        fullscreen: true
      });
      putTaskRecord({
        method: 'put',
        id: e.item.dataset.taskid,
        status
      }).then(({
        data
      }) => {
        loading.close()
        if (data.status === 0) {
          this[e.to.dataset.arr][e.newIndex]['status'] = status
          self.resetTasks()
          this.$message.success(data.msg)
        } else {
          this.$message.warning(data.msg)
        }
      }).catch(err => {
        loading.close()
        self.resetTasks()
      })
    },
    cancel() {
      this.isDialogShow = false;
    },
    openDialog(obj) {
      this.isDialogShow = true;
      this.TaskRecord = Object.assign({}, {
        task_id: obj.id,
        type: 0,
        date: new Date().toLocaleDateString()
      });

    },
    addRecord() {
      this.createLoading = true;

      addTaskRecord(this.TaskRecord)
        .then(res => {
          if (res.data.status === 0) {
            this.$message.success(res.data.msg);
            this.getMyTasks()
          } else {
            this.$message.warning(res.data.msg);
          }
          this.isDialogShow = false;
          this.createLoading = false;
          this.isDrawerShow = false;
        })
        .catch(err => {
          this.createLoading = false;
        });

    },
    //是否显示任务板右侧
    taskBoardRightShow(row) {
      this.project = row.project;
      this.assetId = row.asset.id;
      this.isDrawerShow = true;

      this.activeRow = {
        ...row
      };
      this.TaskRecord = Object.assign({}, {
        task_id: row.task.id,
        type: 0,
        date: new Date().toLocaleDateString()
      });

      this.logsLoading = true;
      this.$refs['taskApprovelog'].getApproveLog(row.task.id);
      queryTaskRecord({
        task_id: row.task.id,
      }).then(({
        data
      }) => {
        this.LogList = [...data.msg];
        this.logsLoading = false;
      }).catch(() => {
        this.logsLoading = false;
      });
      this.detailLoading = true;
      queryTask({
        id: row.task.id,
      }).then(({
        data
      }) => {
        this.TaskDetail = {
          ...data.msg
        }
        this.Asset = this.TaskDetail.asset;
        this.Link = this.TaskDetail.link_dept_name;
        this.detailLoading = false;
      }).catch(() => {
        this.detailLoading = false;
      });
      getHistoryVersion({
        asset_id: row.asset.id
      }).then(({
        data
      }) => {
        this.historyVersion = [...data.msg]

      })

    },
    getAssetVersion() {
      getHistoryVersion({
        asset_id: this.assetId
      }).then(({
        data
      }) => {
        this.historyVersion = [...data.msg]

      })

    },
    //http获取‘我的任务’
    async getMyTasks() {
      await getStatusTaskList().then(({
        data
      }) => {
        this.MyTaskList = [...data.msg];
        this.resetTasks()
      });

    },
    resetTasks() {
      //暂停 0
      this.PauseArr = []
      //未开始 1
      this.DraftArr = []
      //进行中 2
      this.InProgressArr = []
      //审核中 3
      this.ApproveingArr = []
      //完成 4
      this.FinishedArr = []
      //超时 5
      this.TimeOutArr = []
      //审核通过 6
      // this.PassArr = []
      this.MyTaskList.forEach(item => {
        switch (item.task.status) {
          case 0:
            this.PauseArr.push(item.task);
            break;
          case 1:
            this.DraftArr.push(item.task);
            break;
          case 2:
            this.InProgressArr.push(item.task);
            break;
          case 3:
            this.ApproveingArr.push(item.task);
            break;
          case 4:
            this.FinishedArr.push(item.task);
            break;
          case 5:
            this.TimeOutArr.push(item.task);
            // case 6:
            //     this.PassArr.push(item.task);
        }
      });
    }
  },
  computed: {
    topArr() {
      return [{
          title: '所有任务',
          status: null,
          num: this.MyTaskList.length
        },
        {
          title: '未开始',
          status: 1,
          num: this.DraftArr.length
        },
        {
          title: '进行中',
          status: 2,
          num: this.InProgressArr.length
        },
        {
          title: '暂停',
          status: 0,
          num: this.PauseArr.length
        },
        {
          title: '审核中',
          status: 3,
          num: this.ApproveingArr.length
        },
        {
          title: '超时',
          status: 5,
          num: this.TimeOutArr.length
        },
        {
          title: '完成',
          status: 4,
          num: this.FinishedArr.length
        }

        // {
        //     title: '审核通过',
        //     status: 6,
        //     num: this.PassArr.length
        // }
      ]
    }
  },
  created() {
    this.getMyTasks(1)
    //首页中传递过来的字段
    switch (this.$store.state.mine.keyword) {
      case 'priority':
        this.colSel = 'priority'
        this.colSel2 = [2]
        break;
      case 'grade':
        this.colSel = 'grade'
        this.currentGrade = [2]
        break
      case 'expire':
        this.colSel = 'end_date'
        this.timeSelection = dayjs(new Date)
        this.timeSelection2 = dayjs(new Date).add(1, 'day')
        break
    }
    this.$nextTick(() => {
      this.task(2);
      //清空store中的 state.mine.keyword
      this.$store.commit("mine/SET_KEYWORD", '')
    })
  },
};
