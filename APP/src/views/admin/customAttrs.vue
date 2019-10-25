<!-- 自定义属性 -->
<template>
  <div id="customAttrs">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="属性" name="tab0" lazy>
        <attrs :attrsList="attrsList" :auth="auth" :tableLoading="tableLoading" @refresh-attrs="getAttrs" @bindSearch="bindSearch"/>
      </el-tab-pane>
      <el-tab-pane label="实体属性" name="tab1" lazy>
        <attrsEntity :attrsEntityList="attrsEntityList" :auth="auth1" :tableLoading="tableLoading" @refresh-attrsEntity="getAttrsEntity" :attr_entity="attr_entity"/>
      </el-tab-pane>
      <el-tab-pane label="绑定属性" name="tab2" lazy>
       <attrsEntity :attrsEntityList="attrsEntityList" :auth="auth1" :tableLoading="tableLoading" @refresh-Entity="getBindList" :attr_entity="attr_entity"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as HTTP from "@/api/attrs";
import attrs from "./components/attrs";
import attrsEntity from "./components/attrsEntity"
export default {
  name: "customAttrs",
  components: { attrs,attrsEntity },
  data() {
    return {
      activeName: "tab0",
      attrsList: [],
      attrsEntityList:[],
     attr_entity:null,
      tableLoading: false,
      auth:null,
      auth1:null,
    };
  },
  watch: {
    activeName:{
      handler:function(newVal,oldVal){
        if(newVal === "tab1")
        {
          this.getAttrsEntity()
        }
        if(newVal === "tab2")
        {
          this.getBindList()
        }
      }
    }
  },
  methods: {
    bindSearch(){
      this.activeName = "tab2";
      this.getBindList()
    },
    getAttrs() {
      this.tableLoading = true;
      HTTP.getAttrsList().then(({ data }) => {
        if (data.status === 0) {
          this.attrsList = [...data.msg];
          this.auth = data.auth.manage_attr;
          this.tableLoading = false;
        }
      });
    },
    getAttrsEntity(){
      HTTP.getAttrsEntityList().then(({data})=>{
        this.tableLoading = true;
        if(data.status === 0){
          this.attrsEntityList = [...data.msg];
          this.tableLoading = false;
          this.attr_entity = 0
        }
      })
    },
    getBindList(){
      HTTP.searchBind().then(({data})=>{
        if(data.status === 0){
          this.auth1 = data.auth.can_manage_attrsbind;
          this.attrsEntityList = [...data.msg];
          this.attr_entity = 1
        }
      })
    }

  },
  created() {
    this.getAttrs();
    
  }
};
</script>
<style lang='scss' scoped>
</style>