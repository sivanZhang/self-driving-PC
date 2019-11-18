/**
 * 
 *@file 静态路由
 *  
 */
import Layout from '@/layout'
export default [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path*',
      component: () =>
        import('@/views/redirect/index')
    }]
  }, {
    path: '/login',
    component: () =>
      import('@/views/login/signin'),
    hidden: true
  },
  {
    path: '/forgot',
    component: () =>
      import('@/views/login/passwordReset'),
  },
  {
    path: '/signup',
    component: () =>
      import('@/views/login/signup'),
  },
 
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  }
]
/* {
    path: '/assetes',
    component: Layout,
    alwaysShow: true,
    hidden: true,.a
    redirect: '/assetes',
    meta: {
        title: '资产管理',
        icon: 'assets'
    },
    children: [{
        path: 'asset-list',
        name: 'asset-list',
        component: () =>
            import ('@/views/assetsManagement/asset-list'),
        meta: {
            title: '资产列表',
            icon: 'assetlist'
        }
    }, ]
}, */
