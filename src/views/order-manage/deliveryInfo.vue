<template>
  <div id="deliveryInfo">
    <!-- 订单列表 -->
    <div  style="margin-bottom:5px;">
      <el-select v-model="colSel" placeholder="请选择" style="width:130px" filterable >
        <el-option
          v-for="item in columnSelect"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left:5px" @click="searchDelivery()">查询</el-button>
      <el-button type="primary" @click="reDelivery()">重置</el-button>
    </div>
    <el-table
      :data="orderList"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
      style="width: 100%"
     
    >
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_number" label="订单号" width="100px;"></el-table-column>
      <el-table-column prop="create_date" label="下单时间" width="100px;">
        <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="address" label="收货信息" width="180px;">
        <template slot-scope="scope">
          收货人：{{scope.row.address.receiver}}
          <br />
          手机号：{{scope.row.address.phone}}
          <br />
          地址：{{scope.row.address.address}}
        </template>
      </el-table-column>
      <el-table-column prop="number" label="购买数量" width="40px;"></el-table-column>
       <el-table-column  label="快递信息" width="180px;">
        <template slot-scope="scope">
          运单号：{{scope.row.express_number}}
          <br />
          快递公司：{{scope.row.express_company}}
        </template>
      </el-table-column>
      <el-table-column prop="purchase_way" label="购买方式"></el-table-column>
      <el-table-column prop="money" label="现金购买"></el-table-column>
      <el-table-column prop="coin" label="积分购买"></el-table-column>
      <el-table-column prop="coin_money" label="积分+现金购买"></el-table-column>
      <el-table-column prop="status" label="订单状态" :formatter="Status"></el-table-column>
      <!-- <el-table-column prop="user.user_name" label="创建人"></el-table-column> -->
      <el-table-column label="商品图" align="center" width="120px;">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.product.picture"
            style="width: 100%; height: 100%"
          >
            <!-- @click.native="show(scope.row.id)" -->
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="product.specifications" label="商品种类"></el-table-column> -->
       <el-table-column :key="18" label="操作">
        <template slot-scope="scope"   >
          <el-tooltip effect="dark" content="修改快递信息" placement="top" 
          >
            <el-button
              class="el-icon-edit"
              type="text"
              style="color:blue"
              @click="openDialog(scope.row)"
             v-if="scope.row.status==1||scope.row.status==0"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="更新快递信息" :visible.sync="dialogShow" width="400px">
      <el-form
        :model="updateExpress"
        status-icon
        :rules="rules"
        ref="updateExpress"
        label-width="90px"
      >
        <el-form-item label="快递单号" prop="express_number">
          <el-input
            v-model="updateExpress.express_number"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            placeholder="必须为数字"
          ></el-input>
        </el-form-item>
        <el-form-item label="快递公司" prop="express_company">
          <el-input type="text" v-model="updateExpress.express_company"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('updateExpress')">重置</el-button>
          <el-button type="primary" @click="submitForm('updateExpress')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { searchOrders, updateExpressInfo,searchStatusInfo } from "@/api/order";
import dayjs from "dayjs";
export default {
  data() {
    return {
      colSel: '1',
      columnSelect: [
        {
          value: '0',
          label: '未支付'
        },
        {
          value: '1',
          label: '待发货'
        },
        {
          value: '2',
          label: '待收货'
        },
        {
          value: '3',
          label: '已完成'
        },
        {
          value: '4',
          label: '关闭订单'
        }
      ],
      orderList: [],
      dialogShow: false,
      multipleSelection: [],
      updateExpress: {
        express_company: "",
        express_number: ""
      },
      id:'',
      rules: {
        // express_number: [{ type: "number", message: "单号必须为数字值 " }]
      }
    };
  },
  methods: {
    resetForm(updateExpress) {
      this.$refs["updateExpress"].resetFields();
    },
    submitForm(updateExpress) {
      this.$refs[updateExpress].validate(valid => {
        if (valid) {
          // const id = this.multipleSelection.map(item => item.id).join(",");
          updateExpressInfo({
            method: "put",
            id: this.id,
            express_number: this.updateExpress.express_number,
            express_company: this.updateExpress.express_company
          }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.dialogShow = false;
              this.updateExpress = {};
              this.getOrders();
            }
          });
          // alert("submit!");
        } else {
          return false;
        }
      });
    },
    Status: function(row, column) {
      switch (row.status) {
        case 0:
          return "未支付";
          break;
        case 1:
          return "待发货";
          break;
        case 2:
          return "待收货 ";
          break;
        case 3:
          return "已完成";
          break;
        case 4:
          return "关闭订单";
          break;
      }
    },
    getOrders() {
      searchOrders({status_id:1}).then(res => {
        this.orderList = res.data.msg;
      });
    },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    // },
    openDialog(row) {
    
        this.dialogShow = true;
        this.id=row.id
   
    },
    searchDelivery(){
       searchStatusInfo({status_id:this.colSel}).then(res => {
        this.orderList = res.data.msg;
        
      });

    },
    reDelivery(){
      this.colSel='';
      searchOrders().then(res => {
        this.orderList = res.data.msg;
      });
    }
    
  },

  created() {
    this.getOrders();
  }
};
</script>
<style lang='scss' scoped>
</style>