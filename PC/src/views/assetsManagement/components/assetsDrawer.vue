<template>
  <div id="assets-drawer">
    <div class="page-right">
      <div id="videoTabs" class="video-tabs">
        <!-- 侧栏展示Tab页 -->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="制作环节" name="first">
            <links
              :link-list="LinkList"
              :project="project"
              :LinkList="LinkList"
              @refresh="getLinkList"
              @refresh_assetList="getAssetList"
              :LinkAssetList="LinkAssetList"
              :pro_type="pro_type"
              :authLink="authLink"
            ></links>
          </el-tab-pane>
          <el-tab-pane label="评论" name="second">
            <remarks :project="project" :RemarksData="RemarksData" @refreshRemark="updateRemark" />
          </el-tab-pane>
          <el-tab-pane label="相关任务" name="third">
            <el-table
              ref="assetTaskList"
              :data="assetTaskList"
              style="width: 100%"
              border
              :stripe="true"
              :row-style="{'font-size':'13px'}"
              :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
              highlight-current-row
              row-class-name="hover"
            >
              <el-table-column label="任务ID" prop="task_id" align="left"></el-table-column>
              <el-table-column label="名称" prop="task_name" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column label="任务内容" prop="task_content" align="left" show-overflow-tooltip></el-table-column>
              <el-table-column label="提交路径" align="left" prop="path" width="120px"></el-table-column>
              <el-table-column label="完成时间" align="left" width="120px">
                <template slot-scope="scope">{{scope.row.end_time|dateFormat}}</template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-tooltip content="打开任务" placement="top">
                    <el-button
                      @click="openTaskDetail(scope.row)"
                      icon="el-icon-top-right"
                      type="text"
                      style="color:blue"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="历史版本" name="fifth">
            <history
              :historyVersion="historyVersion"
              :project="project"
              @Version="getAssetVersion"
            />
          </el-tab-pane>
          <el-tab-pane label="审批记录" name="sixth">
            <approve-log ref="approvelogs" :project="project" task_or_project="project" />
          </el-tab-pane>
          <el-tab-pane label="信息" name="seventh">
            <info :project="project" @refresh_assetList="getAssetList" :authAsset="authAsset" />
            <attrsBind
              :project="project"
              :customAttrs="customAttrs"
              :attrsList="attrsList"
              @refresh_customAttrs="NewcustomAttrs"
              :attrsTypeNum="attrsTypeNum"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import remarks from "@/components/projectDrawer/components/remarks";
import info from "@/components/projectDrawer/components/info";
import links from "@/views/projects/components/links";
import history from "@/views/task/components/tab-history";
import { addLinks, getLinks } from "@/api/links";
import { getVersion, getHistoryVersion } from "@/api/assets";
import { getAssetTaskList } from "@/api/task";
import approveLog from "@/views/components/approve-log";
import attrsBind from "@/components/projectDrawer/components/attrsBind";
export default {
  name: "assets-drawer",
  props: [
    "project",
    "RemarksData",
    "assetJump",
    "LinkAssetList",
    "customAttrs",
    "attrsList",
    "attrsTypeNum",
    "pro_type",
    "authAsset"
  ],
  data() {
    return {
      activeTab: this.assetJump ? this.assetJump : "first",
      LinkList: [],
      authLink: null,
      assetVersion: null,
      assetTaskList: null,
      historyVersion: []
    };
  },
  watch: {
    project: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.getAssetVersion();
          this.getAssetApproveLog();
        }
      }
    }
  },
  components: { remarks, info, links, approveLog, attrsBind, history },

  methods: {
    updateRemark() {
      this.$emit("refreshRemark");
    },
    NewcustomAttrs() {
      this.$emit("refresh_customAttrs");
    },
    getAssetList() {
      this.$emit("refresh_assetList");
    },
    getLinkList(id) {
      let asset = id || this.project.id;
      getLinks({
        asset
      }).then(res => {
        this.LinkList = [...res.data.msg];
        this.authLink = res.data.auth.can_manage_link;
      });
    },
    getAssetVersion() {
      getVersion({
        asset_id: this.project.id
      }).then(({ data }) => {
        this.assetVersion = [...data.msg];
      });
      getHistoryVersion({ asset_id: this.project.id }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
    },
    getAssetApproveLog() {
      this.$refs["approvelogs"].getAssetAppooveList(this.project.id);
    },
    getAssetTask(id) {
      getAssetTaskList({
        asset_id: id
      }).then(({ data }) => {
        this.assetTaskList = [...data.msg];
      });
    },
    openTaskDetail(row) {
      // this.$router.push({
      //   name: "project-detail", //也可以 path:'/projects/project-detail/'
      //   params: {
      //     id: row.project.id
      //   },
      //   query: {
      //     tab: "tab2"
      //   }
      // });
      this.$emit("jumpName", "tab2");
    }
  },
  created() {
    this.getAssetTask(this.$route.query.asset);
  }
};
</script>

<style lang="scss" scoped>
.page-right {
  height: 100%;

  // margin-left: 0.5%;
  .dropdow {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 3;
  }
}
.color {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  position: absolute;
  z-index: 2;
  right: 15px;
  top: 140px;
}
#videoTabs {
  width: 500px;
}
.video-info {
  padding: 10px;
  height: 165px;
  margin-bottom: 10px;
  background: #fff;
}
.video-tabs {
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  min-height: 10%;
  max-height: 68%;
  overflow: auto;
}
.video-comment {
  padding: 10px;
  background: #fff;
  height: 65%;
  overflow: auto;
}
.video-info,
.video-tabs,
.video-comment {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
    cursor: pointer;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
</style>
