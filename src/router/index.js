import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/404',
    component: () =>
      import('@/views/home/index'),
    hidden: true,
    meta: { title: '首页', icon: 'home' }
  },
  {
    path: '/data-manager',
    component: Layout,
    redirect: '/data-manager/warehouse-manager',
    name: 'data-manager',
    meta: {
      title: '数据管理',
      icon: 'nested'
    },
    children: [{
      path: 'warehouse-manager',
      component: () =>
      import('@/views/data-manager/warehouse-manager'),
      name: 'warehouse-manager',
      meta: { title: '库房管理' },
      children: []
    }, {
      path: 'location-manager',
      component: () =>
      import('@/views/data-manager/location-manager'),
      name: 'location-manager',
      meta: { title: '库位管理' },
      children: []
    }, {
      path: 'production-batch',
      component: () =>
      import('@/views/data-manager/production-batch'),
      name: 'production-batch',
      meta: { title: '生产批次' },
      children: []
    }]
  },
  {
    path: '/warehouse',
    component: Layout,
    children: [{
      path: 'warehouse',
      name: 'warehouse',
      component: () =>
            import('@/views/data-manager/warehouse-manager'),
      meta: { title: '采购退货', icon: 'example', noCache: false, affix: true }
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
    redirect: '/nested/menu2',
    name: 'nested',
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
