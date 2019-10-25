<template>
  <div id="layout_main">
    <div class="layout_main_top">
      <div class="layout_main_top_left">
        <div class="layout_task" v-for="(item,index) of topArr" :key="index">
          <div @click="task(item.status)" :class="{active:changecolor==item.status}">
            <h3>{{item.num}}</h3>
            <span class="layout_top_span">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="任务板" name="first" class="tab-task">
        <div>
          <el-row type="flex" justify="space-between" :gutter="15">
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">未开始</el-col>
                </el-row>
                <draggable
                  v-model="DraftArr"
                  :group="{name:'task'}"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="DraftArr"
                  class="board-column-content"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="item of DraftArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#59e0e8',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">进行中</el-col>
                </el-row>
                <draggable
                  v-model="InProgressArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="InProgressArr"
                  class="board-column-content"
                >
                  <el-card
                    @click.native="openDialog(item)"
                    :style="{margin:'10px 0'}"
                    v-for="item of InProgressArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#589BAD',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">暂停</el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="PauseArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="PauseArr"
                >
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of PauseArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#F9ce8c',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">超时</el-col>
                </el-row>
                <draggable
                  class="board-column-content"
                  v-model="TimeOutArr"
                  group="task"
                  :sort="false"
                  @end="handelChanged"
                  data-arr="TimeOutArr"
                >
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of TimeOutArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#C64b2b',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </draggable>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp" style="background-color:#eeeeee">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">审核中</el-col>
                </el-row>
                <div class="board-column-content">
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of ApproveingArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#2D5637',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </div>
              </div>
            </el-col>
            <el-col>
              <div class="project-warp" style="background-color:#eeeeee">
                <el-row type="flex" align="middle">
                  <el-col tag="h4" :span="24">完成</el-col>
                </el-row>
                <div class="board-column-content">
                  <el-card
                    :style="{margin:'10px 0'}"
                    v-for="item of FinishedArr"
                    :key="item.id"
                    :data-taskid="item.id"
                    :body-style="{backgroundColor:'#2f5c85',color:'#fff',padding:'5px'}"
                  >
                    <div class="cardvalue">{{item.name}}</div>
                    <div class="feedback">{{item.feedback_counter}}个反馈</div>
                  </el-card>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="second" class="tab-task" ref="drawer-parent">
        <Drawer
          ref="drawer-father"
          scrollable
          v-model="isDrawerShow"
          width="512px"
          :inner="isInner"
          :mask-style="{backgroundColor: 'transparent'}"
          :transfer="false"
          draggable
        >
          <el-tabs>
            <el-tab-pane label="任务详情">
              <tabTaskDtail
                :taskdetail="TaskDetail"
                :link="Link"
                :asset="Asset"
                :detailLoading="detailLoading"
              />
            </el-tab-pane>
            <el-tab-pane label="历史版本">
              <history
                :historyVersion="historyVersion"
                :project="project"
                @Version="getAssetVersion"
              />
            </el-tab-pane>
            <el-tab-pane label="执行记录">
              <tabLog :loglist="LogList" :logsLoading="logsLoading" />
            </el-tab-pane>
            <el-tab-pane label="执行任务">
              <task-form
                :task-record.sync="TaskRecord"
                :createLoading="createLoading"
                @addRecord="addRecord"
                @cancel="cancel"
              />
            </el-tab-pane>
            <el-tab-pane label="审核">
              <tab-approve
                v-if="activeRow.task && activeRow.task.status === 2"
                :row="activeRow"
                @refresh="getMyTasks"
              />
              <div v-else style="display:flex;justify-content:center">任务状态不是进行中</div>
              <div style="padding-bottom:5px;font-weight:bold">历史审批：</div>
              <approve-log ref="taskApprovelog" />
            </el-tab-pane>
            <!-- <el-tab-pane label="审批记录">
              <approve-log ref="taskApprovelog" />
            </el-tab-pane> -->
          </el-tabs>
        </Drawer>
        <el-row style="padding-bottom:10px">
          <el-col style="text-align:right">
            <div style="display:flex;justify-content:flex-end">
              <el-select
                v-model="colSel"
                placeholder="请选择"
                style="width:120px;margin-right:5px;"
                filterable
                slot="prepend"
              >
                <el-option
                  v-for="item in columnSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-if="colSel === 'name'"
                placeholder="输入关键字搜索"
                v-model="keyword"
                @keyup.enter.native="task(changecolor)"
                style="width:200px"
              ></el-input>
              <el-select
                v-if="colSel === 'priority'"
                v-model="colSel2"
                placeholder="请选择"
                multiple
                filterable
                style="width:200px"
                @keyup.enter.native="task(changecolor)"
              >
                <el-option
                  v-for="item in columnSelect2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div
                v-if="colSel === 'start_date' || colSel === 'end_date'"
              >
                <el-date-picker style="width:130px" v-model="timeSelection" type="date" placeholder="选择日期"></el-date-picker>
                <span style="text-align:center;padding-top:3px">至</span>
                <el-date-picker style="width:130px" v-model="timeSelection2" type="date" placeholder="选择日期"></el-date-picker>
              </div>
              <el-select
                v-if="colSel === 'grade'"
                v-model="currentGrade"
                placeholder="选择任务难度等级"
                multiple
                filterable
                style="width:200px"
                @keyup.enter.native="task(changecolor)"
              >
                <el-option
                  v-for="item in GradeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button
                @click="task(changecolor)"
                type="primary"
                style="margin-left:5px">
                查询
              </el-button>
              <el-button
                @click="reTask(changecolor)"
                type="primary"
              >重置</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="MyTaskList1"
          highlight-current-row
          border
          @row-click="taskBoardRightShow"
          style="width: 100%;"
          :cell-style="cellStyle"
        >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="task.id" label="任务ID" header-align="left" width="80"></el-table-column>
          <el-table-column label="缩略图" v-if="show_project_image" width="75px">
            <template slot-scope="scope">
              <el-image
                :src="$store.state.BASE_URL+scope.row.asset.image"
                :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
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
          <el-table-column label="项目" header-align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link
                style="cursor: pointer;"
                :to="{name:'project-detail',params:{id:scope.row.project.id},query:{type:scope.row.project.pro_type}}"
              >{{scope.row.project.name}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="asset.name" label="镜头" header-align="left" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="task.dept.name"
            label="制作环节"
            header-align="left"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="task.name" header-align="left" label="任务名称" show-overflow-tooltip></el-table-column>
          <el-table-column
            prop="task.content"
            header-align="left"
            label="任务内容"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="任务状态" width="120px">
            <template slot-scope="scope">
              <div
                v-if="scope.row.task.status != 3 &&scope.row.task.status != 4&&scope.row.task.status != 5&& scope.row.task.status != 6"
              >
                <el-select
                  :value="scope.row.task.status"
                  placeholder="请选择"
                  @change="statusChange($event,scope.row)"
                  class="my-select"
                >
                  <el-option
                    v-for="item in StatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div v-else style="color:#909399">{{scope.row.task.status|taskStatus}}</div>
            </template>
          </el-table-column>
           <el-table-column label="难度等级" header-align="left" prop="task.grade">
            <template slot-scope="scope">{{scope.row.task.grade|taskgrade}}</template>
          </el-table-column>
          <el-table-column label="优先级" header-align="left" prop="task.priority">
            <template slot-scope="scope">{{scope.row.task.priority|taskPriority}}</template>
          </el-table-column>
          <!-- <el-table-column label="创建日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.create_time|dateFormat}}</template>
          </el-table-column>-->
          <el-table-column label="任务进度" header-align="left">
            <template slot-scope="scope">{{scope.row.task.schedule}}%</template>
          </el-table-column>
          <el-table-column label="开始日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.start_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column label="截止日期" header-align="left">
            <template slot-scope="scope">{{scope.row.task.end_date|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="total_hour" header-align="left" label="预设时间（小时）" width="80px;">
            <template slot-scope="scope">{{scope.row.task.total_hour}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="任务执行" :visible.sync="isDialogShow" width="512px" center :modal="false">
      <task-form
        :task-record.sync="TaskRecord"
        :createLoading="createLoading"
        @addRecord="addRecord"
        @cancel="cancel"
      />
    </el-dialog>
  </div>
</template>

<script src="./task.js">
</script>
<style lang="scss" src="./task.scss"></style>
