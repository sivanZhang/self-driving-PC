<template>
  <div id="asset-list">
    <div style="padding-bottom:15px;">
      <el-button icon="el-icon-plus" type="primary" @click="showAssetForm">创建资产</el-button>
    </div>
    <el-table
      class="el-table"
      :data="TableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="border:1px solid #dfe6ec;border-bottom-width:0;width: 100%"
      :stripe="true"
      :row-style="{'font-size':'14px'}"
      :header-cell-style="{'font-size':'15px',background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column type="index" :index="indexMethod" label="序号" align="center" width="65px"></el-table-column>
      <el-table-column prop="changci" label="场次" align="center"></el-table-column>
      <el-table-column prop="jishu" label="集数" align="center"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="id" label="资产ID" v-if="false" align="center"></el-table-column>
      <el-table-column prop="path" label="路径" align="center"></el-table-column>
      <el-table-column prop="creator_name" label="创建人名称" align="center"></el-table-column>
      <el-table-column prop="creator_id" label="创建人ID" v-if="false" align="center"></el-table-column>
      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width:64px;height:36px"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="删除资产" placement="top">
            <el-button
              @click="deleteAssets(scope.row.id)"
              icon="el-icon-delete"
              type="text"
              style="color:red"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TableData.length"
      ></el-pagination>
    </div>
    <el-dialog title="新建" :visible.sync="isShow" width="480px" top="5vh">
      <el-form
        :model="AssetForm"
        :rules="rules"
        ref="assetForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
          ref="upload"
          class="upload-demo"
          :action="action"
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

        <el-form-item label="名称" prop="name">
          <el-input v-model="AssetForm.name"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="AssetForm.path"></el-input>
        </el-form-item>
        <el-form-item label="优先等级" prop="priority">
          <!-- <el-input v-model="AssetForm.code"></el-input> -->
          <el-radio v-model="AssetForm.priority" :label="0">正常</el-radio>
          <el-radio v-model="AssetForm.priority" :label="1">优先</el-radio>
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="AssetForm.level" placeholder="请选择难度等级">
            <el-option
              v-for="item of LevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资产类别" prop="category">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item label="内部版本号" prop="inner_version">
          <el-input v-model="AssetForm['inner_version']"></el-input>
        </el-form-item>
        <el-form-item label="外部版本号" prop="outer_version">
          <el-input v-model="AssetForm['outer_version']"></el-input>
        </el-form-item>
        <el-form-item label="所属项目" prop="project">
          <el-select filterable v-model="AssetForm.project" placeholder="请选择所属项目">
            <el-option v-for="item of ProjectList" :key="item" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联任务" prop="task">
          <el-input v-model="AssetForm.task"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addAsset">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as HTTP from "@/api/assets";

import { mapState } from "vuex";
import { getToken } from "@/utils/auth";

export default {
  neme: "asset-list",
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? this.$store.state.BASE_URL + "appfile/appfile/"
        : "/api/appfile/appfile/",
      SRC: "",
      TableData: [],

      AssetForm: {
        priority: 0
      },
      isShow: false,
      LevelList: [
        {
          label: "简单",
          value: 0
        },
        {
          label: "标准",
          value: 1
        },
        {
          label: "复杂",
          value: 2
        },
        {
          label: "高难度",
          value: 3
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      }
    };
  },

  computed: {
    ...mapState("project", ["ProjectList"])
  },
  methods: {
    _getAssetList() {
      HTTP.queryAssets().then(({ data }) => {
        this.TableData = [...data.msg];
        // console.log(this.TableData);
      });
    },
    deleteAssets(id) {
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //console.log(id);
        HTTP.deleteAssets({ id }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this._getAssetList();
          }
        });
      });
    },
    showAssetForm() {
      this.isShow = true;
      this.$refs["assetForm"].resetFields();
    },
    cancel() {
      this.isShow = false;
    },
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          HTTP.postAssets(this.AssetForm)
            .then(({ data }) => {
              this.createLoading = false;
              this.$message.success(data.msg);
              if (data.status === 0) {
                this._getAssetList();
              }
              this.isShow = false;
            })
            .catch(err => {
              this.createLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.AssetForm.image = response.msg;
      this.AssetForm.image_id = response.id;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      //console.log(this.pagesize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      //console.log(this.currentPage);
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  },
  components: {},
  created() {
    this._getAssetList();
  }
};
</script>
<style lang="scss" scoped>
</style>
