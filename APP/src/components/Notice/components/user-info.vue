<template>
  <div id="notiec-info">
    <div style="padding-left:40px">
      <el-row class="col">
        <el-col :span="4" class="comment">用户名</el-col>
        <el-col :span="20" class="comment">{{userInfo.username}}</el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">性别</el-col>
        <el-col :span="20" class="comment">
          <div @mouseover="showEdit=true" @mouseleave="showEdit = false">
            <span v-if="!editing">{{userInfo.sex}}</span>
            <i class="el-icon-edit" style="color:blue" @click="edit(1)" v-if="showEdit"></i>
          </div>
          <div v-if="editing">
            <el-select v-model="sex" placeholder="请选择" ref="sex" @change="sexChange">
              <el-option v-for="(item,index) of sexList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-button @click="save(1)" type="primary">修改</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">邮箱</el-col>
        <el-col :span="20" class="comment">
         {{userInfo.email}}
        </el-col>
      </el-row>
      <el-row class="col">
        <el-col :span="4" class="comment">电话</el-col>
        <el-col :span="20" class="comment">
          <div @mouseover="showEdit2=true" @mouseleave="showEdit2 = false">
              <span v-if="!editing2">{{userInfo.phone?userInfo.phone:"-"}}</span>
              <i
                class="el-icon-edit"
                style="color:blue"
                v-if="showEdit2"
                @click="edit(2)"
              ></i>
            </div>
            <div v-if="editing2">
              <input type="text" ref="input" class="input" value="userInfo.phone" v-model="phone" />
              <el-button @click="save(2)" type="primary">修改</el-button>
            </div>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>
<script>
import * as HTTP from "@/api/notice";
import { updateUserInfo, addUser } from "@/api/login";
import { userInfo } from 'os';
export default {
  name: "NoticeInfo",
  props: ["userInfo"],
  data() {
    return {
      show:false,
      
      showEdit:false,
      showEdit2:false,
      editing:false,
      editing2:false,
      sex:null,
      sexName:null,
      phone:null,
      sexList:[{
        name: "男",
        id: 0
      },{
        name: "女",
        id: 1
      }]
    };
  },

  methods: {
    sexChange(val){
      this.sexName=this.sexList.find(item=>{
        return item.id === val;
      }).name;
      console.log(this.sex);
    },
    edit(Type){
     if(Type === 1){
       this.showEdit =false;
       this.editing = true;
       this.$nextTick(()=>{
         this.$refs.sex.focus();
       })
     } 
     if(Type === 2){
       this.showEdit2 =false;
       this.editing2 = true;
       this.$nextTick(()=>{
         this.$refs.input.focus();
       })
     }
    },
    save(Type){
      let data = null;
      if(Type === 1){
        this.editing = false;
        data={
          sex: this.sex
        }
      }
      if(Type === 2){
        this.editing2 = false;
        data = {
          phone:this.phone
        } 
      }
      updateUserInfo({
        ...data,
        method:"put",
        userid: this.userInfo.id
      }).then(({data})=>{
        if(data.status === 0){
          this.$message.success(data.msg);
          if(Type === 1){
            this.userInfo.sex = this.sexName;
            this.sex = null;
          }
          if(Type === 2){
            this.userInfo.phone = this.phone;
            this.phone = null;
          }
        }else{
          this.$message.error(data.msg);
        }
      })
    }
  }
};
</script>

<style scoped>
.col{
  padding-bottom:10px
}
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
  input {
    width: 100px;
    border: none;
    border-bottom: solid 2px deepskyblue;
  }
  input:focus {
    outline: none;
  }
</style> 