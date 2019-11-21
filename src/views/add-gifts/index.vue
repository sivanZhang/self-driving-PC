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
            <div class="button" style=";margin-left:20px">
              <el-button type="primary" @click.prevent="addRow()">添加规格</el-button>
              <el-button type="primary" @click.prevent="batchDelete()">删除规格</el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              :data="tableData"
              ref="multipleTable"
              tooltip-effect="dark"
              border
              stripe
              style="width:900px"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45" align="center"></el-table-column>
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="名称" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="价格">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.price"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="虚拟币单价">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.coin"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="礼品数量">
                <template slot-scope="scope">
                  <el-input v-model.number="scope.row.number"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="礼品规格">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.content"></el-input>
                </template>
              </el-table-column>
            </el-table>
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
        <el-input v-model="addGiftsForm.content" type="textarea" :rows="5" placeholder="请输入礼品说明"></el-input>
      </el-form-item>
      <div style="text-align:right;">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('addGiftsForm','tableData')">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  viewGifts,
  addGifts,
  viewGiftsClass,
  viewGiftsSpecs,
  addGiftSpecs
} from "@/api/gift";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      tableData: [
        {
         // rowNum: "",
          price: null,
          coin: null,
          name: null,
          content: null,
          number: null
        }
      ],
      multipleSelection: [],

      selectlistRow: [],

      giftList: [],
      giftsClassList: [],
      giftsSpecsList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogShow1: false,
      addGiftsForm: {
        category: null,
      title: null,
        picture: null,
        turns: null,
        content: null,
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
      SRC1: "",
      headers: {
        Authorization: `JWT ${getToken()}`
      }
    };
  },

  methods: {
    addRow() {
      var list = {
        //rowNum: "",
        name: null,
        price: null,
        coin: null,
        number: null,
        content: null
      };
      this.tableData.push(list);
      // console.log("11111");
      // console.log(this.tableData);
    },
    // 删除方法
    // 删除选中行
    batchDelete() {
      let multData = this.multipleSelection;
      let tableData = this.tableData;
      let multDataLen = multData.length;
      let tableDataLen = tableData.length;
      for (let i = 0; i < multDataLen; i++) {
        for (let y = 0; y < tableDataLen; y++) {
          if (JSON.stringify(tableData[y]) == JSON.stringify(multData[i])) {
            //判断是否相等，相等就删除
            this.tableData.splice(y, 1);
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //  console.log('11111')
      //  console.log( this.multipleSelection)
    },

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
    openDialog(Type) {
      if (Type === 1) {
        this.dialogShow1 = true;
      }
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
    },
    handleSuccess1(response, file, fileList) {
      const urls = fileList.map(item => item.response.msg).join(",");
      if (response.status == 0) {
        this.SRC1 = this.$store.state.BASE_URL + urls;
        this.addGiftsForm["turns"] = urls;
        // this.addGiftsForm.image_id = response.id;
      } else {
        this.$message.error(response.msg);
      }
    },
    //添加礼品
    submitForm(addGiftsForm, tableData) {
      addGifts({
        title:this.addGiftsForm.title,
        category:this.addGiftsForm.category,
        content:this.addGiftsForm.content,
        picture:this.addGiftsForm.picture,
          turns:this.addGiftsForm.turns,
        specifications:this.tableData,
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
         this.addGiftsForm = {};
         this.SRC = "";
          this.getviewGifts();
        } else {
          this.$message.error(data.msg);
          this.addGiftsForm = {};
          this.getviewGifts();
        }
      });
    },
    cancel() {
      this.addGiftsForm = [];
      this.SRC = "";
    }
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