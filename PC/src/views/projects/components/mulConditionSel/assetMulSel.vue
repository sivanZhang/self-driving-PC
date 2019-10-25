<!-- 资产多条件筛选 -->
<template>
  <el-tooltip class="item" effect="dark" content="多条件筛选" placement="top">
              <el-popover v-model="visible2" placement="bottom" width="600" trigger="click">
                <el-form ref="sortSelForm" :model="sortSelForm" label-width="80px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="镜头号" prop="name">
                        <el-input v-model="sortSelForm.name"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="场次" prop="session">
                        <el-input v-model="sortSelForm.session"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="集数" prop="episode">
                        <el-input v-model="sortSelForm.episode"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="版本号" prop="inner_version">
                        <el-input v-model="sortSelForm.inner_version"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="帧数" prop="frame">
                        <el-input v-model="sortSelForm.frame"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="帧数范围" prop="frame_range">
                        <el-input v-model="sortSelForm.frame_range"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="变速信息" prop="retime">
                        <el-input v-model="sortSelForm.retime"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="画面调整" prop="report">
                        <el-input v-model="sortSelForm.report"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="制作内容" prop="content">
                        <el-input v-model="sortSelForm.content"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="创建人" prop="creator">
                        <el-input v-model="sortSelForm.creator"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="难度等级" prop="level">
                        <el-select v-model="sortSelForm.level" multiple placeholder="请选择">
                          <el-option label="简单" :value="0"></el-option>
                          <el-option label="标准" :value="1"></el-option>
                          <el-option label="复杂" :value="2"></el-option>
                          <el-option label="高难度" :value="3"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="优先级" prop="priority">
                        <el-select v-model="sortSelForm.priority" multiple placeholder="请选择">
                          <el-option label="正常" :value="0"></el-option>
                          <el-option label="优先" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="状态" prop="status">
                        <el-select v-model="sortSelForm.status" multiple placeholder="请选择">
                          <el-option label="暂停" :value="0"></el-option>
                          <el-option label="未开始" :value="1"></el-option>
                          <el-option label="进行中" :value="2"></el-option>
                          <el-option label="审核中" :value="3"></el-option>
                          <el-option label="完成" :value="4"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="sortSelForm.remark"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="开始日期" prop="start">
                        <el-date-picker v-model="sortSelForm.start" type="date" placeholder="选择日期"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="结束日期" prop="end">
                        <el-date-picker v-model="sortSelForm.end" type="date" placeholder="选择日期"></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col align="right">
                      <el-button type="primary" @click="MulSel()">筛选</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <el-button
                  slot="reference"
                  type="primary"
                  style="margin-left: 15px"
                  @click="showMul()"
                >筛选</el-button>
              </el-popover>
            </el-tooltip>
</template>

<script>
export default {
  name: "assetMulSel",
  components: {},
  data() {
    return {
      visible2: false,
      sortSelForm: {},
      showMulChoose:[]
    };
  },
  watch: {},
  methods: {
    MulSel(){
      this.mulChoose = true;
      this.visible2 = false;
      function dateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      if (this.sortSelForm.name) {
        this.showMulChoose.name = this.sortSelForm.name;
      }
      if (this.sortSelForm.session) {
        this.showMulChoose.session = this.sortSelForm.session;
      }
      if (this.sortSelForm.episode) {
        this.showMulChoose.episode = this.sortSelForm.episode;
      }
      if (this.sortSelForm.inner_version) {
        this.showMulChoose.inner_version = this.sortSelForm.inner_version;
      }
      if (this.sortSelForm.frame) {
        this.showMulChoose.frame = this.sortSelForm.frame;
      }
      if (this.sortSelForm.frame_range) {
        this.showMulChoose.frame_range = this.sortSelForm.frame_range;
      }
      if (this.sortSelForm.retime) {
        this.showMulChoose.retime = this.sortSelForm.retime;
      }
      if (this.sortSelForm.report) {
        this.showMulChoose.report = this.sortSelForm.report;
      }
      if (this.sortSelForm.content) {
        this.showMulChoose.content = this.sortSelForm.content;
      }
      if (this.sortSelForm.creator) {
        this.showMulChoose.creator = this.sortSelForm.creator;
      }
      if (this.sortSelForm.remark) {
        this.showMulChoose.remark = this.sortSelForm.remark;
      }
      if (this.sortSelForm.level) {
        if (this.sortSelForm.level.length === 0) {
          delete this.sortSelForm.level;
        } else {
          this.showMulChoose.level = this.sortSelForm.level;
          this.sortSelForm.level = "[" + String(this.sortSelForm.level) + "]";
        }
      }
      if (this.sortSelForm.priority) {
        if (this.sortSelForm.priority.length === 0) {
          delete this.sortSelForm.priority;
        } else {
          this.showMulChoose.priority = this.sortSelForm.priority;
          this.sortSelForm.priority =
            "[" + String(this.sortSelForm.priority) + "]";
        }
      }
      if (this.sortSelForm.status) {
        if (this.sortSelForm.status.length === 0) {
          delete this.sortSelForm.status;
        } else {
          this.showMulChoose.status = this.sortSelForm.status;
          this.sortSelForm.status = "[" + String(this.sortSelForm.status) + "]";
        }
      }
      if (this.sortSelForm.start) {
        this.showMulChoose.start = dateFormat(this.sortSelForm.start);
        this.sortSelForm.start = dateFormat(this.sortSelForm.start);
      }
      if (this.sortSelForm.end) {
        this.showMulChoose.end = dateFormat(this.sortSelForm.end);
        this.sortSelForm.end = dateFormat(this.sortSelForm.end);
      }
      this.$emit("refresh_sortMul",this.sortSelForm,1);
      this.$emit("filterCondition",this.showMulChoose,this.sortSelForm)
    },
     showMul() {
      this.sortSelForm = {};
      this.mulChoose = false;
      this.showMulChoose = [];
      this.$emit("selRefresh")
    },
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>