<template>
  <div>
    <el-form :model="addGiftsForm" status-icon ref="addGiftsForm" label-width="90px">
      <div style="display:flex">
        <div>
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
        </div>
        <!-- <el-form-item label="创建人" prop="creator">
          <el-input v-model="addGiftsForm.creator"></el-input>
        </el-form-item>-->
        <div>
          <div style="display:flex">
            <el-form-item label="标题" prop="title">
              <el-input v-model="addGiftsForm.title"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category">
              <el-select v-model="addGiftsForm.category" filterable placeholder="请选择分类">
                <el-option v-for="item of giftsClassList" :label="item" :value="item" :key="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display:flex">
            <el-form-item label="名称" prop="spec_name">
              <el-input v-model="addGiftsForm.spec_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="spec_price">
              <el-input v-model.number="addGiftsForm.spec_price"></el-input>
            </el-form-item>
            <el-form-item label="虚拟币单价" prop="spec_coin">
              <el-input v-model.number="addGiftsForm.spec_coin"></el-input>
            </el-form-item>
          </div>
          <div style="display:flex">
            <el-form-item label="库存" prop="spec_number">
              <el-input v-model.number="addGiftsForm.spec_number"></el-input>
            </el-form-item>
            <el-form-item label="规格说明" prop="spec_content">
              <el-input v-model.number="addGiftsForm.spec_content"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-upload
       accept="turns/jpeg, turns/gif, turns/png"
       action="/api/appfile/appfile/"
       :headers="headers"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess1"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>

      <el-form-item label="礼品说明" prop="content" style="margin-top:10px">
        <el-input v-model="addGiftsForm.content" type="textarea" :rows="5"   placeholder="请输入礼品说明"></el-input>
      </el-form-item>
      <div style="text-align:right;">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('addGiftsForm')">提交</el-button>
      </div>
    </el-form>
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
      dialogImageUrl: '',
      dialogVisible: false,
      addGiftsForm: {
        //  creator: null,
        category: null,
        spec_name: null,
        title: null,
        picture: null,
        turns:null,
        spec_price: null,
        spec_content: null,
        content: null,
        spec_coin: null
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
      SRC1:"",
      headers: {
        Authorization: `JWT ${getToken()}`
      }
      //  currentPage: 1,
      // pageSize: 20,
      // pageSizeList: [10, 20, 50, 100]
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
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

    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      if (response.status == 0) {

        this.SRC = this.$store.state.BASE_URL + response.msg;
        this.addGiftsForm["picture"] = response.msg;
         console.log( this.addGiftsForm["picture"] )
        // this.addGiftsForm.image_id = response.id;
      } else {
        this.$message.error(response.msg);
      }
    },
      handleSuccess1(response, file, fileList) {
         const urls = fileList.map(item=>item.response.msg).join(",");
        //  console.log("000");
        //  console.log(urls);
      
      if (response.status == 0) {
       
        this.SRC1 = this.$store.state.BASE_URL + urls;
        
        this.addGiftsForm["turns"] = urls;
       console.log('111111')
       console.log(this.addGiftsForm["turns"])
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
      this.SRC = "";
      
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
</style>