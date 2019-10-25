<template>
  <div>
    <el-form v-model="TaskRecord" ref="task-form" label-width="100px" label-position="left">
      <el-form-item label="标题" prop="title">
        <el-input type="text" v-model="TaskRecord.title" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="完成内容" prop="content">
        <el-input type="textarea" v-model="TaskRecord.content" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="完成进度" prop="content">
        <el-row type="flex" align="middle">
          <el-col :span="10">
            <el-input-number v-model="TaskRecord.schedule" :min="0" :max="100" :step="10"></el-input-number>
          </el-col>
          <el-col :span="14">
            <el-progress
              :percentage="TaskRecord.schedule"
              :color="customColors"
              :text-inside="true"
              :stroke-width="20"
            ></el-progress>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="工时" prop="labor_hour">
        <el-input-number v-model="TaskRecord.labor_hour" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="TaskRecord.date" type="date" placeholder="选择日期" value-format="yyyy/MM/dd"
        style="width:130px"></el-date-picker>
         </el-form-item>
    </el-form>
    <el-row type="flex" justify="end">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="createLoading" type="primary" @click="addRecord()">提交</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
    props:['TaskRecord','createLoading'],
    data(){
      return {
            customColors: [{
                    color: "#f56c6c",
                    percentage: 20
                },
                {
                    color: "#e6a23c",
                    percentage: 40
                },
                {
                    color: "#6f7ad3",
                    percentage: 60
                },
                {
                    color: "#1989fa",
                    percentage: 80
                },
                {
                    color: "#5cb87a",
                    percentage: 100
                }
            ],
      }
    },
    methods:{
      addRecord(){
        this.$emit('addRecord')
      },
      cancel(){
        this.$emit('cancel')
      }
    }
};
</script>

<style>
</style>
