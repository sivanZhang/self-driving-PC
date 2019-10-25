import {
  asyncRoutes,
  constantRoutes,
  trainingRouter
} from '@/router'
import router from '@/router'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(route, UserRoles) {
  if (route.meta && 'roles' in route.meta) {
    return UserRoles[route.meta.roles]
  } else {
    return true
  }
}
//判断Training权限
function judgeTraining(UserRoles) {
  return 'training_manager' in UserRoles && UserRoles['training_manager']
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, UserRoles) {
  let res = []
  routes.forEach(route => {
    if (hasPermission(route, UserRoles)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, UserRoles)
      }
      res.push(route)
    }
  })
  return res
}

const state = {
  routes: [], //用来在侧边栏显示已经挂载的路由列表
  addRoutes: [] //筛选出来有权限进入的动态路由
}

const mutations = {
  SET_ROUTES: (state, arr) => {
    state.addRoutes = arr
    state.routes = constantRoutes.concat(arr)
  }
}

const actions = {
  generateRoutes({
    state,
    commit,
    rootState
  }) {
    let UserRoles = rootState.login.userInfo.auth
    return new Promise(resolve => {
      let accessedRoutes = []
      if (judgeTraining(UserRoles)) {
        accessedRoutes = [...trainingRouter]

      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes(), UserRoles)
      }
      commit('SET_ROUTES', accessedRoutes)
      router.addRoutes(accessedRoutes)
      resolve(accessedRoutes)

      //accessedRoutes有权限的路由


    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
