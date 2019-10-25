/**
 * 
 *@file 判断登录权限
 *  
 */

import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken
} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
        showSpinner: false
    }) // 进度条配置

const whiteList = ['/login', '/forgot', '/signup', '/login-task'] // 不重定向的页面

router.beforeEach(async(to, from, next) => {
    // 进度条开始
    NProgress.start()
        // set page title
    document.title = getPageTitle(to.meta.title)

    // 判断cookie中的token 确定是否已登录

    if (getToken()) {
        if (to.path === '/login') {
            // 如果已经登录，跳转login页面会重定向到首页
            next({
                path: '/'
            })
        } else {
            //可以在这里增加403页面
            //如果状态机中有缓存的 动态路由
            if (store.state.permission.addRoutes.length) {
                next()
            } else {
                //否则重新用权限设置动态路由
                const res = await store.dispatch('permission/generateRoutes')
                next({...to, replace: true })
            }
        }
    } else { //没有token
        store.commit('permission/SET_ROUTES', [])
        if (whiteList.indexOf(to.path) !== -1) { //判断是否在不重定向的名单中
            next() //正常跳转
        } else {
            //重定向到login页面
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    // 路由进入页面后关闭进度条
    NProgress.done() /*  */
})