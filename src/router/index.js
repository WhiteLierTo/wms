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
        name: 'dataManager',
        meta: {
            title: '数据管理',
            icon: 'data'
        },
        children: [{
            path: 'warehouse-manager',
            component: () =>
                import ('@/views/data-manager/warehouse-manager'),
            name: 'WarehouseManager',
            meta: { title: '库房管理' },
            children: []
        }, {
            path: 'location-manager',
            component: () =>
                import ('@/views/data-manager/location-manager'),
            name: 'LocationManager',
            meta: { title: '库位管理' },
            children: []
        }, {
            path: 'production-batch',
            component: () =>
                import ('@/views/data-manager/production-batch'),
            name: 'ProductionBatch',
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
            name: 'MaterialManager',
            meta: { title: '物料管理' },
            children: []
        }, {
            path: 'unit-manager',
            component: () =>
                import ('@/views/data-manager/unit-manager'),
            name: 'UnitManager',
            meta: { title: '单位管理' },
            children: []
        }, {
            path: 'unit-conversion',
            component: () =>
                import ('@/views/data-manager/unit-conversion'),
            name: 'UnitConversion',
            meta: { title: '单位转换' },
            children: []
        }, {
            path: 'external-documents',
            component: () =>
                import ('@/views/data-manager/external-documents'),
            name: 'ExternalDocuments',
            meta: { title: '外部单据' },
            children: []
        }, {
            path: 'historical-record',
            component: () =>
                import ('@/views/data-manager/historical-record'),
            name: 'historicalRecord',
            meta: { title: '出入库历史' },
            children: []
        }]
    },
    {
        path: '/stockIn',
        component: Layout,
        redirect: '/stockIn/stockIn-Header',
        name: 'stockInHeader',
        meta: {
            title: '入库管理',
            icon: 'stockIn'
        },
        children: [{
            path: 'stockIn-Header',
            component: () =>
                import ('@/views/stockIn/stockIn-Header'),
            name: 'stockInHeader',
            meta: { title: '入库管理' },
            children: []
        }, {
            path: 'stockIn-Line',
            component: () =>
                import ('@/views/stockIn/stockIn-Line'),
            name: 'stockInLine',
            meta: { title: '单行' },
            hidden: true,
            children: []
        }, {
            path: 'stockIn-detail',
            component: () =>
                import ('@/views/stockIn/stockIn-detail'),
            name: 'stockInDetail',
            meta: { title: '入库明细' },
            hidden: true,
            children: []
        }, {
            path: 'stockout-Header',
            component: () =>
                import ('@/views/stockout/stockout-Header'),
            name: 'stockoutHeader',
            meta: { title: '出库管理' },
            children: []
        }, {
            path: 'stockout-detail',
            component: () =>
                import ('@/views/stockout/stockout-detail'),
            name: 'stockoutDetail',
            meta: { title: '出库明细' },
            hidden: true,
            children: []
        }]
    },
    {
        path: '/label-manager',
        component: Layout,
        redirect: '/label-manager/label-template',
        name: 'labelManager',
        meta: {
            title: '标签管理',
            icon: 'label'
        },
        children: [{
                path: 'label-template',
                component: () =>
                    import ('@/views/label-manager/label-template'),
                name: 'LabelTemplate',
                // eslint-disable-next-line indent
                meta: {
                    title: '标签模板',
                    noCache: true,
                    affix: true
                },
                children: []
            }, {
                path: 'element-template',
                component: () =>
                    import ('@/views/label-manager/element-template/index'),
                name: 'FixedTemplate',
                meta: {
                    title: '元素模板'
                },
                children: [{
                    path: 'fixed-template',
                    component: () =>
                        import ('@/views/label-manager/element-template/fixed-template'),
                    name: 'FixedTemplate',
                    meta: {
                        title: '固定模板'
                    }
                }, {
                    path: 'map-template',
                    component: () =>
                        import ('@/views/label-manager/element-template/map-template'),
                    name: 'MapTemplate',
                    meta: {
                        title: '映射模板'
                    }
                }]
            }, {
                path: 'material-label',
                component: () =>
                    import ('@/views/label-manager/material-label'),
                name: 'MaterialLabel',
                // eslint-disable-next-line indent
                meta: {
                    title: '物料标签',
                    noCache: true
                },
                children: []
            }, {
                path: 'location-label',
                component: () =>
                    import ('@/views/label-manager/location-label'),
                name: 'LocationLabel',
                // eslint-disable-next-line indent
                meta: {
                    title: '库位标签',
                    noCache: true
                },
                children: []
            }, {
                path: 'label-data',
                component: () =>
                    import ('@/views/label-manager/label-data'),
                name: 'LabelData',
                // eslint-disable-next-line indent
                meta: {
                    title: '标签数据',
                    noCache: true
                },
                children: []
            },
            {
                path: 'label-manager',
                component: () =>
                    import ('@/views/label-manager/label-manager'),
                name: 'LabelManager',
                // eslint-disable-next-line indent
                meta: {
                    title: '标签管理',
                    noCache: true
                },
                children: []
            },
            {
                path: 'label-operation-log',
                component: () =>
                    import ('@/views/label-manager/label-operation-log'),
                name: 'LabelOperationLog',
                // eslint-disable-next-line indent
                meta: {
                    title: '标签日志',
                    noCache: true
                },
                children: []
            },
            {
                path: 'printer-manager',
                component: () =>
                    import ('@/views/label-manager/printer-manager'),
                name: 'PrinterManager',
                // eslint-disable-next-line indent
                meta: {
                    title: '打印机管理',
                    noCache: true
                },
                children: []
            }
        ]
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