import AXIOS from '@/libs/request'
//获取资产列表（搜索）
// export function getAssets() {
//     return AXIOS.get('/assets/assets/')
// }
//删除资产
export function deleteAssets(data) {
    return AXIOS.post('/assets/assets/?delete', {
        ...data,
        method: 'delete'
    })
}
//创建资产
export function postAssets(data) {
    return AXIOS.post('/assets/assets/', data)
}
//获取资产
export function queryAssets(params) {
    return AXIOS.get('/assets/assets/', {
        params
    })
}
//修改资产
export function editAssets(data) {
    return AXIOS.post('/assets/assets/?put', data)
}
//导入资产列表
export function uploadAssets(data) {
    return AXIOS.post('/assets/batch/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}
//后端解析excel
export function parseExcel(data) {
    return AXIOS.post('/excel/excel/', data, {
        transformRequest: [data => {
            return data;
        }],

        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
//查询对应资产的版本记录
export function getVersion(params){
    return AXIOS.get('/assets/version/',{params})
}
//镜头的历史版本获取
export function getHistoryVersion(params){
    return AXIOS.get('/assets/history/',{params})
}
//资产的最终状态确定
export function getAssetsEndStatus(data) {
    return AXIOS.post('/assets/history/', data)
}
//查询资产对应任务的审批结果
export function getAssetsApprove(params){
    return AXIOS.get('/approve/approve_result/?01',{params})
}
//组长分配镜头
export function allocationScene(params){
    return AXIOS.get('/assets/scene/',{params})
}

//操作资产的权限
export function auth(){
    return AXIOS.get('/assets/assets/?auth')
}