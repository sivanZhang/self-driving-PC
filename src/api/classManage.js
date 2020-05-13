import AXIOS from '@/libs/request'
//类别详情查询
export function getClassDetails(params){
    return AXIOS.get('/categories/categories/?id=6',{params})
}
//类别查询
export function classQuery(params){
    return AXIOS.get('/categories/categories/',{params})
}
//添加类别
export function addClass(data){
    return AXIOS.post('/categories/categories/',data)
}
//删除活动
export function delClass(data){
    return AXIOS.post('/categories/categories/?method=delete',data)
}
//编辑活动
export function putClass(data){
    return AXIOS.post('/categories/categories/?method=put',data)
}
