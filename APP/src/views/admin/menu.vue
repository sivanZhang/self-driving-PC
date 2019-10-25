<template>
  <div id="menu">
    <el-tabs tab-position="left" style="height: ;overflow: auto;padding-top:10px">
      <el-tab-pane label="内部时间配置" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:35%;padding:3px" v-if="$store.state.login.userInfo.auth.admin_management">
            <div style="display:flex">
              <el-form
                ref="saveForm"
                :label-position="labelPosition"
                label-width="100px"
                :model="saveForm"
                :rules="saveRules"
                class="save-form"
              >
                <el-form-item label="上班时间" prop="official_worktime_on">
                  <el-time-select
                    v-model="saveForm.official_worktime_on"
                    :picker-options="{
                    start:'06:00',
                    step:'00:15',
                    end:'20:00'
                }"
                    placeholder="上班时间"
                    name="official_worktime_on"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="下班时间" prop="official_worktime_off">
                  <el-time-select
                    v-model="saveForm.official_worktime_off"
                    :picker-options="{
                    start:'06:00',
                    step:'00:15',
                    end:'20:00',
                    minTime:saveForm.official_worktime_on
                }"
                    placeholder="下班时间"
                    name="official_worktime_off"
                    style="width:220px"
                   
                  />
                </el-form-item>
                <el-form-item label="工时" prop="official_worktime_long">
                  <el-input
                    ref="official_worktime_long"
                    v-model="saveForm.official_worktime_long"
                    placeholder="工时"
                    name="official_worktime_long"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading" @click="save(1)">保存</el-button>
                  <el-button @click="resetForm('saveForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="width:65%;padding-top:3px">
            <div style="display:flex">
              <el-table :data="official"  style="width: 100%" ref="official"
               :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
              >
                  <el-table-column label="上班时间" prop="official_work_on">
                    <template slot-scope="scope">{{scope.row.official_work_on?scope.row.official_work_on:"-"}}</template>
                  </el-table-column>
                  <el-table-column label="下班时间" prop="official_work_off">
                    <template slot-scope="scope">{{scope.row.official_work_off?scope.row.official_work_off:"-"}}</template>
                  </el-table-column>
                  <el-table-column label="工时(小时)" prop="official_work_long">
                    <template slot-scope="scope">{{scope.row.official_work_long?scope.row.official_work_long:"-"}}</template>
                  </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="实训时间配置">
        <div style="display:flex">
          <div style="width:35%;padding:3px" v-if="$store.state.login.userInfo.auth.admin_management">
            <div style="display:flex">
              <el-form
                ref="saveForm1"
                :label-position="labelPosition"
                label-width="100px"
                :model="saveForm1"
                :rules="saveRules1"
                class="save-form"
              >
                <el-form-item label="上班时间" prop="training_worktime_on">
                  <el-time-select
                    v-model="saveForm1.training_worktime_on"
                    :picker-options="{
                    start:'06:00',
                    step:'00:15',
                    end:'20:00'
                }"
                    placeholder="上班时间"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="下班时间" prop="training_worktime_off">
                  <el-time-select
                    v-model="saveForm1.training_worktime_off"
                    :picker-options="{
                    start:'06:00',
                    step:'00:15',
                    end:'20:00',
                    minTime:saveForm1.training_worktime_on
                }"
                    placeholder="下班时间"
                    style="width:220px"
                  />
                </el-form-item>
                <el-form-item label="工时" prop="training_worktime_long">
                  <el-input
                    ref="training_worktime_long"
                    v-model="saveForm1.training_worktime_long"
                    type="text"
                    placeholder="工时"
                    style="width:220px"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="loading1" @click="save(2)">保存</el-button>
                  <el-button @click="resetForm('saveForm1')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="width:65%;padding-top:3px">
          <div style="display:flex">
            <el-table :data="training"  style="width: 100%" ref="training"
             :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
            >
               <el-table-column label="上班时间" prop="training_work_on">
                    <template slot-scope="scope">{{scope.row.training_work_on?scope.row.training_work_on:"-"}}</template>
                  </el-table-column>
                  <el-table-column label="下班时间" prop="training_work_off">
                    <template slot-scope="scope">{{scope.row.training_work_off?scope.row.training_work_off:"-"}}</template>
                  </el-table-column>
                  <el-table-column label="工时(小时)" prop="training_work_long">
                    <template slot-scope="scope">{{scope.row.training_work_long?scope.row.training_work_long:"-"}}</template>
                  </el-table-column>
            </el-table>
          </div>
          </div>
         
        </div>
      </el-tab-pane>
      <el-tab-pane label="排名权重配置">
         <div style="display:flex">
          <div style="width:50%;padding:3px">
            (评分 * 权重) - (考勤 * 权重) - (提交时间 * 权重) - (任务排名 * 权重) = 总排名
          </div>
         </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

  <script>
import { officialWorktime, trainingWorktime, rankList ,getDateList } from "@/api/admin";
export default {
  data() {
    name = "menu";
    return {
      saveForm: {},
      saveForm1: {},
      counterNum: [],
      official:[],
      training:[],
      labelPosition: "right",
      saveRules: {
        official_worktime_on: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上班时间"
          }
        ],
        official_worktime_off: [
          {
            required: true,
            trigger: "blur",
            message: "请输入下班时间"
          }
        ],
        official_worktime_long: [
          {
            required: true,
            trigger: "blur",
            message: "请输入工时"
          }
        ]
      },
      saveRules1: {
        training_worktime_on: [
          {
            required: true,
            trigger: "blur",
            message: "请输入上班时间"
          }
        ],
        training_worktime_off: [
          {
            required: true,
            trigger: "blur",
            message: "请输入下班时间"
          }
        ],
        training_worktime_long: [
          {
            required: true,
            trigger: "blur",
            message: "请输入工时"
          }
        ]
      },
      loading: false,
      loading1: false
    };
  },
  created(){
     this.getTimeSetting()
  },
  methods: {
    //工时计算
    // changeTime(val){

    //   const totalHour = 
    //   (this.saveForm.official_worktime_off*1000 - this.saveForm.official_worktime_on*1000);
    //   console.log(totalHour);
    //   this.saveForm = {
    //     ...this.saveForm,
    //     official_worktime_long : totalHour
    //   }
    // },
    
    //获取内外部时间配置
    getTimeSetting(){
      getDateList().then(({ data })=>{
        this.official = [data.official];
        this.training = [data.training];
      })
    },
    //成员的上下班和工时设置
    save(Type) {
      //正式成员设置
      if (Type == 1) {
        this.$refs["saveForm"].validate(valid => {
          if (valid) {
            this.loading = true;
            officialWorktime({ official_worktime: "", ...this.saveForm}).then(({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.loading = false;
                this.$refs["saveForm"].resetFields();
                this.getTimeSetting()
              } else {
                this.$message.error(data.msg);
              }
              
            });
          }
        });
      }
      //实训成员设置
      if (Type == 2) {
        this.$refs["saveForm1"].validate(valid => {
          if (valid) {
            this.loading1 = true;
            trainingWorktime({ training_worktime: "",...this.saveForm1 }).then(({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.loading1 = false;
                this.$refs["saveForm1"].resetFields();
                this.getTimeSetting()
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>