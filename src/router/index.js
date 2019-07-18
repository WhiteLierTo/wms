import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () =>
        import('@/views/home/index'),
      hidden: true,
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/warehouse',
    component: Layout,
    name: 'warehouse',
    meta: {
      title: '数据管理',
      icon: 'nested'
    },
    children: [{
      path: 'warehouseManager',
      component: () =>
        import('@/views/warehouse/warehouse-manager'), // Parent router-view
      name: 'warehouseManager',
      meta: { title: '库房管理' },
      children: []
    }, {
      path: 'locationManager',
      component: () =>
        import('@/views/warehouse/location-manager'), // Parent router-view
      name: 'locationManager',
      meta: { title: '库位管理' },
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
        import('@/views/warehouse/warehouse-manager'),
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
