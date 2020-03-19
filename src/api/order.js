import AXIOS from '@/libs/request'
//查询订单
export function searchOrders(params){
    return AXIOS.get('/product/bill/?',{params})
}
//更新快递信息
export function updateExpressInfo(data) {
    return AXIOS.post('/product/bill/?put', data)
}
