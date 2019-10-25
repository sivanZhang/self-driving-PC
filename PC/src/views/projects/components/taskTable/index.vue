<!-- 在资产中展示任务列表 -->
<template>
    <el-table
      :data="tableTask"
      style="width:80%;padding-top:0px"
      highlight-current-row
      :tree-props="{ children: 'sub_task' }"
       default-expand-all
       :row-key="row=>row.id"
      :stripe="true"
      :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
      :cell-style="cellStyle"
      border
    >
      <el-table-column width="30px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
            <el-card
              v-if="scope.row.status === 0"
              :style="{width:'13px',backgroundColor:'#F9ce8c'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
            <el-card
              v-if="scope.row.status === 1"
              :style="{width:'13px',backgroundColor:'#59e0e8'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
            <el-card
              v-if="scope.row.status === 2"
              :style="{width:'13px',backgroundColor:'#589BAD'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
            <el-card
              v-if="scope.row.status === 3"
              :style="{width:'13px',backgroundColor:'#2D5637'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：完成" placement="top">
            <el-card
              v-if="scope.row.status === 4"
              :style="{width:'13px',backgroundColor:'#2f5c85'}"
            ></el-card>
          </el-tooltip>
          <el-tooltip effect="dark" content="任务状态：超时" placement="top">
            <el-card
              v-if="scope.row.status === 5"
              :style="{width:'13px',backgroundColor:'#C64b2b'}"
            ></el-card>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="任务ID" prop="id" width="90px"></el-table-column>
      <el-table-column label="缩略图" width="100px">
        <template slot-scope="scope" v-if="!scope.row.pid">
          <el-image
            :src="$store.state.BASE_URL+scope.row.asset.image"
            :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
            style="width: 55px;height: 33px;cursor: pointer; display:block;"
          >
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
      <el-table-column prop="name" label="任务" width="100px"></el-table-column>
      <el-table-column label="制作环节" prop="dept" show-overflow-tooltip width="100px">
        <template slot-scope="scope">{{scope.row.link_dept_name}}</template>
      </el-table-column>
      <el-table-column label="制作内容" align="left" width="300px" prop="content" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column label="镜头号" show-overflow-tooltip prop="asset" width="90pxs">
        <template slot-scope="scope">{{scope.row.asset.name}}</template>
      </el-table-column> -->
      <el-table-column prop="priority" label="优先级" width="120px" align="center">
        <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
      </el-table-column>
      <el-table-column prop="grade" label="难度等级" width="120px" align="center">
        <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="90px">
        <template slot-scope="scope">{{scope.row.status|taskStatus}}</template>
      </el-table-column>
      <el-table-column label="创建者" prop="user" width="200px">
        <template slot-scope="scope">{{scope.row.creator.name}}</template>
      </el-table-column>
      <el-table-column label="执行人" show-overflow-tooltip width="200px">
        <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
      </el-table-column>
      <el-table-column label="任务进度" width="100px" align="center" prop="schedule">
        <template slot-scope="scope">{{scope.row.schedule}}%</template>
      </el-table-column>
      <el-table-column label="创建日期" width="100px" prop="date" sortable="custom">
        <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="开始日期" width="100px" prop="start_date" sortable="custom">
        <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column label="截止日期" width="100px" prop="end_date" sortable="custom">
        <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="total_hour" align="center" label="预设时间（小时）" width="130px"></el-table-column>
    </el-table>

</template>

<script>
import { queryTask } from "@/api/task";
export default {
  name: "taskTable",
  components: {},
  data() {
    return {
      tableTask: []
    };
  },
  watch: {},
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
  methods: {
    getTaskList(id) {
      queryTask({
        lens_id: id
      }).then(({ data }) => {
        this.tableTask = [...data.msg];
  
      });
    },
    //表内单元格样式（状态、优先级改变背景色）
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>