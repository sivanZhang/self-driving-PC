import AXIOS from '@/utils/request'

//新建插件
export function setPlugin(data) {
    return AXIOS.post('/plugin/plugin/', data)
}
//查看插件
export function searchPlugin(params) {
    return AXIOS.get('/plugin/plugin/', {params})
}
//删除插件
export function deletePlugin(data) {
    return AXIOS.post('/plugin/plugin/?delete', data)
}