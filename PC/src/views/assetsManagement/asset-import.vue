<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <input class="file_inp" ref="file_inp" accept=".xlsx" type="file" @change="importExcel" />
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
          <div style="padding-top:2px">
            <span style="font-weight:bold">镜头号：</span>
            不符合要求则返回“镜头号是必填字段”；
          </div>
          <div style="padding-top:2px">
            <span style="font-weight:bold">制作内容：</span>
            不符合要求则返回“制作内容是必填字段”。
          </div>
        </div>
        <div style="padding-top:3px;font-size:12px">
          <h3>非必填字段</h3>
          <div style="padding-top:2px">
            <span style="font-weight:bold">
              开始日期，结束日期，缩略图，路径，内部版本号，外部版本号，优先级，
              难度等级，场次，帧数，帧数范围，画面调整信息，变速信息，集数，备注，
            </span>这些字段可以选填或者不填。
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";
import XLSX from "xlsx";
import ImportTableTemplate from "@/views/components/importTableTemplate";
export default {
  neme: "asset-import",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      dialogVisible: false,
      uploadLoading: false,
      uploadDisabled: true,
      requiredKeysMap: {
        name: "镜头号",
        content: "制作内容"
      },
      keysMap: {
        start_date: "开始日期",
        end_date: "结束日期",
        image: "缩略图",
        path: "路径",
        inner_version: "内部版本号",
        outer_version: "外部版本号",
        priority: "优先级（高中低）",
        level: "难度等级（简单、标准、难）",
        session: "场次",
        frame: "帧数",
        frame_range: "帧数范围",
        report: "画面调整信息",
        retime: "变速信息",
        episode: "集数",
        remark: "备注"
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
    deleteTableRow() {
      this.$refs.tableTemplate.deleteRow();
    },
    //导入excel 变异为数组
    importExcel(e) {
      if (!e.target.files) {
        return;
      }
      let file = e.target.files[0];
      let Fdata = new FormData();
      Fdata.append("file", file);
      this.$refs.tableTemplate.openLoading("数据导入中");
      HTTP.parseExcel(Fdata).then(({ data }) => {
        //这里可判断数据是否为空
        this.testDataJSON = [...data.msg];
        this.importAsset();
        this.uploadDisabled = false;
        e.target.value = null; //可以重新导入同一个表
      });
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
      data = { ...data, project: this.$route.params.id };
      //提交jsons数据
      this.uploadLoading = true;
      HTTP.uploadAssets(data)
        .then(({ data }) => {
          if (data.msg) {
            this.$message.warning(data.msg);
          } else {
            let label = this.$route.query.type==='scene'?'镜头':'资产'
            this.$notify.info({
              title: "导入结果",
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `<div>${label}导入成功${data.create_asset.success_num}条、失败${data.create_asset.failure_num}条</div>
              <div>环节导入成功${data.create_link.success_num}条、失败${data.create_link.failure_num}条</div>
              <div> 任务导入成功${data.create_link.task_success_num}条、失败${data.create_link.task_failure_num}条</div>`
            });
            this.$router.push({
              name: "project-detail",
              params: { id: this.$route.params.id },
              qurey: {
                tab: "tab0"
              }
            });
          }
        })
        .finally(() => {
          this.uploadLoading = false;
        });
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
