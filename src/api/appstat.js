import AXIOS from '@/libs/request'
//获取用户、积分和订单数量
export function getStatDate(params){
    return AXIOS.get('/appstat/appstat/',{params})
}