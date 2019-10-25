<template>
  <div id="sharefiles">
    <div style="display:flex">
      <div style="width:30%;padding:0 10px">
        <div style="display:flex">
          <h4 style="margin: 0 10px;">上传文件</h4>
          <div class="el-upload__tip" slot="tip">上传文件的大小不可超过50M</div>
        </div>
        <div style="display:flex;margin-top:20px">
          <el-form
            ref="saveForm"
            :label-position="labelPosition"
            label-width="100px"
            :model="saveForm"
            class="save-form"
          >
            <el-form-item label="选取文件" prop="file">
              <el-upload
                class="upload-demo"
                ref="upload"
                accept="file"
                :action="action"
                :headers="headers"
                :on-success="handleSuccess"
                :before-remove="beforeRemove"
                :file-list="fileList"
                :clearFiles="clearFiles"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div style="width:70%;">
        <div style="padding-bottom:10px">
          <el-row>
            <el-col :span="16">
              <div style="display:flex">
                <h4 style="margin: 0 10px;">文件列表</h4>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="deletList"
                  style="margin-left:15px"
                  :disabled="this.multipleSelection.length === 0"
                  v-show="auth"
                >批量删除</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="16">
                  <el-input
                    v-model="filterText"
                    placeholder="请输入文件名称"
                    @keyup.enter.native="searchFilesList(1)"
                  >
                    <el-button
                      @click="searchFilesList(1)"
                      slot="append"
                      icon="el-icon-search"
                      type="primary"
                    />
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-button @click="searchFilesList()" type="primary" style="margin-left: 15px">重置</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div style="margin-top:10px; border: 1px solid #dfe6ec;">
          <el-table
            :row-key="row=>row.id"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%"
            ref="tableData"
            :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55px"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="filename" label="文件名称">
              <template slot-scope="scope">{{scope.row.filename}}</template>
            </el-table-column>
            <el-table-column prop="filepath" label="文件路径">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">{{scope.row.filepath}}</div>
                  <span @click="download(scope.row)" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
                </el-tooltip>
              </template>

              <!-- <template slot-scope="scope">{{scope.row.filepath}}</template> -->
            </el-table-column>

            <el-table-column prop="date" label="提交日期">
              <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
            </el-table-column>

            <el-table-column prop="username" label="提交人">
              <template slot-scope="scope">{{scope.row.username}}</template>
            </el-table-column>
            <el-table-column label="操作" v-if="auth">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button
                    icon="el-icon-delete"
                    style="color:red"
                    type="text"
                    @click="deleteFile(scope.row.id)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

 <script>
import { uploadfile, searchfileList, deletefile } from "@/api/sharefiles";
import { getToken } from "@/utils/auth";
export default {
  name: "sharefiles",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? this.$store.state.BASE_URL + "sharefiles/sharefiles/"
        : "/api/sharefiles/sharefiles/",
      fileList: [],
      labelPosition: "right",
      saveForm: {},
      disabled: false,
      tableData: [],
      multipleSelection: [],
      filterText: "",
      loading: false,
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      auth:null
    };
  },
  created() {
    this.searchFilesList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //点击下载文件
    download(row) {
      let data = this.$store.state.BASE_URL + row.filepath;
      window.location.href = data;
    },
    //批量删除
    deletList() {
      this.$confirm("此操作将永久删除文件,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        deletefile({
          method: "delete",
          ids: ids
        }).then(({ data }) => {
          this.$message.success(data.msg);
          this.searchFilesList();
        });
      });
    },
    //查询文件
    searchFilesList(Type) {
      if (Type === 1 && this.filterText) {
        searchfileList({ filename: this.filterText }).then(({ data }) => {
          this.tableData = [...data.msg];
          this.auth =data.auth.can_manage_sharefile
        });
      } else {
        searchfileList().then(({ data }) => {
          this.tableData = [...data.msg];
          this.auth =data.auth.can_manage_sharefile
        });
      }
    },
    beforeRemove(file, fileList) {
      git;
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //监听文件上传成功
    handleSuccess(response, file, fileList) {
      if (response.status === 0) {
        this.$message.success(response.msg);
        this.searchFilesList();
      } else {
        this.$message.error(response.msg);
      }
      this.loading = false;
      this.clearFiles();
    },
    clearFiles() {
      this.fileList = [];
    },
    //单个删除文件
    deleteFile(id) {
      deletefile({ method: "delete", ids: id }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.searchFilesList();
        }
      });
    }
  }
};
</script>
