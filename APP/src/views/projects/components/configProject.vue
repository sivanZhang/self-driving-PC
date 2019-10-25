<template>
  <div id="config-project">
    <div style="padding-bottom:10px">
      <el-button type="primary" @click="projectTemplate(3)">保存模板</el-button>
      <el-button type="primary" @click="projectTemplate(1)">项目模板</el-button>
    </div>
    <el-tabs
      tab-position="left"
      style="height: ;overflow: auto;"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <!-- <el-tab-pane label="项目详情" name="first" style="height: auto;overflow: auto;">
        <div style="width:50%">
          <el-row>
            <el-col :span="6" class="comment">缩略图</el-col>
            <el-col :span="15" class="comment">
              <el-image
                class="mini-image"
                :src="project.image?$store.state.BASE_URL+project.image:''"
                fit="cover"
                style="width:100px;height:100px"
              ></el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">项目名称</el-col>
            <el-col :span="15" class="comment">{{project.name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">项目编码</el-col>
            <el-col :span="15" class="comment">{{project.code}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">Windows路径</el-col>
            <el-col :span="15" class="comment">{{project.Windows}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">Mac路径</el-col>
            <el-col :span="15" class="comment">{{project.Mac}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">Linux路径</el-col>
            <el-col :span="15" class="comment">{{project.Linux}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">项目预算</el-col>
            <el-col :span="15" class="comment">
              <span v-if="project.budget">¥{{project.budget|numberFormat}}万元</span>
              <span v-else>¥{{"0"}}万元</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">负责人</el-col>
            <el-col :span="15" class="comment">{{project.charger_name}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">工作流</el-col>
            <el-col :span="15" class="comment">{{project.status|projectStatus}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">开始日期</el-col>
            <el-col :span="15" class="comment">{{project.date_start|dateFormat}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">结束日期</el-col>
            <el-col :span="15" class="comment">{{project.date_end|dateFormat}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6" class="comment">客户信息</el-col>
            <el-col :span="15" class="comment">{{client.client_name?client.client_name:"-"}}</el-col>
          </el-row>
        </div>
      </el-tab-pane> -->
      <el-tab-pane :label="labelChange" name="second" style="height: auto;overflow: auto;">
        <div style="display:flex">
          <div style="width:50%;padding:5px ">
            <div style="display:flex">
              <h4>工种列表</h4>
              <el-button type="primary" style="margin: 0 10px" @click="addJoinDept" v-if="auth">批量添加</el-button>
            </div>
            <el-tree
              class="filter-tree"
              show-checkbox
              empty-text="未创建工种"
              highlight-current
              ref="tree2"
              :data="DeptList"
              node-key="id"
              :props="defaultProps"
              :default-expand-all="true"
              :expand-on-click-node="false"
            ></el-tree>
          </div>
          <div style="width:50%;border-left:2px soild #999999;padding:5px ">
            <div style="display:flex">
              <h4>当前项目参与的工种列表</h4>
              <el-button type="danger" style="margin: 0 10px" @click="delJoinDept" v-if="auth">批量删除</el-button>
            </div>
            <el-tree
              class="filter-tree"
              empty-text="未绑定工种"
              show-checkbox
              highlight-current
              ref="jointree"
              :data="project.depts"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
            ></el-tree>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="状态配置" name="third" @click="getStatus" style="height:auto;overflow:auto;">
        <div style="display:flex">
          <div style="width: 50%;" v-if="auth">
            <h4 style="margin: 0 10px;">状态列表</h4>
            <div class="box">
              <el-row>
                <div class="maxstatus-name">暂停：</div>
              </el-row>
              <el-row v-for="item of pauseStatus" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                    <span @click="addStatus(item)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">未开始：</div>
              </el-row>
              <el-row v-for="item of notstartStatus" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                    <span @click="addStatus(item)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">进行中：</div>
              </el-row>
              <el-row v-for="item of conductingStatus" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                    <span @click="addStatus(item)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">审核中：</div>
              </el-row>
              <el-row v-for="item of approvingStatus" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                    <span @click="addStatus(item)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>

              <el-row>
                <div class="maxstatus-name">完成：</div>
              </el-row>
              <el-row v-for="item of finishStatus" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col">
                  <el-tooltip class="item" effect="dark" content="添加项目状态" placement="top">
                    <span @click="addStatus(item)">
                      <i class="el-icon-plus"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="width: 50%;">
            <h4 style="margin: 0 10px;">当前项目拥有状态</h4>
            <div class="box">
              <el-row>
                <div class="maxstatus-name">暂停：</div>
              </el-row>
              <el-row v-for="item of pause" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col" v-if="auth">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                    <span @click="delStatus(item)">
                      <i class="el-icon-minus" style="color:red"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">未开始：</div>
              </el-row>
              <el-row v-for="item of notstart" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col"  v-if="auth">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                    <span @click="delStatus(item)">
                      <i class="el-icon-minus" style="color:red"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">进行中：</div>
              </el-row>
              <el-row v-for="item of conducting" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col"  v-if="auth">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                    <span @click="delStatus(item)">
                      <i class="el-icon-minus" style="color:red"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <div class="maxstatus-name">审核中：</div>
              </el-row>
              <el-row v-for="item of approving" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col"  v-if="auth">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                    <span @click="delStatus(item)">
                      <i class="el-icon-minus" style="color:red"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>

              <el-row>
                <div class="maxstatus-name">完成：</div>
              </el-row>
              <el-row v-for="item of finish" :key="item" class="minstatus-name">
                <el-col :span="12">{{item|taskMinStatus}}</el-col>
                <el-col :span="12" align="right" class="col"  v-if="auth">
                  <el-tooltip class="item" effect="dark" content="移除项目状态" placement="top">
                    <span @click="delStatus(item)">
                      <i class="el-icon-minus" style="color:red"></i>
                    </span>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <template v-if="project.pro_type === 0">
        <el-tab-pane label="分组管理" name="fourth">
          <div style="display:flex">
            <div style="width:40%;padding:10px">
              <span style="padding-bottom:10px;display:flex">
                <h3>分组</h3>
                <el-row>
                  <el-button
                    type="success"
                    @click="addTeam(1)"
                    style="margin-left:40px"
                    v-if="teamAuth"
                  >添加分组</el-button>
                </el-row>
              </span>
              <el-input class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
              <el-tree
                class="filter-tree"
                empty-text="未创建分组"
                highlight-current
                ref="tree"
                :data="teamList"
                @node-click="handleGroupClick"
                :props="defaultProps2"
                default-expand-all
                :filter-node-method="searchGroup"
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span style="margin-right:6px;">{{node.label}}</span>
                  <span class="iconWarp">
                    <i
                      class="el-icon-plus"
                      @click="addMember(1,data)"
                      style="color:#409EFF"
                      title="添加成员"
                      v-if="teamAuth"
                    ></i>
                    <i
                      class="el-icon-delete"
                      @click="delTeam(data)"
                      style="color:#F56C6C"
                      title="删除当前分组"
                      v-if="teamAuth"
                    ></i>
                  </span>
                </span>
              </el-tree>
            </div>
            <div style="width:60%;padding:10px">
              <span style="padding-bottom:10px;">
                <h3 style="margin-bottom:15px;">成员信息</h3>
              </span>
              <el-table
                :data="members"
                style="margin-top:5px;"
                :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
                :cell-style="{borderRight:0}"
                highlight-current-row
                @selection-change="handleSelectionChange"
                :row-key="(row)=>{ return row.id}"
                :border="true"
              >
                <el-table-column label="成员名称" prop="name"></el-table-column>
                <el-table-column label="操作" v-if="teamAuth">
                  <template slot-scope="scope" >
                    <el-tooltip effect="dark" content="删除" placement="top">
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        style="color:red"
                        @click="delMember(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="阶段管理" name="fifth">
          <div style="display:flex">
            <div style="width:40%;padding:10px">
              <span style="padding-bottom:10px;display:flex">
                <h3>阶段分类</h3>
                <el-row>
                  <el-button
                    type="success"
                    @click="addGroup(1)"
                    style="margin-left:40px"
                    v-if="groupAuth"
                  >添加阶段</el-button>
                </el-row>
              </span>
              <el-input class="search-group" placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
              <el-tree
                class="filter-tree"
                empty-text="未创建阶段"
                highlight-current
                ref="tree"
                :data="groupList"
                @node-click="handleGroupClick2"
                :props="defaultProps3"
                default-expand-all
                :filter-node-method="searchGroup2"
                :expand-on-click-node="false"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span style="margin-right:6px;">{{node.label}}</span>
                  <span class="iconWarp">
                    <i
                      class="el-icon-plus"
                      @click="addScene(1,data)"
                      style="color:#409EFF"
                      title="添加镜头"
                      v-if="groupAuth"
                    ></i>
                    <i
                      class="el-icon-delete"
                      @click="delGroup(data)"
                      style="color:#F56C6C"
                      title="删除当前阶段"
                      v-if="groupAuth"
                    ></i>
                  </span>
                </span>
              </el-tree>
            </div>
            <div style="width:60%;padding:10px">
              <span style="padding-bottom:10px;">
                <h3 style="margin-bottom:15px;">镜头信息</h3>
              </span>
              <el-table
                :data="groups"
                style="margin-top:5px;"
                :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
                :cell-style="{borderRight:0}"
                highlight-current-row
                @selection-change="handleSelectionChange"
                :row-key="(row)=>{ return row.id}"
                :border="true"
              >
                <el-table-column label="镜头号" prop="name"></el-table-column>
                <el-table-column label="缩略图" prop="image">
                  <template slot-scope="scope">
                    <el-image
                      :src="$store.state.BASE_URL+scope.row.image"
                      style="width: 55px;height: 33px;cursor: pointer; display:block;"
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
                <el-table-column label="操作" v-if="groupAuth">
                  <template slot-scope="scope" >
                    <el-tooltip effect="dark" content="删除" placement="top">
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        style="color:red"
                        @click="delScene(scope.row)"
                      ></el-button>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <!-- 添加分组 -->
    <el-dialog title="添加分组" :visible.sync="teamDialog" width="521px" top="5vh">
      <el-form :model="teamForm" label-width="90px">
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="teamForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分组成员" prop="memberes">
          <el-select v-model="teamForm.memberes" multiple style="width:390px;" filterable>
            <el-option
              v-for="(item,index) of UserList"
              :key="index"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTeam(2)" style="margin-left:115px;">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加成员 -->
    <el-dialog title="添加成员" :visible.sync="addMebDialog" width="512px" top="5vh">
      <el-form :model="addMebForm" label-width="90px">
        <el-form-item label="成员名称" prop="ids">
          <el-select v-model="addMebForm.ids" multiple filterable>
            <el-option
              v-for="(item,index) of UserList"
              :key="index"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMember(2)" style="margin-left:60px;">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加阶段 -->
    <el-dialog title="添加阶段" :visible.sync="groupDialog" width="521px" top="5vh">
      <el-form :model="groupForm" label-width="90px">
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分组镜头" prop="assets">
          <el-select v-model="groupForm.assets" multiple style="width:390px;" filterable>
            <el-option
              v-for="(item,index) of scene"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGroup(2)" style="margin-left:115px;">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加镜头 -->
    <el-dialog title="添加镜头" :visible.sync="addSceneDialog" width="512px" top="5vh">
      <el-form :model="addSceneForm" label-width="90px">
        <el-form-item label="镜头号" prop="ids">
          <el-select v-model="addSceneForm.ids" multiple filterable>
            <el-option
              v-for="(item,index) of scene"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addScene(2)" style="margin-left:60px;">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 项目模板 -->
    <el-dialog
      title="项目模板"
      :visible.sync="projectTemplateDialog"
      width="512px"
      center
      :modal="false"
      @close="cancelprojectTemplate"
    >
      <el-tabs v-model="projectActiveName">
        <el-tab-pane label="项目模板" name="project-first">
          <el-table
            ref="statusTemplateList"
            :data="statusTemplateList"
            :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
            :cell-style="{borderRight:0}"
            highlight-current-row
            :border="false"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column label="模板名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                  <el-button
                    icon="el-icon-top-right"
                    style="color:green"
                    type="text"
                    @click="projectTemplate(2,scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button
                    icon="el-icon-delete"
                    style="color:red"
                    type="text"
                    @click="projectTemplate(5,scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="模板详情" name="project-second" :disabled="templateDetail">
          <el-row style="padding:3px">
            <el-col :span="12">
              <span>状态列表</span>
              <div style="display:flex;overflow: auto;">
                <div class="box">
                  <el-row>
                    <div class="maxstatus-name">暂停：</div>
                  </el-row>
                  <el-row v-for="item of pause2" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">未开始：</div>
                  </el-row>
                  <el-row v-for="item of notstart2" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">进行中：</div>
                  </el-row>
                  <el-row v-for="item of conducting2" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">审核中：</div>
                  </el-row>
                  <el-row v-for="item of approving2" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                  <el-row>
                    <div class="maxstatus-name">完成：</div>
                  </el-row>
                  <el-row v-for="item of finish2" :key="item" class="minstatus-name">
                    <el-col :span="24">{{item|taskMinStatus}}</el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <span>工种列表</span>
              <div v-for="(item,index) of projectTemplateList" :key="index" style="padding-top:5px">
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 项目模板保存 -->
    <el-dialog title="项目模板" :visible.sync="saveTemplateDialog" width="512px" center :modal="false">
      <el-row style="padding-bottom:10px">
        <el-col :span="4">模板名称：</el-col>
        <el-col :span="20">
          <el-input v-model="inputTemplateName"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-row>
          <el-col :span="4">模板展示：</el-col>
        </el-row>
        <el-row style="padding:5px">
          <el-col :span="12">
            <span>状态列表</span>
            <div style="display:flex;overflow: auto;">
              <div class="box">
                <el-row>
                  <div class="maxstatus-name">暂停：</div>
                </el-row>
                <el-row v-for="item of pause" :key="item" class="minstatus-name">
                  <el-col :span="24">{{item|taskMinStatus}}</el-col>
                </el-row>
                <el-row>
                  <div class="maxstatus-name">未开始：</div>
                </el-row>
                <el-row v-for="item of notstart" :key="item" class="minstatus-name">
                  <el-col :span="24">{{item|taskMinStatus}}</el-col>
                </el-row>
                <el-row>
                  <div class="maxstatus-name">进行中：</div>
                </el-row>
                <el-row v-for="item of conducting" :key="item" class="minstatus-name">
                  <el-col :span="24">{{item|taskMinStatus}}</el-col>
                </el-row>
                <el-row>
                  <div class="maxstatus-name">审核中：</div>
                </el-row>
                <el-row v-for="item of approving" :key="item" class="minstatus-name">
                  <el-col :span="24">{{item|taskMinStatus}}</el-col>
                </el-row>
                <el-row>
                  <div class="maxstatus-name">完成：</div>
                </el-row>
                <el-row v-for="item of finish" :key="item" class="minstatus-name">
                  <el-col :span="24">{{item|taskMinStatus}}</el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <span>工种列表</span>
            <el-tree
              class="filter-tree"
              empty-text="未绑定工种"
              ref="jointree"
              :data="project.depts"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              :expand-on-click-node="false"
            ></el-tree>
          </el-col>
        </el-row>
      </el-row>
      <el-row style="padding-top:10px">
        <el-col align="right">
          <el-button type="primary" @click="projectTemplate(4)">保存为模板</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  projectProfession,
  createTeam,
  putTeam,
  delTeam,
  getTeamList
} from "@/api/project";
import {
  getAllMaxStatus,
  getAllMinStatus,
  getProjectStatus,
  addProjectStatus,
  delProjectMinStatus,
  setupTemplate,
  deleteTemplate,
  searchTemplate,
  changeTemplate
} from "@/api/status";
import {
  allScene,
  createGroup,
  removeGroup,
  putGroup,
  getGroup
} from "@/api/training";
export default {
  name: "config-project",
  props: ["project", "configTab","auth"],
  components: {},
  data() {
    return {
      activeName: this.configTab ? this.configTab : "second",
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultProps2: {
        // children: "members",
        label: "name"
      },
      defaultProps3: {
        // children: "members",
        label: "groupname"
      },
      projectTemplateDialog: false,
      saveTemplateDialog: false,
      inputTemplateName: "",
      statusTemplateList: [],
      projectTemplateList: [],
      projectActiveName: "project-first",
      templateDetail: true,
      statusList: [],
      deptList: [],
      allMaxStatus: null,
      approvingStatus: [],
      conductingStatus: [],
      finishStatus: [],
      notstartStatus: [],
      pauseStatus: [],
      approving: [],
      conducting: [],
      finish: [],
      notstart: [],
      pause: [],
      approving2: [],
      conducting2: [],
      finish2: [],
      notstart2: [],
      pause2: [],
      show: true,
      showid: null,
      client: this.project.client ? this.project.client : "",
      teamList: null,
      members: [],
      team: null,
      multipleSelection: [],
      teamAuth: null,
      filterText: "",
      teamDialog: false,
      teamForm: {
        projectid: this.project.id
      },
      addMebDialog: false,
      addMebForm: {},
      addId: null,
      labelChange: this.project.pro_type == 0 ? "实训岗位" : "参与工种",
      groupDialog: false,
      groupForm: {
        projectid: this.project.id
      },
      group: null,
      groups: [],
      groupList: null,
      groupAuth: null,
      scene: [],
      addSceneDialog: false,
      addSceneForm: {},
      sceneId: null
    };
  },
  created() {
    this.getStatus();
    this.getPeojectAllStatus();
  },
  watch: {
    activeName: {
      handler: function(newVal, oldVal) {
        if (newVal === "third") {
          this.getStatus();
          this.getPeojectAllStatus();
        }
        if (newVal === "fourth" && this.project.pro_type === 0) {
          this.getTeam();
        }
        if (newVal === "fifth" && this.project.pro_type === 0) {
          this.getGroupList();
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"])
  },
  methods: {
    //添加阶段
    addGroup(Type) {
      if (Type === 1) {
        this.groupDialog = true;
        allScene({ project: this.project.id, all: "all" }).then(({ data }) => {
          if (data.status === 0) {
            this.scene = [...data.msg];
          }
        });
      } else {
        this.groupForm.assets = this.groupForm.assets
          .map(item => item)
          .join(",");
        // console.log(this.teamForm)
        createGroup(this.groupForm).then(({ data }) => {
          if (data.status === 0) {
            this.groupDialog = false;
            this.$message.success(data.msg);
            this.getGroupList();
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    //添加镜头
    addScene(Type, row) {
      if (Type === 1) {
        this.addSceneDialog = true;
        this.sceneId = row.id;
        allScene({ project: this.project.id, all: "all" }).then(({ data }) => {
          if (data.status === 0) {
            this.scene = [...data.msg];
          }
        });
        //console.log(row);
      } else {
        let addScene = {
          method: "put",
          id: this.sceneId,
          add_asset_ids: this.addSceneForm.ids.map(item => item).join(",")
        };
        putGroup(addScene).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.addSceneDialog = false;
            this.getGroupList(1);
          }
        });
      }
    },
    //删除阶段
    delGroup(data) {
      this.$confirm("此操作将永久删除该阶段?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        removeGroup({ method: "delete", ids: data.id }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getGroupList();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //删除镜头
    delScene(row) {
      this.$confirm("此操作将永久删除此阶段中的该镜头?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        putGroup({
          method: "put",
          id: this.group.id,
          del_asset_ids: row.id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getGroupList(1);
          }
        });
      });
    },
    //分组搜索
    searchGroup(value, data) {
      if (!value) return true;

      return data.name.indexOf(value) !== -1;
    },
    //阶段搜索
    searchGroup2(value, data) {
      if (!value) return true;

      return data.groupname.indexOf(value) !== -1;
    },
    //添加分组
    addTeam(Type) {
      if (Type === 1) {
        this.teamDialog = true;
      } else {
        this.teamForm.memberes = this.teamForm.memberes
          .map(item => item)
          .join(",");
        // console.log(this.teamForm)
        createTeam(this.teamForm).then(({ data }) => {
          if (data.status === 0) {
            this.teamDialog = false;
            this.$message.success(data.msg);
            this.getTeam();
          }
        });
      }
    },
    //添加成员
    addMember(Type, row) {
      if (Type === 1) {
        this.addMebDialog = true;
        this.addId = row.id;
        console.log(row);
      } else {
        let addMeb = {
          method: "put",
          id: this.addId,
          add_user_ids: this.addMebForm.ids.map(item => item).join(",")
        };
        putTeam(addMeb).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.addMebDialog = false;
            this.getTeam(1);
          }
        });
      }
    },
    //删除分组
    delTeam(data) {
      this.$confirm("此操作将永久删除该分组?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        delTeam({ method: "delete", ids: data.id }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getTeam();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    //table行被选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log(this.multipleSelection.length);
    },
    //删除成员
    delMember(row) {
      this.$confirm("此操作将永久删除此分组中的该成员?", "注意", {
        confirmButtonText: "删除",

        cancelButtonText: "取消",

        type: "warning"
      }).then(() => {
        putTeam({
          method: "put",
          id: this.team.id,
          del_user_ids: row.id
        }).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.getTeam(1);
          }
        });
      });
    },
    // 工种单击触发事件
    handleGroupClick(data) {
      this.members = [];
      this.team = data;
      this.members = data.members;
      // console.log(data);
    },
    handleGroupClick2(data) {
      this.groups = [];
      this.group = data;
      this.groups = data.assets;
      // console.log(data);
    },
    //获取分组
    getTeam(Type) {
      getTeamList({ projectid: this.project.id }).then(({ data }) => {
        if (data.status === 0) {
          if (Type === 1) {
            [...data.msg].forEach(item => {
              if (item.id === this.team.id) {
                this.members = item.members;
              }
            });
          }
          this.teamList = [...data.msg];
          this.teamAuth = data.auth.manage_projectteam;
        }
      });
    },
    //获取阶段
    getGroupList(Type) {
      getGroup({ projectid: this.project.id }).then(({ data }) => {
        if (data.status === 0) {
          if (Type === 1) {
            [...data.msg].forEach(item => {
              if (item.id === this.group.id) {
                this.groups = item.assets;
              }
            });
          }
          this.groupList = [...data.msg];
          this.groupAuth = data.auth.manage_asset_group;
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    //获取工种信息
    getDeptList() {
      this.$store.dispatch("admin/get_DeptList");
    },
    //给项目添加参与的工种
    addJoinDept() {
      const add_depts_ids = this.$refs.tree2
        .getCheckedNodes()
        .map(item => item.id)
        .join(",");
      // console.log(add_depts_ids);

      projectProfession({
        method: "put",
        id: this.project.id,
        add_depts_ids: add_depts_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$refs.tree2.setCheckedKeys([]);
        }
      });
    },
    //给项目删除参与的工种
    delJoinDept() {
      const del_depts_ids = this.$refs.jointree
        .getCheckedNodes()
        .map(item => item.id)
        .join(",");
      //   console.log(del_depts_ids);
      projectProfession({
        method: "put",
        id: this.project.id,
        del_dept_ids: del_depts_ids
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) {
          this.$emit("refresh");
          this.$refs.tree.setCheckedKeys([]);
        }
      });
    },
    //获取状态信息
    getStatus() {
      //获取所有大状态
      getAllMaxStatus().then(({ data }) => {
        this.allMaxStatus = [...data.msg];
      });
      //获取所有小状态
      getAllMinStatus().then(({ data }) => {
        //大状态审批中的小状态
        this.approvingStatus = [...data.approving];
        //大状态进行中的小状态
        this.conductingStatus = [...data.conducting];
        //大状态完成中的小状态
        this.finishStatus = [...data.finish];
        //大状态未开始中的小状态
        this.notstartStatus = [...data.notstart];
        //大状态暂停中的小状态
        this.pauseStatus = [...data.pause];
      });
    },
    getPeojectAllStatus() {
      //获取当前项目的状态
      getProjectStatus({ project_id: this.project.id }).then(({ data }) => {
        // this.projectStatus = ;
        this.statusList = data.msg;
        this.pause = [];
        this.notstart = [];
        this.conducting = [];
        this.approving = [];
        this.finish = [];
        [...data.msg].forEach(item => {
          //       approving: [],
          // conducting: [],
          // finish: [],
          // notstart: [],
          // pause:[],
          if (item <= 2) {
            this.pause.push(item);
          }
          if (item > 2 && item <= 5) {
            this.notstart.push(item);
          }
          if (item > 5 && item <= 15) {
            this.conducting.push(item);
          }
          if (item > 15 && item <= 19) {
            this.approving.push(item);
          }
          if (item > 19) {
            this.finish.push(item);
          }
        });
        //console.log(this.projectStatus)
      });
    },
    //给项目添加小状态
    addStatus(id) {
      addProjectStatus({
        project_id: this.project.id,
        state_branch_list: [id]
      }).then(({ data }) => {
        this.$message.success(data.msg);
        if (data.status === 0) this.getPeojectAllStatus();
      });
      //
    },
    //给项目删除小状态
    delStatus(id) {
      delProjectMinStatus({
        method: "delete",
        project_id: this.project.id,
        state_branch_list: [id]
      }).then(({ data }) => {
        if (data.status === 0) {
          this.$message.success("状态已移除");
          this.getPeojectAllStatus();
        }
      });
    },
    //项目模板
    projectTemplate(Type, row) {
      //获取模板列表
      if (Type === 1) {
        this.projectTemplateDialog = true;
        searchTemplate().then(({ data }) => {
          this.statusTemplateList = [...data.msg];
        });
      }
      //展示模板详情
      if (row && Type === 2) {
        (this.projectTemplateList = []),
          (this.pause2 = []),
          (this.notstart2 = []);
        (this.conducting2 = []),
          (this.approving2 = []),
          (this.finish2 = []),
          (this.projectActiveName = "project-second");
        searchTemplate({ id: row.id }).then(({ data }) => {
          const datastatus = data.msg.small_status;
          const deptdata = data.msg.depts;
          datastatus.forEach(item => {
            if (item <= 2) {
              this.pause2.push(item);
            }
            if (item > 2 && item <= 5) {
              this.notstart2.push(item);
            }
            if (item > 5 && item <= 15) {
              this.conducting2.push(item);
            }
            if (item > 15 && item <= 19) {
              this.approving2.push(item);
            }
            if (item > 19) {
              this.finish2.push(item);
            }
          });
          deptdata.forEach((item, index) => {
            this.projectTemplateList[index] = item;
          });
        });
      }
      //模板保存dialog
      if (Type === 3) {
        this.saveTemplateDialog = true;
      }
      //模板保存
      if (Type === 4) {
        let deptid = [];
        this.project.depts.forEach(item => {
          deptid.push(item.id);
        });
        setupTemplate({
          name: this.inputTemplateName,
          add_small_status_ids: String(this.statusList),
          add_depts_ids: String(deptid)
        }).then(({ data }) => {
          this.saveTemplateDialog = true;
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.saveTemplateDialog = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      }
      //模板删除
      if (Type === 5) {
        this.$confirm("此操作将永久删除该项目模板, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteTemplate({ ids: row.id, method: "delete" }).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg);
              this.projectTemplate(1);
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }
    },
    cancelprojectTemplate() {
      this.projectActiveName = "project-first";
    }
  }
};
</script>

<style lang="scss" scoped>
#config-project {
  .comment {
    padding: 5px 10px;
    font-size: 12px;
  }
  .box {
    overflow: auto;
    border: 1px solid #e8eaec;
    margin: 0 10px;
  }
  .maxstatus-name {
    width: 100%;
    background-color: #eef1f6;
    height: 30px;
    font-weight: 600;
    font-display: center;
    padding: 5px;
    border-bottom: 1px solid rgb(234, 232, 236);
  }
  .minstatus-name {
    border-bottom: 1px solid #e8eaec;
    height: 25px;
    width: 100%;
    padding: 5px;
    font-display: center;
    cursor: pointer;
  }
  .col {
    padding-right: 5px;
  }
}
</style>
<style lang="scss">
.el-checkbox__inner {
  margin-right: 10px;
}
.iconWarp {
  display: none;
  font-size: 12px;
  & > * {
    cursor: pointer;
  }
}
.custom-tree-node {
  &:hover {
    .iconWarp {
      display: inline-block;
    }
  }
}
.search-group {
  margin-bottom: 10px;
}
</style>
