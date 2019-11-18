/**
 * 
 *@file 动态路由
 *  
 */
import Layout from '@/layout'
export default function asyncRoutes(params) {
  return [
    {
      path: '/',
      component: Layout,
      redirect: {
        name: 'home-page'
      },
      meta: {
        breadcrumb: false,
        title: '',
        icon: 'gailan'
      },
      children: [{
          path: 'home-page',
          name: 'home-page',
          component: () =>
            import('@/views/home-page'),
          meta: {
            title: '个人首页',
            icon: 'home'
          }
        },
      ]
    },
    {
      path: '/admin',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '系统设置',
        icon: 'settings'
      },
      children: [{
          path: 'profession',
          name: 'profession',
          component: () =>
            import('@/views/admin/userGroup'),
          meta: {
            title: '用户',
            icon: 'group'
          }
        },
        {
          path: 'userGroup',
          name: 'UserGroup',
          component: () =>
            import('@/views/admin/profession'),
          meta: {
            title: '部门及工种',
            icon: 'profession'
          }
        },
        {
          path: 'roles',
          name: 'UserGqqqroup',
          component: () =>
            import('@/views/admin/roles'),
          meta: {
            title: '角色管理',
            icon: 'role',
            roles: 'manage_role'
          }
        },
        {
          path: 'attrs',
          name: 'customAttrs',
          component: () =>
            import('@/views/admin/customAttrs'),
          meta: {
            title: '自定义属性',
            icon: 'custom-attrs',
          }
        },
      ]
    },
    {
      path: '/gift-manage',
      component: Layout,
      redirect: 'noRedirect',
      meta: {
        title: '礼品管理',
        icon: 'gift'
      },
      children: [{
        path: 'gift-manage',
        name: 'gift-manage',
        component: () =>
          import('@/views/gift-manage'),
        meta: {
          title: '礼品管理',
          icon: 'gift'
        }
      },
      {
        path: 'add-gifts',
        name: 'add-gifts',
        component: () =>
          import('@/views/add-gifts'),
        meta: {
          title: '添加礼品',
          icon: 'gift'
        }
      }
    ]
    },
    { // 404必须在最后面
      path: '*',
      redirect: '/404',
      hidden: true
    },
  ]
}
