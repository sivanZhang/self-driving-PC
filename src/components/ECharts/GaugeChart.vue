<template>
  <div :id="chartId" :style="{height:height,width:width}" v-loading="loading" />
</template>

<script>
import echarts from 'echarts'
import resize from "./resize";

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
    initChart(title = "", chartData = []) {
      let options = {	 	 		     
        series: [        
          {            
            name: '百分比100%',            
            type: 'gauge',			 			
            radius: 70,			   			
            center: ['50%', '50%'],			
            axisLine: {            
                show:true,                
                lineStyle: {                          
                    width: 12,					
                    color:[[1, '#1f5c91']],					
                    shadowColor: '#19bdcf',    				
                    shadowBlur: 10,					
                    shadowOffsetX:2                
                }            
            },						
            splitLine: {				
                show: false,			
            },            	
            axisTick: {				
                show: false,			
            },						
            axisLabel: {				
                show:false,			
            },			 		
            pointer: {				
                show: false,				
            },						
            title: {				
                show: true,				
                offsetCenter: [0, '20%'], 				
                textStyle: {					
                    color: 'white',					
                    fontSize: 18			
                }			
            },						
            detail: {				
                show: true,				
                offsetCenter: [0, '-15%'],				
                formatter: '{value}',				
                textStyle: {					
                    fontSize: 28,					
                    color:'#21e5f8'				
                }			
            },	
            data:chartData,			
            zlevel:1       
          },		
          {            
            name: '进度条',            
            type: 'gauge',			
            radius: 70,						          					
            enter: ['50%', '50%'],						
            axisLine: {            				
                show:true,                
                lineStyle: {                      
                width: 12,					
                color:chartData[1]                
                }            
            },						
            splitLine: {				
                show:true,				
                length:10,				
                lineStyle:{				  
                    color: '#1f5c91',				  
                    width:0.5		
                }			
            },            			
            axisTick: {				
                show: false,			
            },						
            axisLabel: {				
                show:false,			
            },			 			
            ointer: {								
                show: false,			
            },						
            title: {				 
                show: false			
            },						
            detail: {				
                show: false,				
                offsetCenter: [0, '-10%'],				
                formatter: '',				
                textStyle: {					
                    fontSize: 0				
                }			
            },			
            data: [			 
                {name:'数量', value:'n'},			
            ],			
            zlevel:2        
          }
          ]	
        };
      this.chart.setOption(options);
      this.loading = false;
    }
  }
};
</script>
