<template>
    <div id="logistic">
    <!-- 物流管理 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="物流配送" name="first">
              <logDelivery/>
            </el-tab-pane>
            <el-tab-pane label="门店自提" name="second">
              <store/>
            </el-tab-pane>
            <el-tab-pane label="本地配送" name="third">本地配送</el-tab-pane>
            <el-tab-pane label="商家地址" name="fourth">商家地址</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import logDelivery from './components/logDelivery'
  import store from './components/store'
  export default {
    components:{
      logDelivery,
      store
    },
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>