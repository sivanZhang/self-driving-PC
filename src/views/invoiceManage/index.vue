<template>
  <div id="invoiceManage">
    <!-- 发票管理 -->
    <el-row class="row-bg" :gutter="10">
      <el-col :span="5" class="col-bg">
        订单编号：
        <el-input style="width:170px" v-model="orderNumber" @keyup.enter.native="search()"></el-input>
      </el-col>
      <el-col :span="4" class="col-bg">
        昵称：
        <el-input style="width:150px" v-model="nickName" @keyup.enter.native="search()"></el-input>
      </el-col>
      <el-col :span="5" class="col-bg">
        公司抬头：
        <el-input style="width:170px" v-model="letterHead" @keyup.enter.native="search()"></el-input>
      </el-col>
      <el-col :span="4" class="col-bg">
        类型：
        <el-select v-model="orderType" placeholder="请选择" style="width:150px;" filterable>
          <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="col-bg">
        纳税人识别号：
        <el-input style="width:150px" v-model="identifier" @keyup.enter.native="search()"></el-input>
      </el-col>
      <el-col :span="5" class="col-bg">
        订单状态：
        <el-select v-model="orderStatus" placeholder="请选择" style="width:170px;" filterable>
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="col-bg">
        备注：
        <el-select v-model="orderRemark" placeholder="请选择" style="width:150px;" filterable>
          <el-option
            v-for="item in remark"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-col :span="4" class="col-bg">
        <el-button type="primary" style="height:27.99px" @click="search()">点击查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="invoiceList"
      stripe
      highlight-current-row
      style="width: 100%;"
      :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
      :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
    >
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="orderNumber" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="tax" label="税额" align="center"></el-table-column>
      <el-table-column prop="letterHead" label="公司抬头" align="center"></el-table-column>
      <el-table-column prop="identifier" label="纳税人识别号" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" align="center"></el-table-column>
      <el-table-column prop="time" label="创建时间" align="center"></el-table-column>
      <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除" placement="top">
            <el-button class="el-icon-delete" type="danger" @click="delRecord(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button class="el-icon-edit" type="danger" @click="putRecord(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderNumber: "",
      nickName: "",
      orderType: "",
      type: [
        {
          value: "-1",
          label: "全部"
        },
        {
          value: "0",
          label: "公司"
        },
        {
          value: "1",
          label: "个人"
        }
      ],
      tax: "",
      letterHead: "",
      identifier: "",
      orderRemark: "",
      remark: [
        {
          value: "0",
          label: "办公用品"
        },
        {
          value: "1",
          label: "明细"
        },
        {
          value: "2",
          label: "其它"
        }
      ],
      orderStatus: "",
      status: [
        {
          value: "0",
          label: "待付款"
        },
        {
          value: "1",
          label: "待发货"
        },
        {
          value: "2",
          label: "已发货"
        },
        {
          value: "3",
          label: "已收货"
        },
        {
          value: "4",
          label: "已关闭"
        }
      ],
      date: "",
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
      invoiceList: [],
      auth: true
    };
  },
  methods: {
    //查询
    search() {
      console.log("这是查询按钮");
    },
    //删除
    delRecord() {
      console.log("这是删除");
    },
    //编辑
    putRecord() {
      console.log("这是编辑");
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
#invoiceManage {
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 6px;
  }
}
</style>