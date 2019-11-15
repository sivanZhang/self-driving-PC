<template>
  <div>
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button type="primary" :rules="rules" @click="openDialog(2)" icon="el-icon-plus">礼品添加</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="6" v-for="(item,index) in giftList" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <div class=".el-card__header">
            <div slot="header" class="box-card-header">
              <el-image
                class="mini-image"
                :src="item.picture?$store.state.BASE_URL+item.picture:''"
                fit="cover"
                style=" width: 100%;
                              height: auto;
"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture" style="color:#909399"></i>
                </div>
              </el-image>
            </div>
            <!-- <div slot="header" class="box-card-header">
              <img src="../../icons/bkground.jpg" class="image" />
            </div>-->
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
    <el-dialog title="礼品添加" :visible.sync="dialogShow2" width="400px">
      <el-form :model="addGiftsForm" status-icon ref="addGiftsForm" label-width="90px">
        <el-upload
          accept="picture/jpeg, picture/gif, picture/png"
          ref="upload"
          class="upload-demo"
          action="/api/appfile/appfile/"
          :headers="headers"
          :on-success="handleSuccess"
          drag
          :show-file-list="false"
        >
          <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
        <!-- <el-form-item label="创建人" prop="creator">
          <el-input v-model="addGiftsForm.creator"></el-input>
        </el-form-item>-->
        <el-form-item label="标题" prop="title">
          <el-input v-model="addGiftsForm.title"></el-input>
        </el-form-item>
        <el-form-item label="礼品说明" prop="content">
          <el-input v-model="addGiftsForm.content"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <!-- <el-input  v-model="addGiftsForm.category"></el-input> -->
          <el-select v-model="addGiftsForm.category" filterable placeholder="请选择分类">
            <el-option v-for="item of giftsClassList" :label="item" :value="item" :key="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="spec_name">
          <el-input v-model="addGiftsForm.spec_name"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="spec_number">
          <el-input v-model.number="addGiftsForm.spec_number"></el-input>
        </el-form-item>
        <el-form-item label="规格说明" prop="spec_content">
          <el-input v-model.number="addGiftsForm.spec_content"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="spec_price">
          <el-input v-model.number="addGiftsForm.spec_price"></el-input>
        </el-form-item>

        <div style="text-align:right">
         <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm('addGiftsForm')">提交</el-button>
        </div>
      </el-form>
    </el-dialog>
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
  viewGiftsSpecs
} from "@/api/gift";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      giftList: [],
      giftsClassList: [],
      dialogShow2: false,
      addGiftsForm: {
        //  creator: null,
        category: null,
        spec_name: null,
        title: null,
        picture: null,
        spec_price: null,
        spec_content: null,
        content: null
      },

      rules: {
        spec_number: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入数字",
            trigger: "change"
          }
        ]
      },
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

    openDialog(Type) {
      if (Type === 2) {
        this.dialogShow2 = true;
      }
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      if (response.status == 0) {
        this.SRC = this.$store.state.BASE_URL + response.msg;
        this.addGiftsForm["picture"] = response.msg;
        // this.addGiftsForm.image_id = response.id;
      } else {
        this.$message.error(response.msg);
      }
    },
    //添加礼品
    submitForm(addGiftsForm) {
      console.log("111111");
      console.log(this.addGiftsForm);
      addGifts(this.addGiftsForm).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.dialogShow2 = false;
          this.addGiftsForm = {};
          this.getviewGifts();
        } else {
          this.$message.error(data.msg);
          this.addGiftsForm = {};
          this.getviewGifts();
        }
      });
    },
    cancel() {
        //this.dialogShow2 = false;
      this.addGiftsForm = [];
      this.SRC="";
    },
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
                background: #DCDFE6;
            }
</style>