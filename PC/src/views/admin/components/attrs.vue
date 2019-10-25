<!-- 属性 -->
<template>
  <div id="attrs">
    <div style="padding-bottom:10px" >
      <el-row :gutter="15">
        <el-col :span="15" v-if="auth">
          <el-row>
            <el-col :span="4">
              <el-button icon="el-icon-plus" type="primary" @click="showDialog(1)">自定义属性</el-button>
            </el-col>
            <el-col :span="4">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="mulDelMaterial()"
                :disabled="this.multipleSelection.length === 0"
              >批量删除</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="9" style="float:right">
          <el-row type="flex" justify="end">
            <el-col :span="15">
              <el-row>
                <el-col :span="9" >
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
                </el-col>
                <el-col :span="15">
                  <el-input
                    v-if="colShow"
                    v-model="filterText"
                    placeholder="请输入关键字"
                    @keyup.enter.native="searchMulAttrs()"
                  >
                  </el-input>
                  <el-select
                    v-show="chooseSel"
                    v-model="colSel2"
                    placeholder="请选择属性类型"
                  >
                    <el-option
                      v-for="item in attrsTypeList"
                      :label="item.type"
                      :value="item.value"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-col>

            <el-col :span="9">
              <el-button
              @click="searchMulAttrs()"
              icon="el-icon-search"
              type="primary"
            />
              <el-button @click="searchAttrs()" type="primary" style="margin-left: 15px">重置</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div style="padding:15px;border: 1px solid #dfe6ec;">
      <el-table
        ref="attrsList"
        :data="attrsList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        highlight-current-row
        v-loading="tableLoading"
        :row-key="(row)=>{ return row.id}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" align="left" v-if="auth"></el-table-column>
        <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
        <el-table-column label="属性名" prop="name">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入属性名"
              v-if="editing&&clickId === scope.row.id"
              @change="showEditIcon"
            >
              <span>{{scope.row.name}}</span>
            </el-input>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性类型" prop="type">
          <template slot-scope="scope">{{scope.row.type|attrsFilter}}</template>
        </el-table-column>
        <el-table-column label="属性值" prop="value"></el-table-column>
        <el-table-column label="默认值" prop="default"></el-table-column>
        <el-table-column label="操作" v-if="auth" >
          <template slot-scope="scope" >
            <el-tooltip class="item" effect="dark" content="属性绑定" placement="top">
              <el-button
                icon="el-icon-plus"
                style="color:blue"
                type="text"
                @click="showDialog(2,scope.row)"
                v-if="!editing||clickId !== scope.row.id"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button
                icon="el-icon-edit"
                style="color:green"
                type="text"
                @click="putAttrts(scope.row,1)"
                v-if="!editing||clickId !== scope.row.id"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-check"
                style="color:green"
                @click="putAttrts(scope.row,2)"
              />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                icon="el-icon-delete"
                style="color:red"
                type="text"
                @click="removeAttrs(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: center;margin-top:10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="attrsList.length"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加自定义属性 -->
    <el-dialog :visible.sync="isDialog" width="512px" top="5vh" title="添加自定义属性">
      <el-form
        :model="attrsForm"
        ref="attrsForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-form-item label="属性名" prop="name">
          <el-input v-model="attrsForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="属性类型" prop="type">
          <el-select v-model="attrsForm.type">
            <el-option
              v-for="(item,index) of attrsTypeList"
              :key="index"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <template v-if="attrsForm.type === 5">
          <el-form-item label="属性值" prop="value">
            <el-radio-group v-model="selectway">
              <el-radio :label="0">单选</el-radio>
              <el-radio :label="1">多选</el-radio>
            </el-radio-group>
            <el-row type="flex" align="middle" v-for="(item,index) of selectForm" :key="index">
              <el-form :model="item" label-width="30px">
                <el-row>
                  <el-col :span="10" style="padding-right:10px">
                    <el-form-item label="键" prop="key">
                      <el-input v-model="item.key"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="值" prop="value">
                      <el-input v-model="item.value"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" align="right">
                    <el-tooltip class="item" effect="dark" content="添加键值对" placement="top">
                      <el-button
                        icon="el-icon-plus"
                        style="color:blue"
                        type="text"
                        @click="after(index)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除键值对" placement="top">
                      <el-button
                        icon="el-icon-delete"
                        style="color:red"
                        type="text"
                        @click="deleteLink(index)"
                      ></el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
          </el-form-item>
        </template>
        <el-form-item label="默认值" prop="default">
          <template v-if="attrsForm.type === 1 ||attrsForm.type === 2">
            <el-input v-model="attrsForm.default" @input="change($event)"></el-input>
          </template>
          <template v-if="attrsForm.type === 3">
            <el-date-picker v-model="attrsForm.default" type="date" placeholder="选择日期时间"></el-date-picker>
          </template>
          <template v-if="attrsForm.type === 4">
            <el-radio-group v-model="attrsForm.default">
              <el-radio :label="0">false</el-radio>
              <el-radio :label="1">true</el-radio>
            </el-radio-group>
          </template>
          <template v-if="attrsForm.type === 5">
            <el-select v-model="attrsForm.default">
              <el-option
                v-for="(item,index) of selectForm"
                :key="index"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm()">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 给实体绑定属性值 -->
    <el-dialog title="实体类别绑定" :visible.sync="isDialog2" width="512px" top="5vh">
      <el-form :model="bindForm" label-width="90px" :rules="rules" ref="bindForm">
        <el-form-item label="属性名称" prop="attr_id">
          <el-input v-model="attrName" disabled></el-input>
        </el-form-item>
        <el-form-item label="实体类别" prop="entity_type">
          <el-select v-model="bindForm.entity_type">
            <el-option
              v-for="(item,index) of entityType"
              :key="index"
              :label="item.type"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="bindSubmit">立即绑定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as HTTP from "@/api/attrs";
