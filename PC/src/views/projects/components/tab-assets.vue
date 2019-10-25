<template>
  <div id="tab-assets" ref="drawer-parent">
    <div>
      <el-row :gutter="15">
        <el-col :span="14" style="padding-bottom:15px;">
          <template v-if="authAsset">
            <el-button icon="el-icon-plus" type="primary" @click="showAssetForm(1)">
              <slot name="add">添加资产</slot>
            </el-button>
            <el-button icon="el-icon-download" type="primary" @click="targetdownload">
              <slot name="import">资产导入</slot>
            </el-button>
            <el-button icon="el-icon-upload2" type="success" @click="targetUpload">
              <slot name="upload">资产导出</slot>
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delMulAssets()"
              :disabled="this.multipleSelection.length === 0"
            >批量删除</el-button>
          </template>
          <el-popover placement="bottom" width="300" trigger="click" style="margin-left:15px">
            <el-col :span="12">
              <el-checkbox v-model="ind">序号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_image">缩略图</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_session">场次</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_episode">集数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_name">镜头号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame">帧数</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_frame_range">帧数范围</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_report">画面调整信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_retime">变速信息</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_inner_version">版本号</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_content">制作内容</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_priority">优先级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_level">难度等级</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_id">资产ID</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_name">创建人</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_creator_id">创建人ID</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_status">状态</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_link">当前环节</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_create_date">创建日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_start_date">开始日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_end_date">结束日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_totle_date_end">计划截止日期</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_total_hours">总工时</el-checkbox>
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="show_remark">备注</el-checkbox>
            </el-col>
            <el-button slot="reference" type="primary" icon="el-icon-setting">展示列</el-button>
          </el-popover>
          <template>
            <assetSortMul @refresh="sortMul" style="margin-left:15px;width:100px" />
          </template>
        </el-col>
        <el-col :span="10" align="right">
          <el-row type="flex" justify="end">
            <!-- 单条件筛选 -->
            <assetSel ref="assetSel" @refreshAssetList="getAssetList" />
            <!-- 多条件筛选 -->
            <assetMulSel
              ref="assetMulSel"
              @refresh_sortMul="MulSel"
              @filterCondition="filterCondition"
              @selRefresh="selRefresh"
            />
            <el-button @click="getAssetList(1)" type="primary" style="margin-left: 15px">重置</el-button>
          </el-row>
        </el-col>
      </el-row>
      <assetFilter ref="assetFilter" @refresh_close="closeSelectedTag" />
      <el-table
        ref="assetTable"
        :data="AssetList"
        :header-cell-style="{background:'#eef1f6',color:'#606266',borderRight:0}"
        :cell-style="cellStyle"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :row-key="(row)=>{ return row.id}"
        v-loading="tableLoading"
        @filter-change="filterHandler"
        @sort-change="sortFilter"
        :border="false"
        @cell-dblclick="editCell"
        @expand-change="expandShow"
      >
        <el-table-column type="selection" :reserve-selection="true" width="50px" align="right"></el-table-column>
        <el-table-column type="expand" prop="expand" width="20px" >
          <template slot-scope="props"  >
            <taskTable ref="taskTable" v-if="props.row.task_num != 0" style="margin-left:20px"/>
            <label for v-else >此镜头暂无任务</label>
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" align="center" v-if="ind"></el-table-column>
        <el-table-column label="缩略图" align="center" v-if="show_image">
          <template slot-scope="scope">
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 55px;height: 33px;cursor: pointer; display:block;"
              :preview-src-list="[$store.state.BASE_URL+scope.row.image]"
              v-if="!editing||clickId !== scope.row.id"
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture" style="color:#909399"></i>
              </div>
            </el-image>
            <el-image
              :src="$store.state.BASE_URL+scope.row.image"
              style="width: 55px;height: 33px;cursor: pointer; display:block;"
              @click.native="img(scope.row)"
              v-if="editing&&clickId === scope.row.id"
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
         <el-table-column label="小状态" prop="small_status" width="120px">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.small_status"
              placeholder="请选择状态"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'small_status')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <div v-if="scope.row.status === 0">
                <el-option
                  v-for="item of pause"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 1">
                <el-option
                  v-for="item of notstart"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 2">
                <el-option
                  v-for="item of conducting"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 3">
                <el-option
                  v-for="item of approving"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
              <div v-if="scope.row.status === 4">
                <el-option
                  v-for="item of finish"
                  :key="item.value"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </div>
            </el-select>

            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'small_status')"
            >{{scope.row.small_status|taskMinStatus}}</span>
          </template>
        </el-table-column>
        <template v-if="groupType == 0?true:false">
          <el-table-column label="实训阶段" prop="groups" width="120px">
            <template slot-scope="scope">
              <el-row v-for="(item,index) of scope.row.groups" :key="index">
                <el-col>{{item}}</el-col>
              </el-row>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          prop="name"
          :label="labelName"
          align="left"
          width="120px"
          show-overflow-tooltip
          v-if="show_name"
          sortable="custom"
          class-name="links"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'name')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.name?scope.row.name:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'name')"
              @click="show(scope.row.id)"
            >{{scope.row.name?scope.row.name:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务数量" prop="task_num"></el-table-column>
        <el-table-column
          prop="session"
          label="场次"
          align="center"
          v-if="show_session&&notShow == 'true'?true:false"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.session"
              placeholder="请输入场次"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol=='session')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.session?scope.row.session:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol!='session')"
            >{{scope.row.session?scope.row.session:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="episode"
          label="集数"
          align="center"
          v-if="show_episode&&notShow == 'true'?true:false"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.episode"
              placeholder="请输入集数"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'episode')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.episode?scope.row.episode:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'episode')"
            >{{scope.row.episode?scope.row.episode:"-"}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="frame"
          label="帧数"
          align="left"
          v-if="show_frame&&notShow == 'true'?true:false"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.frame"
              placeholder="请输入帧数"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.frame?scope.row.frame:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'frame')"
            >{{scope.row.frame?scope.row.frame:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="frame_range"
          label="帧数范围"
          align="left"
          width="120px"
          v-if="show_frame_range&&notShow == 'true'?true:false"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.frame_range"
              placeholder="请输入帧数范围"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'frame_range')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.frame_range?scope.row.frame_range:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'frame_range')"
            >{{scope.row.frame_range?scope.row.frame_range:"-"}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="reference"
          label="制作参考"
          align="left"
          width="120px"
          v-if="show_frame_reference"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.pro_reference"
              placeholder="请输入制作参考内容"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'reference')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.pro_reference?scope.row.pro_reference:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'reference')"
            >{{scope.row.pro_reference?scope.row.pro_reference:"-"}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="report" label="画面调整信息" align="left" width="120px" v-if="show_report">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.report"
              placeholder="请输入画面调整信息"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'report')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.report?scope.row.report:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'report')"
            >{{scope.row.report?scope.row.report:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="retime" label="变速信息" align="left" width="120px" v-if="show_retime">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.retime"
              placeholder="请输入变速信息"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'retime')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.retime?scope.row.retime:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'retime')"
            >{{scope.row.retime?scope.row.retime:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inner_version"
          label="版本号"
          align="left"
          width="90px"
          show-overflow-tooltip
          v-if="show_inner_version"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="制作内容"
          align="left"
          width="400px"
          show-overflow-tooltip
          v-if="show_content"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.content"
              placeholder="请输入制作内容"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'content')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <span>{{scope.row.content?scope.row.content:"-"}}</span>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'content')"
            >{{scope.row.content?scope.row.content:"-"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
          :formatter="Priority"
          align="center"
          width="120px"
          v-if="show_priority"
          sortable="custom"
          column-key="priority"
          :filters="[{text: '正常', value: '0'}, {text: '优先', value: '1'}]"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.priority"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'priority')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <el-option label="正常" :value="0"></el-option>
              <el-option label="优先" :value="1"></el-option>
            </el-select>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'priority')"
            >{{scope.row.priority|Priority}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          label="难度等级"
          :formatter="Level"
          align="center"
          v-if="show_level"
          width="120px"
          sortable="custom"
          column-key="level"
          :filters="[{text: '简单', value: '0'}, {text: '标准', value: '1'}, {text: '复杂', value: '2'}, {text: '高难度', value: '3'}]"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.level"
              placeholder="请选择难度等级"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'level')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <el-option
                v-for="item of LevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'level')"
            >{{scope.row.level|Level}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="资产ID" v-if="show_id" align="left"></el-table-column>
        <el-table-column prop="creator_name" label="创建人" align="left" v-if="show_creator_name"></el-table-column>
        <el-table-column prop="creator_id" label="创建人ID" v-if="show_creator_id" align="left"></el-table-column>
        <el-table-column label="当前环节" align="center" width="160px" v-if="show_link">
          <el-table-column prop="link" label="工种" align="left">
            <template slot-scope="scope">
              <div v-for="(todo,index) of scope.row.link" :key="index">{{todo.name}}</div>
            </template>
          </el-table-column>
          <el-table-column label="截止日期" align="left" width="95px">
            <template slot-scope="scope">
              <div
                v-for="(todo,index) of scope.row.link"
                :key="index"
                style="position:top"
              >{{todo.date_end|dateFormat}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="创建日期"
          align="left"
          width="160px"
          v-if="show_create_date"
          prop="date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.create_date|dateFormat}}</template>
        </el-table-column>
        <el-table-column
          label="开始日期"
          align="left"
          width="160px"
          v-if="show_start_date"
          prop="start_date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="start_date"
              type="date"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'start_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
              placeholder="选择开始日期"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'start_date')"
            >{{scope.row.start_date|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结束日期"
          align="left"
          width="160px"
          v-if="show_end_date"
          prop="end_date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">
            <el-date-picker
              v-model="end_date"
              type="date"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'end_date')"
              @change="showEditIcon(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
              placeholder="选择结束日期"
            />
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'end_date')"
            >{{scope.row.end_date|dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="计划截止日期"
          align="left"
          width="160px"
          v-if="show_totle_date_end"
          prop="total_end_date"
          class-name="date"
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.total_date_end|dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="total_hours" label="总工时" align="left" v-if="show_total_hours"></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="left"
          show-overflow-tooltip
          v-if="show_remark"
        >
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.remark"
              placeholder="请输入备注"
              v-if="(editing&&clickId === scope.row.id)||(dbCell&&cellId === scope.row.id&&cellCol == 'remark')"
              @change="showEditIcon"
              @blur="saveEdit(scope.$index,scope.row)"
              @keyup.enter.native="saveEdit(scope.$index,scope.row)"
            >
              <p v-html="scope.row.remark"></p>
            </el-input>
            <span
              v-if="(!editing||clickId !== scope.row.id)&&(!dbCell||cellId !== scope.row.id||cellCol != 'remark')"
            >
              <p v-html="scope.row.remark"></p>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px" v-if="authAsset">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="导出至素材库" placement="top">
              <svg-icon
                icon-class="exportMaterial"
                @click="pushMaterial(1,scope.row.id)"
                style="cursor:pointer;margin-right:10px"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="修改" placement="top">
              <el-button
                @click="editOneAsset(scope.row)"
                icon="el-icon-edit"
                type="text"
                style="color:blue"
                v-if="!editing||clickId !== scope.row.id"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="确认" placement="top">
              <el-button
                v-if="editing&&clickId === scope.row.id"
                type="text"
                icon="el-icon-check"
                style="color:green"
                @click="saveEdit(scope.$index,scope.row)"
              />
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-button
                @click="deleteAssets(scope.row.id)"
                icon="el-icon-delete"
                style="color:red"
                type="text"
              />
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
    <el-dialog :title="dialogTitle" :visible.sync="isShow" width="480px" top="5vh">
      <el-form
        :model="AssetForm"
        :rules="rules"
        ref="assetForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
          ref="upload"
          class="upload-demo"
          action="/api/appfile/appfile/"
          :headers="headers"
          :on-success="handleSuccess"
          drag
          :show-file-list="false"
        >
          <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
        <el-form-item label="资产名称" prop="name">
          <el-input v-model="AssetForm.name" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="存放路径" prop="path">
          <el-input v-model="AssetForm.path" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="优先等级" prop="priority">
          <!-- <el-input v-model="AssetForm.code"></el-input> -->
          <el-radio v-model="AssetForm.priority" :label="0">正常</el-radio>
          <el-radio v-model="AssetForm.priority" :label="1">优先</el-radio>
        </el-form-item>
        <el-form-item label="难度等级" prop="level">
          <el-select v-model="AssetForm.level" placeholder="请选择难度等级">
            <el-option
              v-for="item of LevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="所属团队" prop="team">
          <el-input v-model="AssetForm.category"></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addAsset">{{DialogName===1?'立即创建':'立即修改'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 资产修改时上传图片 -->
    <el-dialog title="上传图片" :visible.sync="dialogImg" width="480px" top="5vh">
      <el-form
        :model="ImgForm"
        ref="ImgForm"
        label-width="100px"
        hide-required-asterisk
        label-position="left"
      >
        <el-upload
          accept="image/jpeg, image/gif, image/png"
          ref="upload"
          class="upload-demo"
          action="/api/appfile/appfile/"
          :headers="headers"
          :on-success="handleSuccess"
          drag
          :show-file-list="false"
        >
          <el-image v-if="SRC" style="width: 100%; height: 100%" :src="SRC"></el-image>
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </template>
        </el-upload>
        <el-form-item>
          <el-button @click="cancel2">取消</el-button>
          <el-button :loading="buttonStates.createLoading" type="primary" @click="addImg">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加至素材库 -->
    <el-dialog title="添加至素材库" :visible.sync="materialShow" width="480px" top="5vh">
      <el-form :model="materialForm" label-width="90px">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="materialForm.name"></el-input>
        </el-form-item>
        <el-form-item label="素材路径" prop="path">
          <el-input v-model="materialForm.path"></el-input>
        </el-form-item>
        <el-form-item label="素材说明" prop="explain">
          <el-input type="textarea" v-model="materialForm.explain"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button type="primary" @click="pushMaterial()">立即添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导出 -->
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
    <Drawer
      scrollable
      closable
      v-model="value1"
      width="526"
      :transfer="false"
      :mask="false"
      :inner="isInner"
    >
      <Header :project="project">
        <span v-if="drawerType==='scene'" slot="type">镜头类型</span>
      </Header>
      <assetsDrawer
        :project="project"
        :RemarksData="RemarksData"
        @refreshRemark="updateRemark()"
        @refresh_assetList="getAssetList(2)"
        ref="assetsDrawer"
        :assetJump="assetJump"
        :LinkAssetList="LinkAssetList"
        @jumpName="jumpName"
        :attrsList="attrsList"
        :customAttrs="customAttrs"
        @refresh_customAttrs="RefreshcustomAttrs"
        :attrsTypeNum="attrsTypeNum"
        :pro_type="pro_type"
        :authAsset="authAsset"
      />
    </Drawer>
  </div>
</template>

<script>
import assetsDrawer from "@/views/assetsManagement/components/assetsDrawer";
import Header from "@/components/projectDrawer/components/Header";
import * as HTTP from "@/api/assets";
import { getRemark } from "@/api/remark";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
import thumbtackMixin from "@/mixins/thumbtack-mixin";
import { getProjectStatus } from "@/api/status";
import { searchBind, getAttrsEntityList } from "@/api/attrs";
import assetMulSel from "@/views/projects/components/mulConditionSel/assetMulSel";
import assetFilter from "@/views/projects/components/filterCondition/assetFilter";
import assetSortMul from "@/views/projects/components/sortMul/assetSortMul";
import assetSel from "@/views/projects/components/oneConditionSel/assetSel";
import taskTable from "@/views/projects/components/taskTable";
import { editSmallStatus } from "@/api/status";
export default {
  mixins: [thumbtackMixin],
  components: {
    assetsDrawer,
    Header,
    assetMulSel,
    assetFilter,
    assetSortMul,
    assetSel,
    taskTable
  },
  neme: "asset-list",
  data() {
    return {
      tableTask: [], //资产的任务
      labelName: this.notShow == "true" ? "镜头号" : "资产名称",
      uploadVisible: false,
      materialForm: {},
      matrialId: null,
      // assetId: this.$route.query.asset?this.$route.query.asset:"",
      pageCount: 0,
      AssetList: [],
      total: 0,
      tableLoading: false, //表格加载状态
      project: null,
      RemarksData: [],
      value1: false,
      activeAsset: null,
      isDrawerShow: false,
      SRC: "",
      AssetForm: {
        priority: 0
      },
      ImgForm: {},
      isShow: false,
      LevelList: [
        {
          label: "简单",
          value: 0
        },
        {
          label: "标准",
          value: 1
        },
        {
          label: "复杂",
          value: 2
        },
        {
          label: "高难度",
          value: 3
        }
      ],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        priority: [
          { required: true, message: "请输入优先等级", trigger: "blur" }
        ],
        level: [{ required: true, message: "请输入难度等级", trigger: "blur" }]
      },
      buttonStates: {
        createLoading: false
      },
      currentPage: 1,
      pageSize: 20,
      pageSizeList: [20, 30, 50, 100],
      headers: {
        Authorization: `JWT ${getToken()}`
      },
      multipleSelection: [],
      dialogTitle: "",
      DialogName: null,
      editing: false,
      clickId: null,
      iconShow: false,
      dialogImg: false,
      imagePath: null,
      row: null,
      ind: true,
      show_image: true,
      show_session: true,
      show_episode: true,
      show_name: true,
      show_frame: true,
      show_frame_range: true,
      show_frame_reference: true,
      show_report: true,
      show_retime: true,
      show_inner_version: true,
      show_content: true,
      show_priority: true,
      show_level: true,
      show_id: false,
      show_creator_name: false,
      show_creator_id: false,
      show_status: true,
      show_link: true,
      show_totle_date_end: true,
      show_total_hours: true,
      show_remark: true,
      show_create_date: true,
      show_start_date: true,
      show_end_date: true,
      start_date: null,
      end_date: null,
      filterStatus: [],
      filterPriority: [],
      filterLevel: [],
      sort: null,
      path: null,
      multiSelect: [],
      name: "",
      approving: [],
      conducting: [],
      finish: [],
      notstart: [],
      pause: [],
      LinkAssetList: [],
      attrsList: [],
      customAttrs: [],
      attrsTypeNum: null,
      materialShow: false,
      materialEstdate: new Date().toLocaleDateString(),
      pro_type: null,
      authAsset: null,
      dbCell: false,
      cellId: null,
      cellCol: null,
      cutType: -1, //分页类型
      oneSel: null, //保存单列筛选的条件
      sortSelForm: {}, //保存多列筛选条件
      valSel: null, //保存table表内筛选（状态、难度等级、优先级）的条件
      sortfilter: null, //保存单列排序的条件
      sortMulFilter: null //保存多列排序的条件
    };
  },
  watch: {
    assetId: {
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.show(Number(newVal));
        }
      }
    }
  },
  computed: {
    ...mapState("project", ["ProjectList"])
  },
  props: {
    assetJump: {
      type: String
    },
    assetId: {
      type: String
    },
    activeName: {
      type: String
    },
    drawerType: {
      //侧边栏为资产还是镜头
      default: ""
    },
    groupType: {
      default: null
    },
    notShow: {
      type: String
    }
  },
  methods: {
       //展示要修改的资产表单
      showAssetForm(Type,row) {
      this.DialogName = Type;
      if(Type === 1){
        this.dialogTitle = "新建资产";
      }
      if(Type === 2){
        this.dialogTitle = "修改资产";
        this.SRC = this.$store.state.BASE_URL + row.image;
        this.AssetForm={
          image:row.image,
          name:row.name,
          path:row.path,
          priority:row.priority,
          level:row.level,
          id:row.id
        };

      }
      this.isShow = true;
    },
    //展示资产的任务
    expandShow(row, expandedRows) {
      if (Object.keys(expandedRows).length) {
        if (row.task_num != 0) {
          this.$nextTick(() => {
            this.$refs["taskTable"].getTaskList(row.id);
          });
        }
      } else {
        return;
      }
    },
    //重置筛选条件展示
    selRefresh() {
      this.$refs["assetFilter"].showMul();
    },
    //筛选条件展示
    filterCondition(showMulChoose, sortSelForm) {
      this.$refs["assetFilter"].filterCondition(showMulChoose, sortSelForm);
    },
    //删除筛选条件，剩余条件再搜索
    closeSelectedTag(sortSelForm, Type) {
      this.cutType = 2;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id
      };
      if (Type === 1) {
        //正常请求
        data = { ...data, pagenum: 20, page: 1 };
      } else {
        //处理分页
        data = { ...data, pagenum: this.pageSize, page: this.currentPage };
      }
      this.multiSelect = sortSelForm;
      this.tableLoading = true;
      HTTP.queryAssets(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
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
    cellStyle({ row, column, rowIndex, columnIndex }) {
      //console.log({ row, column, rowIndex, columnIndex })
      
      if (column.property == "priority") {
        switch (row.priority) {
          case 1:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      } else if (column.property == "level") {
        switch (row.level) {
          case 3:
            return {
              background: "#C64b2b",
              color: "#FFFFFF"
            };
        }
      }
      return { borderRight: 0 };
    },
    //双击修改单元格获取焦点
    editCell(row, column, cell, event) {
      if (this.authAsset) {
        switch (column.label) {
          case "镜头号":
            this.cellCol = "name";
            break;
          case "场次":
            this.cellCol = "session";
            break;
          case "集数":
            this.cellCol = "episode";
            break;
          case "帧数":
            this.cellCol = "frame";
            break;
          case "帧数范围":
            this.cellCol = "frame_range";
            break;
          case "制作参考":
            this.cellCol = "reference";
            break;
          case "画面调整信息":
            this.cellCol = "report";
            break;
          case "变速信息":
            this.cellCol = "retime";
            break;
          case "制作内容":
            this.cellCol = "content";
          case "优先级":
            this.cellCol = "priority";
            break;
          case "难度等级":
            this.cellCol = "level";
            break;
          case "小状态":
            this.cellCol = "small_status";
            break;
          case "开始日期":
            this.cellCol = "start_date";
            break;
          case "结束日期":
            this.cellCol = "end_date";
            break;
          case "备注":
            this.cellCol = "remark";
            break;
        }

        this.dbCell = true;
        this.cellId = row.id;
      }
    },

    //添加进素材库
    pushMaterial(Type, id) {
      if (Type === 1) {
        this.materialShow = true;
        this.matrialId = id;
      } else {
        let dateMaterial = {
          ...this.materialForm,
          ids: this.matrialId
        };
      }
    },
    jumpName(val) {
      this.$emit("jumpName", val);
    },
    // 单条件排序
    sortFilter({ column, prop, order }, Type) {
      this.sortfilter = { column, prop, order };
      this.cutType = 3;
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1,
        sort: order === "descending" ? "-" + prop : prop
      };
      if (Type === 1) {
        //正常请求
        payload = { ...payload, pagenum: 20, page: 1 };
      } else {
        //处理分页
        payload = {
          ...payload,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      HTTP.queryAssets(payload)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
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
    //多条件排序
    sortMul(sort, Type) {
      this.sortMulFilter = sort;
      this.cutType = 6;
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1,
        sort: sort
      };
      if (Type === 1) {
        //正常请求
        payload = { ...payload, ...sort, pagenum: 20, page: 1 };
      } else {
        //处理分页
        payload = {
          ...payload,
          ...sort,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      HTTP.queryAssets(payload)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
            this.total = data.count;
            this.pageCount = data.page_count;
            // if (Type === 1) {
            //   this.currentPage = 1;
            // }
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //table表内筛选（状态、难度等级、优先级）
    filterHandler(val, Type) {
      this.valSel = val;
      this.cutType = 4;
      if (val.status) {
        this.filterStatus = [];
        this.filterStatus = [...val.status];
        this.filterStatus.forEach((item, index) => {
          item = Number(item);
          this.filterStatus[index] = item;
        });
      }
      if (val.priority) {
        this.filterPriority = [...val.priority];
        this.filterPriority.forEach((item, index) => {
          item = Number(item);
          this.filterPriority[index] = item;
        });
      }
      if (val.level) {
        this.filterLevel = [...val.level];
        this.filterLevel.forEach((item, index) => {
          item = Number(item);
          this.filterLevel[index] = item;
        });
      }
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
      };
      if (Type === 1) {
        //正常请求
        payload = { ...payload, pagenum: 20, page: 1 };
      } else {
        //处理分页
        payload = {
          ...payload,
          pagenum: this.pageSize,
          page: this.currentPage
        };
      }
      if (this.filterStatus.length) {
        payload = { ...payload, status: "[" + String(this.filterStatus) + "]" };
      }
      if (this.filterPriority.length) {
        payload = {
          ...payload,
          priority: "[" + String(this.filterPriority) + "]"
        };
      }
      if (this.filterLevel.length) {
        payload = { ...payload, level: "[" + String(this.filterLevel) + "]" };
      }
      this.tableLoading = true;
      HTTP.queryAssets(payload)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
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
    //多条件筛选
    MulSel(sortSelForm, Type) {
      this.cutType = 1;
      this.sortSelForm = sortSelForm;
      let data = {
        ...sortSelForm,
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
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
      HTTP.queryAssets(data)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];
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
    img(row) {
      this.dialogImg = true;
      this.row = row;
      this.SRC = this.$store.state.BASE_URL + row.image;
    },
    addImg() {
      // console.log(this.ImgForm)
      this.imagePath = this.ImgForm.image;
      this.SRC = this.$store.state.BASE_URL + this.imagePath;
      this.row.image = this.imagePath;
      this.row.image_id = this.ImgForm.id;
      this.dialogImg = false;
    },
    handleCurrentChange(row, event, column) {
      // console.log(row, event, column, event.currentTarget);
    },
    //是否显示行内修改框
    showEditIcon(index, row) {
      this.iconShow = true;
      this.rowClick = true;
      if (
        this.cellCol == "priority" ||
        this.cellCol == "level" ||
        this.cellCol == "small_status" ||
        this.cellCol == "start_date" ||
        this.cellCol == "end_date"
      ) {
        this.saveEdit(index, row);
      }
    },
    //修改资产
    editOneAsset(row) {
      function dateFormat(date) {
        return new Date(date * 1000).toLocaleDateString();
      }
      // console.log("edit");
      // console.log(row);
      if (this.iconShow === true) {
        this.$confirm("当前修改未保存", "注意", {
          // confirmButtonText: "确定",

          // concelButtonText: "取消",

          type: "warning"
        });
      } else {
        this.editing = true;
        this.clickId = row.id;
        this.start_date =
          new Date(dateFormat(row.start_date)) > 0
            ? new Date(dateFormat(row.start_date))
            : "";
        this.end_date =
          new Date(dateFormat(row.end_date)) > 0
            ? new Date(dateFormat(row.end_date))
            : "";
      }
    },
    //行内修改资产保存
    saveEdit(index, row) {
      function DateFormat(dateVal) {
        return new Date(dateVal).toLocaleDateString();
        //'yyyy/mm/dd hh:mm:ss'  return `${new Date(date * 1000).toLocaleDateString()} ${new Date(date * 1000).toTimeString().split(' ')[0]}`
      }
      this.iconShow = false;
      this.dbCell = false;
      let payload = {
        id: row.id,
        priority: row.priority,
        level: row.level,
        ...this.ImgForm,
        session: row.session,
        frame: row.frame,
        episode: row.episode,
        name: row.name,
        method: "put",
        remark: row.remark,
        report: row.report,
        retime: row.retime,
        frame_range: row.frame_range,
        start: DateFormat(this.start_date),
        end: DateFormat(this.end_date),
        reference: row.pro_reference
      };
      let smallStatus = {};
      if (row.small_status) {
        smallStatus = { small_status_id: row.small_status, asset_id: row.id };
      }
      if (payload.start === "Invalid Date") {
        delete payload.start;
      }
      if (payload.end === "Invalid Date") {
        delete payload.end;
      }
      if (!payload.small_status) {
        delete payload.small_status;
      }
      HTTP.editAssets(payload).then(({ data }) => {
        if (smallStatus) {
          editSmallStatus(smallStatus).then(({ data }) => {});
        }
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.getAssetList(2);
          this.editing = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    change() {
      this.$forceUpdate();
    },
    //跳转批量上传页
    targetdownload() {
      this.$router.push({
        name: "asset-import",
        params: { id: this.$route.params.id },
        query: {
          type: this.drawerType
        }
      });
    },
    //跳转导出页面dialog
    targetUpload() {
      HTTP.queryAssets({
        ...this.multiSelect,
        ...this.name,
        project: this.$route.params.id,
        print: "null"
      })
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
    //获取资产或者镜头列表，type=1时表示重置（包括单条件筛选）
    getAssetList(type, oneSel, name) {
      this.name = name;
      this.oneSel = oneSel;
      let payload = {
        project: this.$route.params.id,
        asset_type: this.drawerType === "scene" ? 0 : 1
      };
      switch (type) {
        case 1: //重置
          this.cutType = -1;
          this.currentPage = 1;
          this.$refs["assetFilter"].showMul(); //重置筛选条件展示
          this.$refs["assetSel"].refreshOneSel(); //重置单条件筛选
          this.sortfilter = null; //重置多条件筛选存储的条件
          this.valSel = null; //重置table表内筛选（状态、难度等级、优先级）存储的条件
          this.oneSel = null; //重置单条件排序存储的条件
          this.sortMulFilter = null; //重置多条件排序存储的条件
          payload = { ...payload, pagenum: 20, page: 1 };
          break;
        case 2: //正常查询
          payload = { ...payload, pagenum: 20, page: 1 };
          break;
        case 3: //单条件筛选查询
          this.cutType = 5;
          payload = {
            ...payload,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
        case 4: //单条件筛选下的分页
          payload = {
            ...payload,
            ...oneSel,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
        case -1: //正常查询下的分页
          payload = {
            ...payload,
            pagenum: this.pageSize,
            page: this.currentPage
          };
          break;
      }
      this.tableLoading = true;
      HTTP.queryAssets(payload)
        .then(({ data }) => {
          if (data.status === 0) {
            this.AssetList = [...data.msg];

            this.AssetList.forEach(item => {
              if (!item.link.length) {
                this.LinkAssetList.push(item);
              }
            });
            this.total = data.count;
            this.pageCount = data.page_count;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    //获取操作资产权限
    getAuth() {
      HTTP.auth().then(({ data }) => {
        if (data.status === 0) {
          this.authAsset = data.auth.manage_asset;
        }
      });
    },
    //获取项目的状态
    getProjectAllStatus() {
      getProjectStatus({ project_id: this.$route.params.id }).then(
        ({ data }) => {
          if (data.status === 0) this.projectStatus = [...data.msg];
          this.projectStatus.forEach((item, index) => {
            switch (item) {
              case 0:
                this.pause.push({ label: "ON_HOLD", id: item });
                break;
              case 1:
                this.pause.push({ label: "IGNORE", id: item });
                break;
              case 2:
                this.pause.push({ label: "PAUSE", id: item });
                break;
              case 3:
                this.notstart.push({ label: "NNT_STARTED", id: item });
                break;
              case 4:
                this.notstart.push({ label: "WATING_TO_START", id: item });
                break;
              case 5:
                this.notstart.push({ label: "REAY_TO_START", id: item });
                break;
              case 6:
                this.conducting.push({ label: "NORMAL", id: item });
                break;
              case 7:
                this.conducting.push({ label: "OPEN", id: item });
                break;
              case 8:
                this.conducting.push({ label: "IN_PROGESS", id: item });
                break;
              case 9:
                this.conducting.push({ label: "OUTSOURCE", id: item });
                break;
              case 10:
                this.conducting.push({ label: "SUBMITTED", id: item });
                break;
              case 11:
                this.conducting.push({ label: "FEEDBACK", id: item });
                break;
              case 12:
                this.conducting.push({ label: "READED", id: item });
                break;
              case 13:
                this.conducting.push({ label: "TEST", id: item });
                break;
              case 14:
                this.conducting.push({ label: "RR", id: item });
                break;
              case 15:
                this.conducting.push({ label: "REDO", id: item });
                break;
              case 16:
                this.approving.push({ label: "APPROVE", id: item });
                break;
              case 17:
                this.approving.push({ label: "PENDING_REVIEW", id: item });
                break;
              case 18:
                this.approving.push({ label: "DAILIES", id: item });
                break;
              case 19:
                this.approving.push({ label: "CLIENT_REVIEW", id: item });
                break;
              case 20:
                this.finish.push({ label: "CBB", id: item });
                break;
              case 21:
                this.finish.push({ label: "APPROVED", id: item });
                break;
              case 22:
                this.finish.push({ label: "DIRECTOR_APPROVED", id: item });
                break;
              case 23:
                this.finish.push({ label: "REVISION", id: item });
                break;
              case 24:
                this.finish.push({ label: "FINAL", id: item });
                break;
              case 25:
                this.finish.push({ label: "DELIVERED", id: item });
                break;
              case 26:
                this.finish.push({ label: "OMITTED", id: item });
                break;
              case 27:
                this.finish.push({ label: "CLOSED", id: item });
                break;
            }
          });
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateRemark() {
      getRemark({
        appid: this.project.id,
        apptype: 5
      }).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    },
    //展示侧栏
    show(id) {
      this.value1 = true;
      this.pro_type = this.$route.query.type;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = { ...[...data.msg][0], id };
      });
      this.$refs.assetsDrawer.getLinkList(id);
      this.$refs.assetsDrawer.getAssetTask(id);
      const msg = {
        appid: id,
        apptype: 5
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
      searchBind({ entity_type: 5 }).then(({ data }) => {
        this.attrsList = [...data.msg];
      });
      getAttrsEntityList({ entity_id: id, entity_type: 5 }).then(({ data }) => {
        this.customAttrs = [...data.msg];
        this.attrsTypeNum = 5;
      });
    },
    RefreshcustomAttrs() {
      getAttrsEntityList({ entity_id: this.project.id, entity_type: 5 }).then(
        ({ data }) => {
          this.customAttrs = [...data.msg];
          this.attrsTypeNum = 5;
        }
      );
    },
    //侧栏关闭
    drawerClose() {
      this.value1 = false;
    },
    //删除单个资产
    deleteAssets(id) {
      this.$confirm("此操作将永久删除该资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //console.log(id);
        HTTP.deleteAssets({ id }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.getAssetList(2);
          }
        });
      });
    },
    //批量删除资产
    delMulAssets() {
      this.$confirm("此操作将永久删除资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id).join(",");
        // console.log(ids);
        HTTP.deleteAssets({ ids }).then(({ data }) => {
          this.$message.success(data.msg);
          if (data.status === 0) {
            this.getAssetList(2);
          }
        });
      });
    },
    cancel() {
      this.isShow = false;
      this.$refs["assetForm"].resetFields();
      this.AssetForm = {
        priority: 0
      };
      this.SRC = "";
    },
    cancel2() {
      this.SRC = "";
      this.dialogImg = false;
    },
    //新建
    addAsset() {
      this.$refs["assetForm"].validate(valid => {
        if (valid) {
          this.createLoading = true;
          if (this.DialogName == 1) {
            if (this.activeName === "tab0") {
              this.AssetForm = Object.assign({}, this.AssetForm, {
                project: this.$route.params.id,
                asset_type: 0
              });
            } else {
              this.AssetForm = Object.assign({}, this.AssetForm, {
                project: this.$route.params.id,
                asset_type: 1
              });
            }

            HTTP.postAssets(this.AssetForm)
              .then(({ data }) => {
                this.createLoading = false;
                this.$message.success(data.msg);
                if (data.status === 0) {
                  this.getAssetList(2);
                  this.AssetForm = Object.assign(
                    {},
                    {
                      priority: 0
                    }
                  );
                }
                this.isShow = false;
              })
              .catch(err => {
                this.createLoading = false;
              });
          }
          if (this.DialogName === 2) {
            this.AssetForm = Object.assign({}, this.AssetForm, {
              method: "put"
            });
            HTTP.editAssets(this.AssetForm)
              .then(({ data }) => {
                if (data.status === 0) {
                  this.$message.success(data.msg);
                  this.getAssetList(2);
                  this.isShow = false;
                } else {
                  this.$message.error(data.msg);
                }
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
          }
        } else {
          return false;
        }
      });
      this.DialogName = null;
    },
    //监听图片上传成功
    handleSuccess(response, file, fileList) {
      this.SRC = this.$store.state.BASE_URL + response.msg;
      this.AssetForm.image = response.msg;
      this.AssetForm.image_id = response.id;
      this.ImgForm.image = response.msg;
      this.ImgForm.image_id = response.id;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多条件筛选分页查看
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
          this.getAssetList(4, this.oneSel); //单条件筛选下的分页
          break;
        case 6:
          this.sortMul(this.sortMulFilter, 2); //多条件排序下的分页
        case -1:
          this.getAssetList(-1); //正常请求后分页
          break;
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      switch (this.cutType) {
        case 1:
          this.MulSel(this.sortSelForm, 2); //多条件筛选分页查看
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
          this.getAssetList(4, this.oneSel); //单条件筛选下的分页
          break;
        case 6:
          this.sortMul(this.sortMulFilter, 2); //多条件排序下的分页
        case -1:
          this.getAssetList(-1); //正常请求后分页
          break;
      }
    },
    //解决索引旨在当前页排序的问题，增加函数自定义索引序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    //难度等级格式化显示
    Level: function(row, column) {
      switch (row.level) {
        case 0:
          return "简单";
          break;
        case 1:
          return "标准";
          break;
        case 2:
          return "复杂";
          break;
        case 3:
          return "高难度";
          break;
      }
    },
    //优先级格式化显示
    Priority: function(row, column) {
      switch (row.priority) {
        case 0:
          return "正常";
          break;
        case 1:
          return "优先";
          break;
      }
    }
  },
  created() {
    this.$emit("getGroup");
    this.getAuth();
    this.getAssetList(2);
    this.getProjectAllStatus();
    if (this.assetId) {
      this.value1 = true;
      let id = this.assetId;
      HTTP.queryAssets({ id }).then(({ data }) => {
        this.project = { ...[...data.msg][0], id };
      });
      const msg = {
        appid: this.assetId,
        apptype: 5
      };
      getRemark(msg).then(({ data }) => {
        this.RemarksData = [...data.msg];
      });
    }
  }
};
</script>

<style lang="scss">
#tab-assets {
  min-height: calc(100vh - 199px);
  .links {
    cursor: pointer;
    color: #2d8cf0;
  }
}
svg-icon {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 22px;
  height: 22px;
  vertical-align: 10px;
  padding-right: 10px;
}
.el-table__expanded-cell{
  padding-top:0px !important;
  padding-bottom:0px !important;
  padding-right:70px !important
}
</style>
