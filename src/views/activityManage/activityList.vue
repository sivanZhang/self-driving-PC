<template>
  <div id="activityInfo">
    <!-- 活动列表 -->
    <el-row class="row-lg" v-if="this.auth==true">
        <el-col :span="2">
          <el-button 
            type="danger" 
            icon="el-icon-delete" 
            @click="delActs()"
            :disabled="this.multipleSelection.length === 0"
          >批量删除</el-button>
        </el-col>
        <el-col :span="2">
          <el-button 
            type="primary" 
            icon="el-icon-plus" 
            @click="openDialog()"
          >添加活动</el-button>
        </el-col>
    </el-row>
    <el-table
      row-key='id'
      :data="activityList"
      border
      :stripe="true"
      :row-style="{'font-size':'13px'}"
      :header-cell-style="{'font-size':'12px',background:'#eef1f6',color:'#606266'}"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="活动图片" align="center">
        <template slot-scope="scope">
          <el-image
            :src="$store.state.BASE_URL+scope.row.image"
            style="width: 100%; height: 100%"
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
      <el-table-column prop="title" label="活动标题" align="center"></el-table-column>
      <el-table-column prop="content" label="活动内容" align="center"></el-table-column>
      <el-table-column prop="date" label="活动发布日期" align="center">
        <template slot-scope="scope">{{scope.row.date|dateFormat}}</template>
      </el-table-column>
      <el-table-column prop="url" label="活动跳转url" align="center"></el-table-column>
      <el-table-column label="活动状态" align="center">
          <template slot-scope="scope">
          <div v-if="scope.row.status==0">
            {{scope.row.status|activityStatus}}
          </div>
          <div v-if="scope.row.status==1">
            {{scope.row.status|activityStatus}}
          </div>
          <div v-if="scope.row.status==2">
            {{scope.row.status|activityStatus}}
          </div>
        </template>
      </el-table-column>
      <el-table-column :key="18" label="操作" align="center" v-if="this.auth==true">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="删除活动" placement="top">
            <el-button
              class="el-icon-delete"
              type="danger"
              @click="deleteAct(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogShow" :title="dialogName" width="500px">
      <el-form
        :loading="buttonStates.createLoading"
        :model="actForm"
        ref="actForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="actForm.title" placeholder="请输入活动标题"></el-input>
        </el-form-item>
        <el-form-item label="活动内容" prop="content">
          <el-input v-model="actForm.content" placeholder="请输入活动内容"></el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-select class="select" v-model="actForm.status" placeholder="请选择活动状态" style="width:360px" filterable>
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="发布时间" prop="date">
          <el-date-picker
            v-model="actForm.date"
            type="date"
            style="width:360px"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="活动图片">
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
          <!-- <el-input v-model="actForm.image"></el-input> -->
        </el-form-item>
        <el-form-item label="跳转url" prop="url">
          <el-input v-model="actForm.url" placeholder="请输入url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addAct('actForm')">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getActivityAuth, getActivityList,deleteActivity,addActivity } from "@/api/activity";
import { getToken } from "@/utils/auth";
export default {
    data() {
        return {
            activityList:[],
            auth:false,
            multipleSelection: [],
            dialogShow: false,
            dialogName: null,
            buttonStates: {
                createLoading: false
            },
            actForm:{
                title:null,
                content:null,
                picture:"",
                url:null,
                status:null
            },
            SRC: "",
            headers: {
                Authorization: `JWT ${getToken()}`
            },
              status: [
                {
                    value: "0",
                    label: "草稿"
                },
                {
                    value: "1",
                    label: "可用"
                },
                {
                    value: "2",
                    label: "已过期"
                }
            ],
        }
    },
    methods: {
        //获取活动列表
        getActivity(){
            getActivityList({app:""}).then(({data})=>{
                if(data.status == 0){
                    console.log(data)
                    this.activityList = data.msg
                }else{
                    return false;
                }
            })
        },
        //获取活动管理权限
        getAuth(){
            getActivityAuth({auth:''}).then(({data}) =>{
              this.auth = data.msg.auth.manage_spread
            }) 
        },
        //删除活动
        deleteAct(id){
            this.$confirm("是否删除该活动?", "提示", {
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deleteActivity({ ids: id, method: "delete " }).then(({ data }) => {
                    if (data.status === 0) {
                        this.$message.success(data.msg);
                        this.getActivity();
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            });
        },
        //批量删除
        delActs(){
            this.$confirm("此操作将永久删除活动,是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                const ids = this.multipleSelection.map(item => item.id).join(",");
                deleteActivity({ ids: ids, method: "delete" }).then(({ data }) => {
                    if (data.status === 0) {
                        this.getActivity();
                        this.$message.success(data.msg);
                    } else {
                        this.$message.error(data.msg);
                    }
                });
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //打开添加活动弹出框
        openDialog() {
            this.dialogName = "添加活动";
            this.dialogShow = true;
        },
        //添加活动
        addAct(actForm){
            let data = {
                title:this.actForm.title,
                content:this.actForm.content,
                url:this.actForm.url,
                status:this.actForm.status,
                image:this.actForm.picture
            }
            addActivity(data).then(({data}) => {
                if(data.status == 0){
                    this.$message.success(data.msg);
                    this.dialogShow = false;
                    this.$refs["actForm"].resetFields();
                    this.getActivity();
                }else{
                    this.$message.error(data.msg);
                }
            })
        },
        //关闭添加活动弹出框
        cancel() {
            this.dialogShow = false;
            this.$refs["actForm"].resetFields();
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
    },
    created() {
        this.getActivity(),
        this.getAuth()
    }
};
</script>
<style lang='scss' scoped>
.row-lg{
    margin-bottom: 5px;
}
</style>