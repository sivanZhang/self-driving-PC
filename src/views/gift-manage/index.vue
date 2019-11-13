<template>
  <el-row :gutter="30">
    <el-col :span="6" v-for="(item,index) in giftList" :key="index">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class=".el-card__header">
          <div slot="header" class="box-card-header">
            <img src="../../icons/bkground.jpg" class="image" />
          </div>
        </div>
        <div style="padding: 18px;">
          <p>创建人：{{item.creator_info.username}}</p>
          <el-row>
            <el-col :span="8">
              <p class="subtitle">分类</p>
              <div>{{item.category}}</div>
            </el-col>
            <el-col :span="14">
              <p class="subtitle">名称</p>
              <div style="display:flex;">
                <div>{{item.specifications.name}}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <p class="subtitle">数量</p>
              <div>{{item.specifications.num}}</div>
            </el-col>
            <el-col :span="15">
              <p class="subtitle">标题</p>
              <div>{{item.title}}</div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- <div class="block" style="text-align: right;margin-top:10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="giftList.length"
      ></el-pagination>
  </div>-->
</template>

<script>
import { viewGifts } from "@/api/gift";
export default {
  data() {
    return {
      giftList: []

      //  currentPage: 1,
      // pageSize: 20,
      // pageSizeList: [10, 20, 50, 100]
    };
  },

  methods: {
    getviewGifts() {
      viewGifts().then(({ data }) => {
        this.giftList = [...data.msg];
        this.currentPage = 1;
        console.log("1111111");
        console.log(this.giftList);
      });
    }
    //   // 分页
    // handleSizeChange(val) {
    //   this.pageSize = val;

    // },
    // handleCurrentChange(currentPage) {
    //   this.currentPage = currentPage;

    // },
    // //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    // indexMethod(index) {
    //   return (this.currentPage - 1) * this.pageSize + index + 1;
    // },
  },

  created() {
    this.getviewGifts();
  }
};
</script>
<style lang='scss' scoped>
.el-card {
  position: relative;
  margin: 0 5px 30px 5px;
  width: 300px;

}
.box-card-header {
  position: relative;
  height: 162px;
  overflow: hidden;
}
.el-card__header {
  padding:0px 0px;
}

p {
  font-size: 12px;
  color: #909399;
  margin: 10px 0 5px;
}
.subtitle {
  margin: 15px 0 5px;
}
.image {
  width: 100%;
  display: block;
}
</style>