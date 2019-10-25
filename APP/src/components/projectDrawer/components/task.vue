<template>
  <div id="task">
    <el-table
      ref="assetTable"
      :data="taskList"
      style="width: 100%"
      border
      :stripe="true"
      :tree-props="{ children: 'sub_task' }"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
    >
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="任务"></el-table-column>
      <el-table-column label="制作环节">
        <template slot-scope="scope">{{scope.row.category|categoryFilter}}</template>
      </el-table-column>
      <el-table-column label="镜头号">
        <template slot-scope="scope">{{scope.row.asset.name}}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|projectStatus}}</template>
      </el-table-column>
      <el-table-column label="执行人" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column prop="content" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="end_date" label="截止日期">
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hour" label="预设时间（小时）"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "task",
  filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    categoryFilter(obj) {
      if ("name" in obj) {
        return obj["name"];
      } else {
        return "";
      }
    }
  },
  props: ["taskList", "project"],
  watch: {
    project: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.project = newVal;
          //this.getRemarkList();
        }
      },
      deep: true
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {}
};
</script>

<style>
</style>
