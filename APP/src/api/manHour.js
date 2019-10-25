import AXIOS from '@/utils/request'
//获取工时
export function getManHour(params) {
    return AXIOS.get('/overtime/workhour/?02', {
        params
    })
}
export function getMyManHour(params) {
    return AXIOS.get('/overtime/workhour/?03', {
        params
    })
}