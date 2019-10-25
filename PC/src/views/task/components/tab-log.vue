<template functional>
  <el-table :data="props.loglist" v-loading="props.logsLoading">
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="content" label="任务内容"></el-table-column>
    <el-table-column prop="schedule" label="完成进度"></el-table-column>
    <el-table-column prop="labor_hour" label="工时"></el-table-column>
    <el-table-column prop="executor_date" label="日期" width="90px">
      <template slot-scope="scope">
        {{scope.row.executor_date|dateTimeFormat}}
      </template>
    </el-table-column>
  </el-table>
</template>

