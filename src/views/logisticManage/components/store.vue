<template>
  <div id="store">
    <!-- 门店自提 -->
    <el-tabs v-model="firstActiveName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="门店管理" name="manage">
        <el-row class="row-bg" :gutter="10">
          <el-col :span="5" class="col-bg">
            门店名称：
            <el-input style="width:170px" v-model="storeName" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            联系人：
            <el-input style="width:170px" v-model="person" @keyup.enter.native="search()"></el-input>
          </el-col>
          <el-col :span="5" class="col-bg">
            联系电话：
            <el-input style="width:170px" v-model="phone" @keyup.enter.native="search()" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
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
          :data="infoList"
          stripe
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="comName" label="门店名称" align="center"></el-table-column>
          <el-table-column prop="serial" label="联系人" align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="phone" label="地址" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="default" label="默认" align="center"></el-table-column>
          <el-table-column prop="date" label="创建时间" align="center"></el-table-column>
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
      <el-tab-pane label="门店运费" name="freight">
        <el-row class="row-lg">
          <el-col :span="2" style="margin-top:3px">门店运费</el-col>
          <el-col :span="20">
            <el-input v-model="freight"/>
            <span style="color:#d0c5c5;">(注：如果会员选择配送方式是门店自提对应运费)</span>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2">满X免运费</el-col>
          <el-col :span="20">
            <el-input v-model="nofreight"/>
          </el-col>
        </el-row>
        <el-row class="row-lg">
          <el-col :span="2">是否启用</el-col>
          <el-radio-group v-model="enable">
            <el-radio label="Yes">是</el-radio>
            <el-radio label="No">否</el-radio>
          </el-radio-group>
        </el-row>
        <el-divider></el-divider>
        <el-col :offset="11">
          <el-button type="primary">保存</el-button>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="门店审核人员" name="auditor">
        <el-row>
          <el-col :span="2">
            <el-button 
              type="danger"  
              @click="delActs()"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </el-col>
          <el-col :span="2">
            <el-button 
              type="primary" 
              @click="dialogShow2 = true"
            >创建</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="auditorList"
          stripe
          highlight-current-row
          style="width: 100%;"
          :header-cell-style="{color:'#212529',fontSize:'16px',fontWeight:400}"
          :row-style="{fontSize:'16px',color:'#212529;',fontWeight:400,}"
        >
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
          <el-table-column prop="cellphone" label="手机号码" align="center"></el-table-column>
          <el-table-column prop="stoName" label="门店名称" align="center"></el-table-column>
          <el-table-column prop="creDate" label="创建时间" align="center"></el-table-column>
          <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
            <template>
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
                <el-button class="el-icon-edit" type="danger"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogShow1" title="基本信息" width="500px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="infoForm"
        ref="infoForm"
        label-width="85px"
        label-position="left"
      >
        <el-form-item label="门店名称" prop="title">
          <el-input v-model="infoForm.storeName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="content">
          <el-input v-model="infoForm.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="content">
          <el-input v-model="infoForm.place" placeholder="请输入地区"></el-input>
          <v-distpicker @selected="sel" style="margin-top:10px"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" prop="content">
          <el-input type="textarea" v-model="infoForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="经纬度选择" prop="content">
          <el-row>
            <el-col :span="20">
              <el-input v-model="infoForm.coordinate" placeholder="请选择经纬度"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button>地图选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="联系人" prop="content">
          <el-input v-model="infoForm.person" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="content">
          <el-input v-model="infoForm.phone" placeholder="请输入联系电话" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
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
    <el-dialog :visible.sync="dialogShow2" title="基本信息" width="500px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="auditForm"
        ref="auditForm"
        label-width="85px"
        label-position="left"
      >
        <el-form-item label="自提点" prop="title">
          <el-select v-model="auditForm.point" placeholder="请输入门店名称">
            <el-option
              v-for="item in pointList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="content">
          <el-input
            placeholder="输入手机号码查询"
            suffix-icon="el-icon-search"
            oninput="value=value.replace(/[^\d.]/g,'')"
            v-model="auditForm.cellphone">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="url">
          <el-radio v-model="auditForm.status" label="open">启用</el-radio>
          <el-radio v-model="auditForm.status" label="close">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogShow2 = false">返回</el-button>
          <el-button type="primary" @click="addAudit('auditForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script> 
import VDistpicker from 'v-distpicker'
import { getToken } from "@/utils/auth";
export default {
  data() {
    name: "store";
    return {
      firstActiveName: "manage",
      storeName:"",
      person:"",
      phone:"",
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
      infoList:[],
      disabled:true,
      auth:true,
      buttonStates: {
        createLoading: false
      },
      dialogShow1: false,
      dialogShow2: false,
      citydata:"",
      infoForm:{
        storeName:null,
        sort:null,
        place:null,
        address:null,
        coordinate:null,
        person:null,
        phone:null,
        status:"close"
      },
      freight:10,
      nofreight:100,
      enable:"No",
      multipleSelection: [],
      auditorList:[],
      auditForm:{
        point:null,
        cellphone:null,
        status:"close"
      },
      pointList: [{
        value: '选项1',
        label: '陕西省西安市碑林区'
      }, {
        value: '选项2',
        label: '陕西省西安市雁塔区'
      }, {
        value: '选项3',
        label: '北京市朝阳区'
      }],
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
    addInfo(infoForm){
      this.dialogShow1 = false
    },
    //保存弹出框2内容
    addAudit(auditForm){
      this.dialogShow2 = false
    },
    change(){
      this.disabled = !this.disabled
    },
    sel(data) {          
      this.citydata = data.province.value + data.city.value + data.area.value; 
      if(data.province.value !== "" && data.city.value !== "" && data.area.value !==""){
        this.infoForm.place = this.citydata 
      }              
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
#store {
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

