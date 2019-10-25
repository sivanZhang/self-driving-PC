import Ajax from '../http/http'
//获取Repair列表或者单个repair详情
export const GET_Repair = async(data = "") => {
        return await Ajax.get('/repair/repair/?json', { data })
    }
    //delete或者 cancel一条repair
export function POST_Repair(payload) {
    return Ajax.post('/repair/repair/?json', payload)
}