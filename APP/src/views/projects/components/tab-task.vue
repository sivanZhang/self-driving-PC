<template>
  <div id="task" ref="drawer-parent">
    <div>
      <el-row>
        <el-col :span="13">
          <template v-if="authTask">
            <el-button type="primary" icon="el-icon-plus" @click.native="mainTask">创建任务</el-button>
            <!-- <el-button icon="el-icon-download" type="primary">导入</el-button> -->
            <el-button icon="el-icon-upload2" type="success" @click="targetUpload">导出</el-button>
            <el-button
              type="success"
              @click="mulEditTasks(1)"
              icon="el-icon-edit"
              :disabled="this.multipleSelection.length === 0"
            >批量修改</el-button>
            <el-button
              type="danger"
              @click="deleteTask"
              icon="el-icon-delete"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </template>
          <el-popover placement="bottom" width="300" trigger="click" style="margin-left:15px">
            <el-col :span="12">
              <el-checkbox v-model="show_name">任务</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link_dept_name">制作环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_project_name">所属项目</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_project_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_asset_name">镜头号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_grade">难度等级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_status">状态</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建者</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_executor">执行人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_schedule">任务进度</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_create_time">创建日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_start_date">开始日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_end_date">截止日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_total_hour">预设时间（小时）</el-checkbox>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting" size="mini">展示列</el-button>
          </el-popover>
        </el-col>
        <el-col :span="11" style="text-align:right">
          <div style="display:flex;justify-content:flex-end;text-align:bottom">
            <!-- 单条件筛选 -->
            <taskSel ref="taskSel" @refreshTaskList="getTasks" />
            <!-- 多条件筛选 -->
            <taskMulSel
              @refresh_sortMul="MulSel"
              @filterCondition="filterCondition"
              @selRefresh="selRefresh"
            />
            <el-button @click="getTasks(1)" style="margin-left: 15px" type="primary" size="mini">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 筛选条件展示 -->
      <taskFilter ref="taskFilter" @refresh_close="closeSelectedTag" />
      <el-table
        :data="TaskList"
        style="margin-top:15px;width:100%"
        highlight-current-row
        :tree-props="{ children: 'sub_task' }"
        @current-change="rowSelected"
        @selection-change="handleSelectionChange"
        :stripe="true"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        :cell-style="cellStyle"
        border
        :row-key="row=>row.id"
        v-loading="tableLoading"
        @filter-change="filterHandler"
        @sort-change="sortFilter"
      >
        <!-- default-expand-all -->
        <el-table-column type="selection" :reserve-selection="true" width="50px"></el-table-column>
        <el-table-column label="任务ID" class-name="links" prop="id" width="105px" sortable="custom">
          <template slot-scope="scope">
            <span @click="showDrawer(scope.row)">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" v-if="show_project_image">
          <template slot-scope="scope" v-if="!scope.row.pid">
            <el-image
              :src="$store.state.BASE_URL+scope.row.asset.image"
              :preview-src-list="[$store.state.BASE_URL+scope.row.asset.image]"
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
        <el-table-column width="30px"  >
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="任务状态：暂停" placement="top">
              <el-card 
                v-if="scope.row.status === 0"
                  :style="{width:'10px',backgroundColor:'#F9ce8c',border:'0px'}"
             
            >  </el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：未开始" placement="top">
              <el-card 
                v-if="scope.row.status === 1"
               :style="{width:'10px',backgroundColor:'#59e0e8',border:'0px'}"
               
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：进行中" placement="top">
              <el-card
                v-if="scope.row.status === 2"
               :style="{width:'10px',backgroundColor:'#589BAD',border:'0px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：审核中" placement="top">
              <el-card
                v-if="scope.row.status === 3"
                :style="{width:'10px',backgroundColor:'#2D5637',border:'0px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：完成" placement="top">
              <el-card
                v-if="scope.row.status === 4"
                :style="{width:'10px',backgroundColor:'#2f5c85',border:'0px'}"
              ></el-card>
            </el-tooltip>
            <el-tooltip effect="dark" content="任务状态：超时" placement="top">
              <el-card
                v-if="scope.row.status === 5"
                :style="{width:'10px',backgroundColor:'#C64b2b',border:'0px'}"
              ></el-card>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          v-if="show_status"
          width="90px"
          align="left"
          sortable="custom"
          column-key="status"
          :filters="[{text: '暂停', value: '0'}, {text: '未开始', value: '1'}, {text: '进行中', value: '2'}, {text: '审核中', value: '3'}, {text: '完成', value: '4'}, {text: '超时', value: '5'}, {text: '审核通过', value: '6'}]"
        >
          <template slot-scope="scope">{{scope.row.status|taskStatus}}</template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="任务"
          show-overflow-tooltip
          v-if="show_name"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="制作环节"
          prop="dept"
          sortable="custom"
          show-overflow-tooltip
          v-if="show_link_dept_name"
          width="100px"
        >
          <template slot-scope="scope">{{scope.row.link_dept_name}}</template>
        </el-table-column>
        <el-table-column
          label="制作内容"
          align="left"
          width="400px"
          prop="content"
          show-overflow-tooltip
          v-if="show_content"
        ></el-table-column>

        <el-table-column
          label="镜头号"
          show-overflow-tooltip
          v-if="show_asset_name"
          prop="asset"
          sortable="custom"
          width="90pxs"
        >
          <template slot-scope="scope">{{scope.row.asset.name}}</template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          :formatter="Priority"
          v-if="show_priority"
          width="120px"
          sortable="custom"
          align="center"
          column-key="priority"
          :filters="[{text: '低级', value: '0'}, {text: '中级', value: '1'}, {text: '高级', value: '2'}]"
        >
          <template slot-scope="scope">{{scope.row.priority|taskPriority}}</template>
        </el-table-column>
        <el-table-column
          prop="grade"
          label="难度等级"
          :formatter="Grade"
          v-if="show_grade"
          width="120px"
          sortable="custom"
          align="center"
          column-key="grade"
          :filters="[{text: '简单', value: '0'}, {text: '标准', value: '1'}, {text: '困难', value: '2'}]"
        >
          <template slot-scope="scope">{{scope.row.grade|taskgrade}}</template>
        </el-table-column>
        <el-table-column label="创建者" v-if="show_creator_name" prop="user" link_dept_name>
          <template slot-scope="scope">{{scope.row.creator.name}}</template>
        </el-table-column>
        <el-table-column label="执行人" show-overflow-tooltip v-if="show_executor">
          <template slot-scope="scope">{{scope.row.executor|executorFilter}}</template>
        </el-table-column>
        <el-table-column
          label="任务进度"
          width="100px"
          align="center"
          v-if="show_schedule"
          prop="schedule"
        >
          <template slot-scope="scope">{{scope.row.schedule}}%</template>
        </el-table-column>
        <el-table-column
          label="创建日期"
          width="100px"
          v-if="show_create_time"
          prop="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="开始日期"
          width="100px"
          v-if="show_start_date"
          prop="start_date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.start_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="截止日期"
          width="100px"
          v-if="show_end_date"
          prop="end_date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.end_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          prop="total_hour"
          align="center"
          label="预设时间（小时）"
          width="130px"
          v-if="show_total_hour"
        ></el-table-column>
        <el-table-column label="操作" align="center" v-if="authTask">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="添加子任务" placement="top">
              <span>
                <i
                  type="primary"
                  class="el-icon-plus"
                  style="color:red"
                  @click="openDialog(2,scope.row)"
                ></i>
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改任务" placement="top">
              <span style="margin-left:15px">
                <i
                  class="el-icon-edit"
                  type="primary"
                  style="color:green"
                  @click="openDialog(3,scope.row)"
                ></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :page-count="pageCount"
          :total="total"
          style="margin-top:10px"
        ></el-pagination>
      </div>
    </div>

    <!-- 主任务创建 -->
    <el-dialog title="主任务创建" :visible.sync="mainTaskShow" width="490px" ref="mainTask">
      <el-steps :active="active" finish-status="success">
        <el-step title="所属资产"></el-step>
        <el-step title="所属环节"></el-step>
        <el-step title="任务详情"></el-step>
      </el-steps>
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <div v-if="active == 0" style="padding-top:10px">
          <el-form-item label="所属资产">
            <el-select
              v-model="TaskForm.asset"
              filterable
              placeholder="请选择所属资产"
              @change="changeAsset()"
            >
              <el-option
                v-for="item of AssetListTask"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length" style="padding-top:10px">
          <el-form-item label="所属环节">
            <el-select v-model="TaskForm.link_id" filterable placeholder="请选择所属环节">
              <el-option
                v-for="item of LinkList"
                :label="item.dept.name"
                :value="item.link_id"
                :key="item.link_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="active==1&&LinkList.length===0" style="padding-top:10px">
          <el-row style="display:flex;justify-content:center">
            <svg-icon icon-class="warn" style="width:40px;height:40px;"></svg-icon>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <span>当前资产没有环节，请创建</span>
          </el-row>
          <el-row style="display:flex;justify-content:center;padding-top:10px">
            <el-button type="primary" @click="addLink(TaskForm.asset)">创建环节</el-button>
          </el-row>
        </div>
        <div v-if="active==2" style="padding-top:10px">
          <el-form-item label="任务名称" prop="name">
            <el-input v-model="TaskForm.name" placeholder="请填写任务名称" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="任务内容" prop="content">
            <el-input type="textarea" v-model="TaskForm.content" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <!-- <el-input v-model="TaskForm.code"></el-input> -->
            <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
            <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
            <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
          </el-form-item>
          <el-form-item label="任务难度" prop="grade">
            <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
            <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
            <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
          </el-form-item>
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
              <el-option
                v-for="item of StatusList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="$route.query.type == 0">
            <el-form-item label="执行小组" prop="group_id">
              <el-select v-model="TaskForm.group_id" filterable placeholder="请选择分组">
                <el-option
                  v-for="(item,index) of trainingMenber"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="任务执行人" prop="executorlist">
              <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
                <el-option
                  v-for="item of DeptUsers"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="环节时间">
            <el-row style="padding-left:10px;font-size: 12px;">
              <el-col :span="5">{{linkstart|dateFormat}}</el-col>
              <el-col :span="2">
                <span>至</span>
              </el-col>
              <el-col :span="17">{{linkend|dateFormat}}</el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="任务时间" prop="datetime">
            <el-date-picker
              v-model="TaskForm.datetime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy/MM/dd"
              @change="changeTime()"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="总工时" prop="total_hour">
            <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancel2">取消</el-button>
            <el-button type="primary" @click="editMainTask">立即创建</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button style="margin-top: 12px;" @click="before" v-if="active !=0">上一步</el-button>
      <el-button
        style="margin-top: 12px;"
        @click="next"
        v-if="active !=2"
        :disabled="(active==1&&LinkList.length===0)||active==0&&!this.TaskForm.asset||active==1&&!this.TaskForm.link_id"
      >下一步</el-button>
    </el-dialog>
    <!-- 子任务创建，任务修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="isDialogShow" width="490px">
      <el-form :model="TaskForm" :rules="rules" ref="TaskRef" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="TaskForm.name" placeholder="请填写任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务内容" prop="content">
          <el-input type="textarea" :rows="3" v-model="TaskForm.content" placeholder="请填写任务内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <!-- <el-input v-model="TaskForm.code"></el-input> -->
          <el-radio v-model="TaskForm.priority" :label="0">低级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="1">中级</el-radio>
          <el-radio v-model="TaskForm.priority" :label="2">高级</el-radio>
        </el-form-item>
        <el-form-item label="任务难度" prop="grade">
          <el-radio v-model="TaskForm.grade" :label="0">简单</el-radio>
          <el-radio v-model="TaskForm.grade" :label="1">标准</el-radio>
          <el-radio v-model="TaskForm.grade" :label="2">困难</el-radio>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="TaskForm.status" filterable placeholder="请选择任务状态">
            <el-option
              v-for="item of StatusList2"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务执行人" prop="executorlist">
          <el-select v-model="TaskForm.executorlist" filterable multiple placeholder="请选择任务执行人">
            <el-option
              v-for="item of DeptUsers"
              :label="item.username"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属资产" prop="asset">
          <el-select v-model="TaskForm.asset" filterable placeholder="请选择所属资产">
            <el-option
              v-for="item of AssetList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
              :disabled="DialogType===2||!TaskForm.asset"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务时间" prop="datetime">
          <el-date-picker
            v-model="TaskForm.datetime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            @change="changeTime()"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="总工时" prop="total_hour">
          <el-input v-model="TaskForm.total_hour" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button
            :loading="buttonStates.createLoading"
            type="primary"
            @click="editTask"
          >{{DialogType===3?'立即修改':'立即创建'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 创建任务时，所选资产无环节时，创建环节 -->
    <el-dialog title="添加环节" :visible.sync="isLinkDialogShow" width="512px" center :modal="false">
      <el-row type="flex" align="middle" v-for="(item,index) of FormList" :key="index">
        <el-col :span="4">
          <el-button type="text" icon="el-icon-plus" @click="before(index)">前置</el-button>
          <el-avatar>{{index+1}}</el-avatar>
          <el-button type="text" icon="el-icon-plus" @click="after(index)">后续</el-button>
        </el-col>
        <el-col :span="18">
          <el-form :model="item" label-width="90px">
            <el-form-item
              label="环节内容"
              prop="content"
              :rules="[{ required: true, message: '请输入环节内容', trigger: 'blur' }]"
            >
              <el-input
                type="textarea"
                v-model="item.content"
                style="width:100%"
                @input="change($event)"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="当前工种"
              prop="dept"
              :rules="[{ required: true, message: '请输入当前工种', trigger: 'blur' }]"
            >
              <el-cascader
                v-model="item.dept"
                placeholder="输入搜索工种"
                :options="selectList"
                :props="{ checkStrictly: true}"
                filterable
                style="width:100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="时间" prop="datetime">
              <el-date-picker
                v-model="item.datetime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
                format="yyyy/MM/dd"
              ></el-date-picker>
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
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="addLinks()">立即创建</el-button>
      </el-row>
    </el-dialog>
    <!-- 任务导出 -->
    <el-dialog title="Excel文件导出" :visible.sync="uploadVisible" width="400px" hieght="300px">
      <el-row>
        <el-col :span="6">
          <span>excel文件</span>
        </el-col>
        <el-col :span="18">
          <span @click="download" style="cursor:pointer;color:#2d8cf0">{{"点击下载"}}</span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadExcel">确定</el-button>
      </span>
    </el-dialog>
    <!-- 批量修改任务 -->
    <el-dialog title="批量修改任务" :visible.sync="mulEditDialog" width="620px" center :modal="false">
      <el-form :model="updateMulTask" label-width="90px">
        <el-row>
          <el-col :span="6" align="center">
            <h4 style="padding-bottom:10px">是否修改</h4>
          </el-col>
          <el-col :span="18" align="center"></el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value1"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="updateMulTask.name" placeholder="请填写任务名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value2"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务内容" prop="content">
              <el-input v-model="updateMulTask.content" type="textarea" placeholder="请填写任务内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value3"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="优先级" prop="priority">
              <el-radio v-model="updateMulTask.priority" :label="0">低级</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="1">中级</el-radio>
              <el-radio v-model="updateMulTask.priority" :label="2">高级</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value4"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务难度" prop="grade">
              <el-radio v-model="updateMulTask.grade" :label="0">简单</el-radio>
              <el-radio v-model="updateMulTask.grade" :label="1">标准</el-radio>
              <el-radio v-model="updateMulTask.grade" :label="2">困难</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value5"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务状态" prop="status">
              <el-select v-model="updateMulTask.status" filterable placeholder="请选择任务状态">
                <el-option
                  v-for="item of StatusList2"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value6"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务执行人" prop="executorlist">
              <el-select
                v-model="updateMulTask.executorlist"
                filterable
                multiple
                placeholder="请选择任务执行人"
              >
                <el-option
                  v-for="item of UserList"
                  :label="item.username"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value7"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="任务时间" prop="datetime">
              <el-date-picker
                v-model="updateMulTask.datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                @change="changeTime2()"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" align="center">
            <el-switch
              v-model="value8"
              active-color="#42d842"
              inactive-color="#b7b7b7"
              active-value="是"
              inactive-value="否"
              active-text="是"
              inactive-text="否"
            ></el-switch>
          </el-col>
          <el-col :span="18">
            <el-form-item label="总工时" prop="total_hour">
              <el-input
                v-model="updateMulTask.total_hour"
                oninput="value=value.replace(/[^\d.]/g,'')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col align="right">
            <el-button type="primary" @click="mulEditTasks(2)">立即修改</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <Drawer
      title="任务"
      scrollable
      closable
      v-model="showdrawer"
      width="526"
      :inner="isInner"
      :transfer="false"
      :mask="false"
      draggable
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务详情" name="first">
          <tabTaskDtail
            :taskdetail="TaskDetail"
            :link="Link"
            :asset="Asset"
            :detailLoading="detailLoading"
            ref="taskdetail"
          />
        </el-tab-pane>
        <el-tab-pane label="历史版本" name="third">
          <history :historyVersion="historyVersion" :project="project" @Version="getAssetVersion" />
        </el-tab-pane>
        <el-tab-pane label="执行记录" name="fifth">
          <tabLog :loglist="LogList" :logsLoading="logsLoading" />
        </el-tab-pane>
        <el-tab-pane label="审批记录">
          <approve-log ref="approvelogs" />
        </el-tab-pane>
        <el-tab-pane label="自定义属性" name="second">
          <attrsBind
            :project="project"
            :customAttrs="customAttrs"
            :attrsList="attrsList"
            @refresh_customAttrs="NewcustomAttrs"
            :attrsTypeNum="attrsTypeNum"
          />
        </el-tab-pane>
      </el-tabs>
    </Drawer>
  </div>
</template>
<script>
import * as HTTP from "@/api/task";
import { Transform } from "stream";
import myMixin from "./mixins";
import { mapState } from "vuex";
import { getDeptUsers } from "@/api/admin";
import { queryAssets, getHistoryVersion } from "@/api/assets";
import { getLinks, getLink, addLinks } from "@/api/links";
import approveLog from "@/views/components/approve-log";
import attrsBind from "@/components/projectDrawer/components/attrsBind";
import thumbtackMixin from "@/utils/thumbtack-mixin";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
import { getProjectJoinMeb } from "@/api/training";
import dayjs from "dayjs";
import taskMulSel from "@/views/projects/components/mulConditionSel/taskMulSel";
import taskFilter from "@/views/projects/components/filterCondition/taskFilter";
import taskSel from "@/views/projects/components/oneConditionSel/taskSel";
import tabTaskDtail from "@/views/task/components/tab-task-detail";
import history from "@/views/task/components/tab-history";
import tabLog from "@/views/task/components/tab-log";
export default {
  mixins: [myMixin, thumbtackMixin],
  name: "tab-task",
  data() {
    return {
      authTask: null,
      uploadVisible: false,
      activeTab: "first",
      TaskDetail: {
        //name: ''
      },
      Asset: "",
      Link: "",
      detailLoading: false,
      historyVersion: [],
      project: null,
      logsLoading: false,
      LogList: [],
      tableLoading: false, //表格加载状态
      total: 0,
      pageCount: 0,
      TaskList: [],
      DeptUsers: [],
      isDialogShow: false,
      isLinkDialogShow: false,
      buttonStates: {
        createLoading: false
      },
      ActiveRow: {},
      DialogType: null,
      dialogTitle: "",
      mainTaskShow: false,
      active: 0,
      asset: null,
      asset_type: null,
      AssetListTask: null,
      optionAssetType: null,
      LinkList: [],
      FormList: [{}],
      selectList: [],
      createLoading: false,
      multipleSelection: [],
      path: null,
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 50, 100],
      showdrawer: false,
      show_name: true,
      show_link_dept_name: true,
      show_content: true,
      show_project_name: true,
      show_project_image: true,
      show_asset_name: true,
      show_priority: true,
      show_grade: true,
      show_status: true,
      show_executor: true,
      show_creator_name: false,
      show_create_time: true,
      show_start_date: true,
      show_end_date: true,
      show_total_hour: true,
      show_schedule: true,
      filterStatus: [],
      filterPriority: [],
      filterGrade: [],
      sort: null,
      propName: null,
      sortFunction: null,
      Assetcontent: null,
      datacontent: null,
      multiSelect: [],
      name: "",
      linkstart: null,
      linkend: null,
      activeName: "first",
      project: null,
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      trainingMenber: [],
      mulEditDialog: false,
      updateMulTask: {},
      value1: "否",
      value2: "否",
      value3: "否",
      value4: "否",
      value5: "否",
      value6: "否",
      value7: "否",
      value8: "否",
      sortSelForm: {}, //保存多列筛选条件
      sortfilter: null, //保存单列排序的条件
      valSel: null, //保存table表内筛选（状态、难度等级、优先级）的条件
      cutType: -1, //分页类别区分
      oneSel: null //保存单列筛选的条件
    };
  },
  filters: {
    executorFilter(val) {
      let arr = [];
      val.forEach(item => {
        arr.push(item.name);
      });
      return arr.join();
    },
    categoryFilter(obj) {
      if ("name" in obj) {
        return obj["name"];
      } else {
        return "";
      }
    }
  },
  computed: {
    ...mapState("admin", ["DeptList", "UserList"]) //DeptUsers是根据登录账号得来的
  },
  components: {
    approveLog,
    attrsBind,
    taskMulSel,
    taskFilter,
    taskSel,
    tabLog,
    tabTaskDtail,
    history
  },
  props: {
    AssetList: {
      type: Array
    }
  },
  watch: {
    active: {
      handler: function(newVal, oldVal) {
        if (newVal === 1 && this.TaskForm.asset) {
          //console.log(this.TaskForm.asset);

          getLinks({ asset: this.TaskForm.asset }).then(({ data }) => {
            const linkData = [...data.msg];
            this.LinkList = [];
            linkData.forEach(item => {
              item.forEach(ct => {
                this.LinkList.push(ct);
              });
            });
            const linktime = this.LinkList[0].date_and_user;
            this.linkstart = linktime.date_start;
            this.linkend = linktime.date_end;
          });
        }
        if (oldVal === 1 && this.TaskForm.link_id) {
          getLink({ link: this.TaskForm.link_id }).then(({ data }) => {
            this.TaskForm.content = data.msg.content;
            getDeptUsers({
              id: data.msg.dept.id
            }).then(res => {
              this.DeptUsers = [...res.data.users];
            });
          });
        } else {
          return;
        }
      }
    }
  },
  methods: {
    //重置筛选条件展示
    selRefresh() {
      this.$refs["taskFilter"].showMul();
    },
    //删除筛选条件，剩余条件再搜索 +分页
    closeSelectedTag(sortSelForm, Type) {
      this.sortSelForm = sortSelForm;
      this.cutType = 2;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      };
      if (Type === 1) {
        //正常筛选
        data = { ...data, pagenum: 20, page: 1 };
      } else {
        //处理分页
        data = { ...data, pagenum: this.pageSize, page: this.currentPage };
      }
      this.multiSelect = sortSelForm;
      this.tableLoading = true;
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            this.visible2 = false;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
          this.visible2 = false;
        });
    },
    //表内单元格样式（状态、优先级改变背景色）
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property == "priority") {
        switch (row.priority) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "grade") {
        switch (row.grade) {
          case 2:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    },
    //批量修改任务
    mulEditTasks(Type) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      if (Type === 1) {
        this.mulEditDialog = true;
      } else {
        let keys = [{}];
        if (this.value1 == "是") {
          keys = [...keys, { key: "name", value: this.updateMulTask.name }];
        }
        if (this.value2 == "是") {
          keys = [
            ...keys,
            { key: "content", value: this.updateMulTask.content }
          ];
        }
        if (this.value3 == "是") {
          keys = [
            ...keys,
            { key: "priority", value: this.updateMulTask.priority }
          ];
        }
        if (this.value4 == "是") {
          keys = [...keys, { key: "grade", value: this.updateMulTask.grade }];
        }
        if (this.value5 == "是") {
          keys = [...keys, { key: "status", value: this.updateMulTask.status }];
        }
        if (this.value6 == "是") {
          keys = [
            ...keys,
            {
              key: "executorlist",
              value: this.updateMulTask.executorlist.join()
            }
          ];
        }
        if (this.value7 == "是") {
          keys = [
            ...keys,
            {
              key: "start_date",
              value: dataFormat(this.updateMulTask.datetime[0])
            },
            {
              key: "end_date",
              value: dataFormat(this.updateMulTask.datetime[1])
            }
          ];
        }
        if (this.value8 == "是") {
          keys = [
            ...keys,
            { key: "total_hour", value: this.updateMulTask.total_hour }
          ];
        }
        let data = {
          method: "put",
          ids: this.multipleSelection.map(item => item.id).join(","),
          keys:
            "{" +
            keys.map((t, i) => {
              return `"${t.key}":"${t.value}"`;
            }) +
            "}"
        };
        HTTP.mulPutTasks(data).then(({ data }) => {
          if (data.status === 0) {
            this.$message.success(data.msg);
            this.mulEditDialog = false;
            this.getTasks(2);
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    //获取实训分组
    getTeam() {
      getProjectJoinMeb({ id: this.$route.params.id, users: "users" }).then(
        ({ data }) => {
          this.trainingMenber = [...data.msg];
        }
      );
    },
    //任务导出dialog
    targetUpload() {
      let data = {
        ...this.name,
        ...this.multiSelect,
        project: this.$route.params.id,
        print: "null"
      };
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.uploadVisible = true;
            this.path = data.path;
            this.multiSelect = [];
            this.name = [];
          }
        })
        .catch(err => {
          this.$message.error(data.msg);
          // this.uploadVisible = true;
          this.multiSelect = [];
          this.name = [];
        });
    },
    //导出Excel
    download() {
      let data = this.$store.state.BASE_URL + this.path;
      window.location.href = data;
      this.uploadVisible = false;
    },
    uploadExcel() {
      //  this.download();
      this.uploadVisible = false;
    },
    //筛选条件展示
    filterCondition(showMulChoose, sortSelForm) {
      this.$refs["taskFilter"].filterCondition(showMulChoose, sortSelForm);
    },
    //多条件筛选 +分页
    MulSel(sortSelForm, Type) {
      this.cutType = Type;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      };
      if (Type === 1) {
        //正常筛选
        data = { ...data, pagenum: 20, page: 1 };
      } else {
        //处理分页
        data = { ...data, pagenum: this.pageSize, page: this.currentPage };
      }
      this.multiSelect = sortSelForm;
      this.tableLoading = true;

      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            this.visible2 = false;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
          this.visible2 = false;
        });
    },
    changeAsset(val) {
      const data = this.AssetListTask.filter(item => {
        return item.id === this.TaskForm.asset;
      });
      this.TaskForm.name = data[0].name;
    },
    //单条件排序
    sortFilter({ column, prop, order }, Type) {
      this.sortfilter = { column, prop, order };
      this.cutType = 3;
      let data = {
        project: this.$route.params.id,
        pagenum: 20,
        page: 1,
        sort: order === "descending" ? "-" + prop : prop
      };
      if (Type === 2) {
        //处理分页
        data = { ...data, pagenum: this.pageSize, page: this.currentPage };
      }
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    changeTime(val) {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      const totalHour =
        (this.TaskForm.datetime[1] - this.TaskForm.datetime[0]) /
        (1000 * 3600 * 24);

      this.TaskForm = {
        ...this.TaskForm,
        total_hour: 8 * totalHour + 8
      };
    },
    changeTime2(val) {
      if (this.radio7 == "是") {
        this.radio8 = "是";
        const totalHour2 =
          (this.updateMulTask.datetime[1] - this.updateMulTask.datetime[0]) /
          (1000 * 3600 * 24);
        this.updateMulTask = {
          ...this.updateMulTask,
          total_hour: 8 * totalHour2
        };
      }
    },
    // handleTabClick(tab, event) {},
    showDrawer(item) {
      // console.log(item);
      this.showdrawer = true;
      this.project = item.project;
      this.assetId = item.asset.id;
      searchBind({ entity_type: 1 }).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: item.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
      this.detailLoading = true;

      this.$refs["taskdetail"].getDetail(item.id,"taskLook");

      getHistoryVersion({ asset_id: item.asset.id }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
      this.logsLoading = true;
      HTTP.queryTaskRecord({ task_id: item.id })
        .then(({ data }) => {
          this.LogList = [...data.msg];
          this.logsLoading = false;
        })
        .catch(() => {
          this.logsLoading = false;
        });
      this.$refs["approvelogs"].getApproveLog(item.id);
    },
    getAssetVersion() {
      getHistoryVersion({
        asset_id: this.assetId
      }).then(({ data }) => {
        this.historyVersion = [...data.msg];
      });
    },
    NewcustomAttrs() {
      getAttrsEntityList({ entity_id: this.project.id, entity_type: 1 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 1;
        }
      );
    },
    change() {
      this.$forceUpdate();
    },
    //创建环节时，前置
    before(ind) {
      this.FormList.splice(ind, 0, {});
      //  this.FormList[ind - 1].content=this.datacontent[0].content;
    },
    //创建环节时，后置
    after(ind) {
      this.FormList.splice(ind + 1, 0, {});
      this.FormList[ind + 1].content = this.datacontent[0].content;
    },
    //创建环节时，删除
    deleteLink(index) {
      if (index !== 0) this.FormList.splice(index, 1);
    },
    //资产环节为空时，可创建
    addLink(asset) {
      this.asset = asset;
      this.isLinkDialogShow = true;
      this.mainTaskShow = false;
      this.datacontent = this.AssetListTask.filter(item => {
        return item.id === this.asset;
      });
      this.FormList[0].content = this.datacontent[0].content;
    },
    //给某一资产添加环节
    addLinks() {
      function dataFormat(params) {
        return new Date(params).toLocaleDateString(); //'yyyy/mm/dd hh:mm:ss'
      }
      this.FormList.forEach((item, index) => {
        this.FormList[index] = Object.assign({}, this.FormList[index], {
          dept: this.FormList[index].dept[this.FormList[index].dept.length - 1],
          asset: this.asset
        });

        if (
          "datetime" in this.FormList[index] &&
          this.FormList[index].datetime.length
        ) {
          this.FormList[index] = {
            ...this.FormList[index],
            date_start: dataFormat(this.FormList[index].datetime[0]),
            date_end: dataFormat(this.FormList[index].datetime[1])
          };
          delete this.FormList[index].datetime;
        }
        if (index === 0) {
          this.FormList[index].pid = 0;
        } else {
          this.FormList[index].pid = this.FormList[index - 1].dept;
        }
      });
      this.createLoading = true;

      addLinks({ links: [...this.FormList] })
        .then(({ data }) => {
          this.createLoading = false;

          if (data.status === 0) {
            this.$message.success(data.msg);
            this.$emit("refresh");
            this.$emit("refresh_assetList");
            this.isLinkDialogShow = false;
            this.FormList = [{}];
            this.mainTaskShow = true;
            this.TaskForm.asset = this.asset;
            getLinks({ asset: this.TaskForm.asset }).then(({ data }) => {
              const linkData = [...data.msg];
              this.LinkList = [];
              linkData.forEach(item => {
                item.forEach(ct => {
                  this.LinkList.push(ct);
                });
              });
            });
            this.active = 1;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          this.isDialogShow = false;
          this.createLoading = false;
        });
    },
    formatList() {
      function changeList(arr) {
        for (const item of arr) {
          if (item["children"] && item["children"].length) {
            changeList(item["children"]);
          } else {
            item["children"] = null;
          }
        }
      }
      this.selectList = JSON.parse(
        JSON.stringify(this.DeptList)
          .replace(/name/g, "label")
          .replace(/id/g, "value")
      );
      changeList(this.selectList);
    },
    mainTask() {
      this.mainTaskShow = true;
      this.active = 0;
      queryAssets({
        project: this.$route.params.id,
        asset_type: this.asset_type
      }).then(({ data }) => {
        this.AssetListTask = [...data.msg];
      });
      this.TaskForm = {
        priority: 0,
        grade: 1
      };
    },
    before() {
      if (this.active-- < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //行被点击后触发
    rowSelected(row) {
      this.ActiveRow = { ...row };
      // console.log(this.ActiveRow);
    },
    //打开对话框
    openDialog(Type, row) {
      this.ActiveRow = { ...row };
      // console.log(this.ActiveRow);

      this.DialogType = Type;
      getDeptUsers({
        id: this.ActiveRow.link_dept
      }).then(res => {
        this.DeptUsers = [...res.data.users];
        // console.log(this.DeptUsers);
      });
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      switch (Type) {
        case 1:
          this.dialogTitle = "创建任务";
          this.TaskForm = {
            priority: 0,
            grade: 1
          };
          break;
        case 2:
          this.$emit("getAssetList");
          if (!Object.keys(this.ActiveRow).length) {
            // console.log(this.ActiveRow);
            this.$message.error("请选择父任务");
            return false;
          }
          this.dialogTitle = `创建 ${this.ActiveRow.name} 的子任务`;

          this.TaskForm = {
            priority: 0,
            grade: 1,
            pid: this.ActiveRow.id,
            asset: this.ActiveRow.asset.id,
            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.start_date))
                : "",
              new Date(dateFormat(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.end_date))
                : ""
            ]
          };
          break;
        case 3:
          if (!Object.keys(this.ActiveRow).length) {
            this.$message.error("请选择要修改的任务");
            return false;
          }
          let executorlist;
          if (this.ActiveRow.executor.length) {
            executorlist = this.ActiveRow.executor.map(item => +item.id);
          }
          this.$emit("getAssetList");
          this.dialogTitle = "修改任务";
          this.TaskForm = {
            ...this.ActiveRow,
            datetime: [
              new Date(dateFormat(this.ActiveRow.start_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.start_date))
                : "",
              new Date(dateFormat(this.ActiveRow.end_date)) > 0
                ? new Date(dateFormat(this.ActiveRow.end_date))
                : ""
            ],
            executorlist,
            manager: this.ActiveRow.manager ? this.ActiveRow.manager.id : null,
            asset: this.ActiveRow.asset.id,
            method: "put"
          };
          // console.log(this.TaskForm, "~~~~~~~~~~~~");

          delete this.TaskForm.executor;
          delete this.TaskForm.creator;
          delete this.TaskForm.create_time;
          delete this.TaskForm.category;
          delete this.TaskForm.project;
          delete this.TaskForm["sub_task"];

          break;
      }
      this.isDialogShow = true;
    },
    //添加或者修改任务
    editTask() {
      this.$refs["TaskRef"].validate(valid => {
        if (valid) {
          this.buttonStates.createLoading = true;
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString();
            //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          let data = {
            ...this.TaskForm,
            start_date: changeDateFormat(this.TaskForm.datetime[0]),
            end_date: changeDateFormat(this.TaskForm.datetime[1]),
            project: this.$route.params.id
          };
          // console.log(data);
          if (this.TaskForm.executorlist.length) {
            data["executorlist"] = data["executorlist"].join();
          }
          delete data.datetime;
          //若果是修改
          if (this.DialogType === 3) {
            HTTP.putTask(data)
              .then(({ data }) => {
                this.buttonStates.createLoading = false;

                if (data.status === 0) {
                  this.getTasks(2);
                  this.$message.success("已修改");
                  this.isDialogShow = false;
                } else {
                  this.$message.error(data.msg);
                  this.buttonStates.createLoading = false;
                }
              })
              .catch(err => {
                this.buttonStates.createLoading = false;
              });
          } else {
            // console.log(data);
            HTTP.addTask(data).then(({ data }) => {
              this.buttonStates.createLoading = false;
              if (data.status === 0) {
                this.getTasks(2);
                this.isDialogShow = false;
                this.$message.success("已完成");
              } else {
                this.$message.error(data.msg);
                this.buttonStates.createLoading = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //添加主任务
    editMainTask() {
      this.$refs["TaskRef"].validate(valid => {
        if (valid) {
          function changeDateFormat(dateVal) {
            return new Date(dateVal).toLocaleDateString();
            //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
          }
          if (this.$route.query.type == 0) {
            //console.log(this.TaskForm);
            let dataMulTask = {
              group_id: this.TaskForm.group_id,

              link_id: this.TaskForm.link_id,

              asset_id: this.TaskForm.asset,

              name: this.TaskForm.name,

              content: this.TaskForm.content,

              start_date: changeDateFormat(this.TaskForm.datetime[0]),
              end_date: changeDateFormat(this.TaskForm.datetime[1]),

              total_hour: this.TaskForm.total_hour,

              project_id: this.$route.params.id,

              status: this.TaskForm.status,

              priority: this.TaskForm.priority,

              grade: this.TaskForm.grade
            };
            //console.log(dataMulTask);
            HTTP.mulCreateTasks(dataMulTask)
              .then(({ data }) => {
                this.$message.success(data.msg);
                if (data.status === 0) {
                  this.mainTaskShow = false;
                  this.active = 0;
                  this.getTasks(2);
                  t;
                }
              })
              .catch(err => {});
          } else {
            let data = {
              ...this.TaskForm,
              start_date: changeDateFormat(this.TaskForm.datetime[0]),
              end_date: changeDateFormat(this.TaskForm.datetime[1]),
              project: this.$route.params.id
            };
            if (this.TaskForm.executorlist.length) {
              data["executorlist"] = data["executorlist"].join();
            }
            //若果是修改
            HTTP.addTask(data).then(({ data }) => {
              if (data.status === 0) {
                this.$message.success(data.msg);
                this.mainTaskShow = false;
                this.active = 0;
                this.getTasks(2);

                // console.log(this.mainTaskShow);
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        }
      });
    },

    //取消对话框
    cancel() {
      this.isDialogShow = false;
      this.$refs["TaskRef"].resetFields();
    },
    cancel2() {
      this.mainTaskShow = false;
      this.$refs["TaskRef"].resetFields();
      this.active = 0;
    },
    //删除任务http请求
    deleteTask() {
      this.$confirm("删除任务后无法恢复，确认删除?", "注意", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const ids = this.multipleSelection.map(item => item.id).join(",");
          HTTP.deleteTask({
            ids: ids,
            method: "delete"
          }).then(({ data }) => {
            this.$message.success(data.msg);
            if (data.status === 0) {
              this.getTasks(2);
            }
          });
        })
        .catch(() => {});
    },
    //table表内筛选（状态、难度等级、优先级）+分页
    filterHandler(val, Type) {
      this.cutType = 4;
      this.valSel = val;
      if (val.status) {
        this.filterStatus = [];
        this.filterStatus = [...val.status];
        this.filterStatus.forEach((item, index) => {
          item = Number(item);
          this.filterStatus[index] = item;
        });
      }
      if (val.grade) {
        this.filterGrade = [];
        this.filterGrade = [...val.grade];
        this.filterGrade.forEach((item, index) => {
          item = Number(item);
          this.filterGrade[index] = item;
        });
      }
      if (val.priority) {
        this.filterPriority = [];
        this.filterPriority = [...val.priority];
        this.filterPriority.forEach((item, index) => {
          item = Number(item);
          this.filterPriority[index] = item;
        });
      }
      let data = {
        project: this.$route.params.id,
        pagenum: 20,
        page: 1
      };
      if (Type === 2) {
        //处理分页
        data = { ...data, pagenum: this.pageSize, page: this.currentPage };
      }
      if (this.filterStatus.length) {
        data = { ...data, status: "[" + String(this.filterStatus) + "]" };
      }
      if (this.filterGrade.length) {
        data = { ...data, grade: "[" + String(this.filterGrade) + "]" };
      }
      if (this.filterPriority.length) {
        data = { ...data, priority: "[" + String(this.filterPriority) + "]" };
      }
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            this.total = data.count;
            this.pageCount = data.page_count;
            if (Type === 1) {
              this.currentPage = 1;
            }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //获取任务列表
    getTasks(type, oneSel, name) {
      this.oneSel = oneSel;
      this.name = name; //任务导出时若有筛选条件
      let data = {
        project: this.$route.params.id
      };
      switch (type) {
        case 1: //重置
          this.cutType = -1;
          this.$refs["taskFilter"].showMul(); //重置筛选条件展示
          this.$refs["taskSel"].refreshOneSel(); //重置单条件筛选
          this.sortfilter = null; //重置多条件筛选存储的条件
          this.valSel = null; //重置table表内筛选（状态、难度等级、优先级）存储的条件
          this.oneSel = null; //重置单条件排序存储的条件
          this.currentPage = 1;
          data = { ...data, pagenum: 20, page: 1 };
          break;
        case 2: //正常查询
          data = { ...data, pagenum: 20, page: 1 };
          break;

        case 3: //单条件筛选查询
          this.cutType = 5;
          data = { ...data, ...oneSel, pagenum: 20, page: 1 };
          break;
        case 4: //单条件筛选下的分页
          data = {
            ...data,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
        case -1: //正常查询下的分页
          data = { ...data, pagenum: this.pageSize, page: this.currentPage };
          break;
      }
      this.tableLoading = true;
      HTTP.queryTask(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.TaskList = [...data.msg];
            this.authTask = data.auth.manage_task;
            // console.log(this.authTask);
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多列筛选分页查看
          break;
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2); //剩余筛选条件再筛选分页查看
          break;
        case 3:
          this.sortFilter(this.sortfilter, 2); //单条件排序分页查看
          break;
        case 4:
          this.filterHandler(this.valSel, 2); //table表内状态、难度等级和优先级排序分页查看
          break;
        case 5:
          this.getTasks(4, this.oneSel); //单条件筛选下的分页
          break;
        case -1:
          this.getTasks(-1); //正常请求后分页
          break;
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多列筛选分页查看
          break;
        case 2:
          this.closeSelectedTag(this.sortSelForm, 2); //剩余筛选条件再筛选分页查看
          break;
        case 3:
          this.sortFilter(this.sortfilter, 2); //单条件排序分页查看
          break;
        case 4:
          this.filterHandler(this.valSel, 2); //table表内状态、难度等级和优先级排序分页查看
          break;
        case 5:
          this.getTasks(4, this.oneSel); //单条件筛选下的分页
          break;
        case -1:
          this.getTasks(-1); //正常请求后分页
          break;
      }
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },

    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "低级";
          break;
        case 1:
          return "中级";
          break;
        case 2:
          return "高级";
          break;
      }
    },
    //难度等级格式化显示
    Grade: function(row, column) {
      switch (row.grade) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "困难";
          break;
      }
    }
  },
  async created() {
    if (this.$route.query.type == 0) {
      this.getTeam();
      //console.log("train")
    }
    this.getTasks(2);
    if (!this.DeptList) {
      await this.$store.dispatch("admin/get_DeptList");
      this.formatList();
    } else {
      this.formatList();
    }
  }
};
</script>

<style lang="scss">
#task {
  min-height: calc(100vh - 199px);
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}

.el-switch__core {
  height: 15px;
  width: 33px !important;
}
.el-switch__core:after {
  top: -1px;
  left: -1px;
  margin-right: -10px;
  width: 14px;
  height: 14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
.el-switch__label * {
  line-height: 1;
  font-size: 10px;
  display: inline-block;
}
.el-switch.is-checked .el-switch__core::after {
  margin-left: -14px;
  box-shadow: 1px 1px 1px black;
  background-color: white;
}
.el-table--mini td {
    padding: 0px 0;
 }
</style>

