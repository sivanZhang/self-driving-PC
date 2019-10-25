<template>
  <div id="d-header">
    <!-- 项目头部展示 -->
    <template v-if="project && project.entity_type === 4">
      <div>
        <el-row class="header-first">
          <el-col :span="3">
            <div class="color" :style="{backgroundColor:project.color||'transparent'}"></div>
          </el-col>
          <el-col :span="21">
            <div>
              <span class="project-name">
                <router-link
                  :to="{name:'project-detail',params:{id:project.id},query:{type:project.pro_type}}"
                >{{project.name}}</router-link>
              </span>
            </div>
            <div>
              <div class="project-type">{{'project'}}</div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" align="top" class="header-body">
          <el-col :span="9">
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
              <el-tooltip class="item" effect="dark" content="拖动至此处可替换图片" placement="top">
                <el-image v-if="SRC" :src="SRC" fit="cover" style="width: 160px;height: 100px;"></el-image>

                <template v-else>
                  <div style="padding-top:15px">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      拖入图片，或
                      <em>点击上传</em>
                    </div>
                  </div>
                </template>
              </el-tooltip>
            </el-upload>
          </el-col>
          <el-col :span="15">
            <el-row>
              <el-col :span="6" class="project-name">项目状态</el-col>
              <el-col :span="18" class="project-name">{{project.status|projectStatus}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">项目编码</el-col>
              <el-col :span="18" class="project-comment">{{project.code}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">开始日期</el-col>
              <el-col :span="18" class="project-comment">{{project.date_start |dateFormat}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">截止日期</el-col>
              <el-col :span="18" class="project-comment">{{project.date_end |dateFormat}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- 资产的头部展示 -->
    <template v-if="project && project.entity_type === 5">
      <div style="height:170px">
        <div class="header-first">
          <el-col :span="4">
            <svg-icon icon-class="asset" style="width:40px;height:40px"></svg-icon>
          </el-col>
          <el-col :span="20">
            <el-row>
              <span class="project-name">{{project.name}}</span>
            </el-row>
            <el-row>
              <div class="project-type">{{'资产'}}</div>
            </el-row>
          </el-col>
        </div>
        <div class="header-body">
          <el-col :span="9">
            <el-image
              class="mini-image"
              :src="project.image?$store.state.BASE_URL+project.image:''"
              fit="cover"
              style="width: 160px;height: 90px;float: left;margin-right: 10px"
            ></el-image>
          </el-col>
          <el-col :span="15">
            <el-row>
              <el-col :span="6" class="project-name">
                <slot name="type">类型</slot>
              </el-col>
              <el-col :span="18" class="project-name">{{project.category>0?project.category:"未分类"}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">创建人</el-col>
              <el-col :span="18" class="project-comment">{{project.creator_name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">优先级</el-col>
              <el-col :span="18" class="project-comment">{{project.priority |Priority}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6" class="project-comment">难度等级</el-col>
              <el-col :span="18" class="project-comment">{{project.level |Level}}</el-col>
            </el-row>
          </el-col>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { putProjects } from "@/api/project";
import { getToken } from "@/utils/auth";
import { log } from "util";
export default {
  name: "d-header",
  props: {
    project: {
      type: Object
    }
  },
  data() {
    return {
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      SRC:
        this.project && this.project.image
          ? this.$store.state.BASE_URL + this.project.image
          : ""
    };
  },
  watch: {
    project(val) {
      this.SRC =
        this.project && this.project.image
          ? this.$store.state.BASE_URL + this.project.image
          : "";
    }
  },
  methods: {
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      if(response.status == 0){
        this.SRC = this.$store.state.BASE_URL + response.msg;
        const data = {
        image: response.msg,
        image_id: response.id,
        method: "put",
        name: this.project.name,
        color: this.project.color,
        id: this.project.id
      };
      putProjects(data).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$store.dispatch("project/get_Projects");
        }
      });
      } else {
        this.$message.error(response.msg)
      }
     
    }
  }
};
</script>

<style lang="scss" scoped>
#d-header {
  & /deep/ .el-upload-dragger {
    height: 100px;
    width: 160px;
    font-size: 12px;
    .el-icon-upload {
      margin: 0;
      font-size: 40px;
    }
  }
  .header-first {
    //height: 60px;
    border-bottom: 1px solid rgb(221, 221, 221);
    display: flex-wrap;
    justify-content: flex-start;
    font-size: 16px !important;
    font-weight: 300 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-bottom: 10px;
    .project-name {
      font-size: 16px !important;
      font-weight: 300 !important;

      :hover {
        color: rgba(59, 59, 211, 0.849);
      }
    }
    .project-type {
      font-size: 12px;
      color: #a9abae;
    }
    .color {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      position: relative;
    }
  }
}
.header-body {
  padding-top: 10px;
  .mini-image {
    cursor: pointer;
    overflow: hidden;
    opacity: 1;

    &:hover {
      opacity: 0.8;
      transition: all 2s;
    }
  }
  .project-name {
    font-size: 12px;
    font-weight: 400;
  }
  .project-comment {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
