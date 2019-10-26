import AXIOS from '@/libs/request'
// 删除属性
export function delAttrs(data){
    return AXIOS.post('/attrs/attrs/?delete',data)
}
//批量删除属性
export function delMulAttrs(data){
    data = {...data,method: "delete"}
    return AXIOS.post('/attrs/attrs/',data,{
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          },
          transformRequest: [params => {
            return JSON.stringify(params)
          }],
    })    
}
//全字段搜索属性
export function getMulAttrs(params){
    return AXIOS.get('/attrs/attrs/',{params})
}
//修改属性实体
export function updateAttrsEntity(data){
    return AXIOS.post('/attrs/instance/?01',data)
}
//属性实体绑定(1.给类别绑定属性)
export function attrsEntityBind(data){
    return AXIOS.post('/attrs/bind/',data)
}
//修改属性
export function updateAttrs(data){
    return AXIOS.post('/attrs/attrs/?01',data)
}
//创建属性
export function createAttrs(data){
    return AXIOS.post('/attrs/attrs/',data)
}
// 获取属性列表
export function getAttrsList(params){
    return AXIOS.get('/attrs/attrs/?list',{params})
}
//属性实体解绑
export function  attrsEntityUnbind(data){
    return AXIOS.post('/attrs/bind/?delete',data)
}
//创建属性实体 
export function createAttrsEntity(data){
    return AXIOS.post('/attrs/instance/',data)
}
//获取属性信息
export function getAttrsInfo(params){
    return AXIOS.get('/attrs/attrs/',{params})
}
//获取属性实体列表
export function getAttrsEntityList(params){
    return AXIOS.get('/attrs/instance/?list',{params})
}
//删除属性实体
export function delAttrsEntity(data){
    return AXIOS.post('/attrs/instance/?delete',data)
}
//获取属性实体信息
export function getAttrsEntityInfo(params){
    return AXIOS.get('/attrs/instance/',{params})
}
//查询类别绑定属性（1.查询给类别绑定的属性）
export function searchBind(params){
    return AXIOS.get('/attrs/bind/',{params})
}

//操作属性权限
export function authAttr(){
    return AXIOS.get('/attrs/attrs/?auth')
}