<template>
  <view class="container header-warp">
    <image @tap="search" src="/static/icons/search.png" mode="aspectFit"></image>
    <input
      @keydown.enter="search"
      :value="value"
      @input="$emit('enterKeywords',$event.target.value)"
      type="search"
      :placeholder="searchText"
    >
  </view>
</template>

<script>
export default {
  name: "search",
  props: {
    value: String,
    searchText:{
      default:'search',
    }
  },
  model: {
    prop: "value",
    event: "enterKeywords"
  },
  methods: {
    search() {
      this.$emit("onSearch");
    }
  }
};
</script>

<style lang="scss" scoped>
.header-warp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2.083upx solid #c8c8cc;
  height: 108.333upx;
  image {
    width: 41.666upx;
    height: 41.666upx;
  }
  input {
    flex: 1 1 auto;
    margin-left: 47.916upx;
    height: 75upx;
    line-height: 75upx;
  }
}
</style>