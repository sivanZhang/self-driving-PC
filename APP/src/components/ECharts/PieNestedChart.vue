<template>
  <div :id="chartId" :style="{height:height,width:width}" v-loading="loading" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
const DefaultChartData = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: [
            "direct",
            "marketing campaigns",
            "search engine",
            "email marketing",
            "advertising alliance",
            "video ads",
            "Baidu",
            "Google",
            "will be",
            "other"
          ]
        },
        series: [
          {
            name: "Access Sources",
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
            data: [
              { value: 335, name: "Through", selected: true },
              { value: 679, name: "Marketing Advertising" },
              { value: 1548, name: "search engine" }
            ]
          },
          {
            name: "Access Sources",
            type: "pie",
            radius: ["40%", "55%"],

            data: [
              { value: 335, name: "Through" },
              { value: 310, name: "E-mail marketing" },
              { value: 234, name: "Advertising Alliance" },
              { value: 135, name: "Video ads" },
              { value: 1048, name: "Baidu" },
              { value: 251, name: "Google" },
              { value: 147, name: "Must" },
              { value: 102, name: "Other" }
            ]
          }
        ]
      };
export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "320px"
    },
    chartId: {
      type: String,
      default: "chart",
      required: true
    }
  },
  data() {
    return {
      chart: null,
      loading: true
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
     * @param {string} title 饼图的标题文字，非必传
     * @param {Array} chartData 饼图的数据，必传,具体格式为[{ name:'demo', value: 10 }]
     *
     */
    initChart(chartData = []) {
      let options = Object.assign({},DefaultChartData,chartData)
      this.chart.setOption(options);
      this.loading = false;
    }
  }
};
</script>
