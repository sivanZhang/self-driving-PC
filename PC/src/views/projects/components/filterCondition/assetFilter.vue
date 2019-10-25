<!-- 资产多条件筛选是筛选条件 -->
<template>
  <div
    style="display:flex;padding-top:10px;overflow-x:auto;height:45px"
    class="tags-view-container"
  >
    <label for style="width:80px">筛选条件：</label>
    <scroll-pane class="tags-view-wrapper">
      <div
        class="tags-view-item"
        :class="showMulChoose.name?'active':''"
        v-if="showMulChoose.name&&selShowName"
      >
        镜头号：{{showMulChoose.name}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('name')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.session?'active':''"
        v-if="showMulChoose.session&&selShowSession"
      >
        场次：{{showMulChoose.session}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('session')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.episode?'active':''"
        v-if="showMulChoose.episode&&selShowEpisode"
      >
        集数：{{showMulChoose.episode}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('episode')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.inner_version?'active':''"
        v-if="showMulChoose.inner_version&&selShowInner"
      >
        版本号：{{showMulChoose.inner_version}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('inner_version')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.frame?'active':''"
        v-if="showMulChoose.frame&&selShowFrame"
      >
        帧数：{{showMulChoose.frame}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('frame')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.frame_range?'active':''"
        v-if="showMulChoose.frame_range&&selShowRange"
      >
        帧数范围：{{showMulChoose.frame_range}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('frame_range')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.retime?'active':''"
        v-if="showMulChoose.retime&&selShowRetime"
      >
        变速信息：{{showMulChoose.retime}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('retime')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.report?'active':''"
        v-if="showMulChoose.report&&selShowReport"
      >
        画面调整：{{showMulChoose.report}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('report')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.content?'active':''"
        v-if="showMulChoose.content&&selShowContent"
      >
        制作内容：{{showMulChoose.content}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('content')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.creator?'active':''"
        v-if="showMulChoose.creator&&selShowCreator"
      >
        创建人：{{showMulChoose.creator}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('creator')"
        />
      </div>
      <div
        class="tags-view-item"
        :class="showMulChoose.remark?'active':''"
        v-if="showMulChoose.remark&&selShowRemark"
      >
        备注：{{showMulChoose.remark}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('remark')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.priority&&selShowPriority"
        :class="showMulChoose.priority?'active':''"
      >
        优先级：
        <span v-for="(item,index) of showMulChoose.priority" :key="index">
          <span style="margin-left:5px">{{item|Priority}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('priority')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.level&&selShowLevel"
        :class="showMulChoose.level?'active':''"
      >
        难度等级：
        <span v-for="(item,index) of showMulChoose.level" :key="index">
          <span style="padding-left:5px">{{item|Level}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('level')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.status&&selShowStatus"
        :class="showMulChoose.status?'active':''"
      >
        状态：
        <span v-for="(item,index) of showMulChoose.status" :key="index">
          <span style="padding-left:5px">{{item|assetStatus}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('status')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.start&&selStart"
        :class="showMulChoose.start?'active':''"
      >
        开始日期：{{showMulChoose.start}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('start')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.end&&selEnd"
        :class="showMulChoose.end?'active':''"
      >
        结束日期：{{showMulChoose.end}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('end')"
        />
      </div>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from "@/layout/components/TagsView/ScrollPane";
export default {
  name: "assetFilter",
  components: { ScrollPane },
  data() {
    return {
      selShowName: true,
      selShowSession: true,
      selShowEpisode: true,
      selShowInner: true,
      selShowFrame: true,
      selShowRange: true,
      selShowRetime: true,
      selShowReport: true,
      selShowContent: true,
      selShowCreator: true,
      selShowRemark: true,
      selShowPriority: true,
      selShowLevel: true,
      selShowStatus: true,
      selStart: true,
      selEnd: true,
      showMulChoose: [],
      sortSelForm: {}
    };
  },
  watch: {},
  methods: {
    filterCondition(showMulChoose, sortSelForm) {
      this.showMulChoose = showMulChoose;
      this.sortSelForm = sortSelForm;
    },
    closeSelectedTag(tag) {
      switch (tag) {
        case "name":
          delete this.sortSelForm.name;
          this.selShowName = false;
          break;
        case "session":
          delete this.sortSelForm.session;
          this.selShowSession = false;
          break;
        case "episode":
          delete this.sortSelForm.episode;
          this.selShowEpisode = false;
          break;
        case "inner_version":
          delete this.sortSelForm.inner_version;
          this.selShowInner = false;
          break;
        case "frame":
          delete this.sortSelForm.frame;
          this.selShowFrame = false;
          break;
        case "frame_range":
          delete this.sortSelForm.frame_range;
          this.selShowRange = false;
          break;
        case "retime":
          delete this.sortSelForm.retime;
          this.selShowRetime = false;
          break;
        case "report":
          delete this.sortSelForm.report;
          this.selShowReport = false;
          break;
        case "content":
          delete this.sortSelForm.content;
          this.selShowContent = false;
          break;
        case "creator":
          delete this.sortSelForm.creator;
          this.selShowCreator = false;
          break;
        case "remark":
          delete this.sortSelForm.remark;
          this.selShowRemark = false;
          break;
        case "priority":
          delete this.sortSelForm.priority;
          this.selShowPriority = false;
          break;
        case "level":
          delete this.sortSelForm.level;
          this.selShowLevel = false;
          break;
        case "status":
          delete this.sortSelForm.status;
          this.selShowStatus = false;
          break;

        case "start":
          delete this.sortSelForm.start;
          this.selStart = false;
          break;
        case "end":
          delete this.sortSelForm.end;
          this.selEnd = false;
          break;
      }
      this.$emit("refresh_close", this.sortSelForm, 1);
    },
    showMul() {
      this.selShowName = true;
      this.selShowSession = true;
      this.selShowEpisode = true;
      this.selShowInner = true;
      this.selShowFrame = true;
      this.selShowRange = true;
      this.selShowRetime = true;
      this.selShowReport = true;
      this.selShowContent = true;
      this.selShowCreator = true;
      this.selShowRemark = true;
      this.selShowPriority = true;
      this.selShowLevel = true;
      this.selShowStatus = true;
      this.selStart = true;
      this.selEnd = true;
      this.showMulChoose = [];
      this.sortSelForm = {};
    }
  },
  created() {}
};
</script>
<style lang="scss" scope>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>