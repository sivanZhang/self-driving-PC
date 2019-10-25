import AXIOS from '@/utils/request'
//获取评论/备注信息
export function getRemark(params) {
    return AXIOS.get('/comment/comment/', { params })
}
//添加评论/备注信息
export function addRemark(data) {
    return AXIOS.post('/comment/comment/', data)
}
//删除评论/备注信息
export function removeRemark(data) {
    return AXIOS.post('/comment/comment/?delete', data)
}