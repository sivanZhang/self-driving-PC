<!-- 属性实体 -->
<template>
  <div id="attrs-entity">
    <el-table
      ref="attrsEntityList"
      :data="attrsEntityList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      highlight-current-row
      v-loading="tableLoading"
    >
      <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>
      <el-table-column label="属性名" prop="attr_name"></el-table-column>
      <el-table-column label="属性类型" prop="attr_type">
        <template slot-scope="scope">{{scope.row.attr_type|attrsFilter}}</template>
      </el-table-column>
      <template v-if="attr_entity === 0">
        <el-table-column label="属性值" prop="attr_value">
          <template slot-scope="scope">
            <div v-if="scope.row.attr_type <=2 ||scope.row.attr_type === 5">
              <el-input
                size="small"
                v-model="scope.row.attr_value"
                placeholder="请输入属性值"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <span>{{scope.row.attr_value}}</span>
              </el-input>
            </div>
            <div v-if="scope.row.attr_type === 3">
              <el-date-picker
                v-model="scope.row.attr_value"
                type="date"
                placeholder="选择日期"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
                style="width:80%"
              ></el-date-picker>
            </div>
            <div v-if="scope.row.attr_type === 4">
              <el-select
                v-model="scope.row.attr_value"
                v-if="editing&&clickId === scope.row.id"
                @change="showEditIcon"
              >
                <el-option label="false" value="0"></el-option>
                <el-option label="true" value="1"></el-option>
              </el-select>
            </div>
            <span v-if="!editing||clickId !== scope.row.id">{{scope.row.attr_value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属实体" prop="entity_id"></el-table-column>
      </template>
      <el-table-column
        label="实体类别"
        prop="entity_type"
        :filters="[{text: '任务实体', value: '1'}, {text: '项目实体', value: '4'}, {text: '资产实体', value: '5'}]"
        :filter-method="filterHandler"
      >
        <template slot-scope="scope">{{scope.row.entity_type|entityFilter}}</template>
      </el-table-column>
      <el-table-column label="操作" v-if="auth">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button
              icon="el-icon-edit"
              style="color:green"
              type="text"
              v-if="!editing||clickId !== scope.row.id"
              @click="putAttrtsEntity(scope.row,1)"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="确认" placement="top">
            <el-button
              v-if="editing&&clickId === scope.row.id"
              type="text"
              icon="el-icon-check"
              style="color:green"
              @click="putAttrtsEntity(scope.row,2)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="解绑" placement="top">
            <el-button
              icon="el-icon-delete"
              style="color:red"
              type="text"
              @click="removeAttrsEntity(scope.row.id)"
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
        :total="attrsEntityList.length"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  updateAttrsEntity,
  delAttrsEntity,
  attrsEntityUnbind
} from "@/api/attrs";
export default {
  name: "attrs-entity",
  components: {},
  props: ["attrsEntityList", "tableLoading", "attr_entity","auth"],
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [10, 20, 50, 100],
      editing: false,
      clickId: null,
      iconShow: false
    };
  },
  watch: {},
  methods: {
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
              this.$emit("refresh-attrsEntity");
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
    //删除属性实体
    removeAttrsEntity(id) {
      this.$confirm("此操作将永久删除属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.attr_entity === 0) {
          delAttrsEntity({
            method: "delete",
            id: id
          }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("refresh-attrsEntity");
            } else {
              this.$message.error(data.msg);
            }
          });
        } else {
          attrsEntityUnbind({ id: id, method: "delete" }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.$emit("refresh-Entity");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    //筛选
    filterHandler(value, row) {
      // console.log(value);
      // console.log(row.entity_type)
      return row.entity_type == value;
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
  },
  created() {}
};
</script>
<style lang='scss' scoped>
#attrs-entity {
  padding: 15px;
  border: 1px solid #dfe6ec;
}
</style>