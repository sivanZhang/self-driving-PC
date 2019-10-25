<template>
  <div>
    <svg-icon icon-class="notice" @click="show" style="cursor:pointer" />
    <el-badge :value="unreadCount" class="item" v-if="unreadCount"></el-badge>
    <Drawer
      scrollable
      closable
      height="500"
      v-model="isShowCard"
      width="526"
      :mask-style="{backgroundColor: 'transparent'}"
      :transfer="false"
      @on-close="drawerClose"
    >
      <div id="notice-header" style="border-bottom:1px soild #999999">
        <el-row>
          <el-col :span="4">
            <svg-icon icon-class="people2" style="width:50px;height:50px;"></svg-icon>
          </el-col>
          <el-col :span="14">
            <el-row style="f5ont-size:20px"></el-row>
            <el-col>{{loginMessage.msg}}</el-col>
            <el-row style="padding-top:10px">
              <el-col :span="4">邮箱：</el-col>
              <el-col :span="20">{{loginMessage.email}}</el-col>
            </el-row>
            <el-row style="padding-top:10px">
              <el-col :span="4">工种：</el-col>
              <el-col :span="20">
                <el-col
                  :span="6"
                  v-for="(item,index) of loginMessage.dept"
                  :key="index"
                  style="cursor: pointer"
                >
                  <el-tooltip effect="dark" content="点击跳转工种详情" placement="top">
                    <router-link :to="{path:'/admin/userGroup',query:{id:item.id}}">{{item.name}}</router-link>
                  </el-tooltip>
                </el-col>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-popover trigger="click" placement="bottom" width="400">
              <el-row>
                <el-col :span="8">
                  <el-steps direction="vertical" :active="active" :space="200">
                    <el-step title="上班 9:00" icon="el-icon-user"></el-step>
                    <el-step title="下班 18:00" icon="el-icon-user-solid"></el-step>
                  </el-steps>
                </el-col>
                <el-col :span="16" align="center" style="padding-top:45px">
                  <el-button
                    type="primary"
                    circle
                    style="width:150px;height:150px"
                    @click="clock()"
                    :disabled="clockClose"
                  >
                    <el-row style="padding-bottom:20px">
                      <h2>打卡</h2>
                    </el-row>
                    <el-row>{{date}}</el-row>
                  </el-button>
                </el-col>
              </el-row>
              <el-button slot="reference" type="text">
                <svg-icon icon-class="clock-in" style="width:50px;height:50px;"></svg-icon>
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的权限" name="first">
          <template v-if="userPermission">
            <div>
              <el-row>
                <el-col :span="4" align="center" class="col">{{"序号"}}</el-col>
                <el-col :span="10" class="col">{{"权限名称"}}</el-col>
                <el-col :span="10" class="col">{{"权限说明"}}</el-col>
              </el-row>
              <el-row v-for="(item,index) of userPermission" :key="index">
                <el-col :span="4" align="center" class="col">{{index+1}}</el-col>
                <el-col :span="10" class="col">{{item.codename}}</el-col>
                <el-col :span="10" class="col">{{item.name}}</el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <div style="display:flex;justify-content:center;padding-top:20px">
              <span>该用户未分配权限</span>
            </div>
          </template>
        </el-tab-pane>
        <!-- <el-tab-pane label="版本" name="second">版本</el-tab-pane> -->
        <el-tab-pane label="角色" name="third">
          <template v-if="userRole">
            <el-row>
              <el-col :span="4" align="center" class="col">{{"序号"}}</el-col>

              <el-col :span="20" class="col">{{"角色名称"}}</el-col>
            </el-row>
            <el-row v-for="(item,index) of userRole" :key="index">
              <el-col :span="4" align="center" class="col">{{index+1}}</el-col>
              <el-col :span="20" class="col" style="cursor: pointer;">
                <el-tooltip
                  effect="dark"
                  content="点击跳转角色详情"
                  placement="top"
                  v-if="$store.state.login.userInfo.auth.manage_role"
                >
                  <router-link
                    :to="`/admin/roles`"
                    :disabled="$store.state.login.userInfo.auth.manage_role"
                    style="cursor: pointer;"
                  >{{item.name}}</router-link>
                </el-tooltip>
                <div v-else>{{item.name}}</div>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <div style="display:flex;justify-content:center;padding-top:20px">
              <span>该用户未绑定角色</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="通知" name="fourth">
          <noticeDetail :notice="Notice" @getNoticeDetail="getNoticeDetail"></noticeDetail>
        </el-tab-pane>
        <el-tab-pane label="个人资料" name="fifth">
          <NoticeInfo :userInfo="userInfo" />
        </el-tab-pane>
        <el-tab-pane label="打卡记录" name="sixth">
          <el-table
            :data="clockRed"
            ref="clockRed"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            highlight-current-row
          >
            <el-table-column prop="user_name" label="用户名"></el-table-column>
            <el-table-column prop="date" label="打卡日期">
              <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
            </el-table-column>
            <el-table-column prop="come" label="上班时间">
              <template slot-scope="scope">{{scope.row.come|dateHMSFormat}}</template>
            </el-table-column>
            <el-table-column prop="leave" label="下班时间">
              <template slot-scope="scope">{{scope.row.leave|dateHMSFormat}}</template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>

