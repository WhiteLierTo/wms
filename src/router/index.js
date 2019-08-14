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
            path: 'invcontrol-detail',
            component: () =>
                import ('@/views/data-manager/invcontrol-detail'),
            name: 'invcontrolDetail',
            meta: { title: '库存明细' },
            hidden: true,
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
            path: 'dictionary',
            component: () =>
                import ('@/views/data-manager/dictionary'),
            name: 'Dictionary',
            meta: { title: '字典管理' },
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
            title: '出入库管理',
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
        }, {
            path: 'add-inHeader',
            component: () =>
                import ('@/views/stockIn/add-inHeader'),
            name: 'addInHeader',
            meta: { title: '新增入库单' },
            hidden: true,
            children: []
        }, {
            path: 'edit-inHeader',
            component: () =>
                import ('@/views/stockIn/edit-inHeader'),
            name: 'editInHeader',
            meta: { title: '编辑入库单' },
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
                path: 'template-info',
                component: () =>
                    import ('@/views/label-manager/template-info/index'),
                redirect: '/label-manager/template-info/label-template',
                name: 'LabelTemplate',
                meta: {
                    title: '模板信息'
                },
                children: [{
                        path: 'label-template',
                        component: () =>
                            import ('@/views/label-manager/template-info/label-template'),
                        name: 'LabelTemplate',
                        meta: {
                            title: '标签模板'
                        }
                    }, {
                        path: 'template-widget',
                        component: () =>
                            import ('@/views/label-manager/template-info/template-widget'),
                        name: 'TemplateWidget ',
                        meta: {
                            title: '模板控件'
                        }

                    },
                    {
                        path: 'add-element',
                        component: () =>
                            import ('@/views/label-manager/template-info/add-element'),
                        name: 'AddElement',
                        meta: {
                            title: '添加元素'
                        },
                        hidden: true
                    }
                ]
            },
            {
                path: 'label-printer',
                component: () =>
                    import ('@/views/label-manager/label-printer/index'),
                redirect: '/label-manager/label-printer/general-label',
                name: 'GeneralLabel',
                meta: {
                    title: '标签打印'
                },
                children: [{
                        path: 'general-label',
                        component: () =>
                            import ('@/views/label-manager/label-printer/general-label'),
                        name: 'GeneralLabel',
                        meta: {
                            title: '通用标签'
                        }
                    }, {
                        path: 'material-label',
                        component: () =>
                            import ('@/views/label-manager/label-printer/material-label'),
                        name: 'MaterialLabel',
                        meta: {
                            title: '物料标签'
                        }
                    },
                    {
                        path: 'location-label',
                        component: () =>
                            import ('@/views/label-manager/label-printer/location-label'),
                        name: 'LocationLabel',
                        meta: {
                            title: '库位标签'
                        }
                    }
                ]
            },
            {
                path: 'label-info',
                component: () =>
                    import ('@/views/label-manager/label-info/index'),
                redirect: '/label-manager/label-info/label-manager',
                name: 'LabelManager',
                meta: {
                    title: '标签信息'
                },
                children: [{
                        path: 'label-data',
                        component: () =>
                            import ('@/views/label-manager/label-info/label-data'),
                        name: 'LabelData',
                        meta: {
                            title: '标签数据'
                        },
                        hidden: true
                    },
                    {
                        path: 'label-manager',
                        component: () =>
                            import ('@/views/label-manager/label-info/label-manager'),
                        name: 'LabelManager',
                        meta: {
                            title: '标签列表'
                        }
                    },
                    {
                        path: 'label-operation-log',
                        component: () =>
                            import ('@/views/label-manager/label-info/label-operation-log'),
                        name: 'LabelOperationLog',
                        meta: {
                            title: '标签日志'
                        }
                    }
                ]
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