import Ajax from '@/http/http.js'
//delete或者cancel一条parking
export const POST_Parking = async(data) => {
    return await Ajax.post('/parking/parking/?json', {...data })
};
//获取parking列表，或者单个parking详情
export const GET_Parking = async() => {
    return await Ajax.get('/parking/parking/?json')
};
//获取parking列表，或者单个parking详情
export const GET_ParkingDetail = async(id) => {
    return await Ajax.get('/parking/parking/?json&id=' + id)
};