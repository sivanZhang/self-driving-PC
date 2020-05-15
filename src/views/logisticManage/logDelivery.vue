<template>
  <div id="logDelivery">
    <!-- 物流配送 -->
    <el-tabs v-model="firstActiveName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="物流配送" name="send">
        <el-row class="row-bg" :gutter="10">
          <el-col :span="5" class="col-bg">
            公司名称：
            <el-input style="width:170px" v-model="comName" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            编号：
            <el-input style="width:170px" v-model="serial" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            创建时间：
            <el-date-picker
              v-model="date"
              size="mini"
              style="width:170px"
              type="date"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="search()">点击查询</el-button>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="add()">创建</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="sendList"
          stripe
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="comName" label="公司名称" align="center"></el-table-column>
          <el-table-column prop="serial" label="编号" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="default" label="默认" align="center"></el-table-column>
          <el-table-column prop="date" label="创建时间" align="center"></el-table-column>
          <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button class="el-icon-delete" type="danger" @click="delRecord(scope.row.id)"></el-button>
              </el-tooltip>
              <div v-if="disabled==true">
                <el-tooltip effect="dark" content="点击禁用" placement="top">
                    <el-button class="el-icon-circle-close" type="danger" @click="change()"></el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-tooltip effect="dark" content="点击启用" placement="top">
                    <el-button class="el-icon-circle-check" type="danger" @click="change()"></el-button>
                </el-tooltip>
              </div>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-button class="el-icon-edit" type="danger" @click="putRecord(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="货到付款地区" name="place">货到付款地区</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    name: "logDelivery";
    return {
      firstActiveName: "send",
      comName:"",
      serial:"",
      date:"",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      sendList:[],
      disabled:true,
      auth:true
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    search(){

    },
    add(){

    },
    delRecord(){

    },
    change(){
        this.disabled = !this.disabled
    }
  }
};
</script>
<style lang='scss' scoped>
#logDelivery {
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 6px;
  }
}
</style>
