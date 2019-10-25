import AXIOS from '@/utils/request'
import QS from 'qs'
//获取环节
export function getLinks(params) {
    return AXIOS.get('/links/links/', {
        params
    })
}
//创建环节
export function addLinks(data) {
    return AXIOS.post('/links/links/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [data => {
            return JSON.stringify(data)
        }],
    })
}
//通过link_id查询制作环节
export function getLink(params) {
    return AXIOS.get('/links/links/?link=1', { params })
}
//修改制作环节
export function updateLink(data) {
    return AXIOS.post('/links/links/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [data => {
            return JSON.stringify(data)
        }],
    })
}
//删除制作环节
export function delLink(data) {
    return AXIOS.post('/links/links/', data)
}

//创建环节模板
export function createTemplateLink(params){
    return AXIOS.post('/links/links_template/',params,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}

//查看环节模板
export function searchTempalteLink(params){
    return AXIOS.get('/links/links_template/',{params})
}
//修改环节模板
export function putTemplateLink(data){
    return AXIOS.post('/links/links_template/',data)
}
//删除环节模板
export function removeTemplateLink(data){
    return AXIOS.post('/links/links_template/',data)
}
//通过模板给资产创建环节
export function templateCreateLink(data){
    return AXIOS.post('/links/create_links/',data,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }]
    })
}