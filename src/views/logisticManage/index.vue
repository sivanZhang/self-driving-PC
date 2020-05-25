<template>
    <div id="logistic">
    <!-- 物流管理 -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="物流配送" name="first">
              <Logistics/>
            </el-tab-pane>
            <el-tab-pane label="门店自提" name="second">
              <store/>
            </el-tab-pane>
            <el-tab-pane label="本地配送" name="third">
              <localDelivery/>
            </el-tab-pane>
            <el-tab-pane label="商家地址" name="fourth">
              <businessAdd/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  import Logistics from './components/Logistics'
  import store from './components/store'
  import localDelivery from './components/localDelivery'
  import businessAdd from './components/businessAdd'
  export default {
    components:{
      Logistics,
      store,
      localDelivery,
      businessAdd
    },
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>