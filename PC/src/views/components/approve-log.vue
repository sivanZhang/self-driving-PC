<template>
  <div>
    <template v-if="task_or_project==='project'">
      <el-select
      v-model="select"
      placeholder="请选择"
      style="width:120px;margin-bottom:10px;"
      @change="getAssetAppooveList()"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    </template>
    <template v-else>
      <el-select
      v-model="select"
      placeholder="请选择"
      style="width:120px;margin-bottom:10px;"
      @change="getApproveLog()"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    </template>
    <div v-loading="tableLoading">
      <div class="bd" v-for="(t,i) of list" :key="i">
        <el-row type="flex" justify="space-between">
          <el-col style="display:flex">
            <div class="item"> 
               <div class="item-con">
                  <template v-if="t.approve_result =='1'">
                  <i class="el-icon-check" style="color:green;font-size:15px">通过</i>
                </template>
                <template v-else>
                  <i class="el-icon-close" style="color:red;font-size:15px">未通过</i>
                </template>  
                </div>
            </div>
          </el-col>
          <el-col style="display:flex">
            <template v-if="t.pro_type === 0">
              <div class="item" style="padding-left:40px" >
                <div class="item-title" style="width:40px">评分:</div>
                <div class="item-con">{{t.score}}</div>
              </div>
            </template>
          </el-col>
          <el-col class="text-right">{{t.time|dateTimeFormat}}</el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col style="display:flex">
            {{t.approve_user_id.name}}<h6 style="padding-left:8px">:</h6>
          </el-col>
        </el-row>
        <div class="item">
          <div class="item-con">{{t.approve_suggestion}}</div>
        </div>
        <div class="item">
          <div class="item-con">
            <el-col :span="5"  v-for="(item,index) of t.images" :key="index">
              
                <el-row>
                  <el-image
                  :src="$store.state.BASE_URL+item.image_path"
                  :preview-src-list="imageList(t.images)"
                  style="height:55px;width:90px"
                  fit="cover"
                ></el-image>
                </el-row>
                <el-row style="text-align:center">
                  第{{item.image_frame}}帧
                </el-row>
              
            </el-col>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!list.length">暂无数据</div>
  </div>
</template>
<script>
import { getApproveRemark } from "@/api/video";
import { getAssetsApprove } from "@/api/assets";
export default {
  mame: "approve-logs",
  props:["task_or_project"],
  data() {
    return {
      tableLoading: false,
      list: [],
      httpParams: {},
      options: [
        {
          label: "全部",
          value: 2
        },
        {
          label: "未通过",
          value: 0
        },
        {
          label: "通过",
          value: 1
        }
      ],
      select: 2
    };
  },
  methods: {
    imageList(image){
      return image.map(t=>this.$store.state.BASE_URL+t.image_path)
    },
    //父组件直接通过$refs[组件ref值].getApproveLog(task的id)即可请求列表，切换筛选时自动调用的
    getApproveLog(task_id) {
      if (task_id && this.select === 2) {
        this.httpParams = { task_id };
      } else if (!task_id && this.select === 2) {
        this.httpParams = { task_id: this.httpParams["task_id"] };
      } else if (task_id && this.select !== 2) {
        this.httpParams = {
          task_id,
          approve_result: this.select
        };
      } else if (!task_id && this.select !== 2) {
        this.httpParams = {
          ...this.httpParams,
          approve_result: this.select
        };
      }
      this.tableLoading = true;
      getApproveRemark(this.httpParams)
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.status === 0) {
            this.list = [...data.msg];
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    getAssetAppooveList(asset_id) {
      if (asset_id && this.select === 2) {
        this.httpParams = { asset_id };
      } else if (!asset_id && this.select === 2) {
        this.httpParams = { asset_id: this.httpParams["asset_id"] };
      } else if (asset_id && this.select !== 2) {
        this.httpParams = {
          asset_id,
          approve_result: this.select
        };
      } else if (!asset_id && this.select !== 2) {
        this.httpParams = {
          ...this.httpParams,
          approve_result: this.select
        };
      }
      this.tableLoading = true;
      getAssetsApprove(this.httpParams)
        .then(({ data }) => {
          this.tableLoading = false;
          if (data.status === 0) {
            this.list = [...data.msg];
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bd {
  border: 1px solid #ddd;
  padding: 10px;
  flex: 1 1 auto;
  width: 100%;
  margin-bottom: 10px;
}
.text-right {
  text-align: right;
}
.item {
  margin: 5px 0;
  display: flex;
  justify-content: flex-start;
}
.item-con {
  flex: 1 1 auto;
}
.item-title {
  width: 80px;
}
.image-list {
  background: #eee;
  width: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
}
</style>