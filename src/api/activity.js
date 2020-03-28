import AXIOS from '@/libs/request'
//获取活动管理权限
export function getActivityAuth(params){
    return AXIOS.get('/spread/spread/?auth',{params})
}
//获得活动列表
export function getActivityList(params){
    return AXIOS.get('/spread/spread/?app',{params})
}
//添加活动
export function addActivity(data){
    return AXIOS.post('/spread/auth/',data)
}
//删除活动
export function deleteActivity(data){
    return AXIOS.post('/spread/auth/?delete',data)
}
