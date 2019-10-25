//登录状态管理
import * as userApi from '@/api/login'
import {
    getToken,
    setToken,
    removeToken,
    getUserInfo,
    setUserInfo,
    resetRoles,
    removeUserInfo
} from '@/utils/auth'
import {
    resetRouter
} from '@/router'
import Cookies from 'js-cookie'
const state = {
    token: getToken(),
    userInfo: getUserInfo() ? JSON.parse(getUserInfo()) : null,
}
const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
    }
}

const actions = {
    login({
        commit
    }, {
        username,
        password
    }) {
        return new Promise((resolve, reject) => {
            userApi.login({
                email: username.trim(),
                password: password
            }).then(({
                data
            }) => {
                if (data.status === 0) {
                    commit('SET_TOKEN', data.token);
                    setToken(data.token);
                    commit('SET_USERINFO', data);
                    setUserInfo(data);
                    resolve(data)
                } else {
                    reject(data)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },
    /*   logout({
        commit,
        state
      }) {
        return new Promise((resolve, reject) => {
          userApi.logout(state.token).then(() => {
            commit('SET_TOKEN', '')
            removeToken()
            resetRouter()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }, */
    logout({
        state,
        commit
    }) {
        return new Promise((resolve, reject) => {
            commit('SET_TOKEN', '')
            removeToken()
            commit('permission/SET_ROUTES', [], {
                root: true
            })
            resetRouter()
            resolve()
        })
    },
    resetToken({
        commit
    }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}