<!-- 资产单条件筛选 -->
<template>
  <div style="display:flex;width:400px">
    <el-select v-model="colSel" placeholder="请选择" style="width:130px;" filterable>
      <el-option
        v-for="item in columnSelect"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      v-if="colShow"
      placeholder="输入关键字搜索"
      v-model="filterText"
      @keyup.enter.native="getAssetList()"
      style="width:300px"
    ></el-input>
    <el-select
      v-if="colSel === 'status' || colSel === 'level'||colSel === 'priority'"
      v-model="colSel2"
      placeholder="请选择"
      style="width:300px;margin-top:1px"
      multiple
      filterable
      @change="getAssetList()"
    >
      <el-option
        v-for="item in columnSelect2"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-date-picker
      v-if="colSel === 'start' || colSel === 'end'"
      v-model="timeSelection"
      type="date"
      placeholder="选择日期"
      @change="getAssetList()"
      style="width:300px"
    ></el-date-picker>
    <el-button @click="getAssetList()" icon="el-icon-search" type="primary" style="height:27.99px" />
  </div>
</template>

<script>
export default {
  name: "assetSel",
  components: {},
  data() {
    return {
      colSel: "name",
      columnSelect: [
        {
          value: "name",
          label: "镜头号"
        },
        {
          value: "session",
          label: "场次"
        },
        {
          value: "episode",
          label: "集数"
        },
        {
          value: "frame",
          label: "帧数"
        },
        {
          value: "frame_range",
          label: "帧数范围"
        },
        {
          value: "reference",
          label: "制作参考"
        },
        {
          value: "report",
          label: "画面调整信息"
        },
        {
          value: "retime",
          label: "变速信息"
        },
        {
          value: "inner_version",
          label: "版本号"
        },
        {
          value: "content",
          label: "制作内容"
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
          value: "creator",
          label: "创建人"
        },
        {
          value: "status",
          label: "状态"
        },
        {
          value: "start",
          label: "开始日期"
        },
        {
          value: "end",
          label: "结束日期"
        },
        {
          value: "remark",
          label: "备注"
        }
      ],
      colShow: true,
      columnSelect2: [],
      colSel2: [],
      timeSelection: "",
      name: "",
      filterText: "",
    };
  },
  watch: {
    colSel: {
      handler: function(newVal, oldVal) {
        //console.log(newVal);
        switch (newVal) {
          case "status":
            this.colShow = false;
            this.colSel2 = [1];
            this.columnSelect2 = [
              {
                value: 0,
                label: "暂停"
              },
              {
                value: 1,
                label: "未开始"
              },
              {
                value: 2,
                label: "进行中"
              },
              {
                value: 3,
                label: "审核中"
              },
              {
                value: 4,
                label: "完成"
              }
            ];
            break;
          case "level":
            this.colShow = false;
            this.colSel2 = [1];
            this.columnSelect2 = [
              {
                value: 0,
                label: "简单"
              },
              {
                value: 1,
                label: "标准"
              },
              {
                value: 2,
                label: "复杂"
              },
              {
                value: 3,
                label: "高难度"
              }
            ];
            break;
          case "priority":
            this.colShow = false;
            this.colSel2 = [0];
            this.columnSelect2 = [
              {
                value: 0,
                label: "正常"
              },
              {
                value: 1,
                label: "优先"
              }
            ];
            break;
          case "start":
            this.colShow = false;
            this.timeSelection = "";

            break;
          case "end":
            this.colShow = false;
            this.timeSelection = "";

            break;
          default:
            this.colShow = true;
            this.colSel2 = [];
            this.columnSelect2 = [];
        }
      }
    }
  },
  methods: {
    getAssetList(){
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
      }
      let payload = {}
      switch (this.colSel) {
        case "name":
          this.filterText &&
            (payload = {
              ...payload,
              name: this.filterText,
              pagenum: 20,
              page: 1
            });
          this.name = { name: this.filterText };
          break;
        case "inner_version":
          this.filterText &&
            (payload = {
              ...payload,
              inner_version: this.filterText
            });
          this.name = { inner_version: this.filterText };
          break;
        case "session":
          this.filterText &&
            (payload = {
              ...payload,
              session: this.filterText
            });
          this.name = { session: this.filterText };
          break;
        case "frame":
          this.filterText && (payload = { ...payload, frame: this.filterText });
          this.name = { frame: this.filterText };
          break;
        case "episode":
          this.filterText &&
            (payload = {
              ...payload,
              episode: this.filterText
            });
          this.name = { episode: this.filterText };
          break;
        case "content":
          this.filterText &&
            (payload = {
              ...payload,
              content: this.filterText
            });
          this.name = { content: this.filterText };
          break;
        case "remark":
          this.filterText &&
            (payload = { ...payload, remark: this.filterText });
          this.name = { remark: this.filterText };
          break;
        case "report":
          this.filterText &&
            (payload = { ...payload, report: this.filterText });
          this.name = { report: this.filterText };
          break;
        case "retime":
          this.filterText &&
            (payload = { ...payload, retime: this.filterText });
          this.name = { retime: this.filterText };
          break;
        case "frame_range":
          this.filterText &&
            (payload = {
              ...payload,
              frame_range: this.filterText
            });
          this.name = { frame_range: this.filterText };
          break;
        case "reference":
          this.filterText &&
            (payload = {
              ...payload,
              reference: this.filterText
            });
          this.name = { reference: this.filterText };
          break;
        case "creator":
          this.filterText &&
            (payload = {
              ...payload,
              creator: this.filterText
            });
          this.name = { creator: this.filterText };
          break;
        case "start":
          this.timeSelection &&
            (payload = {
              ...payload,
              start: DateFormat(this.timeSelection)
            });
          this.name = { start: DateFormat(this.timeSelection) };
          break;
        case "end":
          this.timeSelection &&
            (payload = {
              ...payload,
              end: DateFormat(this.timeSelection)
            });
          this.name = { end: DateFormat(this.timeSelection) };
          break;
        case "status":
          if (this.colSel2.length) {
            payload = {
              ...payload,
              status: "[" + String(this.colSel2) + "]"
            };
            this.name = { status: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "level":
          if (this.colSel2.length) {
            payload = {
              ...payload,
              level: "[" + String(this.colSel2) + "]"
            };
            this.name = { level: "[" + String(this.colSel2) + "]" };
          }
          break;
        case "priority":
          if (this.colSel2.length) {
            payload = {
              ...payload,
              priority: "[" + String(this.colSel2) + "]"
            };
            this.name = { priority: "[" + String(this.colSel2) + "]" };
          }
      }
      this.$emit("refreshAssetList",3,payload,name)
    },
    //重置
    refreshOneSel() {
      this.filterText = "";
      this.colSel = "name";
      this.colSel2 = [];
      this.timeSelection = "";
    }
  },
  created() {}
};
</script>
<style lang='scss' scoped>
</style>