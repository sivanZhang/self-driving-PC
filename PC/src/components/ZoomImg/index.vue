<template>
  <div class="zoom-img" v-show="zoomWindowDisplay">
    <div class="header">
      <i class="el-icon-close" title="关闭" @click="close"></i>
    </div>
    <img :src="imgurl" style="max-width:100%" alt>
  </div>
</template>
<script>
export default {
  name: 'ZoomImg',
  data() {
    return {
      zoomWindowDisplay:false,
      imgurl: "",
      widths: false,
      heights: false
    };
  },
  methods: {
    close() {
      //this.$parent.openScanImg(false);
      this.imgurl = "";
      this.zoomWindowDisplay = false;
    },
    zoomImg(url) {
      this.imgurl = url;
      this.zoomWindowDisplay = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.widths {
  width: 100%;
}
.heights {
  height: 100%;
}
.zoom-img {
  width: 1000px;
  height: 700px;
  left: 50%;
  top: 50%;
  margin-left: -400px;
  margin-top: -300px;
  position: fixed;
  z-index: 9999;
  background: #ffffff;
  box-shadow: 5px 5px 5px #aaaaaa;
  border: 1px solid #aaaaaa;
  .header {
    height: 30px;
    background: #ffffff;
    font-size: 22px;
    border-bottom: 1px solid #eeeeee;
    i {
      float: right;
      line-height: 30px;
      margin-right: 4px;
      cursor: pointer;
      transition: transform 0.3s;
    }
    i:hover {
      transform: rotate(90deg);
    }
  }
  img {
    // max-width: 800px;
    // max-height: 570px;
    position: absolute;
    top: 30px;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
}
</style>
