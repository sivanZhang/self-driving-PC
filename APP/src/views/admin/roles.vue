<template>
  <div id="roles">
    <el-container>
      <el-container>
        <transition name="role">
          <el-aside
            width="240px"
            style="border-right:1px solid #ddd;padding:0 5px;margin-right:20px"
          >
            <el-row type="flex" align="middle" class="nav-title">
              <el-button
                @click="addRole(1)"
                type="success"
                v-if="$store.state.login.userInfo.auth.manage_role"
              >添加角色</el-button>
            </el-row>
            <el-input class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-row v-for="(todo,index) of roleList" :key="index" class="role-list" align="center">
              <div @mouseenter="editShow=todo.id" @mouseleave="editShow=null">
                <el-row>
                  <el-col :span="18">
                    <span style="cursor:pointer" @click="getRoleUserList(todo.id)">{{todo.name}}</span>
                  </el-col>
                  <el-col :span="3" align="center">
                    <span
                      style="cursor:pointer"
                      v-if="editShow===todo.id&&todo.sort == 1"
                      @click="editRole(todo)"
                    >
                      <el-tooltip class="item" effect="dark" content="修改" placement="top">
                        <i class="el-icon-edit" style="color:green"></i>
                      </el-tooltip>
                    </span>
                  </el-col>
                  <el-col :span="3" align="center">
                    <span
                      style="cursor:pointer"
                      v-if="editShow===todo.id&&todo.sort == 1"
                      @click="delRole(todo)"
                    >
                      <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <i class="el-icon-delete" style="color:red"></i>
                      </el-tooltip>
                    </span>
                  </el-col>
                </el-row>
              </div>
            </el-row>
            <el-dialog title="修改角色名称" :visible.sync="editing" width="300px">
              <el-row style="padding-bottom:15px">
                <el-input v-model="editName" type="text"></el-input>
              </el-row>
              <el-row>
                <el-col :span="12" align="left">
                  <el-button @click="cancle">取消</el-button>
                </el-col>
                <el-col :span="12" align="right">
                  <el-button type="primary" @click="editRoleName">修改</el-button>
                </el-col>
              </el-row>
            </el-dialog>
          </el-aside>
        </transition>
        <el-main>
          <div class="t-header">
            <el-row>
              <el-col :span="6">
                拥有
                <span style="font-weight:500">{{name}}</span>角色的用户有：
              </el-col>
              <el-col :span="3">
                <el-button
                  type="primary"
                  @click="isShowDialog = true"
                  v-if="$store.state.login.userInfo.auth.manage_role"
                  :disabled="!name"
                >绑定用户</el-button>
              </el-col>
              <el-col :span="3">
                <el-button
                  type="danger"
                  @click="isShowDialog2 = true"
                  v-if="$store.state.login.userInfo.auth.manage_role"
                  :disabled="!name"
                >解绑用户</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" v-for="(item,index) of roleUserList" :key="index">{{item.username}}</el-col>
            </el-row>
          </div>

          <div style="display:flex;">
            <div style="padding:5px 10px;width:50%">
              <h4>所有权限</h4>
              <div style="display:flex">
                <el-button
                  type="primary"
                  :disabled="this.addMultipleSelection.length === 0"
                  style="margin:5px 0px"
                  @click="addRolePermissions"
                  v-if="$store.state.login.userInfo.auth.manage_role"
                >批量添加</el-button>
                <div style="width:220px;padding-left:15px">
                  <input class="input-remarks" placeholder="在此输入筛选条件..." v-model=" optionInput" />
                </div>
              </div>
              <el-table
                ref="addmultipleTable"
                :data="permissionsList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                border
                :stripe="true"
                :row-style="{'font-size':'13px'}"
                :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
                highlight-current-row
                row-class-name="hover"
                style="width: 100%"
                :row-key="(row)=>{ return row.id}"
                @selection-change="handleAddSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="30"
                  align="center"
                  :reserve-selection="true"
                ></el-table-column>
                <el-table-column prop="codename" label="权限名称"></el-table-column>
                <el-table-column prop="name" label="权限说明"></el-table-column>
              </el-table>
              <div class="block" style="text-align: right;width:50%">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="pageSizeList"
                  :page-size="pageSize"
                  layout="total, sizes, prev,next"
                  :total="permissionsList.length"
                ></el-pagination>
              </div>
            </div>
            <div style="padding:5px 10px;width:50%">
              <h4>当前角色所拥有的权限</h4>
              <el-button
                type="danger"
                :disabled="this.delMultipleSelection.length === 0"
                style="margin:5px 0px"
                @click="delRolePermissions"
                v-if="$store.state.login.userInfo.auth.manage_role"
              >批量删除</el-button>
              <el-table
                :data="userPermissionsList"
                border
                :stripe="true"
                :row-style="{'font-size':'13px'}"
                :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
                highlight-current-row
                row-class-name="hover"
                style="width: 100%"
                @selection-change="handleDelSelectionChange"
              >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="codename" label="权限名称"></el-table-column>
                <el-table-column prop="name" label="权限说明"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-main>
        <el-dialog :visible.sync="isShowDialog" :title="name+'角色绑定用户'" width="480px" top="5vh">
          <el-form
            :model="roleAdd"
            ref="roleAdd"
            label-width="100px"
            hide-required-asterisk
            label-position="left"
          >
            <el-form-item label="用户名称" prop="rolename">
              <el-select v-model="roleAdd.rolename" filterable multiple placeholder="请选择用户">
                <el-option
                  v-for="(item,index) of UserList"
                  :key="index"
                  :label="item.username"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" align="right" @click="addUser">立即绑定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :visible.sync="isShowDialog2" :title="name+'角色解绑用户'" width="480px" top="5vh">
          <el-table
            :data="roleUserList"
            border
            :stripe="true"
            :row-style="{'font-size':'13px'}"
            :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
            highlight-current-row
            row-class-name="hover"
            style="width: 100%"
            @selection-change="handleDelUserSelectionChange"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
          </el-table>
          <div align="right">
            <el-button type="danger" style="margin:5px 0px" @click="delUser">立即解绑</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="add_role_show" title="添加角色" width="480px" top="5vh">
          <el-form
            :model="addDeptRole"
            ref="addDeptRole"
            label-width="100px"
            hide-required-asterisk
            label-position="left"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="addDeptRole.name"></el-input>
            </el-form-item>
            <el-form-item label="角色类别" prop="role_type">
              <el-radio-group v-model="addDeptRole.role_type">
                <el-radio :label="1">唯一性角色</el-radio>
                <el-radio :label="2">多用户角色</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="角色分类" prop="role_sort">
              <el-radio-group v-model="addDeptRole.role_sort">
                <el-radio :label="0">内置角色</el-radio>
                <el-radio :label="1">自定义角色</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" align="right" @click="addRole(2)">立即绑定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  permissions,
  getRoles,
  getUsersRole,
  userPermissions,
  updateRole,
  getUserList,
  add_Role,
  removeRole
} from "@/api/admin";
import { mapState } from "vuex";
export default {
  name: "roles",
  data() {
    return {
      filterText: "",
      permissionsList: [],
      userPermissionsList: [],
      roleList: null,
      roleAdd: {},
      editName: null,
      roleUserList: null,
      name: "",
      addMultipleSelection: [],
      delMultipleSelection: [],
      delUserMultipleSelection: [],
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      roleid: null,
      isShowDialog: false,
      isShowDialog2: false,
      optionInput: "",
      editShow: null,
      id: null,
      editing: false,
      add_role_show: false,
      addDeptRole: {}
    };
  },
  components: {},
  created() {
    this.getList();
  },
  watch: {
    optionInput: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          // console.log(this.optionInput);
          permissions({
            codename: newVal
          }).then(({ data }) => {
            this.permissionsList = [...data.msg];
          });
        } else {
          this.getList();
        }
      }
    }
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    //添加角色
    addRole(Type) {
      if (Type === 1) {
        this.add_role_show = true;
      } else {
        add_Role(this.addDeptRole)
          .then(({ data }) => {
            this.add_role_show = false;
            if (data.status === 0) {
              this.$message.success(data.msg);
              //角色列表
              getRoles().then(({ data }) => {
                this.roleList = [...data.msg];
              });
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch(res => {
            this.$message.error(res.msg);
            this.add_role_show = false;
          });
      }
    },
    //删除角色
    delRole(todo) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeRole({
          id: todo.id,
          method: "delete"
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            //角色列表
            getRoles().then(({ data }) => {
              this.roleList = [...data.msg];
            });
            this.roleUserList = [];
            this.name = "";
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    getList() {
      //权限列表
      permissions().then(({ data }) => {
        this.permissionsList = [...data.msg];
      });
      //角色列表
      getRoles().then(({ data }) => {
        this.roleList = [...data.msg];
      });
    },
    getRoleUserList(id) {
      this.roleid = id;
      const roleid = id;
      getUsersRole({ id: roleid }).then(({ data }) => {
        this.roleUserList = [...data.users];
        this.name = data.msg.name;
        //console.log(this.roleUserList);
      });
      userPermissions({ roleid: roleid }).then(({ data }) => {
        this.userPermissionsList = [...data.msg];
        //console.log(this.userPermissionsList);
      });
    },
    handleAddSelectionChange(val) {
      this.addMultipleSelection = val;
    },
    handleDelSelectionChange(val) {
      this.delMultipleSelection = val;
    },
    handleDelUserSelectionChange(val) {
      this.delUserMultipleSelection = val;
    },
    //给角色增加权限
    addRolePermissions() {
      const add_perm_ids = this.addMultipleSelection
        .map(item => item.id)
        .join(",");
      updateRole({
        id: this.roleid,
        method: "put",
        add_perm_ids: add_perm_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        this.addMultipleSelection = [];
        if (data.status === 0) {
          userPermissions({ roleid: this.roleid }).then(({ data }) => {
            this.userPermissionsList = [...data.msg];
            //console.log(this.userPermissionsList);
          });
          this.$nextTick(() => {
            this.$refs.addmultipleTable.clearSelection();
          });
        }
      });
    },
    //给角色删除权限
    delRolePermissions() {
      const del_perm_ids = this.delMultipleSelection
        .map(item => item.id)
        .join(",");
      //console.log(del_perm_ids);
      updateRole({
        id: this.roleid,
        method: "put",
        del_perm_ids: del_perm_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          userPermissions({ roleid: this.roleid }).then(({ data }) => {
            this.userPermissionsList = [...data.msg];
            //console.log(this.userPermissionsList);
          });
        }
      });
    },
    //给角色绑定用户
    addUser() {
      //console.log(this.roleAdd)
      const addrole = this.roleAdd.rolename.map(item => item).join(",");
      // console.log(role)
      updateRole({
        id: this.roleid,
        method: "put",
        add_userids: addrole
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.isShowDialog = false;
          getUsersRole({ id: this.roleid }).then(({ data }) => {
            this.roleUserList = [...data.users];
            this.name = data.msg.name;
            //console.log(this.roleUserList);
          });
          this.roleAdd = {};
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //给角色删除用户
    delUser() {
      const del_userids = this.delUserMultipleSelection
        .map(item => item.id)
        .join(",");
      //console.log(del_userids)
      updateRole({
        id: this.roleid,
        method: "put",
        del_userids: del_userids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.isShowDialog2 = false;
          getUsersRole({ id: this.roleid }).then(({ data }) => {
            this.roleUserList = [...data.users];
            this.name = data.msg.name;
            //console.log(this.roleUserList);
          });
        }
      });
    },
    //修改角色名称
    editRole(todo) {
      this.id = todo.id;
      this.editing = true;
      this.editName = todo.name;
    },
    editRoleName() {
      updateRole({
        id: this.id,
        name: this.editName,
        method: "put"
      })
        .then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.editing = false;
            //角色列表
            getRoles().then(({ data }) => {
              this.roleList = [...data.msg];
            });
          }
        })
        .catch(err => {
          this.$message.error(err.msg);
        });
    },
    cancle() {
      this.editing = false;
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
  }
};
</script>
<style lang="scss" scoped>
#roles {
  .input-remarks {
    width: 200px;
    height: 28px;
    font-size: 12px;

    border: none;
    border-bottom: solid 1px rgb(221, 221, 221);
  }
  .input-remarks:focus {
    outline: none;
    border-bottom: solid 2px rgba(0, 119, 255, 0.884);
  }
  .role-list {
    padding-bottom: 5px;
    width: 240px;
  }
  .role-list :hover {
    background-color: hsl(222, 42%, 95%);
  }
  .nav-title {
    padding: 8px 0;
    .el-col {
      color: #909399;
    }
  }
  .search-group {
    margin-bottom: 10px;
  }
  .t-header {
    padding: 8px 12px;
    background-color: #e4e7ed;
  }
  .el-main {
    padding: 0;
  }
  .el-container {
    min-height: calc(100vh - 50px);
  }
  .el-aside {
    max-height: calc(100vh - 50px);
    overflow-y: scroll;
  }
  .iconWarp {
    display: none;
    font-size: 12px;
    & > * {
      cursor: pointer;
    }
  }
  .tag-nav {
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: #ebeef5;
    }
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .custom-tree-node {
    &:hover {
      .iconWarp {
        display: inline-block;
      }
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>