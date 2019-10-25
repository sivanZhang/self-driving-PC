<!-- 资产多列排序 -->
<template>
  <el-popover v-model="visible" placement="bottom" width="400" trigger="click">
    <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
      <el-col :span="4">
        <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
        <el-avatar>{{index+1}}</el-avatar>
        <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
      </el-col>
      <el-col :span="18">
        <el-form :model="item">
          <el-form-item
            label="列名"
            prop="columnName"
            :rules="[{ required: true, message: '请输入列名', trigger: 'blur' }]"
          >
            <el-select v-model="item.column" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="排序方式"
            prop="order"
            :rules="[{required:true,message:'请选择排序方式',trigger:'blur'}]"
          >
            <el-radio-group v-model="item.order">
              <el-radio :label="0">正序</el-radio>
              <el-radio :label="1">逆序</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-divider />
      </el-col>
      <el-col :span="4" align="center">
        <el-tooltip effect="dark" content="删除" placement="top">
          <span>
            <i class="el-icon-delete" style="color:red" @click="deleteLink(index)"></i>
          </span>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button @click="cancelSort">取消</el-button>
      <el-button type="primary" @click="sortMul()">立即排序</el-button>
    </el-row>
    <el-button slot="reference" type="primary" icon="el-icon-sort">多列排序</el-button>
  </el-popover>
</template>

<script>
export default {
  name: "assetMulSort",
  components: {},
  data() {
    return {
      visible: false,
      FormList: [{}],
      options: [
        {
          value: "session",
          label: "场次"
        },
        {
          value: "episode",
          label: "集数"
        },
        {
          value: "name",
          label: "镜头号"
        },
        {
          value: "frame",
          label: "帧数"
        },
        {
          value: "inner_version",
          label: "版本号"
        },
        {
          value: "priority",
          label: "优先级"
        },
        {
          value: "level",
          label: "难度等级"
        },
        {
          value: "status",
          label: "状态"
        },
        {
          value: "date",
          label: "创建日期"
        },
        {
          value: "start_date",
          label: "开始日期"
        },
        {
          value: "end_date",
          label: "结束日期"
        },
        {
          value: "total_end_date",
          label: "计划截止日期"
        }
      ],
      sort: null
    };
  },
  watch: {},
  methods: {
    //多条件排序前置
    before(ind) {
      this.FormList.splice(ind, 0, {});
    },
    //多条件排序后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
    },
    //多条件排序删除条件
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1);
    },
    //清空排序
    cancelSort() {
      this.visible = false;
      this.FormList = [{}];
    },
    sortMul() {
      this.visible = false;

      let hash = {};

      this.FormList = this.FormList.reduce(function(arr, current) {
        hash[current.id] ? "" : (hash[current.id] = true && arr.push(current));

        return arr;
      }, []);

      //console.log(this.FormList);
      this.FormList.forEach((item, index) => {
        if (item.order === 1) {
          this.FormList[index] = Object.assign({}, this.FormList[index], {
            column: "-" + item.column
          });
        } else {
          this.FormList[index] = Object.assign({}, this.FormList[index], {
            column: item.column
          });
        }
      });

      this.sort = this.FormList.map(item => item.column).join(",");
      this.$emit("refresh", this.sort);
      this.FormList = [{}];
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>