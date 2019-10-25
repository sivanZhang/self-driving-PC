<!-- 任务的历史版本 -->
<template>
  <div id="history">
    <el-table
      :data="historyVersion"
      style="width:100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      :span-method="objectSpanMethod"
    >
      <el-table-column prop="link_content" label="环节内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="task_name" label="任务名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="task_content" label="任务内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="version.current_version" label="版本号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            style="color:#C64b2b"
            v-if="scope.row.end == true"
          >{{scope.row.version.current_version}}</span>
          <span v-else>{{scope.row.version.current_version}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="out_path" label="审核路径" show-overflow-tooltip></el-table-column>
      <el-table-column prop="version.date" width="130" label="更新时间">
        <template slot-scope="scope">{{scope.row.version.date|dateTimeFormat}}</template>
      </el-table-column>
      <el-table-column prop="end" label="设定" v-if="$store.state.login.userInfo.auth.can_manage_asset_history">
        <template slot-scope="scope">
          <el-tooltip content="设定为最终状态" placement="top">
            <el-button
              @click="openAssetDetail(scope.row)"
              icon="el-icon-edit"
              type="text"
              style="color:blue"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAssetsEndStatus } from "@/api/assets";
export default {
  name: "history",
  components: {},
  props: ["historyVersion", "project"],
  data() {
    return {};
  },

  computed: {
    groupNum() {
      return new Set(this.historyVersion.map(item => item.name));
    }
  },
  watch: {},
  methods: {
    getVersion() {
      getHistoryVersion({ asset_id: this.project.id }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
    },
    LinkGroup(name) {
      return this.historyVersion.filter(item => item.link_content == name)
        .length;
    },
    TaskGroup(name) {
      return this.historyVersion.filter(item => item.task_name == name).length;
    },
    TaskContentGroup(name) {
      return this.historyVersion.filter(item => item.task_content == name)
        .length;
    },
    NameLen(name) {
      const tmp = Array.from(this.groupNum);
      const index = tmp.indexOf(name);
      let len = 0;
      for (let i = 0; i < index; i++) {
        len += this.Group(tmp[i]);
      }
      return len;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const len = this.LinkGroup(row.link_content);
        const lenName = this.NameLen(row.link_content);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else if (columnIndex === 1) {
        const len = this.TaskGroup(row.task_name);
        const lenName = this.NameLen(row.task_name);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else if (columnIndex === 2) {
        const len = this.TaskContentGroup(row.task_content);
        const lenName = this.NameLen(row.task_content);
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else
          return {
            rowspan: 0,
            colspan: 0
          };
      } else {
        return {
          rowspan: 1,
          colspan: 1
        };
      }
    },
    //资产的最终状态修改
    openAssetDetail(row) {
      getAssetsEndStatus({
        asset_id: this.project.id,
        task_id: row.task_id,
        out_path: row.out_path
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$emit("Version");
        } else {
          this.$message.warning(data.msg);
        }
      });
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>