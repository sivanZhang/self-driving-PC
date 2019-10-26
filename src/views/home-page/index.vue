<script>
import noticeDetail from "@/components/Notice/components/notice-detail";
import { mapState } from "vuex";
export default {
  name: "home-page",
  components: {
    noticeDetail
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
    }
  }
};
</script>
<template>
  <div id="home-page">
    <el-row :gutter="16">
      <el-col :span="4">
        <el-card shadow="hover">
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
          <div class="card-item">
            <div class="labels">工 种</div>
            <div class="content">
              <router-link
                class="dept-link"
                v-for="(item,index) of userInfo.dept"
                :key="index"
                :to="{path:'/admin/userGroup',query:{id:item.id}}"
              >{{item.name}}</router-link>
            </div>
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
                style="width: 100%"
                ref="multipleTable"
                tooltip-effect="dark"
                @row-click="updateIsRead"
                :show-header="false"
              >
                <el-table-column label="通知" width="256" show-overflow-tooltip>
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
    </el-row>
  </div>
</template>

<style lang="scss">
#home-page {
  font-size: 12px;
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