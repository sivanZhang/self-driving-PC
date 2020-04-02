<!-- 自定义属性绑定 -->

<template>
  <div id="attr_bind">
    <el-button type="primary" @click="showDialog(1)" style="margin-bottom:10px" v-if="auth">自定义属性绑定</el-button>
    <div v-for="(item,index) of customAttrs" :key="index" style="padding-top:5px">
      <el-row>
        <el-col :span="6">{{item.attr_name}}</el-col>
        <el-col :span="9">
          <template v-if="item.attr_type <=2 ||item.attr_type === 5">
            <el-input
              size="small"
              v-model="item.attr_value"
              placeholder="请输入属性值"
              v-if="editing&&clickId === item.id"
              @change="showEditIcon"
            >
              <span>{{item.attr_value}}</span>
            </el-input>
          </template>
          <template v-if="item.attr_type === 3">
            <el-date-picker
              v-model="item.attr_value"
              type="date"
              placeholder="选择日期"
              v-if="editing&&clickId === item.id"
              @change="showEditIcon"
              style="width:80%"
            ></el-date-picker>
          </template>
          <template v-if="item.attr_type === 4">
            <el-select
              v-model="item.attr_value"
              v-if="editing&&clickId === item.id"
              @change="showEditIcon"
              style="width:80%"
            >
              <el-option label="false" value="0"></el-option>
              <el-option label="true" value="1"></el-option>
            </el-select>
          </template>
          <span v-if="!editing||clickId !== item.id">{{item.attr_value}}</span>
        </el-col>
        <el-col :span="9">
          <template v-if="auth">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              icon="el-icon-edit"
              style="color:green"
              type="text"
              v-if="!editing||clickId !== item.id"
              @click="putAttrtsEntity(item,1)"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="确认" placement="top">
            <el-button
              v-if="editing&&clickId === item.id"
              type="text"
              icon="el-icon-check"
              style="color:green"
              @click="putAttrtsEntity(item,2)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="解绑" placement="top">
            <el-button
              icon="el-icon-delete"
              style="color:red"
              type="text"
              @click="removeBind(item.id)"
            ></el-button>
          </el-tooltip>
          </template>
        </el-col>
      </el-row>
    </div>

    <template v-if="isDialog">
      <div style="margin-top:20px;border:1px solid;color:#dfe6ec">
        <div style="padding-top:10px">
          <el-form :model="bindForm" label-width="90px">
            <el-form-item label="属性名称" prop="attr_name">
              <el-select v-model="bindForm.attr_name" @change="bindType()">
                <el-option
                  v-for="(item,index) of attrsList.filter(item=>item.attr_type <=4)"
                  :key="index"
                  :label="item.attr_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性值" prop="attr_value">
              <template v-if="attrtype&&(attrtype <=2 ||attrtype === 5) ">
                <el-input v-model="bindForm.attr_value"></el-input>
              </template>
              <template v-if="attrtype&&attrtype === 3">
                <el-date-picker v-model="bindForm.attr_value" type="date" placeholder="选择日期时间"></el-date-picker>
              </template>
              <template v-if="attrtype&&attrtype === 4">
                <el-radio-group v-model="bindForm.attr_value">
                  <el-radio :label="0">false</el-radio>
                  <el-radio :label="1">true</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item>
              <el-tooltip class="item" effect="dark" content="创建新的自定义属性" placement="top">
                <el-button type="primary" @click="showDialog(2)">创建属性</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="绑定为个性化属性" placement="top">
                <el-button type="primary" @click="saveAttrs">立即绑定</el-button>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <el-dialog title="创建新属性" :visible.sync="isDialog2" width="512px" top="5vh" :modal="false">
      <el-form :model="newAttrForm" label-width="90px">
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="newAttrForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value">
          <el-input v-model="newAttrForm.attr_value"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="saveNewAttr()">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  createAttrs,
  createAttrsEntity,
  delAttrsEntity,
  updateAttrsEntity,
  attrsEntityBind,
  getAttrsEntityList,
  authAttr
} from "@/api/attrs";
export default {
  name: "attr_bind",

  components: {},

  props: ["project", "customAttrs", "attrsList", "attrsTypeNum"],

  data() {
    return {
      bindForm: {},
      entityTpe: [
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
      EntityName: [],
      isDialog: false,
      isDialog2: false,
      editing: false,
      clickId: null,
      iconShow: false,
      newAttrForm: {},
      attrtype: null,
      attrname: null,
      auth:null
    };
  },

  watch: {},

  methods: {
    bindType() {
      this.attrsList.forEach(item => {
        if (item.id == this.bindForm.attr_name) {
          (this.attrtype = item.attr_type), (this.attrname = item.attr_name);
        }
      });
      // console.log(this.attrsList)
      // console.log(this.bindForm.attr_name)
      //console.log(this.attrtype);
    },

    saveNewAttr() {
      let dataAttrs = {
        ...this.newAttrForm,
        entity_id: this.project.id,
        entity_type: this.attrsTypeNum,
        attr_type: 2
      };
      let newAttr = {
        name: this.newAttrForm.attr_name,
        type: 2
      };

      createAttrs(newAttr).then(({ data }) => {
        createAttrsEntity(dataAttrs).then(({ data }) => {
          if (data.status === 0) {
            this.isDialog2 = false;
            this.$message.success(data.msg);
            this.$emit("refresh_customAttrs");
          }
        });
        // attrsEntityBind
        getAttrsEntityList().then(({ data }) => {
          if (data.status === 0) {
            [...data.msg].forEach(item => {
              return item.attr_name === this.newAttrForm.attr_name;
            }).id;
          }
        });
      });

      //console.log(data)
    },

    //是否显示行内修改框
    showEditIcon() {
      this.iconShow = true;
      this.rowClick = true;
    },

    //修改属性实体
    putAttrtsEntity(row, Type) {
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (row.attr_type === 3) {
        row.attr_value = dateFormat(row.attr_value);
      }
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
        updateAttrsEntity({ value: row.attr_value, method: "put", id: row.id })
          .then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("refresh_customAttrs");
              this.editing = false;
              this.iconShow = false;
            } else {
              this.$message.error(data.msg);
              this.editing = false;
              this.iconShow = false;
            }
          })
          .catch(res => {});
      }
    },

    showDialog(Type) {
      if (Type === 1) {
        this.isDialog = true;
      } else {
        this.isDialog2 = true;
      }
    },

    saveAttrs() {
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.attrtype === 3) {
        this.bindForm.attr_value = dateFormat(this.bindForm.attr_value);
        // console.log(this.bindForm.attr_value);
      }
      let data = {
        attr_type: this.attrtype,
        attr_name: this.attrname,
        attr_value: this.bindForm.attr_value,
        entity_id: this.project.id,
        entity_type: this.attrsTypeNum
      };

      // console.log(data);
      createAttrsEntity(data).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$emit("refresh_customAttrs");
          this.isDialog = false;
          this.bindForm = {};
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    removeBind(id) {
      this.$confirm("此操作将永久解绑属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delAttrsEntity({ id, method: "delete" }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$emit("refresh_customAttrs");
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    }
  },

  created() {
    // authAttr().then(({data})=>{
    //   if(data.status === 0){
    //     this.auth = data.auth.manage_attr
    //   }
    // })
  }
};
</script>

<style lang="scss" scoped></style>