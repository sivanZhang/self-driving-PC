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
    path: '/gift',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '礼品管理',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
      path: 'gift-detail/:id',
      name: 'gift-detail',
      component: () =>
        import('@/views/gift/gift-detail'),
      meta: {
        title: '礼品详情',
        icon: 'tree',
      }
    },
    {
      path: 'add-gifts/:id',
      name: 'alter-gifts',
      component: () =>
        import('@/views/add-gifts/index'),
      meta: {
        title: '礼品修改',
        icon: 'tree',
      }
    }
  ]
  },
  {
    path: '/coinManage',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '积分管理',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
      path: 'coinDetail/:id',
      name: 'coinDetail',
      component: () =>
        import('@/views/coinManage/coinDetail'),
      meta: {
        title: '积分详情',
        icon: 'tree',
      }
    }
  ]
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
