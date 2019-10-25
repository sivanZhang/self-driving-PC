<template>
  <el-card shadow="hover">
    <el-row slot="header" type="flex" justify="space-between" align="middle" class="card-header">
      <el-badge :value="myTaskList.length" :hidden="!myTaskList.length" :max="99" class="item">
        <span style="padding-right: 10px;">我的任务</span>
      </el-badge>
      <el-button @click="targetMore" type="text">查看更多</el-button>
    </el-row>
    <el-divider content-position="left">审批反馈</el-divider>

    
    <section class="feedback" v-for="(item,index) of FeedbackList" :key="index">
      <div class="name" @click="showDrawer(item)">{{item.task.name}}</div>
      <div class="msg">
        <div :style="{color:item.result?'#19be6b':'#ed4014'}">
          {{item.result?'通过':'未通过'}}
        </div>
      </div>
      <div class="date">{{item.date|dateFormat}}</div>
      <div>
        意见 : {{item.suggestion}}
      </div>
    </section>

    <el-divider content-position="left">任务列表</el-divider>
    <div class="navs">
      <div @click="targetMore('priority')">
        {{TaskCount.high}}
        <br />高优先级
      </div>
      <div @click="targetMore('grade')">
        {{TaskCount.difficult}}
        <br />困难
      </div>
      <div @click="targetMore('expire')">
        {{TaskCount.outdate}}
        <br />即将超期
      </div>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="item of myTaskList.filter((t,i)=>1<5)"
        :key="item.task.id"
        @click="showDrawer(item)"
        style="cursor: pointer;"
      >
        {{item.task.name}}
        <div
          class="message"
        >{{item.task.start_date | dateFormat}} - {{item.task.end_date|dateFormat}}</div>
        <div class="message">{{item.task.content}}</div>
      </li>
    </ul>
    <div v-show="myTaskList.length>5">...</div>
  </el-card>
</template>
<script>
import { getHomepageMyTask, getFeedback } from "@/api/task";
export default {
  props: {
    myTaskList: {
      type: Array
    }
  },
  data() {
    return {
      TaskCount: {},
      FeedbackList: []
    };
  },
  created() {
    this.getTaskCount();
    getFeedback().then(res => {
      this.FeedbackList = [...res.data.msg];
    });
  },
  methods: {
    getTaskCount() {
      getHomepageMyTask().then(({ data }) => {
        this.TaskCount = data.msg;
      });
    },
    showDrawer(item) {
      this.$emit("show-drawer", item);
    },
    //使跳转我的任务页面后，自动筛选
    targetMore(type) {
      if (type) {
        this.$store.commit("mine/SET_KEYWORD", type);
      }
      this.$router.push({ name: "my-task" });
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin mustInLine {
  overflow: hidden; //超出的隐藏
  text-overflow: ellipsis; //省略号
  white-space: nowrap; //强制一行显示
}
$border: 1px solid #dcdfe6;
$linkColor: #2d8cf0;
.feedback {
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  .name {
    width: 100%;
    @include mustInLine;
    cursor: pointer;
    &:hover {
      color: $linkColor;
    }
  }
  .date{
    flex:0 0 50%;
    color: #909399;
    text-align: right;
  }
  .msg{
    flex:0 0 50%;
  }
  & + .feedback {
    border-top: $border;
  }
}
.navs {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 10px;
  & > div {
    flex: 1;
    cursor: pointer;
    &:hover {
      color: $linkColor;
    }
    & + div {
      border-left: 1px solid $border;
    }
  }
}
.list {
  list-style-position: inside;

  .item {
    padding-bottom: 8px;
    &:hover {
      color: $linkColor;
    }
    @include mustInLine;
    .message {
      @include mustInLine;
      font-size: 12px;
      color: #909399;
      padding-left: 20px;
    }
  }
}
</style>