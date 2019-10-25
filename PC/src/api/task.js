import AXIOS from '@/libs/request'
//获取任务执行记录
export function queryTaskLogs() {
  return AXIOS.get('/task/taskrecord')
}
//新建任务执行记录
export function addTaskLogs(data) {
  return AXIOS.post('/task/taskrecord', data)
}
//新建任务执行记录
export function addTask(data) {
  return AXIOS.post('/task/task/', data)
}
//获取任务或者详情
export function queryTask(params = null) {
  return AXIOS.get('/task/task/', {
    params
  })
}
//删除任务
export function deleteTask(data) {
  return AXIOS.post('/task/task/?delete', data)
}
//修改任务
export function putTask(data) {
  return AXIOS.post('/task/task/?01', data)
}
//获取我的任务
export function queryMyTask(params) {
  return AXIOS.get('/task/task/?inplugin', {
    params
  })
}
//根据id获取任务详情
export function getTaskDetail(params) {
  return AXIOS.get('/task/task/?id=12', {
    params
  })
}
//查询任务执行记录
export function queryTaskRecord(params) {
  return AXIOS.get('/task/taskrecord/', {
    params
  })
}
//新建执行记录
export function addTaskRecord(data) {
  return AXIOS.post('/task/taskrecord/', data)
}
//修改执行记录
export function putTaskRecord(data) {
  return AXIOS.post('/task/task/?status', data)
}
//根据状态查询任务
export function getStatusTaskList(params) {
  return AXIOS.get('/task/task/?mytask', {
    params
  })
}
//提交我完成的任务
export function taskApprove(data) {
  return AXIOS.post('/approve/approve_submit/', data)
}
//根据资产ID查询任务列表
export function getAssetTaskList(params) {
  return AXIOS.get('/task/task/', {
    params
  })
}

//给实训项目批量创建任务
export function mulCreateTasks(data) {
  return AXIOS.post('/task/batch_task/', data)
}

//任务批量修改
export function mulPutTasks(data) {
  return AXIOS.post('/task/task/?02', data)
}
//首页特定任务统计
export function getHomepageMyTask(params) {
  return AXIOS.get('/task/stat/?mytask&homepage=2', {
    params
  })
}
//任务执行人查看审批反馈
export function getFeedback(params = {
  mine: ''
}) {
  return AXIOS.get('/task/feedback/', {
    params
  })
}
//查看任务dailies
export function getTaskDailies(){
  return AXIOS.get('/task/task/?dailies')
}
//查看资产的任务
export function getAssetTask(params){
  return AXIOS.get('/task/asset_task/',{params})
}
