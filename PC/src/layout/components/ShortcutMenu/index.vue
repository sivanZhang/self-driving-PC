<template>
  <div class="menu-group">
    <router-link :to="{name:'my-task'}">
      <div :class="[{active:activeIndex==1},'main-menu']">我的</div>
    </router-link>
    <el-popover placement="bottom" trigger="click">
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" style="width:50%"></el-input>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button
            type="primary"
            v-if="$store.state.login.userInfo.auth.manage_project"
            @click="isCreateShow=true"
            icon="el-icon-plus"
          >创建项目</el-button>
        </el-col>
        <el-col :span="24">
          <el-row class="list-title" :gutter="20">
            <el-col :span="8">最新项目</el-col>
            <el-col :span="8">我的项目</el-col>
            <el-col :span="8">进行中的项目</el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row :gutter="20">
            <el-col :span="8">
              <template v-if="CacheList.length">
                <div v-for="(item,index) of CacheList" :key="index">
                  <router-link :to="`/projects/project-detail/${item.id}`">
                    <div class="title">{{item.name}}</div>
                  </router-link>
                </div>
              </template>
              <div v-else>暂无数据</div>
            </el-col>
            <el-col :span="8" v-if="MyProject.length?true:false">
              <div v-for="(todo,index) of MyProject.filter((item,index)=>index<=9)" :key="index">
                <div class="title" @click="targetDetail(todo)">{{todo.name}}</div>
              </div>
              <!-- <router-link v-if="MyProject && MyProject.length>10" to="/">
                <el-button type="text">查看更多..</el-button>
              </router-link>-->
            </el-col>
            <el-col :span="8" v-else>
              <div>暂无数据</div>
            </el-col>
            <el-col :span="8" v-if="ProjectList?true:false">
              <div v-for="(item,index) of ProjectList.filter((item,index)=>index<=9)" :key="index">
                <div class="title" @click="targetDetail(item)">{{item.name}}</div>
              </div>
              <!-- <router-link v-if="ProjectList && ProjectList.length>10" to="/">
                <el-button type="text">查看更多..</el-button>
              </router-link>-->
            </el-col>
            <el-col :span="8" v-else>
              <div>暂无数据</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div slot="reference" :class="[{active:activeIndex==2},'main-menu']" @click="getProject">
        项目
        <i class="el-icon-arrow-down el-icon--right" />
      </div>
    </el-popover>
    <create-project v-bind:isShow.sync="isCreateShow" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CreateProject from "@/components/CreateProject";
import { getMyProject } from "@/api/project";
export default {
  components: {
    CreateProject
  },
  name: "ShortcutMenu",
  data() {
    return {
      activeIndex: 0,
      isCreateShow: false,
      MyProject: []
    };
  },
  created() {
    // if (!this.MyProject) {
    //   this.getMyTask();
    // }
    // if (!this.ProjectList) {
    //   this.$store.dispatch("project/get_Projects");
    // }
  },
  computed: {
    ...mapState({
      ProjectList: state => state.project.ProjectList,
      CacheList: state => state.app.CacheList
    })
  },
  methods: {
    getProject() {
      this.getMyTask();
      this.$store.dispatch("project/get_Projects");
    },
    getMyTask() {
      getMyProject({
        mine: null
      }).then(({ data }) => {
        this.MyProject = [...data.msg];
        //console.log(this.MyTask);
      });
    },
    targetDetail(item) {
      this.$router.push({name:'project-detail',params:{id:item.id},query:{type:item.pro_type}});
      this.$store.commit("app/CACHEPRPJECT", item);
    }
  },
  watch: {
    //根据路由变化控制顶部菜单的active状态
    $route(to, from) {
      this.isCreateShow = false;
      const reg1 = /^\/task\/task/,
        reg2 = /^\/projects/;
      if (reg1.test(to.path)) {
        this.activeIndex = 1;
      } else if (reg2.test(to.path)) {
        this.activeIndex = 2;
      } else {
        this.activeIndex = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  padding: 4px 0;
  cursor: pointer;
}
.title:hover {
  cursor: hand;
  background-color: #eeeeee;
}
input {
  width: 240px;
  border: none;
  border-bottom: solid 2px deepskyblue;
}
input:focus {
  outline: none;
}

.list-title {
  padding: 6px 0;
  font-weight: 600;
  text-align: left;
}
.menu-group {
  position: relative;
  font-size: 14px;
  .active {
    color: rgb(24, 144, 255);
  }

  .main-menu {
    cursor: pointer;
    width: 80px;
    text-align: center;
  }
}
</style>


