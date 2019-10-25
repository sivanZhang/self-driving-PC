<!-- 素材库 -->
<template>
  <div id="material">
    <div style="padding-bottom:10px" >
      <el-row>
        <el-col :span="15" v-if="authRole">
          <el-button type="primary" icon="el-icon-plus" @click="AddMaterial(1)">素材添加</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="mulDelMaterial()"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button>
        </el-col>
        <el-col :span="9" style="float:right">
          <el-row type="flex" justify="end">
            <el-select
              v-model="colSel"
              placeholder="请选择"
              style="width:100px"
              filterable
              size="mini"
            >
              <el-option
                v-for="item in columnSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-if="colShow"
              v-model="keyword"
              size="mini"
              placeholder="请输入关键字"
              @keyup.enter.native="searchMaterial()"
              style="width:200px"
            ></el-input>
            <el-select
              @keyup.enter.native="searchMaterial()"
              v-show="chooseSel"
              v-model="colSel2"
              placeholder="请选择"
              style="width:200px"
            >
              <el-option
                v-for="item in columnSelect2"
                :label="item.name"
                :value="item.name"
                :key="item.id"
              ></el-option>
            </el-select>
            <el-date-picker v-if="timeSel" v-model="timeSelection" type="date" placeholder="选择日期" style="width:200px"></el-date-picker>
            <el-button
              @click="searchMaterial()"
              icon="el-icon-search"
              style="height:27.99px"
              type="primary"
            />
            <el-button @click="searchMaterial2()" type="primary" style="margin-left: 15px">重置</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="materialList"
      :data="materialList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="{borderRight:0}"
      highlight-current-row
      :row-key="(row)=>{ return row.id}"
      :border="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true" align="left"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="缩略图" prop="image">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 48px;height: 27px;cursor: pointer;"
            :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
            v-if="!editing||clickId !== scope.row.id"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 48px;height: 27px;"
            @click.native="img(scope.row)"
            v-if="editing&&clickId === scope.row.id"
          >
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="素材名称" prop="name">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.name"
            placeholder="请输入素材名称"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.name?scope.row.name:"-"}}</span>
          </el-input>
          <span v-if="!editing||clickId !== scope.row.id">{{scope.row.name?scope.row.name:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材分类" prop="category">
        <template slot-scope="scope">
          <el-select
            v-model="categorys"
            multiple
            placeholder="请选择类型"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <el-option
              v-for="item of CategorysList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <span v-if="!editing||clickId !== scope.row.id">
            <el-row v-for="(item,index) of scope.row.category" :key="index">
              <el-col>{{item.name}}</el-col>
            </el-row>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="项目信息" prop="project_id">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.project_id"
            placeholder="请选择项目"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <el-option
              v-for="item of ProjectList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <span
            v-if="!editing||clickId !== scope.row.id"
          >{{scope.row.project?scope.row.project:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材路径" prop="path">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.path"
            placeholder="请输入素材路径"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.path?scope.row.path:"-"}}</span>
          </el-input>
          <span
            v-if="!editing||clickId !== scope.row.id"
            @click="show(scope.row.id)"
          >{{scope.row.path?scope.row.path:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="素材说明" prop="explain">
        <template slot-scope="scope">
          <el-input
            size="small"
            v-model="scope.row.explain"
            placeholder="请输入素材说明"
            v-if="editing&&clickId === scope.row.id"
            @change="showEditIcon"
          >
            <span>{{scope.row.explain?scope.row.explain:"-"}}</span>
          </el-input>
          <span
            v-if="!editing||clickId !== scope.row.id"
            @click="show(scope.row.id)"
          >{{scope.row.explain?scope.row.explain:"-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="estdate">
        <template slot-scope="scope">{{scope.row.estdate|dateFormat}}</template>
      </el-table-column>
      <template v-if="authRole">
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                @click="editMaterial(scope.row)"
                icon="el-icon-edit"
                type="text"
                style="color:blue"
                v-if="!editing||clickId !== scope.row.id"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-check"
                style="color:green"
                @click="saveMaterial(scope.$index,scope.row)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteMaterial(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizeList"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="materialList.length"
      ></el-pagination>
    </div>
    <!-- 修改素材时更改图片 -->
    <el-dialog title="上传图片" :visible.sync="dialogImg" width="480px" top="5vh">
      <el-form
        :model="ImgForm"
        ref="ImgForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
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
        <el-form-item>
          <el-button @click="cancel2">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addImg">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加素材 -->
    <el-dialog title="添加素材" :visible.sync="addDialog" width="480px" top="5vh">
      <el-form :model="materialForm" label-width="90px">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="添加分类" prop="categorys">
          <el-row>
            <el-col :span="14">
              <el-select
                v-model="materialForm.categorys"
                multiple
                :filterable="true"
                allow-create
                placeholder="请选择类型"
              >
                <el-option
                  v-for="item of CategorysList"
                  :label="item.name"
                  :value="item.name"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-tooltip effect="dark" content="删除分类" placement="top">
                <el-button
                  type="text"
                  style="color:red"
                  icon="el-icon-delete"
                  @click="deletCategory"
                ></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="项目信息" prop="project_id">
          <el-select v-model="materialForm.project_id" placeholder="请选择项目">
            <el-option
              v-for="item of ProjectList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="素材路径" prop="path">
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
        <el-form-item label="素材说明" prop="explain">
          <el-input type="textarea" v-model="materialForm.explain"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="AddMaterial()">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMaterial,
  addMaterial,
  delMaterial,
  putMaterial
} from "@/api/material";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";
import { getProjects } from "@/api/project";
export default {
  name: "material",
  components: {},
  data() {
    const isPro = Object.is(process.env.NODE_ENV, "production");
    return {
      action: isPro
        ? this.$store.state.BASE_URL + "appfile/appfile/"
        : "/api/appfile/appfile/",
      materialForm: {},
      materialList: [],
      editing: false,
      ProjectList: [],
      CategorysList: [],
      clickId: null,
      iconShow: false,
      dialogImg: false,
      row: null,
      SRC: "",
      ImgForm: {},
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      buttonStates: {
        createLoading: false
      },
      multipleSelection: [],
      imagePath: null,
      fileList: [],
      addDialog: false,
      authRole: null,
      filterText: null,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      categorys: [],
      colSel: "name",
      colShow: true,
      keyword: "",
      columnSelect: [
        {
          value: "name",
          label: "素材名称"
        },
        {
          value: "sort",
          label: "素材分类"
        },
        {
          value: "itemInfo",
          label: "项目信息"
        },
        {
          value: "explain",
          label: "素材说明"
        },
        {
          value: "date",
          label: "创建时间"
        }
      ],
      chooseSel: false,
      columnSelect2: [],
      colSel2: [],
      timeSel: false,
      timeSelection: ""
    };
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        if (newVal == "sort") {
          this.colShow = false;
          this.timeSel = false;
          this.chooseSel = true;
          this.columnSelect2 = this.CategorysList;
        } else if (newVal == "itemInfo") {
          this.colShow = false;
          this.timeSel = false;
          this.chooseSel = true;
          this.columnSelect2 = this.ProjectList;
        } else if (newVal == "date") {
          this.colShow = false;
          this.chooseSel = false;
          this.timeSel = true;
          this.timeSelection = "";
        } else {
          this.colShow = true;
          this.timeSel = false;
          this.chooseSel = false;
          this.colSel2 = [];
          this.columnSelect2 = [];
        }
      }
    }
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //获取所有项目
    getAllProjectList() {
      getProjects().then(({ data }) => {
        this.ProjectList = data.msg;
      });
    },
    //删除素材分类
    deletCategory() {
      let categoryid = [];
      this.CategorysList.map(item => {
        this.materialForm.categorys.map(ct => {
          if (item.name == ct) {
            categoryid.push(item.id);
          }
        });
      });
      delMaterial({ category_ids: String(categoryid), method: "delete" }).then(
        ({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.category = [];
            this.searchMaterial();
            this.materialForm.categorys = [];
          }
        }
      );
    },
    //素材添加
    AddMaterial(Type) {
      if (Type === 1) {
        this.addDialog = true;
      } else {
        this.materialForm.categorys = this.materialForm.categorys
          .map(item => item)
          .join(",");
        addMaterial(this.materialForm).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.addDialog = false;
            this.materialForm = {};
            this.fileList = [];
            this.searchMaterial();
          } else {
            this.$message.error(data.msg);
            this.materialForm = {};
            this.searchMaterial();
          }
        });
      }
    },
    //修改图片弹出
    img(row) {
      this.dialogImg = true;
      this.row = row;
      this.SRC = this.$store.state.BASE_URL + row.image;
    },
    //修改图片
    addImg() {
      // console.log(this.ImgForm)
      this.imagePath = this.ImgForm.image;
      this.SRC = this.$store.state.BASE_URL + this.imagePath;
      this.row.image = this.imagePath;
      this.row.image_id = this.ImgForm.id;
      this.dialogImg = false;
    },
    //图片弹框退出
    cancel2() {
      this.SRC = "";
      this.dialogImg = false;
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.ImgForm.image = response.msg;
      this.ImgForm.image_id = response.id;
      this.materialForm.path = response.msg;
      //this.materialForm.path_id = response.id;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    clearFiles() {
      this.fileList = [];
    },
    //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
    },
    //修改素材
    editMaterial(row) {
      if (this.iconShow === true) {
        this.$confirm("当前修改未保存", "注意", {
          // confirmButtonText: "确定",

          // concelButtonText: "取消",

          type: "warning"
        });
      } else {
        this.editing = true;
        this.clickId = row.id;
      }
    },
    //确认修改素材
    saveMaterial(index, row) {
      this.iconShow = false;

      let dataMaterial = {
        method: "put",
        id: row.id,
        name: row.name,
        ...this.ImgForm,
        path: row.path,
        explain: row.explain,
        project_id: row.project_id
      };
      if (this.categorys.length) {
        dataMaterial = {
          ...dataMaterial,
          categorys: this.categorys.map(item => item).join(",")
        };
      } else {
        dataMaterial = {
          ...dataMaterial,
          categorys: row.category.map(item => item.id).join(",")
        };
      }
      putMaterial(dataMaterial).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.searchMaterial();
          (this.categorys = null), (this.editing = false);
        } else {
          this.$message.error(data.msg);
        }
      });
      // console.log(dataMaterial)
    },
    //素材删除
    deleteMaterial(id) {
      this.$confirm("此操作将永久删除素材, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMaterial({ ids: id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.searchMaterial();
          }
        });
      });
    },
    //素材批量删除
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    mulDelMaterial() {
      const ids = this.multipleSelection.map(item => item.id).join(",");
      this.$confirm("此操作将永久删除素材, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delMaterial({ ids, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.searchMaterial();
          }
        });
      });
    },
    //查询素材库
    searchMaterial() {
      let data = {};
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      if (this.colSel == "name" && this.keyword) {
        data = {
          ...data,
          name: this.keyword
        };
      }
      if (this.colSel == "sort") {
        data = {
          ...data,
          category: this.colSel2
        };
      }
      if (this.colSel == "itemInfo") {
        data = {
          ...data,
         project: this.colSel2
        };
      }
      if (this.colSel == "explain") {
        data = {
          ...data,
          explain: this.keyword
        };
      }
      if (this.colSel == "date") {
        data = {
          ...data,
          date: DateFormat(this.timeSelection)
        };
      }
      getMaterial(data).then(({ data }) => {
        this.materialList = [...data.msg];
        this.authRole = data.auth.can_manage_material_state;
        this.currentPage = 1
      });
    },
    searchMaterial2() {
      getMaterial().then(({ data }) => {
        this.materialList = [...data.msg];
        this.materialList.map(item => {
          this.CategorysList = item.all_categorys;
        });
        this.authRole = data.auth.can_manage_material_state;
        this.currentPage = 1
      });
    }
    
  },
  created() {
    //this.searchMaterial();
    this.searchMaterial2();
    this.getAllProjectList();
  }
};
</script>
<style lang='scss' scoped>
</style>