<template>
  <div id="Logistics">
    <!-- 物流配送 -->
    <el-tabs v-model="firstActiveName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="物流配送" name="send">
        <el-row class="row-bg" :gutter="10">
          <el-col :span="5" class="col-bg">
            公司名称：
            <el-input style="width:170px" v-model="comName" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            编号：
            <el-input style="width:170px" v-model="serial" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            创建时间：
            <el-date-picker
              v-model="date"
              size="mini"
              style="width:170px"
              type="date"
              align="right"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="search()">点击查询</el-button>
          </el-col>
          <el-col :span="2" class="col-bg">
            <el-button type="primary" style="height:27.99px" @click="dialogShow1 = true">创建</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="sendList"
          stripe
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="comName" label="公司名称" align="center"></el-table-column>
          <el-table-column prop="serial" label="编号" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="default" label="默认" align="center"></el-table-column>
          <el-table-column prop="date" label="创建时间" align="center"></el-table-column>
          <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="删除" placement="top">
                <el-button class="el-icon-delete" type="danger" @click="delRecord(scope.row.id)"></el-button>
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
                <el-button class="el-icon-edit" type="danger" @click="putRecord(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="货到付款地区" name="place">
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
        :model="infoForm"
        ref="infoForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="公司名称" prop="title">
          <el-input v-model="infoForm.name" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="content">
          <el-input v-model="infoForm.number" placeholder="请输入编号"></el-input>
        </el-form-item>
         <el-form-item label="排序" prop="content">
          <el-input v-model="infoForm.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="封面">
            <el-upload
                accept="picture/jpeg, picture/gif, picture/png"
                ref="upload"
                class="upload-demo"
                action="/api/appfile/appfile/"
                :headers="headers"
                :on-success="handleSuccess"
                drag
                :show-file-list="false"
            >
            <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
            <template v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话" prop="content">
          <el-input v-model="infoForm.phone" placeholder="请输入联系电话" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="默认" prop="url">
          <el-radio v-model="infoForm.default" label="Yes">是</el-radio>
          <el-radio v-model="infoForm.default" label="No">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="url">
          <el-radio v-model="infoForm.status" label="open">启用</el-radio>
          <el-radio v-model="infoForm.status" label="close">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogShow1 = false">返回</el-button>
          <el-button type="primary" @click="addInfo('infoForm')">保存</el-button>
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
    name: "Logistics";
    return {
      firstActiveName: "send",
      comName:"",
      serial:"",
      date:"",
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
      sendList:[],
      disabled:true,
      auth:true,
      buttonStates: {
        createLoading: false
      },
      dialogShow1: false,
      dialogShow2: false,
      infoForm:{
        name:null,
        number:null,
        sort:null,
        picture:"",
        phone:null,
        default:"Yes",
        status:"close"
      },
      SRC: "",
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      citydata:"",
      place:"",
      placeList:["北京市丰台区","上海市浦东新区","西安市碑林区"]
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
    //保存弹出框内容
    addInfo(infoForm){
      this.dialogShow1 = false
    },
    delRecord(){
      console.log("删除")
    },
    putRecord(){
      console.log("修改")
    },
    change(){
      this.disabled = !this.disabled
    },
    //监听上传图片成功，成功后赋值给form ，并且赋值给图片src显示图片
    handleSuccess(response, file, fileList) {
      console.log(response)
        if (response.status == 0) {
            this.SRC = this.$store.state.BASE_URL + response.msg;
            this.actForm["picture"]= response.msg;
            // this.addGiftsForm.image_id = response.id;
        } else {
            this.$message.error(response.msg);
        }
    },
    sel(data) {          
      this.citydata = data.province.value + data.city.value + data.area.value;          
      // console.log(this.citydata);        
    },
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
    }
  },
  created(){

  }
};
</script>
<style lang='scss' scoped>
#Logistics {
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
