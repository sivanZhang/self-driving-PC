//用户管理和工种公共状态
import {
    getDept,
    getDeptUsers
} from "@/api/admin";
import {
    getUserList
} from '@/api/admin'
const state = {
    UserList: null,
    DeptList: null,
    DeptUsers: null,
    DeptAuth:null
}

const mutations = {
    SET_USERLIST: (state, arr) => {
        state.UserList = [...arr]
    },
    SET_DEPTLIST: (state, arr) => {
        state.DeptList = [...arr]
    },
    SET_DEPTUSERS: (state, arr) => {
        state.DeptUsers = [...arr]
    },
    SET_DEPTAUTH: (state, arr) => {
        state.DeptAuth = arr
    },
}

const actions = {
    //获取所有用户的列表
    get_UserList({
        commit
    }, params) {
        getUserList().then(({
            data
        }) => {
            commit('SET_USERLIST', data)
        }).catch(() => {
            commit('SET_USERLIST', null)
        })
    },
    //获取工种列表
    get_DeptList({
        commit
    }) {
        return getDept().then(({
            data
        }) => {
            commit('SET_DEPTLIST', data.msg);
            commit('SET_DEPTAUTH',data.auth.manage_dept)
        }).catch(() => {
            commit('SET_DEPTLIST', null)
        })
    },
    
    //获取已登录用户同部门的用户列表
    get_DeptUsers({
        state,
        commit,
        rootState
    }) {
        return getDeptUsers({
            user: rootState.login.userInfo.id
        }).then(({
            data
        }) => {
            commit('SET_DEPTUSERS', data.msg)
        }).catch(() => {
            commit('SET_DEPTUSERS', null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}