<template>
  <div id="bind">
    <el-tabs tab-position="left" style="height: ;overflow: auto;padding-top:10px">
      <el-tab-pane label="外审系统配置" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:50%;padding:5px" v-if="$store.state.login.userInfo.auth.admin_management">
            <div style="display:flex">
              <el-form
                ref="saveForm"
                :label-position="labelPosition"
                label-width="100px"
                :model="saveForm"
                :rules="saveRules"
                class="save-form"
              >
                <el-form-item label="协议及地址" prop="host">
                  <el-input
                    ref="host"
                    v-model="saveForm.host"
                    placeholder="协议及地址"
                    name="host"
                    type="text"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="端口号" prop="port">
                  <el-input
                    ref="port"
                    v-model="saveForm.port"
                    type="text"
                    placeholder="端口号"
                    name="port"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button :loading="loading" type="primary" @click="save">保存</el-button>
                  <el-button @click="resetForm('saveForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="width:50%;padding:5px">
            <div style="display:flex">
              <h4 style="margin: 0 10px;">已完成的配置</h4>
            </div>
            <div class="bind-name" style="padding-top:10px">
              <el-row>
                <el-col :span="4">协议及地址：</el-col>
                <el-col :span="20">{{host}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="4">端口号：</el-col>
                <el-col :span="20">{{port}}</el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="客户部门绑定" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width: 50%;" v-if="$store.state.login.userInfo.auth.admin_management">
            <h4 style="margin: 0 10px;">部门列表</h4>
            <div class="box">
              <el-row v-for="(item,index) in DeptList" :key="index" class="list-name">
                <el-col :span="12" :class="activeClass == index ? 'active':''">{{item.name}}</el-col>
                <el-col :span="12" align="right">
                  <el-tooltip class="item" effect="dark" content="绑定" placement="top">
                    <span
                      @click="bindClient(item.id,index)"
                      :class="activeClass == index ? 'active':''"
                    >
                      <i class="el-icon-circle-check"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">当前绑定的客户部门</h4>
            <div class="bind-name">
              <div>{{clientname}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="外包部门绑定" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width: 50%;" v-if="$store.state.login.userInfo.auth.admin_management">
            <h4 style="margin: 0 10px;">部门列表</h4>
            <div class="box">
              <el-row v-for="(item,index) in DeptList" :key="index" class="list-name">
                <el-col :span="12" :class="activeClass1 == index ? 'active':''">{{item.name}}</el-col>
                <el-col :span="12" align="right">
                  <el-tooltip class="item" effect="dark" content="绑定" placement="top">
                    <span
                      @click="bindList(item.id,index)"
                      :class="activeClass1 == index ? 'active':''"
                    >
                      <i class="el-icon-circle-check"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">当前绑定的外包部门</h4>
            <div class="bind-name">
              <div>{{listname}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  getDept,
  bindClientDept,
  getClientDept,
  bindIP,
  searchIP
} from "@/api/admin";
import { mapState } from "vuex";
export default {
  data() {
    return {
      clientname: null,
      listname: null,
      labelPosition: "right",
      saveForm: {},
      host: null,
      port: null,
      isshow: false,
      activeClass: -1,
      activeClass1: -1,
      saveRules: {
        host: [
          {
            required: true,
            trigger: "blur",
            message: "请输入协议及地址"
          }
        ],
        port: [
          {
            required: true,
            trigger: "blur",
            message: "请输入端口号"
          }
        ]
      },
      loading: false
    };
  },
  computed: {
    ...mapState("admin", ["DeptList", "DeptAuth"])
  },
  created() {
    this.getDeptList();
    this.search();
    getClientDept().then(({ data }) => {
      getDept({ id: data.client }).then(({ data }) => {
        this.clientname = data.msg.name;
        this.DeptList.forEach((item, index) => {
          if (item.id === data.msg.id) {
            this.activeClass = index;
          }
        });
      });
    });
    getClientDept().then(({ data }) => {
      getDept({ id: data.outsourcing }).then(({ data }) => {
        this.listname = data.msg.name;
        this.DeptList.forEach((item, index) => {
          if (item.id === data.msg.id) {
            this.activeClass1 = index;
          }
        });
      });
    });
  },
  methods: {
    //ip和端口绑定
    save() {
      this.$refs["saveForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          bindIP(this.saveForm).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.search();
            }
            this.loading = false;
            this.$refs["saveForm"].resetFields();
          }); 
        }else {
          return false;
        }
      });
     
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      searchIP().then(({ data }) => {
        this.host = data.host;
        this.port = data.port;
        this.isshow = !this.isshow;
      });
    },
    //http获取“用户组”列表
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    //绑定客户部门
    bindClient(id, index) {
      bindClientDept({ client: id }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.getBindClientList();
          this.activeClass = index;
        }
      });
    },
    //获取绑定客户部门列表
    getBindClientList() {
      getClientDept().then(({ data }) => {
        getDept({ id: data.client }).then(({ data }) => {
          this.clientname = data.msg.name;
        });
      });
    },
    //外包部门绑定
    bindList(id, index) {
      bindClientDept({ outsourcing: id }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.getBindList();
          this.activeClass1 = index;
        }
      });
    },
    //获取外包部门列表
    getBindList() {
      getClientDept().then(({ data }) => {
        getDept({ id: data.outsourcing }).then(({ data }) => {
          this.listname = data.msg.name;
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#bind {
  .box {
    overflow: auto;
    margin: 0 10px;
  }
  .active {
    color: rgb(23, 130, 238);
  }
  .list-name {
    width: 300px;
    height: 30px;
    padding-top: 10px;
    cursor: pointer;
    border-bottom: 1px solid #e8eaec;
  }
  .bind-name {
    height: 25px;
    width: 100%;
    padding: 8px;
  }
}
</style>