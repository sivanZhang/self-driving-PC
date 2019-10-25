import Ajax from '../http/http'
//登录接口
export const POST_LOGIN = async(payload) => {
    return await Ajax.post('/users/login/?json', payload)
};
//获取资产列表
export const GET_Property = async() => {
        return await Ajax.get('/property/house/?json&myproperty');
    }
    //获取验证码
export const GET_Password = async(params) => {
        return await Ajax.get('/users/emailscode/${params}?json');
    }
    //重置密码
export const SET_Password = async(payload) => {
    return await Ajax.post('/users/find_password?json', payload);
}
//修改地址
export function User_Address(payload){
    return Ajax.post('/users/org_user_list/?json', payload);
}
//获取用户基本信息
export function Get_UserMsg(payload){
    return Ajax.get('/users/org_user_list/?json&myinfo', payload);
}