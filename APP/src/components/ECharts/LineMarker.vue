<template>
  <div :id="chartId" :class="className" :style="{height:height,width:width}" v-loading="loading"/>
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
const DefaultOption = {
  title: {
    top: 20,
    text: "标题",
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
  legend: {//图例
    data: ["CMCC", "CTCC", "CUCC"],// 名字
    tooltip: {
        show: true,
    },
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [// x轴
        "13:00",
        "13:05",
        "13:10",
        "13:15",
        "13:20",
        "13:25",
        "13:30",
        "13:35",
        "13:40",
        "13:45",
        "13:50",
        "13:55"
      ]
    }
  ],
  yAxis: [
    {
      type: "value",
      /* name: "(%)", */
    }
  ],
  series: [
    // 线数据
    {
      name: "CMCC",
      type: "line",
      smooth: true,
      showSymbol: true,
      data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
    },
    {
      name: "CTCC",
      type: "line",
      smooth: true,// 是否曲线
      showSymbol: true,// 是否显示点
      data: [120, 110, 125, 145, 122, 165, 122, 220, 182, 191, 134, 150]
    },
    {
      name: "CUCC",
      type: "line",
      smooth: true,
      showSymbol: true,
      data: [220, 182, 125, 145, 122, 191, 134, 150, 120, 110, 165, 122]
    }
  ]
};
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    chartId: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "480px"
    }
  },
  data() {
    return {
      chart: null,
      loading:false
    };
  },
  mounted() {
    this.chart = echarts.init(document.getElementById(this.chartId));
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    // 父组件调用,开启加载动画
    openLoading() {
      this.loading = true;
    },
    /**
     * 父组件直接调用该方法即可渲染，但是父组件必须在其 mounted() 钩子中调用
     *
     * @param {Object} customOption 参考上面DefaultOption里面配置 
     *
     */
    initChart(customOption = {}) {
      let option = Object.assign({}, DefaultOption, customOption);
      this.chart.setOption(option);
      this.loading = false;
    }
  }
};
</script>
