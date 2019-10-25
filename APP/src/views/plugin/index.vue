<template>
  <div id="plugin">
    <ElRow :gutter="15">
      <ElCol :span="8" v-show="auth">
        <el-card>
          <h4 slot="header">创建插件</h4>
          <div style="display:flex;margin-top:20px">
            <el-form
              ref="saveForm"
              :label-position="labelPosition"
              label-width="100px"
              :model="saveForm"
              :rules="saveRules"
              class="save-form"
            >
              <el-form-item label="插件名称" prop="name">
                <el-input
                  ref="name"
                  v-model="saveForm.name"
                  placeholder="插件名称"
                  name="name"
                  type="text"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="适用软件" prop="software">
                <el-input
                  ref="software"
                  v-model="saveForm.software"
                  type="text"
                  placeholder="适用软件"
                  name="software"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="插件版本" prop="version">
                <el-input
                  ref="version"
                  v-model="saveForm.version"
                  type="text"
                  placeholder="版本号"
                  name="version"
                  style="width:220px"
                />
              </el-form-item>
              <el-form-item label="发布日期" prop="pubdate">
                <span>{{dateNow}}</span>
              </el-form-item>
              <el-form-item label="插件文件" prop="filepath">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  accept="file"
                  :multiple="false"
                  :action="action"
                  :headers="headers"
                  :on-success="handleSuccess"
                  :before-remove="beforeRemove"
                  :file-list="fileList"
                  :clearFiles="clearFiles"
                  :limit="1"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button :loading="loading" type="primary" @click="save">立即创建</el-button>
                <el-button @click="resetForm('saveForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </ElCol>
      <ElCol :span="16">
        <el-card>
          <h4 slot="header">插件列表</h4>
          <div>
            <el-row>
              <el-col :span="16">
                <div style="display:flex">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    @click="deletList"
                    :disabled="this.multipleSelection.length === 0"
                    v-show="auth"
                  >批量删除</el-button>
                </div>
              </el-col>
              <el-col :span="8">
                <el-row type="flex" justify="end">
                  <el-input
                    v-model="filterText"
                    placeholder="请输入插件名称"
                    @keyup.enter.native="searchPluginList(1)"
                  >
                    <el-button
                      @click="searchPluginList(1)"
                      slot="append"
                      icon="el-icon-search"
                      type="primary"
                    />
                  </el-input>
                  <el-button @click="searchPluginList()" type="primary" style="margin-left: 15px">重置</el-button>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div style="margin-top:15px; border: 1px solid #dfe6ec;">
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
              <el-table-column prop="name" label="插件名称">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              <el-table-column prop="software" label="适用软件">
                <template slot-scope="scope">{{scope.row.software}}</template>
              </el-table-column>

              <el-table-column prop="version" label="插件版本">
                <template slot-scope="scope">{{scope.row.version}}</template>
              </el-table-column>

              <el-table-column prop="pubdate" label="发布日期">
                <template slot-scope="scope">{{scope.row.pubdate|dateFormat}}</template>
              </el-table-column>
              <el-table-column prop="filepath" label="插件文件">
                <template slot-scope="scope">
                  <span @click="download(scope.row)" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="auth">
                <template slot-scope="scope">
                  <el-tooltip effect="dark" content="删除" placement="top">
                    <el-button
                      icon="el-icon-delete"
                      style="color:red"
                      type="text"
                      @click="deletePlugin(scope.row.id)"
                    />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </ElCol>
    </ElRow>
  </div>
</template>

 <script>
import { setPlugin, searchPlugin, deletePlugin } from "@/api/plugin";
import { getToken } from "@/utils/auth";
export default {
  name: "plugin",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? this.$store.state.BASE_URL + "appfile/appfile/"
        : "/api/appfile/appfile/",
      fileList: [],
      labelPosition: "right",
      saveForm: {},
      disabled: false,
      tableData: [],
      multipleSelection: [],
      filterText: "",
      saveRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请输入插件名称"
          }
        ],
        software: [
          {
            required: true,
            trigger: "blur",
            message: "请输入适用的软件"
          }
        ],
        version: [
          {
            required: true,
            trigger: "blur",
            message: "请输入插件版本号"
          }
        ]
      },
      loading: false,
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      dateNow: new Date().toLocaleDateString(),
      auth: null
    };
  },
  created() {
    // this.show();
    this.searchPluginList();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    deletList() {
      this.$confirm("此操作将永久删除插件,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        deletePlugin({
          method: "delete",
          ids: ids
        }).then(({ data }) => {
          this.$message.success(data.msg);
          this.searchPluginList();
        });
      });
    },
    //查询插件
    searchPluginList(Type) {
      if (Type === 1 && this.filterText) {
        searchPlugin({ name: this.filterText }).then(({ data }) => {
          this.tableData = [...data.msg];
          this.auth = data.auth.can_manage_plugin;
        });
      } else {
        searchPlugin().then(({ data }) => {
          this.tableData = [...data.msg];
          this.auth = data.auth.can_manage_plugin;
        });
      }
    },
    download(row) {
      let data = this.$store.state.BASE_URL + row.filepath;
      window.location.href = data;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //监听文件上传成功
    handleSuccess(response, file, fileList) {
      this.saveForm.filepath = response.msg;
      this.saveForm.file_id = response.id;
    },
    getPluginList() {
      let data = {
        name: this.saveForm.name,
        software: this.saveForm.software,
        version: this.saveForm.version,
        filepath: this.saveForm.filepath
      };
      setPlugin(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
        } else {
          this.$message.error(data.msg);
        }
        this.loading = false;
        this.$refs["saveForm"].resetFields();
        this.searchPluginList();
      });
    },
    clearFiles() {
      this.fileList = [];
    },
    //创建插件
    save() {
      this.$refs["saveForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.getPluginList();
          this.clearFiles();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //单个删除插件
    deletePlugin(id) {
      this.$confirm("此操作将永久删除该插件，是否继续?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        console.log(id);
        deletePlugin({ method: "delete", ids: id }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.searchPluginList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  }
};
</script>
