<template>
  <div id="giftClassify">
    <!-- 礼品分类 -->
    <ElRow :gutter="24">
      <ElCol :span="6">
        <el-card>
          <h4 slot="header">礼品分类</h4>
          <div>
            <el-row type="flex" align="middle" class="nav-title">
              <el-button @click="openDialog1('add')" type="success" style="width:100%">添加分类</el-button>
            </el-row>
            <el-input class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-tree
              class="filter-tree"
              empty-text="未创建分类"
              highlight-current
              ref="tree"
              :data="classList"
              @node-click="handleGroupClick"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="searchClass"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span style="margin-right:6px;">{{node.label}}</span>
                <span class="iconWarp">
                  <i
                    class="el-icon-plus"
                    @click="openDialog1('add',data)"
                    style="color:#409EFF;"
                    title="添加子类别"
                    v-if="auth"
                  ></i>
                  <i
                    class="el-icon-edit"
                    @click="openDialog1('update',data)"
                    style="color:#FEB402;margin-left:5px"
                    title="修改类别"
                    v-if="auth"
                  ></i>
                  <i
                    class="el-icon-delete"
                    @click="removeClass(data)"
                    style="color:#F56C6C;margin-left:5px"
                    title="删除当前类别"
                    v-if="auth"
                  ></i>
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </ElCol>
      <ElCol :span="18">
        <el-card>
          <h4 slot="header">礼品列表</h4>
          <div class="rigth-giftList" :table-loading="tableLoading">
            <el-row :gutter="30">
              <el-col :span="6" v-for="(item,index) in giftList" :key="index">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <div class="dropdow">
                    <el-dropdown placement="bottom" trigger="click">
                      <el-button type="text" style="color:#333">
                        <i class="el-icon-more"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown" style="margin-top:0px">
                        <router-link
                          :to="{name:'alter-gifts',params:{id:item.id},query:{type:item.pro_type}}"
                        >
                          <el-dropdown-item>修改</el-dropdown-item>
                        </router-link>
                        <el-dropdown-item @click.native="delGift(item)">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div class=".el-card__header">
                    <div slot="header" class="box-card-header">
                      <router-link
                        :to="{name:'gift-detail',params:{id:item.id},query:{type:item.pro_type}}"
                      >
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
                      </router-link>
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
                    </el-row>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </ElCol>
    </ElRow>
    <!-- 添加用户组弹出框 -->
    <el-dialog :title="dialogName1" :visible.sync="dialogShow1" width="460px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="classForm"
        ref="classForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="classForm.name" placeholder="请输入类别名称"></el-input>
        </el-form-item>
        <el-form-item label="父类别" prop="parent">
          <el-select class="select" v-model="classForm.parent" placeholder="请选择父类别" filterable>
            <el-option
              v-for="item in parent"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="classForm.sort" placeholder="请输入序号"
           oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio v-model="classForm.enabled" label="1">启用</el-radio>
          <el-radio v-model="classForm.enabled" label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addClass('classForm')">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getClassDetails,
  classQuery,
  addClass,
  delClass,
  putClass
} from "@/api/classManage";
import {
  viewGifts,
  deleteGift
} from "@/api/gift";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";
export default {
  name: "giftClassify",
  data() {
    return {
      giftList: [],
      classList:[],
      tableLoading: false,
      filterText: "",
      ActiveGroup: null,
      DialogType: {},
      defaultProps: {
        children: "children",
        label: "name"
      },
      classForm:{
        name:null,
        parent:null,
        sort:null,
        enabled:"0"
      },
      buttonStates: {
        createLoading: false
      },
      dialogShow1: false,
      dialogName1:null,
      Loadings: {
        addDeptLoading: false,

        memberEditLoading: false
      },
      manageAuth:false,
      auth:false,
      parent:[],
      edit:false,
      detailList:[],
      tableLoading:false
    };
  },
  methods: {
    //获取所有礼品
    getviewGifts() {
      viewGifts().then(({ data }) => {
        this.giftList = [...data.msg];
      });
    },
    //删除礼品
    delGift(item) {
      this.$confirm("此操作将永久删除该用户，是否继续?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteGift({ method: "delete", ids: item.id }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getviewGifts();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //获取类别
    getClassList(){
        classQuery().then(({data}) =>{
            this.auth = data.auth
            this.classList = data.msg
            this.parent = data.msg
        })
    },
    //打开添加类别弹出框
    openDialog1(type, node = null) {
      this.dialogShow1 = true;
      let enabled = ""
      let parentid = ""
      if(node){
        if(node.enable == true){
        enabled = "1"
        }else{
          enabled = "0"
        }
        if(node.parentid !== 0){
          parentid = node.parentid
        }else{
          parentid = null
        }
        this.classForm = Object.assign(
          {},
          {
            name: node.name,
            parent:parentid,
            enabled:enabled
          }
        );
      }else {
        this.DialogType = Object.assign(
          {},
          {
            title: "添加类别",

            type
          }
        );

        this.classForm = {};
      }
      if (type === "add"){
        this.dialogName1 = "添加子类别";
      } else if(type === "update"){
        this.dialogName1 = "修改类别";
      }
    },
    //关闭添加活动弹出框
    cancel() {
      this.dialogShow1 = false;
      this.$refs["classForm"].resetFields();
    },
    //添加类别
    addClass(classForm){
        let data = {
            name:this.classForm.name,
            parentid:this.classForm.parent,
            sort:this.classForm.sort,
            enabled:this.classForm.enabled,
        }
        addClass(data).then(({data}) => {
            if(data.status == 0){
                this.$message.success(data.msg);
                this.dialogShow1 = false;
                this.$refs["classForm"].resetFields();
                this.getClassList();
            }else{
                this.$message.error(data.msg);
            }
        })
    },
    //类别单击触发事件
    handleGroupClick(data) {
      this.tableLoading = true;
      viewGifts({category:data.name}).then(({ data }) => {
        this.giftList = [...data.msg];
        this.tableLoading = false;
      });
    },
    //删除类别
    removeClass(data) {
      this.$confirm("此操作将永久删除该类别?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delClass({
          ids:data.id,
          method:"delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getClassList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //搜索类别
    searchClass(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getClassList();
    this.getviewGifts();
    if (this.$route.query.id) {
      this.pageRouter();
    }
  },
};
</script>
<style lang="scss" scoped src="./gitClassify.scss">
</style>