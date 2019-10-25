<style lang="scss" scoped>
</style>
<template>
  <div id="my-production" ref="drawer-parent">
    <el-card>
      <template v-if="!teamId" slot="header">
        <el-select v-model="currentAuthor" placeholder="请选择" style="width:120px">
          <el-option
            v-for="item in Authors"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select v-model="currentType" placeholder="请选择" style="width:120px">
          <el-option
            v-for="item in Types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="getProductions()">查询</el-button>
      </template>
      <el-table :data="ProductionList" v-loading="tableLoading">
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="作品" align="center">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.path && isImagePath(scope.row.path)"
              :src="$store.state.BASE_URL+scope.row.path"
              style="width: 55px;height: 33px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.path]"
            >
              <div slot="error">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
            <el-button
              v-else-if="scope.row.path"
              type="text"
              icon="el-icon-video-camera-solid"
              @click="showVideo(scope.row.path)"
            >{{scope.row.path}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="creator.username" label="创建者" header-align="center"></el-table-column> -->
        <el-table-column label="素材缩略图" align="center">
          <!-- <el-table-column prop="asset.name" label="素材名称" header-align="center"></el-table-column> -->

          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              style="width: 55px;height: 33px;cursor: pointer; display:inline-block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="任务名称" header-align="center" prop="task[0].taskname"></el-table-column>

        <el-table-column label="评论" align="center" v-if="!teamId">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="font-size:15px"
              @click="viewComments(scope.row,scope.$index)"
              icon="el-icon-chat-line-round"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :visible.sync="dialogTableVisible" @closed="endPlay">
      <video ref="videoplayer" :src="videoSrc" controls width="100%"></video>
    </el-dialog>
    <Drawer
      scrollable
      closable
      v-model="isDrawerShow"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :title="drawerTitle"
      @on-close="handelDrawerClose"
    >
      <el-image
        v-if="inDrawerPath && isImagePath(inDrawerPath)"
        :src="$store.state.BASE_URL+inDrawerPath"
        style="width: 100%;height: 228px;cursor: pointer; display:block;"
        :preview-src-list="[$store.state.BASE_URL+inDrawerPath]"
      >
        <div slot="error">
          <i class="el-icon-picture" style="color:#909399"></i>
        </div>
      </el-image>
      <video
        v-else-if="inDrawerPath"
        ref="drawer-player"
        :src="$store.state.BASE_URL+inDrawerPath"
        controls
        width="100%"
      ></video>
      <remarks
        ref="remarks"
        :project="RemarkParams"
        :RemarksData="RemarksData"
        @refreshRemark="updateRemark"
        :showImage="false"
      />
    </Drawer>
  </div>
</template>

<script>
import remarks from "@/components/projectDrawer/components/remarks";
import { getProduction } from "@/api/production";
import thumbtackMixin from "@/mixins/thumbtack-mixin";
import { getRemark } from "@/api/remark";

export default {
  name: "my-production",
  mixins: [thumbtackMixin], //drawer图钉效果
  components: {
    remarks
  },
  props: ["teamId", "projectId", "user_id"],
  data() {
    return {
      drawerTitle: "",
      RemarkParams: {}, //传给remark的参数
      RemarksData: [],
      isDrawerShow: false, //是否显示drawer
      videoSrc: "",
      inDrawerPath: "",
      dialogTableVisible: false, //dialog是否显示
      tableLoading: false, //table的加载效果
      ProductionList: [], //table的数据
      //作品参数
      Authors: [
        {
          label: "所有作品",
          value: ""
        },
        {
          label: "我的作品",
          value: "myworks"
        }
      ],
      currentAuthor: "myworks",
      //作品类型
      Types: [
        {
          label: "所有类型",
          value: ""
        },
        {
          label: "图片类型",
          value: "image"
        },
        {
          label: "视频类型",
          value: "video"
        }
      ],
      currentType: ""
    };
  },
  methods: {
    handelDrawerClose(){
       this.$refs["drawer-player"].pause();
       this.inDrawerPath = ''
    },
    isImagePath(path) {
      let reg = /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/;
      return reg.test(path);
    },
    //点击评论按钮显示评论drawer
    viewComments(row, index) {
      this.inDrawerPath = row.path;
      this.drawerTitle = `#${index + 1} 作品评论`;
      this.RemarkParams = {
        id: row.task[0].taskid,
        entity_type: 1
      };
      const msg = {
        appid: row.task[0].taskid,
        apptype: 1
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];

        //console.log(this.RemarksData);
      });
      this.$nextTick(() => {
        // this.$refs["remarks"].getRemarkList();
        this.isDrawerShow = true;
      });
    },
    updateRemark() {
      getRemark({
        appid: this.RemarkParams.id,
        apptype: this.RemarkParams.entity_type
      }).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    //关闭dialog回调，停止视频播放
    endPlay() {
      this.$refs["videoplayer"].pause();
    },
    //打开视频弹框，为视频src赋值
    showVideo(path) {
      this.videoSrc = this.$store.state.BASE_URL + path;
      this.dialogTableVisible = true;
    },
    //获取作品列表
    getProductions() {
      this.tableLoading = true;
      let params = {};

      this.currentType && (params[this.currentType] = "");
      this.currentAuthor && (params[this.currentAuthor] = "");
      getProduction(params)
        .then(({ data }) => {
          this.ProductionList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //实验分组查看分组作品调用
    getProjectTeam() {
      getProduction({ project_id: this.projectId, team_id: this.teamId })
        .then(({ data }) => {
          this.ProductionList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //查看个人作品调用
    getPersonProduction() {
      getProduction({ users_id: this.user_id })
        .then(({ data }) => {
          this.ProductionList = [...data.msg];
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  },
  created() {
    this.getProductions();
  }
};
</script>