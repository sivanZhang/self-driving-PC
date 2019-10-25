<template>
  <div>
    <div v-if="!isHasData">暂无数据</div>
    <div class="info-cont" v-if="isHasData">
      <el-image class="image" :src="videoInfo.task.image" fit="cover">
        <div
          slot="error"
          style="height: 100%;display: flex;justify-content: center;align-items: center;font-size: 56px;background: #dcdfe6;"
        >
          <i class="el-icon-picture" style="color:#909399"></i>
        </div>
      </el-image>
      <div class="desc">
        <p>
          <span>镜头名称</span>
          <span>{{videoInfo.task.name}}</span>
        </p>
        <p>
          <span>所属项目</span>
          <span>{{videoInfo.project.name}}</span>
        </p>
        <p>
          <span>版本号</span>
          <span>{{videoInfo.task.inner_version}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "VideoInfo",
  data() {
    return {
      isHasData: false,
      videoInfo: {}
    };
  },
  methods: {
    initInfo(item) {
      this.videoInfo = Object.assign({}, item);
      this.isHasData = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.info-cont {
  width: 100%;
  height: 100%;
  font-family: "Microsoft YaHei";
  overflow: hidden;
  .image {
    float: left;
    width: 200px;
    height: 115px;
  }
  .desc {
    float: left;
    padding-left: 10px;
    p {
      font-size: 14px;
      padding: 10px 0;
      span:first-child {
        color: #555666;
        min-width: 75px;
        display: inline-block;
      }
      
    }
  }
}
</style>
