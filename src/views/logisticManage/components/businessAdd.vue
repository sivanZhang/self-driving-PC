<template>
  <div id="businessAdd">
    <!-- 商家地址 -->
    <el-row class="row-lg">
      <el-col :span="2" style="margin-top:3px">收货地址</el-col>
      <el-col :span="20">
        <el-input v-model="shipAdd" />
      </el-col>
    </el-row>
    <el-row class="row-lg">
      <el-col :span="2" style="margin-top:3px">收件人</el-col>
      <el-col :span="20">
        <el-input v-model="addressee" />
      </el-col>
    </el-row>
    <el-row class="row-lg">
      <el-col :span="2">联系人</el-col>
       <el-col :span="20">
        <el-input v-model="person" />
      </el-col>
    </el-row>
    <el-row class="row-lg">
      <el-col :span="2">邮编</el-col>
       <el-col :span="20">
        <el-input v-model="postcode" />
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-col :offset="11">
      <el-button type="primary">保存</el-button>
    </el-col>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    name: "businessAdd";
    return {
        shipAdd:"",
        addressee:"",
        person:"",
        postcode:""
    };
  },
  methods: {},
  created() {}
};
</script>
<style lang='scss' scoped>
#businessAdd {
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 6px;
  }
  .row-lg {
    padding-left: 70px;
    padding-top: 20px;
  }
}
</style>
