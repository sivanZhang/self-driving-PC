<template>
  <div id="manage-work" ref="drawer-parent">
    <template v-if="auth">
      <div style="padding-bottom:10px">
        <el-button icon="el-icon-plus" type="primary" @click="openDialog(1)">添加调休表</el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          @click="removeDayOff()"
          :disabled="this.multipleSelection.length === 0"
        >批量删除</el-button>
      </div>
    </template>
    <el-table
      :data="leaverhourList"
      @selection-change="handleSelectionChange"
      :row-key="(row)=>{ return row.id}"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
      <el-table-column prop="off_user.username" label="调休人" class-name="links">
        <template slot-scope="scope">
          <span @click="showDrawer(scope.row)">{{scope.row.off_user.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调休时长" prop="off_hour"></el-table-column>
      <el-table-column prop="reason" label="调休理由"></el-table-column>
      <el-table-column prop="off_count" label="调休详情" align="center">
        <el-table-column label="开始时间">
          <template slot-scope="scope">{{scope.row.start_time|dateTimeFormat}}</template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">{{scope.row.end_time|dateTimeFormat}}</template>
        </el-table-column>
        <el-table-column label="总调休时间" prop="off_count.all_off_hour"></el-table-column>
        <el-table-column label="已调休时间" prop="off_count.have_off_hour"></el-table-column>
        <el-table-column label="剩余调休时间" prop="off_count.allow_off_hour"></el-table-column>
      </el-table-column>
      <template v-if="auth">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              style="color:red"
              @click="remove(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <Drawer
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
      :title="titleSHow"
    >
      <el-table :data="overtime_list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="创建时间" prop="creator_date">
          <template slot-scope="scope">{{scope.row.creator_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="加班时长（小时）" prop="overtime_hour"></el-table-column>
        <el-table-column label="加班原因" prop="reason"></el-table-column>
        <el-table-column label="开始时间" prop="start_time">
          <template slot-scope="scope">{{scope.row.start_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column label="结束时间" prop="end_time">
          <template slot-scope="scope">{{scope.row.end_time|dateFormat}}</template>
        </el-table-column>
      </el-table>
    </Drawer>
    <el-dialog title="添加调休记录" :visible.sync="dialogShow" width="512px">
      <el-form :model="dayOffForm" label-width="110px">
        <el-form-item label="调休人" prop="off_user_id">
          <el-select v-model="dayOffForm.off_user_id" filterable @change="userDaysOff()">
            <el-option
              v-for="(item,index) of UserList"
              :key="index"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可调休时长">
          <span style="font-size:12px">{{allow_off}}</span>
        </el-form-item>
        <el-form-item label="调休时间">
          <el-input v-model="dayOffForm.off_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="dayOffForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy/MM/dd HH:mm"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="调休原因">
          <el-input type="textarea" v-model="dayOffForm.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="this.offtime" @click="openDialog(2)" type="primary">立即提交</el-button>
          <el-button v-else disabled type="primary">无可用调休时长</el-button>
        </el-form-item> 
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDayOffList, addDayOff, delDayOff } from "@/api/checkingIn";
import { mapState } from "vuex";
import dayjs from "dayjs";
import thumbtackMixin from "@/utils/thumbtack-mixin";
export default {
  mixins: [thumbtackMixin],
  name: "manage-work",
  data() {
    return {
      leaverhourList: [],
      dialogShow: false,
      dialogTitle: "",
      dayOffForm: {},
      allow_off: null,
      myDayOff: [],
      auth: null,
      overtime_list: null,
      value1: false,
      multipleSelection: [],
      titleSHow: "",
      offtime:null
    };
  },
  computed: {
    ...mapState("admin", ["UserList"])
  },
  methods: {
    //获取某个用户的调休时间
    userDaysOff() {
      getDayOffList({ user_id: this.dayOffForm.off_user_id }).then(
        ({ data }) => {
          this.offtime = data.msg.length;
          if (data.status === 0) {
            if (!data.msg.length) {
              this.allow_off = "暂无调休";
            } else {
              this.allow_off = data.msg[0].off_count.allow_off_hour + "小时";
            }
          }
        }
      );
    },
    //批量删除
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    removeDayOff() {
      this.$confirm("此操作将永久删除调休记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delDayOff({
          method: "delete",
          ids: this.multipleSelection.map(item => item.daysoff_id).join(",")
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getList();
          }
        });
      });
    },
    //单个删除
    remove(row) {
      this.$confirm("此操作将永久删除调休记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delDayOff({
          method: "delete",
          ids: row.daysoff_id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getList();
          }
        });
      });
    },
    //展开侧栏
    showDrawer(row) {
      this.value1 = true;
      getDayOffList({ daysoff_id: row.daysoff_id }).then(({ data }) => {
        this.overtime_list = data.msg.overtime_list;
        this.titleSHow = data.msg.off_user.username + "的加班详情";
      });
    },
    //添加调休表
    openDialog(Type) {
      if (Type === 1) {
        this.dialogShow = true;
      } else {
        function dataFormat(params) {
          return dayjs(params).format("YYYY/MM/DD HH:mm:ss"); //'yyyy/mm/dd hh:mm:ss'
        }
        this.dayOffForm.start_time = dataFormat(this.dayOffForm.start_time);
        addDayOff(this.dayOffForm).then(({ data }) => {
          if (data.status === 0) {
            this.dialogShow = false;
            this.$message.success(data.msg);
            this.getList();
            this.dayOffForm = [];
          } else {
            this.dialogShow = false;
            this.$message.error(data.msg);
            this.dayOffForm = [];
          }
        });
      }
    },
    getList() {
      getDayOffList({ all_daysoff: "" }).then(({ data }) => {
        if (data.status === 0) {
          this.auth = data.auth.daysoff_operate;
          if (data.auth.daysoff_operate == true) {
            this.leaverhourList = [...data.msg];
          } else {
            getDayOffList({
              my_daysoff: this.$store.state.login.userInfo.id
            }).then(({ data }) => {
              if (data.status === 0) {
                this.leaverhourList = [...data.msg];
              }
            });
          }
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss">
#manage-work {
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}
</style>
