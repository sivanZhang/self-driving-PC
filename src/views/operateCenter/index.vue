<template>
    <div id="operateCenter">
    <!-- 运营中心 -->
    <el-row class="header" :gutter="15">
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/orderStat.png" alt="">
                    <div class="stat-num">0</div>
                </div>
                <div class="header-text">今日订单总金额(元)</div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/gift.png" alt="">
                    <div class="stat-num">19</div>
                </div>
                <div class="header-text">礼品发布(个)</div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/orderNum.png" alt="">
                    <div class="stat-num">793</div>
                </div>
                <div class="header-text">订单总数(笔)</div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/sale.png" alt="">
                    <div class="stat-num">25</div>
                </div>
                <div class="header-text">本月销量(笔)</div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/transaction.png" alt="">
                    <div class="stat-num">80</div>
                </div>
                <div class="header-text">已完成交易(笔)</div>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <div class="header-stat">
                    <img class="img"
                    src="@/assets/operateCenter/assess.png" alt="">
                    <div class="stat-num">63</div>
                </div>
                <div class="header-text">累计评价(个)</div>
            </el-card>
        </el-col>
    </el-row>
    <el-row class="middle-top" :gutter="15">
        <el-col :span="18">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="top-text">交易提示</div>
                </div>
                <el-row class="top-row">
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>待付款</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>待发货</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>已发货</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>已收货</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>已关闭</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="row-num">0</div>
                        <div>售后申请</div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="top-text">礼品提示</div>
                </div>
                <el-row class="top-row">
                    <el-col :span="8">
                        <div class="row-num">0</div>
                        <div>出售中</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="row-num">0</div>
                        <div>仓库中</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="row-num">0</div>
                        <div>库存预警</div>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row class="middle-bottom" :gutter="15">
        <el-col :span="18">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="bottom-text">订单总数统计</div>
                </div>
                <el-row style="font-size:15px;margin:10px 0px 0px 5px">
                    <el-col :span="7">
                        时间：<el-date-picker
                            v-model="time1"
                            type="daterange"
                            style="width:200px"
                            :picker-options="pickerOptions"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            size="mini"
                            value-format="yyyy/MM/dd"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="15">
                        <el-button
                            @click="search1()"
                            icon="el-icon-search"
                            style="height:27.99px;"
                            type="primary"/>
                    </el-col>
                    <el-col :span="2">
                        <el-tooltip content="切换为折线图" placement="top">
                            <img class="img" @click="clickLine1"
                            src="@/assets/operateCenter/polyLine.png" alt=""/>
                        </el-tooltip>
                        <el-tooltip content="切换为柱状图" placement="top">
                            <img style="margin-left:10px" @click="clickBar1"
                            src="@/assets/operateCenter/bar.png" alt="">
                        </el-tooltip>
                    </el-col>
                </el-row> 
                <div>
                    <LineChart v-if ="line1 == true" ref="orderNum" chart-id="orderNum" style="height:270px;" />
                    <BarChart v-else ref="orderNum" chart-id="orderNum" style="height:270px" />
                </div>  
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="bottom-text">销售情况统计</div>
                </div>
                <div>
                    <el-table
                        :data="tableData"
                        :span-method="objectSpanMethod"
                        style="width:100%;">
                        <el-table-column
                            prop="id">
                        </el-table-column>
                        <el-table-column
                            prop="name">
                        </el-table-column>
                        <el-table-column
                            prop="amount1">
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <el-row class="footer" :gutter="15">
        <el-col :span="18">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="footer-text">下单金额</div>
                </div>
                <el-row style="font-size:15px;margin:10px 0px 0px 5px">
                    <el-col :span="7">
                        时间：<el-date-picker
                        v-model="time2"
                        type="daterange"
                        style="width:200px"
                        :picker-options="pickerOptions"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        size="mini"
                        value-format="yyyy/MM/dd"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="15">
                        <el-button
                            @click="search2()"
                            icon="el-icon-search"
                            style="height:27.99px;"
                            type="primary"/>
                    </el-col>
                    <el-col :span="2">
                        <el-tooltip content="切换为折线图" placement="top">
                            <img class="img" @click="clickLine2"
                            src="@/assets/operateCenter/polyLine.png" alt=""/>
                        </el-tooltip>
                        <el-tooltip content="切换为柱状图" placement="top">
                            <img style="margin-left:10px" @click="clickBar2"
                            src="@/assets/operateCenter/bar.png" alt="">
                        </el-tooltip>
                    </el-col>
                </el-row> 
                <div>
                    <LineChart  v-if ="line2 == true" ref="orderMoney" chart-id="orderMoney" style="height:290px"/>
                    <BarChart v-else ref="orderMoney" chart-id="orderMoney" style="height:260px"/>
                </div>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card>
                <div style="display:flex">
                    <img class="img"
                    src="@/assets/operateCenter/dot.png" alt="">
                    <div class="footer-text">单品销售排名</div>
                </div>
                <div>
                    <el-table
                        :data="rankList"
                        height="290"
                        style="width:100%;margin-top:10px">
                        <el-table-column
                            prop="serial"
                            label="排名">
                        </el-table-column>
                        <el-table-column
                            prop="giftInfo"
                            label="礼品信息"
                            width="300">
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-col>
    </el-row>
    </div>
