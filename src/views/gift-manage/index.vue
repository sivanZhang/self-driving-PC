<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="6" v-for="(item,index) in giftList" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class="dropdow">
            <el-dropdown placement="bottom" trigger="click">
              <el-button type="text" style="color:#333">
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" style="margin-top:0px">
                <el-dropdown-item
                  @click.native="delGift(item)"
                >删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class=".el-card__header">
            <div slot="header" class="box-card-header">
              <el-image
                class="mini-image"
                :src="item.picture?$store.state.BASE_URL+item.picture:''"
                fit="cover"
                style=" width: 100%; height: auto;"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </div>
          </div>
          <div style="padding: 18px;">
            <p>创建人：{{item.creator_info.username}}</p>
            <el-row>
              <el-col :span="8">
                <p class="subtitle">分类</p>
                <div>{{item.category}}</div>
              </el-col>
              <el-col :span="15">
                <p class="subtitle">标题</p>
                <div>{{item.title}}</div>
              </el-col>
               <el-col :span="8">
                <p class="subtitle">礼品说明</p>
                <div>{{item.content}}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
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
import {
  viewGifts,
  addGifts,
  viewGiftsClass,
  viewGiftsSpecs,
  deleteGift
} from "@/api/gift";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      giftList: [],
      giftsClassList: [],
      dialogShow2: false,
      SRC: "",
      headers: {
        Authorization: `JWT ${getToken()}`
      }
      //  currentPage: 1,
      // pageSize: 20,
      // pageSizeList: [10, 20, 50, 100]
    };
  },

  methods: {
    getviewGifts() {
      viewGifts().then(({ data }) => {
        this.giftList = [...data.msg];
      });
    },
    getGiftsClass() {
      viewGiftsClass().then(({ data }) => {
        this.giftsClassList = [...data.msg];
      });
    },
    //删除
    delGift(item) {
      this.$confirm("此操作将永久删除该用户，是否继续?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteGift({method: "delete", ids:item.id  }).then(({ data }) => {
          console.log(data.msg);
          if (data.status === 0) {
            this.$message.success(data.msg);
             this.getviewGifts();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      if (response.status == 0) {
        this.SRC = this.$store.state.BASE_URL + response.msg;
        this.addGiftsForm["picture"] = response.msg;
        // this.addGiftsForm.image_id = response.id;
      } else {
        this.$message.error(response.msg);
      }
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
    this.getGiftsClass();
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
  padding: 0px 0px;
}

p {
  font-size: 12px;
  color: #909399;
  margin: 10px 0 5px;
}
.subtitle {
  margin: 15px 0 5px;
}
.mini-image {
  cursor: pointer;
  overflow: hidden;
  opacity: 1;
}
.image-slot {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 56px;
  background: #dcdfe6;
}
.dropdow {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 3;
}
</style>