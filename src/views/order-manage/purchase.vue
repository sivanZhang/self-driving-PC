<template>
  <div id="purchase">
    <!-- 购买方式 -->
    <el-table
      :data="PurchaseWayList"
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
      <el-table-column prop="goods__title" label="商品的标题" width="300px;"></el-table-column>
      <el-table-column prop="goods__content" label="商品的内容" width="230px"></el-table-column>
      <el-table-column label="商品图"  width="140px;" height="50px;">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.goods__picture"
            style="width: 100%; height: 100%"
          >
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
      <el-table-column
        prop="purchase_way"
        label="购买方式"
        :formatter="Purchase_way"
        width="180px"
        align="center"
      ></el-table-column>
      <el-table-column prop="coin" label="积分数量" width="110px"></el-table-column>
      <el-table-column prop="cash" label="现金数量" width="110px"></el-table-column>
      <el-table-column prop="coin_cash" label="积分+现金 " width="150px;"></el-table-column>
      <el-table-column :key="18" label="操作" align="center" width="110px;">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改购买方式" placement="top">
            <el-button
              class="el-icon-edit"
              type="text"
              style="color:blue"
              @click="openDialog1(scope.row)"
           
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改商品购买方式" :visible.sync="dialogShow1" width="380px">
      <el-form
        :model="alertWaysForm"
        status-icon
        :rules="rules"
        ref="alertWaysForm"
        label-width="90px"
      >
        <el-form-item label="购买方式" prop="purchaseWay ">
          <el-select v-model="alertWaysForm.purchaseWay" placeholder="请选择" multiple>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分数量" prop="coin">
          <el-input
            style="width:192px;"
            v-model="alertWaysForm.coin"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            placeholder="必须为数字"
          ></el-input>
        </el-form-item>
        <el-form-item label="现金数量" prop="cash">
          <el-input
            style="width:192px;"
            v-model="alertWaysForm.cash"
            onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
            placeholder="必须为数字"
          ></el-input>
        </el-form-item>
        <el-form-item label="积分+现金数量" prop="coin_cash">
          <el-input
            style="width:192px;"
            v-model="alertWaysForm.coin_cash"
            onkeyup="this.value = this.value.replace(/[^\d+(,\d\d\d)*.\d+$]/g,'');"
            placeholder="用逗号隔开，左边是积分"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('alertWaysForm')">重置</el-button>
          <el-button type="primary" @click="alertForm('alertWaysForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  searchPurchaseWay,
  addPurchaseWay,
  editPurchaseWay
} from "@/api/order";
import dayjs from "dayjs";
export default {
  data() {
    return {
      PurchaseWayList: [],
      multipleSelection: [],
      dialogShow1: false,
      options: [
        {
          value: "1",
          label: "支持积分"
        },
        {
          value: "2",
          label: "支持现金"
        },
        {
          value: "3",
          label: "支持现金+积分"
        }
      ],
      value: "",
      rules: {},
      addWaysForm: {
        purchaseWay: null,
        coin: null,
        cash: null,
        coin_cash: null
      },
      alertWaysForm: {
        purchaseWay: null,
        coin: null,
        cash: null,
        coin_cash: null
      },
      id: ""
    };
  },
  methods: {
    resetForm(alertWaysForm) {
      this.$refs["alertWaysForm"].resetFields();
    },
   
    alertForm(alertWaysForm) {
      let params = {};
      params = {
        goods_id: this.id,
        purchase_way: this.alertWaysForm.purchaseWay
          .map(item => item)
          .join(","),
        coin: this.alertWaysForm.coin,
        cash: this.alertWaysForm.cash,
        coin_cash: this.alertWaysForm.coin_cash
      };
      if (params.coin == null) {
        delete params.coin;
      }
      if (params.cash == null) {
        delete params.cash;
      }
      if (params.coin_cash == null) {
        delete params.coin_cash;
      }
      addPurchaseWay(params).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.dialogShow1 = false;
          this.addWaysForm = {};
          this.getPurchaseWay();
        }
      });
    },
    openDialog1(row) {
      this.id = row.goods_id;
      var array = row.purchase_way.split(",");
      this.alertWaysForm = {
        purchaseWay: array,
        coin: row.coin,
        cash: row.cash,
        coin_cash: row.coin_cash
      };
      this.dialogShow1 = true;
    },
    getPurchaseWay() {
      searchPurchaseWay().then(res => {
        this.PurchaseWayList = res.data.msg;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //购买方式格式化
    Purchase_way: function(row, column) {
      var str = "";
      var value = row[column.property];
      if (value.indexOf("1") > -1) {
        str += "支持积分，";
      }
      if (value.indexOf("2") > -1) {
        str += "支持现金，";
      }
      if (value.indexOf("3") > -1) {
        str += "支持现金+积分";
      }
      return str;
    }
  },

  created() {
    this.getPurchaseWay();
  }
};
</script>
<style lang='scss' scoped>
</style>