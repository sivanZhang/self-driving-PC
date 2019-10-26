<template>
  <div id="assets">
    <el-table
      ref="assetTable"
      :data="assetsList"
      style="width: 100%"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      row-class-name="hover"
    >
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 50px;height: 30px;"
          ><!-- @click.native="show(scope.row.id)" -->
            <div slot="placeholder" class="image-slot">
              加载中
              <span class="dot">...</span>
            </div>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture" style="color:#909399"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" align="left"></el-table-column>
      <el-table-column prop="priority" label="优先级" :formatter="Priority" align="left"></el-table-column>
      <el-table-column prop="level" label="难度等级" :formatter="Level" align="left"></el-table-column>
      <el-table-column prop="id" label="资产ID" v-if="false" align="left"></el-table-column>
      <el-table-column prop="path" label="路径" v-if="false" align="left"></el-table-column>
      <el-table-column prop="creator_name" label="创建人" v-if="false" align="left"></el-table-column>
      <el-table-column prop="creator_id" label="创建人ID" v-if="false" align="left"></el-table-column>
      <el-table-column prop="status" label="状态" align="left"></el-table-column>
      <el-table-column prop="executor" label="执行人" v-if="false" align="left"></el-table-column>
      <el-table-column prop="deadline" label="截止日期" v-if="false" align="left"></el-table-column>
      <el-table-column prop="total_hours" label="总工时" v-if="false" align="left"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "assets",
  props: ["assetsList", "project"],
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
  methods: {
    //难度等级格式化显示
    Level: function(row, column) {
      switch (row.level) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "复杂";
          break;
        case 3:
          return "高难度";
          break;
      }
    },
    //优先级格式化显示
     Priority:function(row,column){
       switch (row.priority) {
        case 0:
            return '正常'
            break
        case 1:
            return '优先'
            break
    }
     }
  }
};
</script>

<style>
</style>
