import {
  getApprove
} from "@/api/video";
import {getOverTimeApprove} from "@/api/checkingIn";
const state = {
  AuditList: null, //我的审批任务列表
  ApproveOverTime:null//我的加班审批列表
}

const mutations = {
  SET_AUDIT: (state, arr) => {
    state.AuditList = [...arr]
  },
  SET_OVERTIME: (state, arr) => {
    state.ApproveOverTime = [...arr]
  },
  
}

const actions = {
  get_Approve({
    commit
  }) {
    return getApprove().then(({
      data
    }) => {
      commit('SET_AUDIT', data.msg)
    }).catch(() => {
      commit('SET_AUDIT', null)
    })
  },
  get_ApproveOverTime({
    commit
  }) {
    return getOverTimeApprove().then(({
      data
    }) => {
      commit('SET_OVERTIME', data.msg)
    }).catch(() => {
      commit('SET_OVERTIME', null)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
