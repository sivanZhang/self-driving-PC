<template>
  <div>
    <el-card class="task-ditail">
      <h4 slot="header" class="clearfix">
        <el-row type="flex">
          <el-col :span="5">任务名称:</el-col>
          <el-col :span="19">{{taskdetail.name}}</el-col>
        </el-row>
      </h4>
      <el-row type="flex">
        <el-col :span="5">任务内容:</el-col>
        <el-col :span="19">{{taskdetail.content}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">创&nbsp;&nbsp;建&nbsp;&nbsp;者:</el-col>
        <el-col :span="19">{{taskdetail.creator|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">执&nbsp;&nbsp;行&nbsp;&nbsp;者:</el-col>
        <el-col :span="19">{{taskdetail.executor|executorFilter}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">任务状态:</el-col>
        <el-col :span="19">{{taskdetail.status|taskStatus}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">优先等级:</el-col>
        <el-col :span="19">{{taskdetail.priority|Priority}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属项目:</el-col>
        <el-col :span="19" @click="target(taskdetail.project)">{{taskdetail.project|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属资产:</el-col>
        <el-col :span="19">{{taskdetail.asset|filterName}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">所属环节:</el-col>
        <el-col :span="19">{{taskdetail.link_dept_name}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">创建时间:</el-col>
        <el-col :span="19">{{taskdetail.create_time|dateTimeFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">开始日期:</el-col>
        <el-col :span="19">{{taskdetail.start_date|dateFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">结束日期:</el-col>
        <el-col :span="19">{{taskdetail.end_date|dateFormat}}</el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="5">预设时间:</el-col>
        <el-col :span="19">{{taskdetail.total_hour}}(小时)</el-col>
      </el-row>
      <template v-if="path">
        <el-row type="flex">
          <el-col :span="5">任务输出:</el-col>
          <el-col :span="19">
            <el-image
              v-if="path && /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(path)"
              :src="$store.state.BASE_URL+path"
              style="width: 55px;height: 33px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+path]"
            >
              <div slot="error">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
            <el-button
              v-else-if="path"
              type="text"
              icon="el-icon-video-camera-solid"
              @click="showVideo(path)"
            >{{path}}</el-button>
          </el-col>
        </el-row>
      </template>
    </el-card>
    <!-- <template v-if="taskdetail.sub_task && taskdetail.sub_task.length">
      <task-ditail
        v-for="(item, index) in taskdetail.sub_task.length"
        :key="index"
        :task-detail="item"
      />
    </template> -->
    <el-dialog :visible.sync="dialogTableVisible" @closed="endPlay">
      <video ref="videoplayer" :src="videoSrc" controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import{queryTask} from "@/api/task";
export default {
  name: "task-ditail",
  props: {
    // asset: {
    //   name:String
    // },
    link: String,
    // taskdetail: Object,
    detailLoading: {
      type: Boolean,
      default: false
    },
    path: String
  },
  data() {
    return {
      taskdetail: [],
      videoSrc: "",
      dialogTableVisible: false //dialog是否显示
    };
  },
  filters: {
    filterName(obj) {
      if (obj && "name" in obj) return obj.name;
    },
    executorFilter(arr) {
      if (Array.isArray(arr) && arr.length) {
        return arr
          .map(item => {
            return item.name;
          })
          .join();
      }
    },
    target({ id }) {
      if (id) {
        this.$router.push({ name: "project-detail", params: { id } });
      }
    }
  },
  methods: {
    //打开视频弹框，为视频src赋值
    showVideo(path) {
      this.videoSrc = this.$store.state.BASE_URL + path;
      this.dialogTableVisible = true;
    },
    //关闭dialog回调，停止视频播放
    endPlay() {
      this.$refs["videoplayer"].pause();
    },
    getDetail(id,taskLook) {
      queryTask({ id: id })
        .then(({ data }) => {
          this.taskdetail = {...data.msg};
          if(taskLook){
            this.taskdetail.sub_task = []
          }
          // this.Asset = this.TaskDetail.asset;
          // this.Link = this.TaskDetail.link_dept_name;
          // this.detailLoading = false;
        })
        .catch(() => {
          console.log("catch");
          
          // this.detailLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.task-ditail {
  font-size: 13px;
  overflow-y: auto;
  .el-row + .el-row {
    margin-top: 10px;
  }
}
</style>


