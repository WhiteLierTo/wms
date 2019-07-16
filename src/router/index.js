import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
  path: '/login',
  component: () =>
            import('@/views/login/index'),
  hidden: true
},

{
  path: '/404',
  component: () =>
            import('@/views/404'),
  hidden: true
},

{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Dashboard',
    component: () =>
                import('@/views/dashboard/index'),
    hidden: true,
    meta: { title: '首页', icon: 'dashboard' }
  }]
},

{
  path: '/tree',
  component: Layout,
  children: [{
    path: 'tree',
    name: 'Tree',
    noCache: false,
    affix: true,
    component: () =>
                import('@/views/tree/index'),
    meta: { title: '采购退货', icon: 'example' }
  }]
},

{
  path: '/form',
  component: Layout,
  children: [{
    path: 'index',
    name: 'Form',
    component: () =>
                import('@/views/form/index'),
    meta: { title: '条码打印', icon: 'form' }
  }]
},

{
  path: '/nested',
  component: Layout,
  redirect: '/nested/menu1',
  name: 'Nested',
  meta: {
    title: '数据管理',
    icon: 'nested'
  },
  children: [{
    path: 'menu2',
    component: () =>
                import('@/views/nested/menu2/index'), // Parent router-view
    name: 'Menu2',
    meta: { title: '采购订单' },
    children: []
  }]
},
// 404 page must be placed at the end !!!
{ path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
