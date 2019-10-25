<template>
  <div>
    <goHome/>
    <van-nav-bar title="Confirm Payment" left-arrow @click-left="$router.go(-1)" fixed :border="false" />
    Confirm Payment
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="less" scoped>
  @import "./ConfirmPayment.less";
</style>