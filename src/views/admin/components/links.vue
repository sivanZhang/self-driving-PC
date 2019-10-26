<template>
  <div id="links">
    <template v-if="!LinkTemplateList.length">
      <el-button icon="el-icon-plus" type="primary" @click="showLinkWKForm" v-if="DeptAuth">添加审批流程</el-button>
    </template>
    <template v-else>
      <el-button icon="el-icon-edit" type="success" @click="editLinkWKForm" v-if="DeptAuth">修改审批流程</el-button>
      <el-button
        icon="el-icon-delete"
        type="danger"
        @click="delLinkWKForm(LinkTemplateList)"
        v-if="DeptAuth"
      >删除审批流程</el-button>
      <el-steps direction="vertical" :active="1" :space="100">
        <el-step v-for="(item,index) of LinkTemplateList" :key="index" status="process">
          <div slot="title" style="font-size:14px">{{index+1|WKLevel}}</div>
          <ul slot="description" style="width:200px;">
            <el-row style="font-size:16px;font-weight:400;padding-top:20px">
              <span>审批角色：{{item.entity_id.role_name||item.entity_id.user_name}}</span>
            </el-row>
          </ul>
        </el-step>
      </el-steps>
    </template>

    <el-dialog title="添加审批流程" :visible.sync="isDrawerShow" width="514px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="审批类型"
              prop="type"
              :rules="[{ required: true, message: '请选择审批类型', trigger: 'blur' }]"
            >
              <el-radio-group v-model="item.type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="0">角色</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="item.type === 1">
              <el-form-item
                label="审批用户"
                prop="role_id"
                :rules="[{ required: true, message: '请输入审批工种', trigger: 'blur' }]"
              >
                <el-select v-model="item.role_id" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in UserList"
                    :key="item.value"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="item.type === 0">
              <el-form-item
                label="审批角色"
                prop="role_id"
                :rules="[{ required: true, message: '请输入审批角色', trigger: 'blur' }]"
              >
                <el-select v-model="item.role_id" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in rolesList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-form>
          <el-divider />
        </el-col>
        <el-col :span="4" align="center">
          <el-tooltip effect="dark" content="删除" placement="top">
            <span>
              <i class="el-icon-delete" style="color:red" @click="deleteLink(index)"></i>
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm()">立即创建</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="修改审批流程" :visible.sync="isUpdateShow" width="514px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of updateForm" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="editBefore(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="editAfter(index)">后续</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="审批类型"
              prop="type"
              :rules="[{ required: true, message: '请选择审批类型', trigger: 'blur' }]"
            >
              <el-radio-group v-model="item.type">
                <el-radio :label="1">用户</el-radio>
                <el-radio :label="0">角色</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="item.type === 1">
              <el-form-item
                label="审批用户"
                prop="role_id"
                :rules="[{ required: true, message: '请输入审批工种', trigger: 'blur' }]"
              >
                <el-select v-model="item.role_id" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in UserList"
                    :key="item.value"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="item.type === 0">
              <el-form-item
                label="审批角色"
                prop="role_id"
                :rules="[{ required: true, message: '请输入审批角色', trigger: 'blur' }]"
              >
                <el-select v-model="item.role_id" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in rolesList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-form>
          <el-divider />
        </el-col>
        <el-col :span="4" align="center">
          <el-tooltip effect="dark" content="删除" placement="top">
            <span>
              <i class="el-icon-delete" style="color:red" @click="editDeleteLink(index)"></i>
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-button @click="cancel2">取消</el-button>
        <el-button type="primary" @click="update()">立即修改</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoles,
  getWKTemplate,
  addWKTemplate,
  updateWKTemplate,
  deleteWKTemplate
} from "@/api/admin";
import { mapState } from "vuex";
export default {
  name: "links",
  data() {
    return {
      FormList: [{}],

      radio: null,
      isDrawerShow: false,
      isUpdateShow: false,
      rolesList: [],
      value: "",
      updateList: [{}],
      updateForm: [
        {
          level: null,
          role_id: null,
          type: null
        }
      ]
    };
  },
  props: ["LinkTemplateList", "deptId", "deptName", "DeptAuth"],
  computed: {
    ...mapState("admin", ["UserList"]) //DeptUsers是根据登录账号得来的
  },

  methods: {
    //前置
    before(ind) {
      this.FormList.splice(ind, 0, {});
    },
    //后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
    },
    //删除
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1);
    },
    editBefore(index) {
      this.updateForm.splice(index, 0, {});
      //this.updateForm[index].level = index +1;
      this.updateForm.forEach((item,index)=>{
        item.level = index +1
      })
    },
    editAfter(index) {
      console.log(index)
      this.updateForm.splice(index + 1, 0, {});
      this.updateForm.forEach((item,index)=>{
        item.level = index +1
      })
    },
    editDeleteLink(index) {
      if (index !== 0) this.updateForm.splice(index, 1);
    },
    cancel() {
      this.isDrawerShow = false;
      this.FormList = [{}];
    },
    rolesListChange(item) {
      this.$forceUpdate();

      // console.log(item);
    },
    showLinkWKForm() {
      this.isDrawerShow = true;
      //获取角色列表
      getRoles().then(({ data }) => {
        this.rolesList = [...data.msg];
        //console.log(this.rolesList);
      });
    },
    cancel2() {
      this.isUpdateShow = false;
      this.updateForm = [{}];
    },
    submitForm() {
      this.FormList.forEach((item, index) => {
        // if(item.type === 1)
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          level: index + 1,
          role_id: this.FormList[index].role_id,
          type: this.FormList[index].type
        });
      });
      //console.log(this.FormList);
      const msg = {
        dept: this.deptId,
        rule: this.FormList
      };
      addWKTemplate(msg)
        .then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
            this.isDrawerShow = false;
            // this.dynamicValidateForm.domains.value = "";
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {});
    },
    update() {
     //console.log(this.updateForm);
      // console.log(this.updateForm)
      const msg = {
        id: this.updateList[0].id,
        rule: this.updateForm,
        method: "put"
      };
      updateWKTemplate(msg)
        .then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
            this.isUpdateShow = false;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {});
    },
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== 0) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        key: Date.now()
      });
    },
    //展示修改审批流程
    editLinkWKForm() {
      getWKTemplate({
        dept: this.deptId
      }).then(({ data }) => {
        this.updateList = [...data.msg];
        this.updateList.forEach((item, index) => {
          let role_id = null;
          if (item.type === 1) {
            role_id = item.entity_id.user_id;
          } else {
            role_id = item.entity_id.role_id;
          }
          this.updateForm.splice(index, 1, {
            level: index + 1,
            role_id,
            type: this.updateList[index].type
          });
        });
        //console.log(this.updateForm);
        this.isUpdateShow = true;
      });

      //console.log(this.updateForm);
      //获取角色列表
      getRoles().then(({ data }) => {
        this.rolesList = [...data.msg];
        // console.log(this.rolesList);
      });
    },
    //删除审批流程
    delLinkWKForm(LinkTemplateList) {
      const id = LinkTemplateList[0].id;
      this.$confirm("删除模板后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteWKTemplate({
          method: "delete",
          id: id
        }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.$emit("refresh");
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

