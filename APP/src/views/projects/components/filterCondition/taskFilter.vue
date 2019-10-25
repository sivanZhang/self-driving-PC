<!-- 任务多条件筛选时的筛选条件 -->
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
        任务：{{showMulChoose.name}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('name')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.dept&&selShowDept"
        :class="showMulChoose.dept?'active':''"
      >
        制作环节：{{showMulChoose.dept}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('dept')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.content&&selShowContent"
        :class="showMulChoose.content?'active':''"
      >
        制作内容：{{showMulChoose.content}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('content')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.user&&selShowUser"
        :class="showMulChoose.user?'active':''"
      >
        创建人：{{showMulChoose.user}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('user')"
        />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.priority&&selShowPriority"
        :class="showMulChoose.priority?'active':''"
      >
        优先级：
        <span v-for="(item,index) of showMulChoose.priority" :key="index">
          <span style="margin-left:5px">{{item|taskPriority}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('priority')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.grade&&selShowGrade"
        :class="showMulChoose.grade?'active':''"
      >
        任务难度：
        <span v-for="(item,index) of showMulChoose.grade" :key="index">
          <span style="padding-left:5px">{{item|taskgrade}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('grade')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.status&&selShowStatus"
        :class="showMulChoose.status?'active':''"
      >
        状态：
        <span v-for="(item,index) of showMulChoose.status" :key="index">
          <span style="padding-left:5px">{{item|taskStatus}}</span>
        </span>
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag('status')" />
      </div>
      <div
        class="tags-view-item"
        v-if="showMulChoose.total_hour&&selTolHour"
        :class="showMulChoose.user?'active':''"
      >
        总工时：{{showMulChoose.total_hour}}
        <span
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag('total_hour')"
        />
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
  name: "taskFilter",
  components: { ScrollPane },
  data() {
    return {
      selShowName: true,
      selShowDept: true,
      selShowContent: true,
      selShowUser: true,
      selShowPriority: true,
      selShowGrade: true,
      selShowStatus: true,
      selTolHour: true,
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
    //删除筛选条件，剩余条件再搜索
    closeSelectedTag(tag) {
      switch (tag) {
        case "name":
          delete this.sortSelForm.name;
          this.selShowName = false;
          break;
        case "dept":
          delete this.sortSelForm.dept;
          this.selShowDept = false;
          break;
        case "content":
          delete this.sortSelForm.content;
          this.selShowContent = false;
          break;
        case "user":
          delete this.sortSelForm.user;
          this.selShowUser = false;
          break;
        case "priority":
          delete this.sortSelForm.priority;
          this.selShowPriority = false;
          break;
        case "grade":
          delete this.sortSelForm.grade;
          this.selShowGrade = false;
          break;
        case "status":
          delete this.sortSelForm.status;
          this.selShowStatus = false;
          break;
        case "total_hour":
          delete this.sortSelForm.total_hour;
          this.selTolHour = false;
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
      this.$emit("refresh_close", this.sortSelForm,1);
    },
    //重置筛选条件
    showMul(){
      this.selShowName=true;
      this.selShowDept=true;
      this.selShowContent=true;
      this.selShowUser=true;
      this.selShowPriority=true;
      this.selShowGrade=true;
      this.selShowStatus=true;
     this. selTolHour=true;
      this.selStart=true;
      this.selEnd=true;
      this.showMulChoose=[],
      this.sortSelForm={}
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