export default {
  name: "attrs",
  components: {},
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      editing: false,
      clickId: null,
      iconShow: false,
      isDialog: false,
      filterText: null,
      attrsForm: {},
      multipleSelection: [],
      colSel: "name",
      colSel2: [],
      colShow: true,
      chooseSel: false,
      columnSelect2: [],
      columnSelect: [
        {
          value: "name",
          label: "属性名称"
        },
        {
          value: "type",
          label: "属性类型"
        },
        {
          value: "value",
          label: "属性值"
        },
        {
          value: "default",
          label: "默认值"
        }
      ],
      attrsTypeList: [
        {
          type: "NUMBER（数字）",
          value: 1
        },
        {
          type: "CHARACTER（字符）",
          value: 2
        },
        {
          type: "DATE（日期）",
          value: 3
        },
        {
          type: "BOOLEAN（布尔值）",
          value: 4
        },
        {
          type: "ENUMERATE（枚举）",
          value: 5
        }
      ],
      selectway: 0,
      selectForm: [{}],
      selection: {},
      defailtList: [],
      attrsList: [],
      isDialog2: false,
      bindForm: {},
      entityType: [
        {
          type: "任务实体",
          value: 1
        },
        {
          type: "项目实体",
          value: 4
        },
        {
          type: "资产实体",
          value: 5
        }
      ],
      attrName: null,
      rules: {
        entity_type: [
          { required: true, message: "请选择实体类别", trigger: "blur" }
        ]
      }
    };
  },
  props: ["tableLoading", "auth"],
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        if (newVal == "type") {
          this.colShow = false;
          this.chooseSel = true;
        } else if (newVal == "value") {
          this.colShow = true;
          this.chooseSel = false;
        } else if (newVal == "default") {
          this.colShow = true;
          this.chooseSel = false;
        } else {
          this.colShow = true;
          this.chooseSel = false;
          // this.colSel2 = [];
          // this.columnSelect2 = [];
        }
      }
    }
  },
  created() {
    this.searchAttrs();
  },
  methods: {
    //批量删除
    mulDelMaterial() {
      console.log(this.multipleSelection)
      const ids = this.multipleSelection.map(item => item.id);
      this.$confirm("此操作将永久删除属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        HTTP.delMulAttrs({
          
          ids: ids
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$emit("refresh-attrs");
            this.searchAttrs();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //多字段查询属性
    searchMulAttrs() {
      let data = {};
      if (this.colSel == "name" && this.filterText) {
        data = {
          ...data,
          name: this.filterText
        };
      }
      if (this.colSel == "type") {
        data = {
          ...data,
          type: this.colSel2
        };
      }
      if (this.colSel == "value") {
        data = {
          ...data,
          value: this.filterText
        };
      }
      if (this.colSel == "default") {
        data = {
          ...data,
          default: this.filterText
        };
      }
      HTTP.getMulAttrs(data).then(({ data }) => {
        this.attrsList = [...data.msg];
        
        // this.authRole = data.auth.can_manage_material_state;
        this.currentPage = 1;
      });
    },
    searchAttrs() {
        HTTP.getAttrsList().then(({ data }) => {
          if (data.status === 0) {
            this.attrsList = [...data.msg];
          }
        });
    },
    bindSubmit() {
      this.$refs["bindForm"].validate(valid => {
        if (valid) {
          // console.log(this.bindForm)
          HTTP.attrsEntityBind(this.bindForm).then(({ data }) => {
            this.isDialog2 = false;
            this.bindForm = {};
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("bindSearch");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    submitForm() {
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.attrsForm.type === 5) {
        //  console.log(this.selectForm);
        this.attrsForm.value =
          "{" +
          '"selectway":' +
          this.selectway +
          ',"selection":{' +
          this.selectForm.map((t, i) => {
            return `"${t.key}":${t.value}`;
          }) +
          "}}";
      }
      if (this.attrsForm.type === 3) {
        this.attrsForm.default = dateFormat(this.attrsForm.default);
      }
      // console.log(this.attrsForm);
      HTTP.createAttrs(this.attrsForm).then(({ data }) => {
        this.isDialog = false;
        if (data.status === 0) {
          this.isDialog = false;
          this.attrsForm = {};
          this.selectForm = [{}];
          this.$message.success(data.msg);
          this.$emit("refresh-attrs");
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //键值对+1
    after(ind) {
      this.selectForm.splice(ind + 1, 0, {});
    },
    //键值对 -1
    deleteLink(index) {
      if (index !== 0) this.selectForm.splice(index, 1);
    },
    //dialog取消
    cancel() {
      this.isDialog = false;
      this.selectForm = [{}];
    },
    //处理input框不能输入
    change() {
      this.$forceUpdate();
    },
    showDialog(Type, row) {
      if (Type === 1) {
        this.isDialog = true;
      }
      if (Type === 2 && row) {
        this.isDialog2 = true;
        this.attrName = row.name;
        this.bindForm.attr_id = row.id;
      }
    },
    //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
      this.rowClick = true;
    },
    //属性修改
    putAttrts(row, Type) {
      if (Type === 1) {
        if (this.iconShow === true) {
          this.$confirm("当前修改未保存", "注意", {
            type: "warning"
          });
        } else {
          this.editing = true;
          this.clickId = row.id;
        }
      } else {
        //console.log(row)
        HTTP.updateAttrs({ name: row.name, method: "put", id: row.id })
          .then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("refresh-attrs");
              this.editing = false;
              thsi.iconShow = false;
            } else {
              this.$message.error(data.msg);
              this.editing = false;
              this.iconShow = false;
            }
          })
          .catch(res => {});
      }
    },
    //属性删除
    removeAttrs(id) {
      this.$confirm("此操作将永久删除属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        HTTP.delAttrs({
          method: "delete",
          id: id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$emit("refresh-attrs");
            this.searchAttrs();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
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
<style lang='scss' scoped>
</style>