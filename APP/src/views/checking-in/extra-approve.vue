<!-- 加班审批 -->
<template>
  <div id="extra-approve">
    <template v-if="!extraTemplate.length&&$store.state.login.userInfo.auth.manage_overtime_template">
      <el-button type="primary" @click="addTemplate(1)">添加模板</el-button>
    </template>
    <template v-else>
      <div style="width:400px" v-if="$store.state.login.userInfo.auth.manage_overtime_template">
        <el-row style="padding:10px">
          <el-col :span="12">
            <el-button type="success" @click="editTemplate(1)">修改模板</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="danger" @click="delTemplate">删除模板</el-button>
          </el-col>
        </el-row>
      </div>
      <el-steps direction="vertical" :active="1" :space="100">
        <el-step v-for="(item,index) of extraTemplate" :key="index" status="process">
          <div slot="title" style="font-size:14px">{{index+1|WKLevel}}</div>
          <ul slot="description" style="width:200px;">
            <el-row style="font-size:16px;font-weight:400;padding-top:20px">
              <span>审批角色：{{item.name}}</span>
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
        <el-button type="primary" @click="addTemplate()">立即创建</el-button>
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
        <el-button type="primary" @click="editTemplate()">立即修改</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles } from "@/api/admin";
import {
  getExtraTemplate,
  delExtraTemplate,
  putExtraTemplate,
  createExtraTemplate
} from "@/api/checkingIn";
import { mapState } from "vuex";
export default {
  name: "extra-approve",
  components: {},
  data() {
    return {
      extraTemplate: [],
      isDrawerShow: false,
      isUpdateShow: false,
      FormList: [{}],
      rolesList: [],
      updateForm: [
        {
          level: null,
          role_id: null,
          type: null
        }
      ]
    };
  },
  watch: {},
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
      this.updateForm.forEach((item, index) => {
        item.level = index + 1;
      });
    },
    editAfter(index) {
      console.log(index);
      this.updateForm.splice(index + 1, 0, {});
      this.updateForm.forEach((item, index) => {
        item.level = index + 1;
      });
    },
    editDeleteLink(index) {
      if (index !== 0) this.updateForm.splice(index, 1);
    },
    cancel() {
      this.isDrawerShow = false;
      this.FormList = [{}];
    },
    cancel2() {
      this.isUpdateShow = false;
      this.updateForm = [{}];
    },
    addTemplate(Type) {
      if (Type === 1) {
        this.isDrawerShow = true;
        //获取角色列表
        getRoles().then(({ data }) => {
          this.rolesList = [...data.msg];
          //console.log(this.rolesList);
        });
      } else {
        this.FormList.forEach((item, index) => {
          // if(item.type === 1)
          this.FormList[index] = Object.assign({}, this.FormList[index], {
            level: index + 1,
            role_id: this.FormList[index].role_id,
            type: this.FormList[index].type
          });
        });
        createExtraTemplate({ rule: this.FormList }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.isDrawerShow = false;
            this.getTemplate();
          }
        });
      }
    },
    editTemplate(Type) {
      if (Type === 1) {
        getExtraTemplate().then(({ data }) => {
          this.updateList = [...data.msg];
          this.updateList.forEach((item, index) => {
            let role_id = null;

            role_id = item.id;

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
      } else {
        putExtraTemplate({ rule: this.updateForm }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.isUpdateShow=false;
            this.getTemplate();
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    delTemplate() {
      this.$confirm("删除模板后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delExtraTemplate({ method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getTemplate();
          }
        });
      });
    },
    getTemplate() {
      getExtraTemplate().then(({ data }) => {
        if (data.status === 0) {
          this.extraTemplate = [...data.msg];
        } else {
          this.extraTemplate = [];
        }
      });
    }
  },
  created() {
    this.getTemplate();
  }
};
</script>
<style lang='scss' scoped>
</style>