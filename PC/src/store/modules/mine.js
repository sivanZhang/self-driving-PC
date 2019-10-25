
 //主页跳转我的任务带的参数
 const state = {
    keyword:''
  }
  
  const mutations = {
    SET_KEYWORD: (state, str='') => {
      state.keyword = str
    },
  }
  
  const actions = {
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  