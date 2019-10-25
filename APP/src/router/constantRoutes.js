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
    path: '/login-task',
    component: () =>
      import('@/views/myTask/loginMyTask'),
    hidden: true
  },
  {
    path: '/mytaskplug',
    component: () =>
      import('@/views/myTask/myTaskPlug'),
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
    path: '/projects',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '项目',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
      path: 'project-detail/:id',
      name: 'project-detail',
      component: () =>
        import('@/views/projects/project-detail'),
      meta: {
        title: '项目详情',
        icon: 'tree',
      }
    }]
  },
  {
    path: '/import',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
      title: '批量上传',
      icon: 'tree-table',
    },
    hidden: true,
    children: [{
        path: 'import-users',
        name: 'import-users',
        component: () =>
          import('@/views/admin/user-import'),
        meta: {
          title: '用户上传',
          icon: 'tree'
        }
      },
      {
        path: 'asset-import/:id',
        name: 'asset-import',
        component: () =>
          import('@/views/assetsManagement/asset-import'),
        meta: {
          title: '批量导入',
          icon: 'assetlist'
        },
        hidden: true
      },
      {
        path: 'clockin-import',
        name: 'clockin-import',
        component: () =>
          import('@/views/checking-in/clockin-import'),
        meta: {
          title: '打卡导入',
          icon: 'assetlist'
        },
        hidden: true
      },
      {
        path: 'date-import',
        name: 'date-import',
        component: () =>
          import('@/views/admin/date-import'),
        meta: {
          title: '节假日导入',
          icon: 'assetlist'
        },
        hidden: true
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
