<!-- 数据统计 -->
<template>
  <div id="statistic-manager">
    <ElCard>
      <template slot="header">
        <label for>项目：</label>
        <el-select v-model="value1" @change="handleGroupClick">
          <el-option
            v-for="(item,index) of projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </template>

      <div v-if="click_id">
        <statistics :click_id="click_id" ref="clickRefresh" />
      </div>
      <div v-else class="text-center">
        选择项目查看
      </div>
    </ElCard>
  </div>
</template>

<script>
import { getProjects } from "@/api/project";
import statistics from "@/views/projects/components/statistics";
export default {
  name: "statistic-manager",
  components: { statistics },
  data() {
    return {
      projectList: [],
      defaultProps: {
        // children: "children",
        label: "name"
      },
      filterText: "",
      click_id: null,
      value1: null
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getList() {
      getProjects().then(({ data }) => {
        this.projectList = [...data.msg];
      });
    },
    // 工种单击触发事件
    handleGroupClick() {
      this.click_id = this.value1;
      this.$nextTick(() => {
        this.$refs.clickRefresh.getAssetStatistics();
        this.$refs.clickRefresh.getTaskStatistics();
        this.$refs.clickRefresh.getBurnOut();
        this.$refs.clickRefresh.exportData();
        this.$refs.clickRefresh.getCommitCount();
        this.$refs.clickRefresh.getAssetTask();
        this.$refs.clickRefresh.getGradeChange();
        this.$refs.clickRefresh.getProjectProgress();
        this.$refs.clickRefresh.getGantt();
        this.$refs.clickRefresh.getganttStat();
      });
      // this.$mount["click"]
    },
    //搜索
    searchGroup(value, data) {
      if (!value) return true;

      return data.name.indexOf(value) !== -1;
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang='scss' scoped>
</style>