
<template>
  <div id="gantt">
    <gantt-elastic :options="options" :tasks="ganttData">
      <gantt-header slot="header" :options="HeaderOption"></gantt-header>
    </gantt-elastic>
  </div>
</template>

<style>
</style>

<script>
import GanttElastic from "gantt-elastic";
import GanttHeader from "gantt-elastic-header";

let defaultOptions = {
  chart: {
    progress: {
      bar: true //是否显示任务进度上的绿色调
    },
    expander: {
      display: true //有子节点的时候是否显示 “+” 图标
    }
  },
  locale: {
    name: "zh-cn",
    weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    months: [
      "01月",
      "02月",
      "03月",
      "04月",
      "05月",
      "06月",
      "07月",
      "08月",
      "09月",
      "10月",
      "11月",
      "12月"
    ]
  }
};
export default {
  name: "Gantt",
  components: {
    GanttElastic,
    GanttHeader
  },
  props: {
    ganttData: {
      //甘特图渲染的数据
      type: Array,
      required: true
    },
    customHeaderOption: {
      type: Object,
      default:{}
    },
    customOptions: {
      type: Object
    }
  },
  computed: {
    options() {
      return Object.assign({}, defaultOptions, this.customOptions);
    },
    HeaderOption() {
      return Object.assign(
        {},
        {
          //甘特图header部分配置
          locale: {
            Now: "当前时间",
            "X-Scale": "横向尺寸",
            "Y-Scale": "纵向尺寸",
            "Task list width": "表格宽度",
            "Before/After": "日期范围",
            "Display task list": "表格显示"
          }
        },
        this.customHeaderOption
      );
    }
  }
};
/* const locale = {
  name: "en",
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
    "_"
  ),
  weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
  weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split(
    "_"
  ),
  monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
  weekStart: 1,
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  },
  formats: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd, D MMMM YYYY HH:mm"
  },
  ordinal: n => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`;
  }
}; */
</script>
<style lang="scss">
#gantt {
  .gantt-elastic__header-btn-recenter {
    padding: 6px 12px !important;
    font-size: 12px !important;
  }
  .gantt-elastic__task-list-header-label {
    text-align: left;
  }
  .gantt-elastic__header-label,.gantt-elastic__header-task-list-switch--wrapper{
    font-weight: normal!important;
  }
}
</style>