import AXIOS from '@/libs/request'
//获取积分
export function getCoin(params){
    return AXIOS.get('/webcoin/webcoin/',{params})
}