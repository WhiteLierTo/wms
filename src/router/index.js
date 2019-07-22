import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
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
                import ('@/views/home/index'),
            hidden: true,
            meta: { title: '首页', icon: 'home' }
        }]
    },
    {
        path: '/data-manager',
        component: Layout,
        redirect: '/data-manager/warehouse-manager',
        name: 'data-manager',
        meta: {
            title: '数据管理',
            icon: 'data'
        },
        children: [{
            path: 'warehouse-manager',
            component: () =>
                import ('@/views/data-manager/warehouse-manager'),
            name: 'warehouseManager',
            meta: { title: '库房管理' },
            children: []
        }, {
            path: 'location-manager',
            component: () =>
                import ('@/views/data-manager/location-manager'),
            name: 'location-manager',
            meta: { title: '库位管理' },
            children: []
        }, {
            path: 'production-batch',
            component: () =>
                import ('@/views/data-manager/production-batch'),
            name: 'productionBatch',
            meta: { title: '生产批次' },
            children: []
        }, {
            path: 'invcontrol-manager',
            component: () =>
                import ('@/views/data-manager/invcontrol-manager'),
            name: 'InvcontrolManager',
            meta: { title: '库存管理' },
            children: []
        }, {
            path: 'material-manager',
            component: () =>
                import ('@/views/data-manager/material-manager'),
            name: 'materialManager',
            meta: { title: '物料管理' },
            children: []
        }]
    },
    {
        path: '/warehouse-manager',
        component: Layout,
        children: [{
            path: 'warehouse-manager',
            name: 'warehouse-manager',
            component: () =>
                import ('@/views/data-manager/warehouse-manager'),
            meta: { title: '采购退货', icon: 'purchase', noCache: false, affix: true }
        }]
    },
    {
        path: '/label-manager',
        component: Layout,
        redirect: '/label-manager/label-painter',
        name: 'label-manager',
        meta: {
            title: '标签管理',
            icon: 'label'
        },
        children: [{
            path: 'label-painter',
            component: () =>
                import ('@/views/label-manager/label-painter'),
            name: 'labelPainter',
            meta: { title: '标签打印' },
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