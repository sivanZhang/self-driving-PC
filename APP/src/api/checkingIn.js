import AXIOS from '@/utils/request'
//获取加班申请列表
export function getOvertime(params) {
    return AXIOS.get('/overtime/overtime/', {
        params
    })
}
//提交加班申请
export function postOvertime(data) {
    return AXIOS.post('/overtime/overtime/', data)
}
//加班申请提交审核
export function postApply(data) {
    return AXIOS.post('/overtime/submit/', data)
}
//删除加班申请
export function deleteApply(data) {
    return AXIOS.post('/overtime/overtime/?delete', data)
}
//修改加班申请
export function putApply(data) {
    return AXIOS.post('/overtime/overtime/?put', data)
}
//获取加班申请审批列表
export function getOverTimeApprove(params) {
    return AXIOS.get('/overtime/submit/', {
        params
    })
}
//提交加班申请的审批
export function postApprove(data) {
    return AXIOS.post('/overtime/approve/', data)
}
//新建加班审批模板
export function createExtraTemplate(params){
    return AXIOS.post('/wktemplate/extral_work_rule/',params,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//修改加班审批模板
export function putExtraTemplate(params){
    return AXIOS.post('/wktemplate/extral_work_rule/',params,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//删除加班审批模板
export function delExtraTemplate(data){
    return AXIOS.post('/wktemplate/extral_work_rule/',data)
}
//查看加班审批模板
export function getExtraTemplate(params){
    return AXIOS.get('/wktemplate/extral_work_rule/',{params})
}

//查看调休信息
export function getDayOffList(params){
    return AXIOS.get('/overtime/daysoff/',{params})
}
//添加调休
export function addDayOff(data){
    return AXIOS.post('/overtime/daysoff/',data)
}
//删除调休
export function delDayOff(data){
    return AXIOS.post('/overtime/daysoff/?delete',data)
}