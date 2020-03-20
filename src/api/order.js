import AXIOS from '@/libs/request'
//查询订单
export function searchOrders(params){
    return AXIOS.get('/product/bill/?',{params})
}
//更新快递信息
export function updateExpressInfo(data) {
    return AXIOS.post('/product/bill/?put', data)
}
//查询商品的购买方式
export function searchPurchaseWay(params){
    return AXIOS.get('/product/purchase_way/',{params})
}
//新增商品的购买方式
export function addPurchaseWay(data) {
    return AXIOS.post('/product/purchase_way/', data)
}
//修改商品的购买方式
export function editPurchaseWay(data) {
    return AXIOS.post('/product/purchase_way/', data)
}
