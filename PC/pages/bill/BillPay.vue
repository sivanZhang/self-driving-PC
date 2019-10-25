<template>
  <div id="billPay">
    <goHome />
    <van-nav-bar title="Pay Bills" left-arrow @click-left="$router.go(-1)" :border="false"/>
    <div class="container">
      <div class="mainCheck">
        <van-checkbox v-model="checked" checked-color="#41b88f"></van-checkbox>
        <div>Room 123 Building A</div>
      </div>
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title">
            <van-checkbox @tap.stop v-model="checked" checked-color="#41b88f"></van-checkbox>
          </div>提供多样店铺模板，快速搭建网上商城
        </van-collapse-item>
        <van-collapse-item title="有赞零售" name="2">网店吸粉获客、会员分层营销、一机多种收款，告别经营低效和客户流失</van-collapse-item>
        <van-collapse-item title="有赞美业" name="3" disabled>线上拓客，随时预约，贴心顺手的开单收银</van-collapse-item>
      </van-collapse>
      <div class="mainCheck">
        <van-checkbox v-model="checked" checked-color="#41b88f"></van-checkbox>
        <div>Room 123 Building A</div>
      </div>
    </div>
    <nav>03
      <div class="totle">
        Total
        <span class="price">${{400}}</span>
      </div>
      <div class="next">Next</div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      activeNames: ["1"]
    };
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
@import "./billPay.less";
</style>