<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="(item,index) in giftList" :key="index">
            <el-image
              class="mini-image"
              :src="item?$store.state.BASE_URL+item:''"
              fit="cover"
              style=" width: 100%; height: auto;"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="8">
        <label>标题: {{giftList2}}</label>
      </el-col>
      <el-col :span="14">
        <el-table :data="giftSpeList" border style="margin-top:5px">
          <el-table-column prop="id" label="规格id"></el-table-column>
          <el-table-column prop="name" label="礼品名称"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="coin" label="虚拟币价格"></el-table-column>
          <el-table-column prop="num" label="库存"></el-table-column>
          <el-table-column prop="content" label="礼品描述"></el-table-column>
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
  </div>
</template>

<script>
import { viewGifts, viewGiftsSpecs } from "@/api/gift";
import { getToken } from "@/utils/auth";
export default {
  name: "gift-detail",

  data() {
    return {
      giftList: [],
      giftList1: [],
      giftList2: [],
      giftSpeList: [],
      id: this.$route.params.id
    };
  },
  methods: {
    //轮播图
    getviewGifts() {
      var id = this.id;
      viewGifts({ product_id: id }).then(({ data }) => {
        let list = data.msg[0].turns;
        this.giftList = list;
        let list1 = data.msg[0].title;
        this.giftList2 = list1;
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
</style>