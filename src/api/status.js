import AXIOS from '@/libs/request'

//按照大状态id查询小状态
export function getMinStatus(params) {
    return AXIOS.get('/state/statebranch/?id=7', { params })
}
//获取项目的状态
export function getProjectStatus(params) {
    return AXIOS.get('/state/projectstate/', { params })
}
//给项目添加状态
export function addProjectStatus(params) {
    return AXIOS.post('/state/projectstate/', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }],
    })
}
//删除项目的小状态
export function delProjectMinStatus(params) {
    return AXIOS.post('/state/projectstate/', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }],
    })
}
//查询所有小状态
export function getAllMinStatus(params) {
    return AXIOS.get('/state/statebranch/', params)
}
//查询所有的大状态
export function getAllMaxStatus(params) {
    return AXIOS.get('/state/state/', params)
}
//新建模板（小状态和工种）
export function setupTemplate(params) {
    return AXIOS.post('/statustem/statustem/', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }],
    })
}
//删除模板（小状态和工种）
export function deleteTemplate(params) {
    return AXIOS.post('/statustem/statustem/?delete',  params)
}
//查看模板（小状态和工种）
export function searchTemplate(params) {
    return AXIOS.get('/statustem/statustem/', {params})
}
//修改模板（小状态和工种）
export function changeTemplate(params) {
    return AXIOS.post('/statustem/statustem/?put', params, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }],
    })
}
//资产小状态修改
export function editSmallStatus(data){
    return AXIOS.post('/assets/status/',data)
}