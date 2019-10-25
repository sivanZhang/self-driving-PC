<template>
  <div id="project-drawer">
    <div class="page-right">
      <div id="videoTabs" class="video-tabs">
        <!-- 侧栏展示Tab页 -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="评论" name="first">
            <remarks :project="project" :RemarksData="RemarksData" @refreshRemark="updateRemark()"></remarks>
          </el-tab-pane>
          <el-tab-pane label="任务" name="second">
            <task :taskList="taskList"></task>
          </el-tab-pane>
          <el-tab-pane label="资产" name="third">
            <assets :project="project" :assetsList="assetsList" />
          </el-tab-pane>
          <el-tab-pane label="动态" name="fifth">动态</el-tab-pane>
          <el-tab-pane label="信息" name="sixth">
            <info :project="project" />
            <el-divider />
            <attrsBind
              :project="project"
              :customAttrs="customAttrs"
              :attrsList="attrsList"
              @refresh_customAttrs="NewcustomAttrs"
              :attrsTypeNum="attrsTypeNum"
            />
          </el-tab-pane>
          <el-tab-pane label="参与工种" name="seventh">
            <joinDept :project="project" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import remarks from "@/components/projectDrawer/components/remarks";
import info from "@/components/projectDrawer/components/info";
import assets from "@/components/projectDrawer/components/assets";
import task from "@/components/projectDrawer/components/task";
import joinDept from "@/components/projectDrawer/components/joinDept";
import attrsBind from "@/components/projectDrawer/components/attrsBind";

export default {
  props: [
    "project",
    "RemarksData",
    "assetsList",
    "taskList",
    "attrsList",
    "customAttrs",
    "attrsTypeNum"
  ],
  data() {
    return {
      activeTab: "first"
    };
  },
  name: "projectDrawer",
  components: { remarks, info, assets, task, joinDept, attrsBind },
  methods: {
    updateRemark(){
      //console.log("父亲");
      this.$emit("refreshRemark")
    },
    NewcustomAttrs() {
      this.$emit("refresh_customAttrs");
    },
    handleTabClick(tab, event) {
      // this.getRemarkList();
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-right {
  height: 100%;
  // overflow: auto;

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

