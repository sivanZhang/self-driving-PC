<script>
import noticeDetail from "@/components/Notice/components/notice-detail";
import GaugeChart from "@/components/ECharts/GaugeChart";
import Chart from "@/components/ECharts/PieChart";
import { mapState } from "vuex";
export default {
  name: "home-page",
  components: {
    noticeDetail,
    GaugeChart,
    Chart
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount"]),
    ...mapState("login", ["userInfo"]),
    unreadList() {
      if (this.Notice && this.Notice.length) {
        return this.Notice.filter(t => !t.read);
      } else {
        return [];
      }
    }
  },
  methods: {
    //修改是否已读
    updateIsRead(row) {
      console.log(row);
      if (row.read === 0) {
        row.read = 1;
      }
      HTTP.putNotice({
        method: "put",
        ids: row.id,
        read: row.read
      }).then(({ data }) => {
        if (data.status === 0) {
          //this.$message.success(data.msg);
          this.getNoticeDetail();
        }
      });
    },
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    },
    coinNumber(){
      let option1 = [
        {
          name: "今日新增",
          value: 100
        },
        [[0.2, '#0eb2d3']]
      ]
      this.$nextTick(()=>{
        this.$refs["coinChart"].initChart("", option1);
      });
    },
    userNumber(){
      let option2 = [
        {
          name: "今日新增",
          value: 200
        },
        [[0.3, '#c5cf45']]
      ]
      this.$nextTick(()=>{
        this.$refs["userChart"].initChart("", option2);
      });
    },
    orderNumber(){
      let option3 = [
        {
          name: "今日新增",
          value: 300
        },
        [[0.5, '#0ea162']]
      ];
      let option4 = [
        {
          name: "未发货订单",
          value: 100
        },
        {
          name: "已发货订单",
          value: 200
        }
      ]
      this.$nextTick(()=>{
        this.$refs["orderChart1"].initChart("", option3);
        this.$refs["orderChart2"].initChart("订单发货状态", option4);
      });
    }
  }, 
  created(){
    this.coinNumber();
    this.userNumber();
    this.orderNumber();
  }
};
</script>
<template>
  <div id="home-page">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card>
          <el-row
            slot="header"
            type="flex"
            justify="space-between"
            align="middle"
            class="card-header"
          >
            <span>我的信息</span>
          </el-row>
          <div class="card-item">
            <div class="labels">
              <el-avatar size="small">{{userInfo.username | avatarFormat}}</el-avatar>
            </div>
            <div class="content">
              {{userInfo.username}}
              <svg-icon :icon-class="userInfo.sex && userInfo.sex==='男'?'nanxing':'nvxing'" />
            </div>
          </div>
          <div class="card-item">
            <div class="labels">邮 箱</div>
            <div class="content">{{userInfo.email}}</div>
          </div>
          <div class="card-item">
            <div class="labels">角 色</div>
            <div class="content">{{userInfo.role.role}}</div>
          </div>
          <div>
            <div class="labels">
              <el-badge :value="unreadCount" :hidden="!unreadCount" :max="99" class="item">
                <span style="padding-right:8px">消 息</span>
              </el-badge>
            </div>

            <div class="content">
              <el-table
                :data="unreadList.filter((t,i)=>i<5)"
                style="width: 100%;background:#13345f"
                ref="multipleTable"
                tooltip-effect="dark"
                @row-click="updateIsRead"
                :show-header="false"
              >
                <el-table-column label="通知" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <svg-icon v-if="scope.row.read == 0" icon-class="notice-close" />

                    <svg-icon v-if="scope.row.read == 1" icon-class="notice-open" />
                    <router-link :to="{path:scope.row.url}">{{scope.row.title}}</router-link>
                  </template>
                </el-table-column>
                <el-table-column label="紧急程度" align="center" width="60">
                  <template slot-scope="scope">
                    <el-tooltip
                      v-if="scope.row.urgency_level == 0"
                      class="item"
                      effect="dark"
                      content="一般"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 0" icon-class="urgency1"></svg-icon>
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 1"
                      class="item"
                      effect="dark"
                      content="紧急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 1" icon-class="urgency2"></svg-icon>
                    </el-tooltip>
                    <el-tooltip
                      v-if="scope.row.urgency_level == 2"
                      class="item"
                      effect="dark"
                      content="特急"
                      placement="top"
                    >
                      <svg-icon v-if="scope.row.urgency_level == 2" icon-class="urgency3"></svg-icon>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-button
                v-show="unreadList.length>5"
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
              >查看更多</el-button>
              <!-- <el-button
                @click="$store.commit('notice/SET_CARDSHOW', true)"
                type="text"
                style="color:#ed4014"
              >{{unreadCount}} 条未读 <el-icon class="el-icon-position"/></el-button>-->
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card>
          <el-row
            slot="header"
            type="flex"
            justify="space-between"
            align="middle"
            class="card-header"
          >
            <span>积分数量统计</span>
          </el-row>
          <el-row><GaugeChart ref="coinChart" chart-id="coinChart" height="180px" style="margin-top:-10px"/></el-row>
          <div class="row-text">
            <el-row>今日新增积分数：<span class="row-text-number">100</span></el-row>
            <el-row>总积分数:<span class="row-text-number">1000</span></el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5">
        <el-card>
          <el-row
            slot="header"
            type="flex"
            justify="space-between"
            align="middle"
            class="card-header"
          >
            <span>用户数量统计</span>
          </el-row>
          <el-row><GaugeChart ref="userChart" chart-id="userChart" height="180px" style="margin-top:-10px"/></el-row>
          <div class="row-text">
            <el-row>今日新增用户数：<span class="row-text-number">200</span></el-row>
            <el-row>总用户数:<span class="row-text-number">1000</span></el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card>
          <el-row
            slot="header"
            type="flex"
            justify="space-between"
            align="middle"
            class="card-header"
          >
            <span>订单数量统计</span>
          </el-row>
          <el-row>
            <el-col :span="12"><GaugeChart ref="orderChart1" chart-id="orderChart1" height="180px" style="margin-top:-10px"/>
              <div class="row-text">
                <el-row>今日新增订单：<span class="row-text-number">300</span></el-row>
                <el-row>总订单数:<span class="row-text-number">1000</span></el-row>
              </div>
            </el-col>
            <el-col :span="12"><chart ref="orderChart2" chart-id="orderChart2" height="250px" style="margin-top:-50px"/></el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
#home-page {
  min-height: 100vh;
  font-size: 12px;
  .el-card {
    height: 300px;
    background:#13345f
  }
  .content{
    color:white;
  }
  .row-text{
    margin-left:5px;
    margin-top:-20px;
    color:white;
    font-size:12px;
    font-weight: bold;
  }
  .row-text-number{
    color:#1ecfec;
    font-size:20px;
    font-weight: bold;
    text-shadow: 1px 1px 2px #45d0f4;
  }
  .card-header {
    color:white;
    font-size: 14px;
    font-weight: 600;
  }
  .card-item {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
  }
  .labels {
    vertical-align: middle;
    color: #909399;
    width: 60px;
    flex: 0 0 40px;
  }
  .label {
    width: 200px;
  }
  .el-button--text {
    padding: 0;
  }
  .svg-icon {
    font-size: 16px;
  }
  .dept-link {
    font-size: 12px;
    color: #2d8cf0;
    & + .dept-link {
      margin-left: 5px;
    }
  }
}
</style>