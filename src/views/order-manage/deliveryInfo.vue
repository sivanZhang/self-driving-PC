<template>
  <div id="deliveryInfo">
    <!-- 快递信息 -->
    <el-button
      type="primary"
      @click="openDialog(1)"
      :disabled="this.multipleSelection.length === 0 ||this.multipleSelection.length>1"
      style="margin-bottom:5px;"
    >修改快递信息</el-button>
    <el-table
      :data="orderList"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_number" label="订单号" width="160px;"></el-table-column>
      <el-table-column prop="create_date" label="创建时间" width="100px;">
        <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="address.address" label="地址" width="150px;"></el-table-column>
      <el-table-column prop="address.phone" label="手机号" width="120px;"></el-table-column>
      <el-table-column prop="address.receiver" label="收货人"></el-table-column>
      <el-table-column prop="number" label="商品数量" width="40px;"></el-table-column>
      <el-table-column prop="express_number" label="运单号 "></el-table-column>
      <el-table-column prop="express_company" label="快递公司"></el-table-column>
      <el-table-column prop="purchase_way" label="购买方式"></el-table-column>
      <el-table-column prop="money" label="现金购买"></el-table-column>
      <el-table-column prop="coin" label="积分购买"></el-table-column>
      <el-table-column prop="coin_money" label="积分+现金购买"></el-table-column>
      <el-table-column prop="user.user_name" label="创建人"></el-table-column>
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
      <el-table-column prop="product.specifications" label="商品种类"></el-table-column>
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
          <el-input v-model="updateExpress.express_number"
          onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
           placeholder="必须为数字"></el-input>
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
import { searchOrders, updateExpressInfo } from "@/api/order";
import dayjs from "dayjs";
export default {
  data() {
    return {
      orderList: [],
      dialogShow: false,
      multipleSelection: [],
      updateExpress: {
        express_company: "",
        express_number: ""
      },
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
          const id = this.multipleSelection.map(item => item.id).join(",");
          updateExpressInfo({
            method: "put",
            id: id,
            express_number: this.updateExpress.express_number,
            express_company:this.updateExpress.express_company
          }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.dialogShow = false;
               this.updateExpress = {};
                this.getOrders();
            }
          });
          // alert("submit!");
        } 
        else {
          return false;
        }
      });
    },

    getOrders() {
      searchOrders().then(res => {
        this.orderList = res.data.msg;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openDialog(Type) {
      if (Type === 1) {
        this.dialogShow = true;
      }
    }
  },

  created() {
    this.getOrders();
  }
};
</script>
<style lang='scss' scoped>
</style>