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
          path: 'bind',
          name: 'settings',
          component: () =>
            import('@/views/admin/bind'),
          meta: {
            title: '绑定',
            icon: 'bangding'
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
        {
          path: 'time-management',
          name: 'time-management',
          component: () =>
            import('@/views/admin/time-management'),
          meta: {
            title: '时间管理',
            icon: 'fs',
          }
        },
        {
          path: 'extra-approve',
          name: 'extra-approve',
          component: () =>
            import('@/views/checking-in/extra-approve'),
          meta: {
            title: '加班审批模板',
            icon: 'extra-approve',
          }
        },
        {
          path: 'menu',
          name: 'menu',
          component: () =>
            import('@/views/admin/menu'),
          meta: {
            title: '考勤时间设置',
            icon: 'menu',
          }
        },
      ]
    },
    { // 404必须在最后面
      path: '*',
      redirect: '/404',
      hidden: true
    },
  ]
}
