<template>
  <div id="localDelivery">
    <!-- 本地配送 -->
    <el-tabs v-model="firstActiveName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="配送人员" name="staff">
        <el-row class="row-bg" :gutter="10">
          <el-col :span="6" class="col-bg">
            配送人员姓名：
            <el-input style="width:170px" v-model="staffName" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="6" class="col-bg">
            配送人员电话：
            <el-input style="width:170px" v-model="staffPhone" @keyup.enter.native="search()" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="search()">点击查询</el-button>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="dialogShow1 = true">创建</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="staffList"
          stripe
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="staffName" label="配送人员姓名" align="center"></el-table-column>
          <el-table-column prop="staffPhone" label="配送人员电话" align="center"></el-table-column>
          <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button class="el-icon-delete" type="danger"></el-button>
              </el-tooltip>
              <div v-if="disabled==true">
                <el-tooltip effect="dark" content="点击禁用" placement="top">
                    <el-button class="el-icon-circle-close" type="danger" @click="change()"></el-button>
                </el-tooltip>
              </div>
              <div v-else>
                <el-tooltip effect="dark" content="点击启用" placement="top">
                    <el-button class="el-icon-circle-check" type="danger" @click="change()"></el-button>
                </el-tooltip>
              </div>
              <el-tooltip effect="dark" content="编辑" placement="top">
                <el-button class="el-icon-edit" type="danger" @click="put(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配送费用" name="fees">
        <el-row class="row-lg">
          <el-col :span="2" style="margin-top:3px">起送消费金额</el-col>
          <el-col :span="20">
            <el-input v-model="amount"/>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2" style="margin-top:3px">起送配送费用</el-col>
          <el-col :span="20">
            <el-input v-model="fees"/>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2">配送时间</el-col>
          <el-col :span="11">
            <span>上午开始时间</span>
          </el-col>
          <el-col :span="11">
            <span>上午结束时间</span>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="11" :offset="2">
            <el-time-select
                v-model="amStart"
                :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '12:00'
                }"
                placeholder="选择上午开始时间">
            </el-time-select>
          </el-col>
          <el-col :span="11">
            <el-time-select
                v-model="amEnd"
                :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '12:00'
                }"
                placeholder="选择上午结束时间">
            </el-time-select>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="11" :offset="2">
            <span>下午开始时间</span>
          </el-col>
          <el-col :span="11">
            <span>下午结束时间</span>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="11" :offset="2">
            <el-time-select
                v-model="pmStart"
                :picker-options="{
                    start: '12:00',
                    step: '00:30',
                    end: '24:00'
                }"
                placeholder="选择下午开始时间">
            </el-time-select>
          </el-col>
          <el-col :span="11">
            <el-time-select
                v-model="pmEnd"
                :picker-options="{
                    start: '12:00',
                    step: '00:30',
                    end: '24:00'
                }"
                placeholder="选择下午结束时间">
            </el-time-select>
          </el-col>
        </el-row>
        <el-row class="row-lg">
            <span style="color:#d0c5c5;margin-left:95px">(注：配送时间可单独设置上午或下午，若起始时间与结束时间均未设置，则默认为该时间段不提供配送服务)</span>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2">优惠配送金额</el-col>
          <el-col :span="11">
            <span>消费金额</span>
          </el-col>
          <el-col :span="11">
            <span>配送费用</span>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="11" :offset="2">
            <el-input v-model="conAmount" style="width:220px"/>
          </el-col>
          <el-col :span="11">
            <el-input v-model="shipFees" style="width:220px"/>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-col :offset="11">
          <el-button type="primary">保存</el-button>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="本地配送地区" name="area">
        <el-row class="row-lg">
          <el-col :span="2" style="margin-top:3px">已支持地区</el-col>
          <el-col :span="6">
            <el-button type="primary" @click="dialogShow2 = true">指定地区城市</el-button>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2">已选择地区</el-col>
          <el-col :span="22">
            <template>
              <div v-for="(item,index) in placeList" :key="index" style="margin-bottom:5px;">
                <span style="border:lightgray 1px solid;border-radius:10px;padding:5px;">{{item}}
                  <el-button type="text" class="el-icon-circle-close" style="color:lightgray" @click="del(item)">
                  </el-button>
                </span>
              </div>
            </template>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-col :offset="11">
          <el-button type="primary">保存</el-button>
        </el-col>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogShow1" title="基本信息" width="500px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="staffForm"
        ref="staffForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="配送员工姓名" prop="content">
          <el-input v-model="staffForm.person" placeholder="请输入配送员工姓名"></el-input>
        </el-form-item>
        <el-form-item label="配送员工电话" prop="content">
          <el-input v-model="staffForm.phone" placeholder="请输入配送员工电话" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="url">
          <el-radio v-model="staffForm.status" label="open">启用</el-radio>
          <el-radio v-model="staffForm.status" label="close">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogShow1 = false">返回</el-button>
          <el-button type="primary" @click="addInfo('staffForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogShow2" title="选择地区" width="600px">
        <v-distpicker @selected="sel"></v-distpicker>
        <div style="margin-top:30px;padding:20px">
            <el-col :offset="11">
                <el-button type="primary" @click="savePlace">保存</el-button>
            </el-col>
        </div>
    </el-dialog>
  </div>
</template>
<script> 
import VDistpicker from 'v-distpicker'
import { getToken } from "@/utils/auth";
export default {
  data() {
    name: "localDelivery";
    return {
      firstActiveName: "staff",
      staffName:"",
      staffPhone:"",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      staffList:[],
      disabled:true,
      auth:true,
      amount:"100.00",
      fees:"6.00",
      buttonStates: {
        createLoading: false
      },
      dialogShow1: false,
      dialogShow2: false,
      staffForm:{
        person:null,
        phone:null,
        status:"close"
      },
      citydata:"",
      place:"",
      placeList:["北京市丰台区","上海市浦东新区","西安市碑林区"],
      amStart:"9:00",
      amEnd:"12:00",
      pmStart:"13:00",
      pmEnd:"19:00",
      conAmount:"",
      shipFees:""
    };
  },
  components: { VDistpicker },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    search(){
      console.log("查询")
    },
    //保存弹出框1内容
    addInfo(staffForm){
      this.dialogShow1 = false
    },
    change(){
      this.disabled = !this.disabled
    },
    put(){
      console.log("修改")
    },
    sel(data) {          
      this.citydata = data.province.value + data.city.value + data.area.value;               
    },
    //保存弹出框2的内容
    savePlace(){
      this.place = this.citydata
      let index = this.placeList.indexOf(this.place)
      if(index == -1){
        this.placeList.push(this.place)
      }else{
        this.$message.error("该地区已被选择，请重新选择");
      }
      this.dialogShow2 = false
    },
    del(item){
      let index = this.placeList.indexOf(item);
      this.placeList.splice(index, 1);
    },
    //批量删除
    delActs(){
      this.$confirm("此操作将永久删除活动,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
      });
    },
  },
  created(){

  }
};
</script>
<style lang='scss' scoped>
#localDelivery {
  .row-bg {
    padding-bottom: 10px;
  }
  .col-bg {
    padding: 6px;
  }
  .row-lg{
    padding-left:70px;
    padding-top:20px;
  }
}
</style>

