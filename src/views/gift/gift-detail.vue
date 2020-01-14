<!--礼品详情-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in turnsLists" :key="index">
            <el-image class="mini-image" :src="item?$store.state.BASE_URL+item:''" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="6">
        <label>标题: {{headline}}</label>
      </el-col>
      <el-col :span="8" style="padding-left:280px;">
        <el-button type="primary" icon="el-icon-plus" @click="openDialog(1)">添加规格</el-button>
      </el-col>
      <el-col :span="14">
        <el-table :data="giftSpeList" border style="margin-top:5px">
          <el-table-column prop="id" label="规格id"></el-table-column>
          <el-table-column prop="name" label="礼品名称">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.name"
                placeholder="请输入名称"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.name?scope.row.name:"-"}}</span>
              </el-input>
              <span v-if="!editing||clickId !== scope.row.id">{{scope.row.name?scope.row.name:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model.number="scope.row.price"
                placeholder="请输入价格"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.price?scope.row.price:"-"}}</span>
              </el-input>
              <span
                v-if="!editing||clickId !== scope.row.id"
              >{{scope.row.price?scope.row.price:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="coin" label="虚拟币价格">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model.number="scope.row.coin"
                placeholder="虚拟币价格"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.coin?scope.row.coin:"-"}}</span>
              </el-input>
              <span v-if="!editing||clickId !== scope.row.id">{{scope.row.coin?scope.row.coin:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="库存">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model.number="scope.row.num"
                placeholder="库存"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.num?scope.row.num:"-"}}</span>
              </el-input>
              <span v-if="!editing||clickId !== scope.row.id">{{scope.row.num?scope.row.num:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="礼品描述">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row.content"
                placeholder="礼品描述"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.content?scope.row.content:"-"}}</span>
              </el-input>
              <span
                v-if="!editing||clickId !== scope.row.id"
              >{{scope.row.content?scope.row.content:"-"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="修改" placement="top">
                <el-button
                  @click="editGiftSpecs(scope.row)"
                  icon="el-icon-edit"
                  type="text"
                  style="color:blue"
                  v-if="!editing||clickId !== scope.row.id"
                />
              </el-tooltip>
              <el-tooltip effect="dark" content="确认" placement="top">
                <el-button
                  v-if="editing&&clickId === scope.row.id"
                  type="text"
                  icon="el-icon-check"
                  style="color:green"
                  @click="saveGiftSpecs(scope.$index,scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-col :span="24" v-for="(item,index) in giftList1" :key="index">
      <el-card>
        <el-col :span="24">
          <p class="subtitle">礼品说明：</p>
          <div v-html="item.content"></div>
        </el-col>
      </el-card>
    </el-col>
    <!--添加规格-->
    <el-dialog title="添加规格" :visible.sync="dialogShow1" width="480px" top="5vh">
      <el-form :model="addSpecsForm" label-width="90px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addSpecsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number">
          <el-input v-model.number="addSpecsForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model.number="addSpecsForm.price"></el-input>
        </el-form-item>
        <el-form-item label="虚拟币单价" prop="coin">
          <el-input v-model.number="addSpecsForm.coin"></el-input>
        </el-form-item>
        <el-form-item label="规格说明" prop="content">
          <el-input v-model="addSpecsForm.content"></el-input>
        </el-form-item>
        <div class="btn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm('addSpecsForm')">创建</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  viewGifts,
  viewGiftsSpecs,
  addGiftSpecs,
  alterGiftSpecs
} from "@/api/gift";
import { getToken } from "@/utils/auth";
export default {
  name: "gift-detail",

  data() {
    return {
      dialogShow1: false,
      editing: false,
        row: null,
       clickId: null,
      turnsLists: [],
      giftList1: [],
      headline: [],
      giftSpeList: [],
      id: this.$route.params.id,
      addSpecsForm: {
        price: null,
        coin: null,
        name: null,
        content: null,
        number: null
      },
      rules: {
        name: [{ required: true, message: "名称不能为空" }],
        number: [
          { required: true, message: "数量不能为空" },
          { type: "number", message: "数量必须为数字值" }
        ],
        price: [
          { required: true, message: "单价不能为空" },
          { type: "number", message: "数量必须为数字值" }
        ],
        coin: [
          { required: true, message: "虚拟币不能为空" },
          { type: "number", message: "数量必须为数字值" }
        ]
      }
    };
  },
  methods: {
    openDialog(Type) {
      if (Type === 1) {
        this.dialogName = "添加规格";
        this.dialogShow1 = true;
      }
    },
    //轮播图
    getviewGifts() {
      var id = this.id;
      viewGifts({ product_id: id }).then(({ data }) => {
        let turnsList = data.msg[0].turns;
        this.turnsLists = turnsList;
        let head = data.msg[0].title;
        this.headline = head;
      });
    },
    getviewGifts1() {
      var id = this.id;
      viewGifts({ product_id: id }).then(({ data }) => {
        this.giftList1 = [...data.msg];
      });
    },
    //查看礼品规格
    getGiftsSpecs() {
      var id = this.id;
      viewGiftsSpecs({ product_id: id }).then(({ data }) => {
        this.giftSpeList = [...data.msg];
      });
    },
    //添加规格
    submitForm(addSpecsForm) {
      let specs = {};
      specs = {
        product: this.id,
        name: this.addSpecsForm.name,
        number: this.addSpecsForm.number,
        content: this.addSpecsForm.content,
        coin: this.addSpecsForm.coin,
        price: this.addSpecsForm.price
      };

      if (specs.content == null) {
        delete specs.content;
      }
      addGiftSpecs(specs).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.addSpecsForm = {};
          this.getGiftsSpecs();
          this.dialogShow1 = false;
        } else {
          this.$message.error(data.msg);
          this.addSpecsForm = {};
          this.getGiftsSpecs();
        }
      });
    },
    cancel() {
      this.addSpecsForm = [];
    },
     //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
    },
     //修改礼品规格
    editGiftSpecs(row) {
     
      if (this.iconShow === true) {
        this.$confirm("当前修改未保存", "注意", {

          type: "warning"
        });
      } else {
        this.editing = true;
        this.clickId = row.id;
        //   console.log('111111')
       //  console.log(this.clickId)
      }
    },
    //确认修改礼品规格
    saveGiftSpecs(index, row) {
      this.iconShow = false;

      let specs = {
        method: "put",
        id: row.id,
        name: row.name,
        number: row.num,
        price: row.price,
        coin: row.coin,
        content:row.content,

      };
    //  console.log('111111')
    //      console.log(specs)
      alterGiftSpecs(specs).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.getGiftsSpecs();
      (this.editing = false);
        } else {
          this.$message.error(data.msg);
        }
      });
     // console.log(dataMaterial)
    }
  },
  
  created() {
    this.getviewGifts();
    this.getGiftsSpecs();
    this.getviewGifts1();
  }
};
</script>

<style lang="scss" scoped>
.mini-image {
  width: 100%;
  height: auto;
}
.btn {
  text-align: right;
}
</style>