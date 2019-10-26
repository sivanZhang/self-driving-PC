import AXIOS from '@/libs/request'
//登录
export function login(data) {
    return AXIOS.post('/users/login/?json', data)
}
//发送邮箱验证码   state = true为找回密码 ； 否则为申请账号
export function getEmailCode(payload) {
    const params = {
        codetype: 1
    };
    return AXIOS.get('/users/emailscode/' + payload.email, {
        params: payload.state ? params : null
    })
}
//找回密码
export function postResetPassword(data) {
    return AXIOS.post('/users/find_password/', data)
}

//注册用户
export function postRegister(data) {
    return AXIOS.post('/users/register/', data)
}
//获取当前用户权限
export function getUserPermission(params){
    return AXIOS.get('/users/list/?permissions',{params})
}
//获取当前用户角色
export function getUserRole(params){
    return AXIOS.get('/users/role/',{params})
}
//用户修改
export function updateUserInfo(data){
    return AXIOS.post('/users/list/',data)
}
//用户添加
export function addUser(data){
    return AXIOS.post('/users/list/',data)
}
//批量导入

