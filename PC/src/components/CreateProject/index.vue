<template>
  <div id="create-project">
    <el-dialog title="新建项目" :visible.sync="isShow" width="480px" top="5vh" @closed="cancel()">
      <el-form
        :model="ProjectForm"
        :rules="rules"
        ref="projectForm"
        label-width="100px"
        class="demo-ProjectForm"
        label-position="left"
        hide-required-asterisk
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
        <el-form-item label="类型">
          <!-- <el-radio-group v-model="radio">
            <el-radio :label="0">实训项目</el-radio>
            <el-radio :label="1">项目</el-radio>
          </el-radio-group>-->
          <el-switch
            v-model="radio"
            active-value="0"
            inactive-value="1"
            active-text="实训项目"
            inactive-text="标准项目"
          ></el-switch>
        </el-form-item>
        <el-form-item label="周期选择">
          <el-switch
            v-model="ProjectForm.wk_type"
            active-value="1"
            inactive-value="0"
            active-text="自然日"
            inactive-text="工作日"
          ></el-switch>
        </el-form-item>
        <!-- <el-form-item label="颜色" prop="color">
          <el-color-picker
            v-model="ProjectForm.color"
            :predefine="predefineColors"
            color-format="hex"
          ></el-color-picker>
        </el-form-item>-->
        <el-form-item label="项目名称" prop="name">
          <el-input v-model.trim="ProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目编码" prop="code">
          <el-input v-model="ProjectForm.code"></el-input>
        </el-form-item>
        <el-form-item label="制作要求" prop="requirement">
          <el-input v-model="ProjectForm.requirement" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="Windows路径" prop="windows_path">
          <el-input v-model="ProjectForm.windows_path"></el-input>
        </el-form-item>
        <el-form-item label="Mac路径" prop="mac_path">
          <el-input v-model="ProjectForm.mac_path"></el-input>
        </el-form-item>
        <el-form-item label="Linux路径" prop="linux_path">
          <el-input v-model="ProjectForm.linux_path"></el-input>
        </el-form-item>
        <template v-if="radio == 1">
          <el-form-item label="项目预算" prop="budget">
            <el-input v-model="ProjectForm.budget">
              <span slot="append">万</span>
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="工作流" prop="region">
          <el-select v-model="ProjectForm.status" placeholder="请选择工作流">
            <el-option label="未开始" :value="0"></el-option>
            <el-option label="正在进行" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="region">
          <el-select v-model="ProjectForm.chargerid" filterable placeholder="请选择负责人">
            <el-option
              v-for="item of UserList"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期" required prop="datetime">
          <el-date-picker
            v-model="ProjectForm.datetime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
            format="yyyy/MM/dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="模板使用">
          <div style="padding-left:3px;float:left">
            <el-button type="primary" @click="projectTemplate(1)">项目模板</el-button>
            <el-input
              style="padding-top:10px;"
              :disabled="true"
              v-model="TemplateListName"
              placeholder="选择的模板名称"
            ></el-input>
          </div>
          <div style="padding-left:3px;"></div>
        </el-form-item>
        <div style="text-align:right">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="isShowNext" width="480px" top="5vh" @closed="cancel()">
      <el-row>
        <el-col align="center">
          <svg-icon icon-class="success" style="width:50px;height:50px"></svg-icon>
        </el-col>
        <el-col align="center" style="padding-top:10px">
          <h2>创建成功</h2>
        </el-col>
        <el-col align="center" style="padding-top:25px">
          <h4 style="font-weight:100;">已创建新项目</h4>
          <h4 style="font-weight:100;">前往项目以查看项目详情，或点击导入镜头进行资产导入</h4>
        </el-col>
      </el-row>
      <el-row style="padding-top:20px;padding-bottom:30px;">
        <el-col align="center">
          <router-link :to="{name:'project-detail',params:{id:id},query:{type:radio}}">
            <el-button type="primary" @click="cancel1()" style="margin-right:20px">前往项目</el-button>
          </router-link>

          <router-link :to="`/import/asset-import/${id}`">
            <el-button type="primary" @click="cancel1()">导入镜头</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 项目模板 -->
    <el-dialog
      title="项目模板"
      :visible.sync="projectTemplateDialog"
      width="512px"
      center
      :modal="false"
      @close="cancelprojectTemplate"
    >
      <el-tabs v-model="projectActiveName">
        <el-tab-pane label="项目模板" name="project-first">
          <el-table
            ref="statusTemplateList"
            :data="statusTemplateList"
            :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
            :cell-style="{borderRight:0}"
            highlight-current-row
            :border="false"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column label="模板名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                  <el-button
                    icon="el-icon-top-right"
                    style="color:green"
                    type="text"
                    @click="projectTemplate(2,scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="模板详情" name="project-second" :disabled="templateDetail">
          <el-row style="padding:3px">
            <el-col :span="12">
              <span>状态列表</span>
              <div style="display:flex;overflow: auto;">
                <div class="box">
                  <el-row>
                    <div class="maxstatus-name">暂停：</div>
                  </el-row>
                  <el-row v-for="item of pause" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">未开始：</div>
                  </el-row>
                  <el-row v-for="item of notstart" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">进行中：</div>
                  </el-row>
                  <el-row v-for="item of conducting" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">审核中：</div>
                  </el-row>
                  <el-row v-for="item of approving" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">完成：</div>
                  </el-row>
                  <el-row v-for="item of finish" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <span>工种列表</span>
              <div v-for="(item,index) of projectTemplateList" :key="index" style="padding-top:5px">
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-row>
          <div style="padding-left:350px">
            <el-button type="primary" @click="saveProjectTemplate">选择模板</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { addProjects } from "@/api/project";