</template>
<script>
import LineChart from "@/components/ECharts/LineMarker";
import BarChart from "@/components/ECharts/BarMarker";
export default {
    name: "operateCenter",
    components: {
        BarChart,
        LineChart,
    },
    data() {
        return {
            tableData: [
            {
                id: '当天销售',
                name: '销售量(件)',
                amount1: '234',
                }, {
                id: '当天销售',
                name: '销售金额(元)',
                amount1: '165',
                }, {
                id: '本月销售',
                name: '销售量(件)',
                amount1: '324',
                }, {
                id: '本月销售',
                name: '销售金额(元)',
                amount1: '621',
                }, {
                id: '本年销售',
                name: '销售量(件)',
                amount1: '539'
                },{
                id: '本年销售',
                name: '销售金额(元)',
                amount1: '539'
            }],
            rankList:[
                {
                    serial:1,
                    giftInfo:"测试商品测试商品测试商品测试商品"
                },
                {
                    serial:2,
                    giftInfo:"测试商品"
                },
                {
                    serial:3,
                    giftInfo:"测试商品"
                },
                {
                    serial:4,
                    giftInfo:"测试商品"
                }
            ],
            time1:[],
            time2:[],
            pickerOptions: {
                shortcuts: [
                {
                    text: "今天",
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "昨天",
                    onClick(picker) {
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24);
                    picker.$emit("pick", [start, start]);
                    }
                },
                {
                    text: "最近一周",
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "最近一个月",
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit("pick", [start, end]);
                    }
                },
                {
                    text: "自定义",
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit("pick", [start, end]);
                    }
                }
                ]
            },
            line1:true,
            line2:true 
        };
    },
    methods:{
        //点击转为折线图
        clickLine1(){
            this.line1 = true,
            this.getNum()
        },
        //点击转为柱状图
        clickBar1(){
            this.line1 = false
            this.getNum()
        },
        //点击转为折线图
        clickLine2(){
            this.line2 = true,
            this.getMoney()
        },
        //点击转为柱状图
        clickBar2(){
            this.line2 = false
            this.getMoney()
        },
        //获取订单总数
        getNum(){
            let way = ""
            if(this.line1 == true){
                way = "line"
            }else{
                way = "bar"
            }
            let option = {
                title: {
                    text: "订单数",
                    textStyle: {
                        //---主标题内容样式
                        color: "#000",
                        fontSize:16
                    },
                    padding:[15,18], //---标题位置,因为图形是是放在一个dom中,因此用padding属性来定位
                },
                tooltip: {
                    trigger: "axis",
                },
                grid: {
                    left: "3%",
                    top: "25%",
                    containLabel: true
                },
                legend: {
                    data:[]
                },
                xAxis: [
                {
                    name:'时间',
                    type: "category",
                    // triggerEvent:true,
                    data: ["周一", "周二", "周三", "周四", "周五", "周六"],
                }
                ],
                yAxis: [
                {
                    type: "value",
                    name:'件',
                    splitLine:{show:false},
                    axisLabel:{
                        fontSize:14,
                    },
                }],
                series: [
                {
                    name: "订单数",
                    type: way,
                    smooth:true,
                    data: [100,200,100,300,400,500],
                }]
            };
            this.$nextTick(()=>{
                this.$refs["orderNum"].initChart(option);
            })
        },
        //获取下单金额
        getMoney(){
            let way = ""
            if(this.line2 == true){
                way = "line"
            }else{
                way = "bar"
            }
            let option = {
                title: {
                    text: "下单金额",
                    textStyle: {
                        //---主标题内容样式
                        color: "#000",
                        fontSize:16
                    },
                    padding:[15,18],
                },
                tooltip: {
                    trigger: "axis",
                },
                grid: {
                    left: "3%",
                    top: "25%",
                    containLabel: true
                },
                legend: {
                    data:["下单金额"]
                },
                xAxis: [
                {
                    name:'时间',
                    type: "category",
                    data: ["周一", "周二", "周三", "周四", "周五", "周六"],
                }
                ],
                yAxis: [
                {
                    type: "value",
                    name:'元',
                    splitLine:{show:false},
                    axisLabel:{
                        fontSize:14,
                    },
                }],
                series: [{
                    name: "产量",
                    type: way,
                    barCategoryGap: "30%",
                    smooth: true,
                    data: [100, 300, 200, 400, 100,400]
                }]
            };
            this.$nextTick(()=>{
                this.$refs["orderMoney"].initChart(option);
            })
        },
        //根据时间查询订单数
        search1(){
            console.log("根据时间查询")
        },
        //根据时间查询下单金额
        search2(){
            console.log("根据时间查询")
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 2 === 0) {
                    return {
                    rowspan: 2,
                    colspan: 1
                    };
                } else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    };
                }
            }
        }
    },
    created() {
        this.getNum();
        this.getMoney()
    }
}
</script>
<style lang='scss' scoped>
#operateCenter{
  .header{
    margin-bottom:15px;
    .el-card {
        height: 110px;
        .header-stat{
           display:flex;
           justify-content:center;
           align-items:center; 
            .img{
                height:20px;
                width:20px;
            }
            .stat-num{
                font-size: 25px;
                margin-top:5px;
                margin-left:5px
            }
        }
        .header-text{
            color:#86939e;
            text-align:center;
        }
    }
  }  
  .middle-top{
    margin-bottom:15px; 
    .el-card {
        height: 150px;
        .img{
            width:15px;
            height:15px;
            margin-top:6px
        }
        .top-text{
            margin-left:5px;
            font-size:15px
        }
        .top-row{
            margin-top:25px;
            text-align: center;
            color:#86939e;
            .row-num{
                color:#0b7ef1;
                font-size:25px;
            }
        }
    }
  }
  .middle-bottom{
    margin-bottom: 15px;
    .el-card {
        height: 320px;
        .img{
            width:15px;
            height:15px;
            margin-top:6px
        }
        .bottom-text{
            margin-left:5px;
            font-size:15px
        }
    }
  }
  .footer{
    .el-card {
        height: 350px;
        .img{
            width:15px;
            height:15px;
            margin-top:6px
        }
        .footer-text{
            margin-left:5px;
            font-size:15px
        }
    } 
  }
}
</style>