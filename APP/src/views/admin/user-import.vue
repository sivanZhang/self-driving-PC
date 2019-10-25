<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <input
        class="file_inp"
        ref="file_inp"
        accept=".xlsx, .xls, .csv"
        type="file"
        @change="importExcel($event.target)"
      />
      <el-button
        icon="el-icon-circle-plus"
        type="success"
        @click="openFile"
        class="pan-btn green-btn"
        size="mini"
      >添加Excel</el-button>
      <!-- openFile -->
      <el-button
        icon="el-icon-upload"
        type="success"
        @click="getAsset"
        class="pan-btn green-btn"
        size="mini"
        :loading="uploadLoading"
        :disabled="uploadDisabled"
      >上传</el-button>
      <el-button
        icon="el-icon-refresh-left"
        type="success"
        @click="importAsset(1)"
        class="pan-btn green-btn"
        size="mini"
      >清空表格</el-button>
      <el-button
        icon="el-icon-delete-solid"
        type="danger"
        @click="deleteTableRow()"
        class="pan-btn red-btn"
        v-show="$refs.tableTemplate?$refs.tableTemplate.tableData.length : false"
        size="mini"
      >删除已选</el-button>
      <span
        style="padding-left:15px;font-size:12px;color:#808080;cursor: pointer;"
        @click="openExplain()"
      >
        使用帮助:
        <svg-icon icon-class="wenhao" />
      </span>
    </div>
    <import-table-template ref="tableTemplate" @returnAssemblingData="returnAssemblingData"></import-table-template>
    <el-dialog title="注意事项" :visible.sync="dialogVisible" width="365px">
      <div style="padding-left:5px;padding-bottom:20px;padding-right:5px">
        <div style="font-size:12px">
          <h3>必填字段</h3>
          <h4>用户名：</h4>
          <div style="padding-top:2px">规定长度，不符合要求则返回“长度过长”或“长度为0”；</div>
          <div style="padding-top:2px">不得重复用户名，否则返回“此用户名已被使用”。</div>
        </div>
        <div style="padding-top:2px;font-size:12px">
          <h4>邮箱：</h4>
          <div style="padding-top:2px">规定格式，不符合格式则返回“email格式错误”；</div>
          <div style="padding-top:2px">不得重复邮箱，否则返回“此邮箱已被使用”。</div>
        </div>
        <div style="padding-top:2px;font-size:12px">
          <h4>手机号码：</h4>
          <div style="padding-top:2px">规定格式，不符合格式则返回“phone格式错误”；</div>
          <div style="padding-top:2px">不得重复号码，否则返回“此号码已被使用”。</div>
        </div>
        <div style="padding-top:2px;font-size:12px">
          <h4>部门：</h4>
          <div style="padding-top:2px">若用户所属部门不存在，则返回“未能找到该对应工种”。</div>
        </div>
        <div style="padding-top:2px;font-size:12px">
          <h4>是否启用：</h4>
          <div style="padding-top:2px">规定格式，只能为0和1，（0：未使用，1：使用中）；</div>
          <div style="padding-top:2px">若输入的不是数字，则返回“isactive字段只能为数字”；</div>
          <div style="padding-top:2px">若输入的数字不为0或1，则返回“isactive字段只能为0或1”。</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUsers } from "@/api/admin";
import XLSX from "xlsx";
import ImportTableTemplate from "@/views/components/BaseImportTemplate";
export default {
  neme: "asset-import",
  data() {
    return {
      dialogVisible: false,
      uploadLoading: false,
      uploadDisabled: true,
      requiredKeysMap: {
        name: "用户名",
        email: "邮箱"
      },
      keysMap: {
        phone: "手机号码",
        dept: "部门",
        isactive: "是否使用"
      },
      testDataJSON: []
    };
  },
  components: { ImportTableTemplate },
  methods: {
    //导入说明
    openExplain() {
      this.dialogVisible = true;
    },
    //点击隐藏的上传文件按钮
    openFile() {
      this.$refs.file_inp.click();
    },
    //导入excel 变异为数组
    importExcel(obj) {
      let _self = this;
      if (!obj.files) {
        return;
      }
      let file = obj.files[0],
        types = file.name.split(".")[1],
        fileType = ["xlsx", "xlc", "xlm", "xls", "xlt", "xlw", "csv"].some(
          item => item === types
        );
      if (!fileType) {
        this.$message.error("格式错误！请重新选择");
        return;
      }
      _self.testDataJSON = [];
      _self.$refs.tableTemplate.openLoading("数据导入中");
      //异步等到解析文件后调用其他方法
      file2Xce(file).then(tabJson => {
        //这里可判断数据是否为空
        _self.testDataJSON = [...tabJson];
        _self.importAsset();
        _self.uploadDisabled = false;
        obj.value = null; //可以重新导入同一个表
      });
      function file2Xce(file) {
        return new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(e) {
            let data = e.target.result;
            let wb = XLSX.read(data, {
              type: "binary"
            });
            resolve(
              XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
                header: 1, //二维数组展示
                raw: false,
                skipHeader: true
              })
            );
          };
          reader.readAsBinaryString(file);
        });
      }
    },
    //获得编辑后的数据
    getAsset() {
      this.$refs.tableTemplate.getAssemblingData();
    },
    /**
     * 获取表格组装好的数据
     * 组件中必须 @returnAssemblingData="returnAssemblingData"
     */
    returnAssemblingData(data) {
      //提交jsons数据
      this.uploadLoading = true;
      uploadUsers(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.$notify({
              title: `用户导入成功${data.success_num}条，失败${data.fail_num}条`,
              message: data.msg.join(),
              duration: 0,
              type: "warning"
            });
            this.$router.push({
              name: "profession"
            });
          } else {
            this.$message.warning(data.msg);
          }
        })
        .finally(() => {
          this.uploadLoading = false;
        });
    },
    deleteTableRow() {
      this.$refs.tableTemplate.deleteRow();
    },
    //导入数据 type=1表示重置
    importAsset(type) {
      if (type === 1) {
        this.$refs.tableTemplate.initData({
          reset: true,
          datas: [],
          keysMap: {},
          requiredKeysMap: {}
        });
        return;
      }
      let data = {
        reset: false,
        datas: this.testDataJSON,
        keysMap: this.keysMap,
        requiredKeysMap: this.requiredKeysMap
      };
      this.$refs.tableTemplate.initData(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.file_inp {
  display: none;
}
</style>