import AXIOS from "@/utils/request";
import { getToken } from "@/utils/auth";
import { mapState } from "vuex";
import { searchTemplate } from "@/api/status";
/* 
import { close } from "fs"; */
export default {
  name: "CreateProject",
  data() {
    return {
      projectTemplateDialog: false,
      templateid: "",
      statusTemplateList: [],
      projectTemplateList: [],
      projectActiveName: "project-first",
      statusList: [],
      deptsList: [],
      statusid: [],
      templateDetail: true,
      approving: [],
      conducting: [],
      finish: [],
      notstart: [],
      pause: [],
      TemplateList: [],
      TemplateListName: null,
      ProjectForm: {
        image: null
        // color: "#409EFF"
      },
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#c7158577"
      ],
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
        start: [
          { required: true, message: "请输入项目开始日期", trigger: "blur" }
        ],
        end: [
          { required: true, message: "请输入项目结束日期", trigger: "blur" }
        ],
        budget: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入数字",
            trigger: "change"
          }
        ]
      },
      SRC: "",
      file: null,
      headers: {
        Authorization: `JWT ${getToken()}`
      },

      isShowNext: false,
      id: null,
      radio: null
    };
  },
  props: {
    //父组件接，控制是否显示弹框
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    //项目模板
    projectTemplate(Type, row) {
      //获取模板列表
      if (Type === 1) {
        this.projectTemplateDialog = true;
        searchTemplate().then(({ data }) => {
          this.statusTemplateList = [...data.msg];
        });
      }
      //展示模板详情
      if (Type === 2) {
        (this.projectTemplateList = []),
          (this.pause = []),
          (this.notstart = []);
        (this.conducting = []),
          (this.approving = []),
          (this.finish = []),
          (this.TemplateList = row.name);
        this.projectActiveName = "project-second";
        searchTemplate({ id: row.id }).then(({ data }) => {
          const datastatus = data.msg.small_status;
          const deptdata = data.msg.depts;
          //  console.log(datastatus)
          //  console.log(deptdata)
          this.templateid = data.msg.id;
          datastatus.forEach(item => {
            this.statusid = item;
            if (item <= 2) {
              this.pause.push(item);
            }
            if (item > 2 && item <= 5) {
              this.notstart.push(item);
            }
            if (item > 5 && item <= 15) {
              this.conducting.push(item);
            }
            if (item > 15 && item <= 19) {
              this.approving.push(item);
            }
            if (item > 19) {
              this.finish.push(item);
            }
          });
          deptdata.forEach((item, index) => {
            this.projectTemplateList[index] = item;
          });
        });
      }
    },
    //选择模板
    saveProjectTemplate() {
      this.TemplateListName = this.TemplateList;
      this.projectTemplateDialog = false;
    },
    cancelprojectTemplate() {
      this.projectActiveName = "project-first";
    },
    cancel() {
      //告诉父组件：不显示弹框
      this.$emit("update:isShow", false);
      this.TemplateListName = [];
    },
    cancel1() {
      this.isShowNext = false;
      this.TemplateListName = [];
    },
    //验证，并提交创建项目的表单
    submitForm() {
      this.$refs["projectForm"].validate(valid => {
        if (valid) {
          // console.log(this.ProjectForm)
           if (this.ProjectForm.requirement) {
            this.ProjectForm.requirement = this.ProjectForm.requirement
              .replace(/\r\n/g, "<br/>")
              .replace(/\n/g, "<br/>")
              .replace(/\s/g, "&nbsp;");
          }
          let Data = {
            ...this.ProjectForm,
            start: this.ProjectForm.datetime[0].toLocaleDateString(),
            end: this.ProjectForm.datetime[1].toLocaleDateString()
          };
         
          if (this.templateid) {
            Data = { ...Data, templateid: this.templateid };
          }

          delete this.ProjectForm.datetime[0];
          delete this.ProjectForm.datetime[1];
          if (this.radio === 0) {
            Data = { ...Data, training: null };
          }
          addProjects(Data).then(({ data }) => {
            // this.$message.success("项目创建成功！");
            if (data.status === 0) {
              this.id = data.id;
              this.isShowNext = true;
              if (this.radio === 0) {
                this.$store.dispatch("trainingStatus/get_TrainProject");
              } else {
                this.$store.dispatch("project/get_Projects");
              }
              this.$emit("update:isShow", false);
            }else{
              this.$message.error(data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      if(response.status == 0){   
        this.SRC = this.$store.state.BASE_URL + response.msg;
        this.ProjectForm["image"] = response.msg;
        this.ProjectForm.image_id = response.id;
      }else{
        this.$message.error(response.msg);
      }
    },
  },
  created() {
    !this.UserList && this.$store.dispatch("admin/get_UserList");
  },

  watch: {
    isShow(val) {
      //弹框关闭后，form数据重置、验证重置
      if (!val) {
        this.SRC = "";
        this.ProjectForm = {};
        this.$refs["projectForm"].resetFields();
      }
    }
  }
};
</script>
<style lang="scss">
.el-upload-dragger {
  width: 440px;
  height: 220px;
  border: 0px;
}
.el-upload-dragger:hover {
  border-color: transparent;
}

.el-dialog__body {
  padding: 10px 20px;
}
.el-form-item--mini .el-form-item__label {
  line-height: 28px;
  font-size: 12px;
}
</style>
<style lang="scss" scoped>
.line {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 247px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
label {
  font-size: 12px;
  font-weight: 500;
}
.upload-demo {
  .el-upload {
    .el-upload-dragger {
      width: 440px;
      height: 247px;
    }
  }
}
</style>
<style lang="scss">
.box {
  overflow: auto;
  border: 1px solid #e8eaec;
  margin: 0 10px;
}
.maxstatus-name {
  width: 100%;
  background-color: #eef1f6;
  height: 30px;
  font-weight: 600;
  font-display: center;
  padding: 5px;
  border-bottom: 1px solid rgb(234, 232, 236);
}
.minstatus-name {
  border-bottom: 1px solid #e8eaec;
  height: 25px;
  width: 100%;
  padding: 5px;
  font-display: center;
  cursor: pointer;
}
</style>