<script>
import * as HTTP from "@/api/notice";
import { getUserPermission, getUserRole } from "@/api/login";
import noticeDetail from "./components/notice-detail";
import NoticeInfo from "./components/user-info";
import { mapState } from "vuex";
export default {
  name: "Notice",
  created() {
    this.getNoticeDetail();
    this.clockRecord();
  },
  components: {
    noticeDetail,
    NoticeInfo
  },
  data() {
    return {
      id: this.$store.state.login.userInfo.id,
      active: null,
      multipleSelection: [],
      activeName: "fourth",
      loginMessage: this.$store.state.login.userInfo,
      userPermission: null,
      userRole: null,
      userInfo: this.$store.state.login.userInfo,
      date: new Date().toLocaleDateString(),
      clockRed: null,
      active: 1,
      clockClose: false,
      dateHour: new Date().getHours()
    };
  },
  computed: {
    ...mapState("notice", ["Notice", "unreadCount", "isShowCard"])
  },
  watch: {
    date: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          if (this.dateHour > 9 && this.dateHour < 18) {
            this.clockClose = true;
          } else {
            this.clockClose = false;
          }
          //console.log(this.dateHour)
          //this.clockClose = true
          // console.log(newVal)
        }
      }
    }
  },
  mounted: function() {
    //定时器，用于每秒刷新页面
    var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(function() {
      _this.date = new Date().toLocaleTimeString(); //修改数据date
    }, 1000);
  },
  beforeDestory: function() {
    //清除定时器
    if (this.timer) {
      clearInterval(this.timer); //在Vue实例销毁前，清除定时器
    }
  },
  methods: {
    //打卡
    clock() {
      if (this.active++ > 2) this.active = 0;
      let data = {};
      //console.log(this.dateHour);
      if (this.dateHour < 9) {
        data = { status: 0 };
      }
      if (this.dateHour >= 18) {
        data = { status: 1 };
        this.clockClose = true;
        this.active = 2;
      }
      HTTP.clockIn(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);

            this.clockRecord();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(res => {});
    },
    //打卡记录
    clockRecord() {
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      HTTP.getClockRecord({ user_id: this.id }).then(({ data }) => {
        if (data.status === 0) {
          this.clockRed = [...data.msg];
          // this.clockRed.forEach(item => {
          //   if (dateFormat(item.date * 1000) === this.date) {
          //   }else{
          //     if(this.dateHour <9){
          //       this.clockClose = false;
          //       this.active = 1;
          //     }
          //   }
          // });
        }
      });
    },
    handleClick(tab, event) {
      //  console.log(tab, event);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    drawerClose() {
      this.$store.commit("notice/SET_CARDSHOW", false);
    },
    show() {
      this.$store.commit("notice/SET_CARDSHOW", true);
      getUserPermission().then(({ data }) => {
        if (data.msg) {
          this.userPermission = null;
        } else {
          this.userPermission = [...data];
        }
      });
      getUserRole({ userid: this.id }).then(({ data }) => {
        if (data.roles.length) {
          this.userRole = [...data.roles];
        } else {
          this.userRole = null;
        }
      });
    },
    handleChange(val) {
      // console.log(val);
    },
    //获取当前用户收到的通知
    getNoticeDetail() {
      this.$store.dispatch("notice/get_Notice", {
        userid: this.$store.state.login.userInfo.id
      });
    },

    //修改是否已读
    updateIsRead(row) {
      // console.log(row);
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
        } else {
          //this.$message.error(data.msg);
        }
      });
    },
    updateIsReads() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      HTTP.putNotice({
        method: "put",
        ids: ids,
        read: 1
      }).then(({ data }) => {
        if (data.status === 0) {
          //this.$message.success(data.msg);
          this.getNoticeDetail();
        } else {
          //this.$message.error(data.msg);
        }
      });
    },
    //批量删除通知
    delNotices() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      //console.log(ids);
      this.$confirm("确定删除？", "注意", {
        confirmButtonText: "删除",

        concelButtonText: "取消",

        type: "warning"
      }).then(() => {
        HTTP.removeNotice({
          ids: ids,
          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$refs.multipleTable.clearSelection();
            this.getNoticeDetail();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.item {
  position: static;
  margin-left: -10px;
  margin-top: -16px;
}
svg-icon {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 22px;
  height: 22px;
  vertical-align: 10px;
}
.col {
  padding-bottom: 10px;
}
</style> 



